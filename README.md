# Fighter Arena

Turn-based combat between Robots, Archers, and Clerics. Originally a 2019 BYU CS 235 (Data Structures) C++ class lab; modernized in 2026 as a TypeScript + Next.js web app on Vercel.

**Live:** https://fighter-arena.vercel.app
**Original C++:** https://github.com/matthewtannyhill/RPG

## What it does

Create fighters with custom stats, pick two, watch a turn-based battle play out with a step-through log. Battle math is preserved from the original C++:

- **Damage taken:** `damage − floor(speed/4)`, minimum 1
- **Regenerate:** HP + `max(floor(strength/6), 1)`, capped at max HP
- **Robot:** damage = strength + bonus; Shockwave Punch costs 5 energy and adds `strength × (energy/max)⁴` to next attack
- **Archer:** damage = current speed; Quickstep adds +1 speed per use (no cost)
- **Cleric:** damage = magic; Healing Light costs 25 mana and heals `floor(magic/3)`

Each turn: regenerate → use ability → attack. Loser is the first fighter to drop to HP ≤ 0.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind 4 |
| Logic | TypeScript classes, all client-side |
| Hosting | Vercel (static-friendly, no backend) |

## Local dev

```bash
npm install
npm run dev
```

That's it. No serverless functions, no datasets, no env vars.

## Layout

```
src/lib/         Battle simulator (pure TS, no DOM)
  fighters.ts    Fighter base class + Robot, Archer, Cleric subclasses
  battle.ts      Turn-by-turn simulator producing an event log
src/components/  UI building blocks (FighterCard, CreateFighterForm, BattleViewer)
src/app/         Next.js routes (/, /about)
```
