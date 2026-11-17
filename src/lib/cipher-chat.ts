/**
 * Daily Cipher rules for Ask Adam, enforced on the server.
 *
 * The model only learns today's word when the visitor has already asked about
 * the cipher earlier in the same conversation and now asks for the answer
 * again. Before that it gets a server-made hint (never the word), and its
 * reply is checked so a hint turn can't leak the word.
 */

export type CipherMode = 'none' | 'hint' | 'hint2' | 'reveal';

const MENTIONS =
  /\b(cipher|wordle|word of the day|today'?s word|daily word|secret word|hidden word|mystery word|perkataan|teka\s?kata)\b/i;
const WANTS_HINT = /\b(hint|hints|clue|clues|petunjuk|klu|tip)\b/i;
const WANTS_ANSWER =
  /\b(answer|jawapan|reveal|spoil|just tell|tell me the word|give me the word|what('?s| is) the word|the word is|bagi(tau)?\s+(je\s+)?(jawapan|perkataan)|apa\s+(perkataan|jawapan))\b/i;

const isCipherAsk = (text: string, askedBefore: boolean) =>
  MENTIONS.test(text) || WANTS_HINT.test(text) || (askedBefore && WANTS_ANSWER.test(text));

/** Earlier user turns that asked about the cipher (hint or answer). */
export function countEarlierAsks(history: string[]): number {
  let n = 0;
  for (const h of history) if (isCipherAsk(h, n > 0)) n++;
  return n;
}

export function cipherMode(message: string, history: string[]): CipherMode {
  const earlier = countEarlierAsks(history);
  if (!isCipherAsk(message, earlier > 0)) return 'none';
  if (earlier === 0) return 'hint';
  const answer =
    WANTS_ANSWER.test(message) || (MENTIONS.test(message) && !WANTS_HINT.test(message));
  return answer ? 'reveal' : 'hint2';
}

const VOWELS = /[AEIOU]/g;
/** A nudge, not a giveaway: length, first letter, vowel count (+ last letter on a 2nd hint). */
export function serverHint(word: string, stronger = false): string {
  const w = word.toUpperCase();
  const vowels = (w.match(VOWELS) || []).length;
  const parts = [
    `it has ${w.length} letters`,
    `starts with "${w[0]}"`,
    `has ${vowels} vowel${vowels === 1 ? '' : 's'}`,
  ];
  if (stronger) parts.push(`ends with "${w[w.length - 1]}"`);
  return `Today's word: ${parts.join(', ')}. It appears as visible text somewhere on this portfolio, so try clicking words that fit.`;
}

/** The prompt section for this turn. Only 'reveal' contains the word. */
export function cipherPrompt(mode: CipherMode, word: string): string {
  const intro =
    'There is a Wordle-style game on the portfolio called "Daily Cipher": visitors find a hidden 5-letter word by clicking words on the site and guessing in the CIPHER tab.';
  switch (mode) {
    case 'none':
      return `${intro}\nYou do not know today's word. If someone asks about it, offer a hint.`;
    case 'hint':
    case 'hint2':
      return `${intro}
The visitor is asking about today's word. You do NOT know the word. Give them only this hint, in your own friendly words, without guessing any word:
"${serverHint(word, mode === 'hint2')}"
${mode === 'hint' ? 'Tell them that if they are still stuck, they can ask you for the answer again.' : 'If they want the answer, they can ask for it directly.'}
Encourage them to keep exploring the portfolio.`;
    case 'reveal':
      return `${intro}
The visitor already asked for help earlier in this chat and is asking for the answer again, so you may reveal it: today's word is "${word.toUpperCase()}". Say it plainly and congratulate them for trying.`;
  }
}

/** True if text contains the word, even spelled out with spaces, dots or dashes. */
export function leaksWord(text: string, word: string): boolean {
  const w = word.toUpperCase();
  const flat = text.toUpperCase().replace(/[^A-Z]/g, ' ');
  if (new RegExp(`\\b${w}\\b`).test(flat)) return true;
  const spaced = new RegExp(w.split('').join('[\\s\\-_.*,·]{1,3}'));
  return spaced.test(text.toUpperCase());
}

/** Keep only plausible earlier user messages from the request body. */
export function cleanHistory(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m): m is string => typeof m === 'string')
    .slice(-20)
    .map((m) => m.slice(0, 500));
}
