/**
 * Keep the last two words of a title together so a single word
 * cannot wrap alone onto the final line (typographic orphan).
 *
 * Prefer with `.title-measure` / `.title-measure-sm` / `.title-measure-lg`
 * (globals.css) — not skinny `max-w-[12ch]`/`max-w-[14ch]` — so titles
 * read as 1–2 natural lines instead of balanced 3-line stacks.
 */
export function antiOrphan(text: string): string {
  const trimmed = text.trimEnd();
  const i = trimmed.lastIndexOf(" ");
  if (i <= 0) return text;
  return `${trimmed.slice(0, i)}\u00A0${trimmed.slice(i + 1)}`;
}
