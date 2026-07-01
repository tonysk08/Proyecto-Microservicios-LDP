/**
 * Normalización de nombres de producto para el matching.
 * "LECHE ENTERA 1 LT." -> "leche entera 1 l"
 */
const UNIT_ALIASES: Record<string, string> = {
  lt: 'l',
  lts: 'l',
  litro: 'l',
  litros: 'l',
  ml: 'ml',
  kg: 'kg',
  kgs: 'kg',
  gr: 'g',
  grs: 'g',
  g: 'g',
  und: 'un',
  unidad: 'un',
};

export function stripAccents(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function normalizeName(input: string): string {
  const base = stripAccents((input ?? '').toLowerCase())
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return base
    .split(' ')
    .map((tok) => UNIT_ALIASES[tok] ?? tok)
    .join(' ');
}

export function tokens(input: string): string[] {
  return normalizeName(input).split(' ').filter(Boolean);
}
