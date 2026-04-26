"use client";

import { useState } from "react";
import type { FighterType } from "@/lib/fighters";

interface Props {
  existingNames: string[];
  onCreate: (data: {
    name: string;
    type: FighterType;
    maxHP: number;
    strength: number;
    speed: number;
    magic: number;
  }) => void;
}

export function CreateFighterForm({ existingNames, onCreate }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<FighterType>("Robot");
  const [maxHP, setMaxHP] = useState("100");
  const [strength, setStrength] = useState("10");
  const [speed, setSpeed] = useState("8");
  const [magic, setMagic] = useState("6");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) return setError("Name is required.");
    if (existingNames.includes(trimmed))
      return setError(`A fighter named "${trimmed}" already exists.`);

    const stats = [maxHP, strength, speed, magic].map(Number);
    if (stats.some((n) => !Number.isFinite(n) || n <= 0)) {
      return setError("All stats must be positive numbers.");
    }

    onCreate({
      name: trimmed,
      type,
      maxHP: stats[0],
      strength: stats[1],
      speed: stats[2],
      magic: stats[3],
    });
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border border-stone-200">
      <h3 className="font-semibold mb-3">Create fighter</h3>

      <div className="space-y-3">
        <label className="block">
          <span className="block text-sm text-stone-700 mb-1">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Thalia"
            className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
            required
          />
        </label>

        <label className="block">
          <span className="block text-sm text-stone-700 mb-1">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as FighterType)}
            className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-400 outline-none"
          >
            <option value="Robot">🤖 Robot — strength + Shockwave Punch</option>
            <option value="Archer">🏹 Archer — speed + Quickstep</option>
            <option value="Cleric">✨ Cleric — magic + Healing Light</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Max HP" value={maxHP} onChange={setMaxHP} />
          <NumberField label="Strength" value={strength} onChange={setStrength} />
          <NumberField label="Speed" value={speed} onChange={setSpeed} />
          <NumberField label="Magic" value={magic} onChange={setMagic} />
        </div>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-stone-900 hover:bg-stone-700 text-white font-medium py-2 rounded transition"
        >
          Add to roster
        </button>
      </div>
    </form>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-stone-600 mb-1">{label}</span>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 text-sm border border-stone-300 rounded focus:ring-2 focus:ring-amber-400 outline-none"
        required
      />
    </label>
  );
}
