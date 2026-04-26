export type FighterType = "Robot" | "Archer" | "Cleric";

export const ROBOT_ABILITY_COST = 5;
export const CLERIC_ABILITY_COST = 25;

export interface FighterStats {
  name: string;
  type: FighterType;
  maxHP: number;
  HP: number;
  strength: number;
  speed: number;
  magic: number;
  /** Robot only — current energy. */
  energy?: number;
  maxEnergy?: number;
  bonusDamage?: number;
  /** Archer only — current speed bonus from Quickstep. */
  speedBonus?: number;
  defaultSpeed?: number;
  /** Cleric only — current mana. */
  mana?: number;
  maxMana?: number;
}

export abstract class Fighter implements FighterStats {
  name: string;
  type: FighterType;
  maxHP: number;
  HP: number;
  strength: number;
  speed: number;
  magic: number;

  constructor(
    name: string,
    type: FighterType,
    maxHP: number,
    strength: number,
    speed: number,
    magic: number
  ) {
    if (maxHP <= 0 || strength <= 0 || speed <= 0 || magic <= 0) {
      throw new Error("All stats must be greater than 0.");
    }
    this.name = name;
    this.type = type;
    this.maxHP = maxHP;
    this.HP = maxHP;
    this.strength = strength;
    this.speed = speed;
    this.magic = magic;
  }

  abstract getDamage(): number;
  abstract useAbility(): boolean;
  abstract reset(): void;

  /**
   * dmg - floor(speed/4), minimum 1. HP can go negative.
   */
  takeDamage(damage: number): number {
    const reduced = damage - Math.floor(this.speed / 4);
    const taken = reduced >= 1 ? reduced : 1;
    this.HP -= taken;
    return taken;
  }

  /**
   * HP += max(floor(strength/6), 1), capped at maxHP.
   */
  regenerate(): number {
    const baseRestore = Math.floor(this.strength / 6);
    const restore = baseRestore >= 1 ? baseRestore : 1;
    const before = this.HP;
    this.HP = Math.min(this.HP + restore, this.maxHP);
    return this.HP - before;
  }

  snapshot(): FighterStats {
    const base: FighterStats = {
      name: this.name,
      type: this.type,
      maxHP: this.maxHP,
      HP: this.HP,
      strength: this.strength,
      speed: this.speed,
      magic: this.magic,
    };
    return base;
  }
}

export class Robot extends Fighter {
  energy: number;
  maxEnergy: number;
  bonusDamage: number;

  constructor(name: string, maxHP: number, strength: number, speed: number, magic: number) {
    super(name, "Robot", maxHP, strength, speed, magic);
    this.maxEnergy = 2 * magic;
    this.energy = this.maxEnergy;
    this.bonusDamage = 0;
  }

  getDamage(): number {
    const dmg = this.strength + this.bonusDamage;
    this.bonusDamage = 0;
    return dmg;
  }

  useAbility(): boolean {
    if (this.energy < ROBOT_ABILITY_COST) return false;
    const ratio = this.energy / this.maxEnergy;
    this.bonusDamage += Math.floor(this.strength * Math.pow(ratio, 4));
    this.energy -= ROBOT_ABILITY_COST;
    return true;
  }

  reset(): void {
    this.HP = this.maxHP;
    this.energy = this.maxEnergy;
    this.bonusDamage = 0;
  }

  snapshot(): FighterStats {
    return {
      ...super.snapshot(),
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      bonusDamage: this.bonusDamage,
    };
  }
}

export class Archer extends Fighter {
  defaultSpeed: number;

  constructor(name: string, maxHP: number, strength: number, speed: number, magic: number) {
    super(name, "Archer", maxHP, strength, speed, magic);
    this.defaultSpeed = speed;
  }

  getDamage(): number {
    return this.speed;
  }

  useAbility(): boolean {
    this.speed += 1;
    return true;
  }

  reset(): void {
    this.HP = this.maxHP;
    this.speed = this.defaultSpeed;
  }

  snapshot(): FighterStats {
    return {
      ...super.snapshot(),
      speedBonus: this.speed - this.defaultSpeed,
      defaultSpeed: this.defaultSpeed,
    };
  }
}

export class Cleric extends Fighter {
  mana: number;
  maxMana: number;

  constructor(name: string, maxHP: number, strength: number, speed: number, magic: number) {
    super(name, "Cleric", maxHP, strength, speed, magic);
    this.maxMana = 5 * magic;
    this.mana = this.maxMana;
  }

  getDamage(): number {
    return this.magic;
  }

  useAbility(): boolean {
    if (this.mana < CLERIC_ABILITY_COST) return false;
    const baseHeal = Math.floor(this.magic / 3);
    const heal = baseHeal >= 1 ? baseHeal : 1;
    this.HP = Math.min(this.HP + heal, this.maxHP);
    this.mana -= CLERIC_ABILITY_COST;
    return true;
  }

  regenerate(): number {
    const hpRestored = super.regenerate();
    const baseManaRestore = Math.floor(this.magic / 5);
    const manaRestore = baseManaRestore >= 1 ? baseManaRestore : 1;
    this.mana = Math.min(this.mana + manaRestore, this.maxMana);
    return hpRestored;
  }

  reset(): void {
    this.HP = this.maxHP;
    this.mana = this.maxMana;
  }

  snapshot(): FighterStats {
    return {
      ...super.snapshot(),
      mana: this.mana,
      maxMana: this.maxMana,
    };
  }
}

export function createFighter(
  type: FighterType,
  name: string,
  maxHP: number,
  strength: number,
  speed: number,
  magic: number
): Fighter {
  switch (type) {
    case "Robot":
      return new Robot(name, maxHP, strength, speed, magic);
    case "Archer":
      return new Archer(name, maxHP, strength, speed, magic);
    case "Cleric":
      return new Cleric(name, maxHP, strength, speed, magic);
  }
}
