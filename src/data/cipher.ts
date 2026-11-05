/**
 * Daily Cipher word pool + deterministic-per-day picker.
 * Shared by the client game and the chat API so both always agree.
 *
 * The previous djb2-style hash of YYYY-MM-DD barely mixed: consecutive
 * days produced consecutive hash values, so the picker walked a short
 * window of the list and some words never appeared. We now use FNV-1a
 * with a Murmur-style finalizer so small date changes avalanche.
 */
export const WORDS = [
  'NAJMI',
  'JOHOR',
  'TOOLS',
  'MYSQL',
  'POWER',
  'REACT',
  'INTEL',
  'FLOWS',
  'TEAMS',
  'BUILT',
  'KEMAS',
  'SCALE',
  'YIELD',
  'GRADE',
  'USERS',
  'STACK',
  'STAKE',
  'RATES',
  'SWAPS',
  'CROSS',
  'VAULT',
  'LOWER',
  'BANKS',
  'ADMIN',
  'FUNDS',
  'EMAIL',
  'STAFF',
  'TOKEN',
  'AGENT',
  'FINAL',
] as const;

export type CipherWord = (typeof WORDS)[number];

/** UTC calendar date as YYYY-MM-DD. */
export function getUtcDateString(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Mix a date string into a well-distributed 32-bit unsigned index. */
export function hashDateToIndex(dateStr: string, modulo: number): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < dateStr.length; i++) {
    h ^= dateStr.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h | 0, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h | 0, 0x846ca68b);
  h ^= h >>> 16;
  return (h >>> 0) % modulo;
}

export function getDailySecret(date: Date = new Date()): CipherWord {
  const idx = hashDateToIndex(getUtcDateString(date), WORDS.length);
  return WORDS[idx];
}

export function isCipherWord(word: string): word is CipherWord {
  return (WORDS as readonly string[]).includes(word.toUpperCase());
}
