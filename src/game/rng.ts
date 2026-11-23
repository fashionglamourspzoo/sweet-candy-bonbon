/**
 * Local, deterministic PRNG. Generation NEVER uses Math.random(),
 * so any board can be reproduced from its seed.
 */
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** seed = index * 7919 ^ attempt * 104729 — one seed per attempt, logged with the stage. */
export function makeSeed(index: number, attempt: number): number {
  return ((index * 7919) ^ (attempt * 104729)) >>> 0;
}

export const randInt = (rng: Rng, maxExclusive: number) =>
  Math.min(maxExclusive - 1, Math.floor(rng() * maxExclusive));

export function shuffled<T>(items: T[], rng: Rng): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = randInt(rng, i + 1);
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}
