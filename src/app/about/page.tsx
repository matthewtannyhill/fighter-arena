export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">About</h1>

      <h2 className="text-xl font-semibold mt-6 mb-3">History</h2>
      <p className="mb-4">
        Originally a 2019 BYU CS 235 (Data Structures) Lab 1 — a C++ exercise in
        inheritance and polymorphism. The original code parsed text files of
        instructions, created fighters in an arena, and ran battles to a deterministic
        output for grading.
      </p>
      <p className="mb-4">
        Modernized in 2026 as a TypeScript port with a Next.js UI on Vercel. The battle
        math is preserved exactly — same damage formulas, same regeneration rates, same
        ability costs. Original C++ archived at{" "}
        <a
          className="text-amber-700 hover:underline"
          href="https://github.com/matthewtannyhill/RPG"
        >
          github.com/matthewtannyhill/RPG
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Battle rules</h2>
      <ul className="list-disc list-inside space-y-1 text-stone-700 mb-4">
        <li>
          <strong>Damage taken</strong>: <code>damage − floor(speed/4)</code>, minimum 1
        </li>
        <li>
          <strong>Regenerate</strong>: HP +{" "}
          <code>max(floor(strength/6), 1)</code>, capped at max HP
        </li>
        <li>
          <strong>Each turn</strong>: regenerate → use ability → attack
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">Classes</h2>
      <div className="space-y-3 text-stone-700">
        <p>
          <strong>🤖 Robot</strong> — damage = strength + ability bonus.{" "}
          <em>Shockwave Punch</em> (5 energy): bonus damage = strength × (energy/max)⁴.
          Max energy = 2 × magic.
        </p>
        <p>
          <strong>🏹 Archer</strong> — damage = current speed.{" "}
          <em>Quickstep</em> (free): speed +1 per use, persists until reset.
        </p>
        <p>
          <strong>✨ Cleric</strong> — damage = magic.{" "}
          <em>Healing Light</em> (25 mana): HP + floor(magic/3). Max mana = 5 × magic;
          regenerate also restores mana.
        </p>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Stack</h2>
      <p className="text-stone-700">
        Next.js 16, React 19, Tailwind 4, TypeScript. Pure client-side — no backend, no
        database. The battle simulator is deterministic and runs entirely in the browser.
      </p>
    </div>
  );
}
