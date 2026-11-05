/**
 * Daily Cipher word pool + deterministic-per-day picker.
 * Shared by the client game and the chat API so both always agree.
 *
 * Pool rule: every distinct 5-letter alphabetic token that appears as
 * visible text on the portfolio (hero, location, skills chips, blurbs,
 * HSS, EduCeria, etc.) is a valid guess AND a possible word-of-the-day.
 * Tokens are normalized the same way as clicks: uppercase, letters only.
 *
 * Hash: FNV-1a + Murmur-style finalizer so consecutive UTC dates
 * avalanche across the list (the old djb2 barely mixed).
 */
export const WORDS = [
  'ADMIN',
  'AGENT',
  'APPLE',
  'AXIOS',
  'BAHRU',
  'BANKS',
  'BASED',
  'BUILT',
  'CERIA',
  'CHECK',
  'CLICK',
  'CROSS',
  'DAILY',
  'EMAIL',
  'ERROR',
  'EVERY',
  'FARAH',
  'FINAL',
  'FIRST',
  'FIXED',
  'FLOWS',
  'FUNDS',
  'GMAIL',
  'GRADE',
  'HANDS',
  'INDIA',
  'INTEL',
  'JOHOR',
  'KEEPS',
  'KEMAS',
  'KOLEJ',
  'LEAVE',
  'LIGHT',
  'LINUX',
  'LOGIN',
  'LOWER',
  'MONTH',
  'MYSQL',
  'NAJMI',
  'OAUTH',
  'OPENS',
  'PARTY',
  'PHONE',
  'PINIA',
  'POWER',
  'RATES',
  'REACT',
  'READY',
  'ROLES',
  'RURAL',
  'SCALE',
  'SHIFT',
  'STACK',
  'STAFF',
  'STAKE',
  'STATE',
  'SWAPS',
  'TASKA',
  'TEAMS',
  'THEIR',
  'THEME',
  'THESE',
  'THIRD',
  'TOKEN',
  'TOOLS',
  'UNDER',
  'USERS',
  'VAULT',
  'VUEJS',
  'WHERE',
  'WHOLE',
  'WORKS',
  'YEARS',
  'YIELD',
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
