import type { Fighter, FighterStats } from "./fighters";

export type BattleEventType =
  | "start"
  | "regenerate"
  | "ability"
  | "ability_failed"
  | "attack"
  | "knockout";

export interface BattleEvent {
  type: BattleEventType;
  turn: number;
  actor: string;
  target?: string;
  message: string;
  damage?: number;
  healed?: number;
  manaCost?: number;
  energyCost?: number;
  bonusDamage?: number;
  attackerSnapshot: FighterStats;
  defenderSnapshot: FighterStats;
}

export interface BattleResult {
  winner: string;
  loser: string;
  events: BattleEvent[];
  totalTurns: number;
}

const MAX_TURNS = 1000;

/**
 * Runs the full battle deterministically. Original C++ Arena battle loop:
 * each turn the active fighter regenerates, tries useAbility, then attacks.
 * Loop ends when one fighter has HP < 1.
 */
export function simulateBattle(a: Fighter, b: Fighter): BattleResult {
  a.reset();
  b.reset();

  const events: BattleEvent[] = [];
  events.push({
    type: "start",
    turn: 0,
    actor: a.name,
    target: b.name,
    message: `${a.name} (${a.type}) vs ${b.name} (${b.type}). Fight!`,
    attackerSnapshot: a.snapshot(),
    defenderSnapshot: b.snapshot(),
  });

  let turn = 1;
  let attacker = a;
  let defender = b;

  while (attacker.HP > 0 && defender.HP > 0 && turn <= MAX_TURNS) {
    const regenAmount = attacker.regenerate();
    if (regenAmount > 0) {
      events.push({
        type: "regenerate",
        turn,
        actor: attacker.name,
        message: `${attacker.name} regenerates +${regenAmount} HP.`,
        healed: regenAmount,
        attackerSnapshot: attacker.snapshot(),
        defenderSnapshot: defender.snapshot(),
      });
    }

    const beforeHP = attacker.HP;
    const usedAbility = attacker.useAbility();
    if (usedAbility) {
      const abilityHeal = attacker.HP - beforeHP;
      events.push({
        type: "ability",
        turn,
        actor: attacker.name,
        message: abilityName(attacker, abilityHeal),
        healed: abilityHeal > 0 ? abilityHeal : undefined,
        attackerSnapshot: attacker.snapshot(),
        defenderSnapshot: defender.snapshot(),
      });
    } else {
      events.push({
        type: "ability_failed",
        turn,
        actor: attacker.name,
        message: `${attacker.name} tries to use their ability but lacks resources.`,
        attackerSnapshot: attacker.snapshot(),
        defenderSnapshot: defender.snapshot(),
      });
    }

    const damage = attacker.getDamage();
    const taken = defender.takeDamage(damage);
    events.push({
      type: "attack",
      turn,
      actor: attacker.name,
      target: defender.name,
      damage: taken,
      message: `${attacker.name} hits ${defender.name} for ${taken} damage.`,
      attackerSnapshot: attacker.snapshot(),
      defenderSnapshot: defender.snapshot(),
    });

    if (defender.HP <= 0) {
      events.push({
        type: "knockout",
        turn,
        actor: defender.name,
        message: `${defender.name} is knocked out. ${attacker.name} wins!`,
        attackerSnapshot: attacker.snapshot(),
        defenderSnapshot: defender.snapshot(),
      });
      return {
        winner: attacker.name,
        loser: defender.name,
        events,
        totalTurns: turn,
      };
    }

    [attacker, defender] = [defender, attacker];
    turn += 1;
  }

  // Stalemate cap (e.g., two Clerics infinitely healing). Pick higher HP%.
  const aPct = a.HP / a.maxHP;
  const bPct = b.HP / b.maxHP;
  const winner = aPct >= bPct ? a : b;
  const loser = winner === a ? b : a;
  events.push({
    type: "knockout",
    turn,
    actor: loser.name,
    message: `Stalemate after ${MAX_TURNS} turns. ${winner.name} wins on HP%.`,
    attackerSnapshot: winner.snapshot(),
    defenderSnapshot: loser.snapshot(),
  });
  return { winner: winner.name, loser: loser.name, events, totalTurns: turn };
}

function abilityName(f: Fighter, healed: number): string {
  switch (f.type) {
    case "Robot":
      return `${f.name} channels Shockwave Punch — bonus damage charged.`;
    case "Archer":
      return `${f.name} uses Quickstep — speed +1.`;
    case "Cleric":
      return `${f.name} casts Healing Light — restored ${healed} HP.`;
  }
}
