/** Thousands separator without Intl (Hermes locale data is not guaranteed). */
export function groupNumber(value: number): string {
  const n = Math.max(0, Math.floor(value));
  const s = String(n);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) {
      out += ',';
    }
    out += s[i];
  }
  return out;
}

export function ratio(current: number, target: number): string {
  return `${Math.min(current, target)}/${target}`;
}

export function clockLabel(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? '0' : ''}${r}`;
}

export function multiplierLabel(value: number): string {
  return value % 1 === 0 ? `x${value.toFixed(0)}` : `x${value.toFixed(1)}`;
}
