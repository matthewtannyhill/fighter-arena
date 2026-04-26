"use client";

import { useEffect, useRef, useState } from "react";
import type { BattleResult, BattleEvent } from "@/lib/battle";
import { FighterCard } from "./FighterCard";

interface Props {
  result: BattleResult;
  onReplay: () => void;
  onClose: () => void;
}

const EVENT_ICONS: Record<BattleEvent["type"], string> = {
  start: "⚔",
  regenerate: "💚",
  ability: "✨",
  ability_failed: "·",
  attack: "💥",
  knockout: "🏆",
};

export function BattleViewer({ result, onReplay, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  const currentEvent = result.events[Math.min(step, result.events.length - 1)];
  const isDone = step >= result.events.length - 1;

  useEffect(() => {
    if (!autoplay || isDone) return;
    const id = setTimeout(() => setStep((s) => s + 1), 600);
    return () => clearTimeout(id);
  }, [autoplay, step, isDone]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [step]);

  const visibleEvents = result.events.slice(0, step + 1);

  // Map snapshots back to fighters consistently. The first event is "start"
  // with attackerSnapshot=fighter1, defenderSnapshot=fighter2. Other events
  // alternate by attacker — pick the one matching fighter1 by name.
  const f1Name = result.events[0].attackerSnapshot.name;
  const snapshotFor = (name: string) => {
    if (currentEvent.attackerSnapshot.name === name) return currentEvent.attackerSnapshot;
    if (currentEvent.defenderSnapshot.name === name) return currentEvent.defenderSnapshot;
    return null;
  };
  const f1Snap = snapshotFor(f1Name) ?? result.events[0].attackerSnapshot;
  const f2Snap =
    snapshotFor(result.events[0].defenderSnapshot.name) ?? result.events[0].defenderSnapshot;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-stone-50 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <h2 className="font-semibold text-lg">Battle</h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-900 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="grid md:grid-cols-2 gap-4 p-6">
          <FighterCard stats={f1Snap} />
          <FighterCard stats={f2Snap} />
        </div>

        <div ref={logRef} className="flex-1 overflow-y-auto px-6 pb-4 space-y-1.5">
          {visibleEvents.map((event, i) => (
            <div
              key={i}
              className={`flex gap-2 text-sm py-1.5 px-3 rounded ${
                event.type === "knockout"
                  ? "bg-amber-100 text-amber-900 font-medium"
                  : event.type === "attack"
                  ? "bg-white"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              <span className="text-xs text-stone-400 w-8">T{event.turn}</span>
              <span>{EVENT_ICONS[event.type]}</span>
              <span className="flex-1">{event.message}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-stone-200 bg-white flex gap-2 flex-wrap">
          <button
            onClick={() => setAutoplay((a) => !a)}
            disabled={isDone}
            className="px-4 py-2 text-sm rounded border border-stone-300 hover:bg-stone-100 disabled:opacity-40"
          >
            {autoplay ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={() => setStep((s) => Math.min(s + 1, result.events.length - 1))}
            disabled={isDone}
            className="px-4 py-2 text-sm rounded border border-stone-300 hover:bg-stone-100 disabled:opacity-40"
          >
            Step ▸
          </button>
          <button
            onClick={() => {
              setAutoplay(false);
              setStep(result.events.length - 1);
            }}
            disabled={isDone}
            className="px-4 py-2 text-sm rounded border border-stone-300 hover:bg-stone-100 disabled:opacity-40"
          >
            Skip to end
          </button>
          <div className="flex-1" />
          <button
            onClick={onReplay}
            className="px-4 py-2 text-sm rounded bg-stone-900 hover:bg-stone-700 text-white"
          >
            Rematch
          </button>
        </div>
      </div>
    </div>
  );
}
