import type { FighterStats, FighterType } from "@/lib/fighters";

const TYPE_COLOR: Record<FighterType, string> = {
  Robot: "bg-slate-100 text-slate-800 border-slate-300",
  Archer: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Cleric: "bg-amber-100 text-amber-800 border-amber-300",
};

const TYPE_ICON: Record<FighterType, string> = {
  Robot: "🤖",
  Archer: "🏹",
  Cleric: "✨",
};

interface FighterCardProps {
  stats: FighterStats;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
}

export function FighterCard({ stats, selected, onSelect, onRemove }: FighterCardProps) {
  const hpPct = Math.max(0, (stats.HP / stats.maxHP) * 100);

  return (
    <div
      className={`p-4 rounded-lg border bg-white transition ${
        selected ? "border-amber-500 ring-2 ring-amber-200" : "border-stone-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{TYPE_ICON[stats.type]}</span>
          <div>
            <div className="font-semibold">{stats.name}</div>
            <span
              className={`inline-block text-xs px-2 py-0.5 rounded border ${TYPE_COLOR[stats.type]}`}
            >
              {stats.type}
            </span>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-xs text-stone-400 hover:text-red-600"
            aria-label={`Remove ${stats.name}`}
          >
            ✕
          </button>
        )}
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-stone-600 mb-1">
          <span>HP</span>
          <span>
            {stats.HP} / {stats.maxHP}
          </span>
        </div>
        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              hpPct > 50 ? "bg-emerald-500" : hpPct > 20 ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${hpPct}%` }}
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Stat label="STR" value={stats.strength} />
        <Stat label="SPD" value={stats.speed} />
        <Stat label="MAG" value={stats.magic} />
      </div>

      {stats.type === "Robot" && stats.maxEnergy !== undefined && (
        <ResourceBar label="Energy" current={stats.energy ?? 0} max={stats.maxEnergy} color="bg-slate-500" />
      )}
      {stats.type === "Cleric" && stats.maxMana !== undefined && (
        <ResourceBar label="Mana" current={stats.mana ?? 0} max={stats.maxMana} color="bg-violet-500" />
      )}
      {stats.type === "Archer" && (stats.speedBonus ?? 0) > 0 && (
        <div className="mt-2 text-xs text-emerald-700">+{stats.speedBonus} bonus speed</div>
      )}

      {onSelect && (
        <button
          onClick={onSelect}
          className={`mt-3 w-full text-sm py-1.5 rounded-md transition ${
            selected
              ? "bg-amber-500 text-white"
              : "bg-stone-100 hover:bg-amber-100 text-stone-700"
          }`}
        >
          {selected ? "Selected" : "Select"}
        </button>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-stone-50 rounded px-2 py-1 text-center">
      <div className="text-stone-400 text-[10px]">{label}</div>
      <div className="font-medium text-stone-800">{value}</div>
    </div>
  );
}

function ResourceBar({
  label,
  current,
  max,
  color,
}: {
  label: string;
  current: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (current / max) * 100 : 0;
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-stone-600 mb-1">
        <span>{label}</span>
        <span>
          {current} / {max}
        </span>
      </div>
      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
