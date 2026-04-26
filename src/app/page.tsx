"use client";

import { useState } from "react";
import { createFighter, Fighter, FighterType } from "@/lib/fighters";
import { simulateBattle, type BattleResult } from "@/lib/battle";
import { FighterCard } from "@/components/FighterCard";
import { CreateFighterForm } from "@/components/CreateFighterForm";
import { BattleViewer } from "@/components/BattleViewer";

const STARTERS: Array<{
  name: string;
  type: FighterType;
  maxHP: number;
  strength: number;
  speed: number;
  magic: number;
}> = [
  { name: "Crusher", type: "Robot", maxHP: 120, strength: 14, speed: 6, magic: 8 },
  { name: "Fletcher", type: "Archer", maxHP: 90, strength: 8, speed: 14, magic: 7 },
  { name: "Mira", type: "Cleric", maxHP: 100, strength: 7, speed: 8, magic: 12 },
];

function makeStarters(): Fighter[] {
  return STARTERS.map((s) => createFighter(s.type, s.name, s.maxHP, s.strength, s.speed, s.magic));
}

export default function ArenaPage() {
  const [fighters, setFighters] = useState<Fighter[]>(() => makeStarters());
  const [selected, setSelected] = useState<string[]>([]);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  function toggleSelect(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 2) return [prev[1], name];
      return [...prev, name];
    });
  }

  function handleCreate(data: {
    name: string;
    type: FighterType;
    maxHP: number;
    strength: number;
    speed: number;
    magic: number;
  }) {
    const f = createFighter(data.type, data.name, data.maxHP, data.strength, data.speed, data.magic);
    setFighters((prev) => [...prev, f]);
  }

  function handleRemove(name: string) {
    setFighters((prev) => prev.filter((f) => f.name !== name));
    setSelected((prev) => prev.filter((n) => n !== name));
  }

  function handleBattle() {
    if (selected.length !== 2) return;
    const a = fighters.find((f) => f.name === selected[0]);
    const b = fighters.find((f) => f.name === selected[1]);
    if (!a || !b) return;
    setBattleResult(simulateBattle(a, b));
  }

  function handleReplay() {
    if (!battleResult) return;
    const a = fighters.find((f) => f.name === battleResult.events[0].attackerSnapshot.name);
    const b = fighters.find((f) => f.name === battleResult.events[0].defenderSnapshot.name);
    if (!a || !b) return;
    setBattleResult(simulateBattle(a, b));
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Fighter Arena</h1>
        <p className="text-stone-600 max-w-2xl">
          Create fighters, pick two, and watch a turn-based battle play out. Each class
          has a unique ability: Robots charge a Shockwave Punch, Archers gain speed each
          turn, Clerics heal with Healing Light.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CreateFighterForm
            existingNames={fighters.map((f) => f.name)}
            onCreate={handleCreate}
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Roster ({fighters.length})</h2>
            <button
              onClick={handleBattle}
              disabled={selected.length !== 2}
              className="px-4 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-medium transition"
            >
              {selected.length === 2
                ? `Fight: ${selected[0]} vs ${selected[1]}`
                : `Select ${2 - selected.length} more`}
            </button>
          </div>

          {fighters.length === 0 ? (
            <div className="text-stone-500 text-sm p-8 text-center bg-white rounded-lg border border-stone-200">
              Roster is empty. Create a fighter to start.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {fighters.map((f) => (
                <FighterCard
                  key={f.name}
                  stats={f.snapshot()}
                  selected={selected.includes(f.name)}
                  onSelect={() => toggleSelect(f.name)}
                  onRemove={() => handleRemove(f.name)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {battleResult && (
        <BattleViewer
          result={battleResult}
          onReplay={handleReplay}
          onClose={() => setBattleResult(null)}
        />
      )}
    </div>
  );
}
