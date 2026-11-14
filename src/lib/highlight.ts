/**
 * Tiny build-time syntax highlighter for the editor panes. It only needs to
 * colour the handful of files this site shows, so it is a set of per-language
 * regex passes rather than a full grammar. Output is escaped HTML.
 */
import { isCipherWord } from '../data/cipher';

export type Lang = 'ts' | 'json' | 'env' | 'sh';
export interface CodeLine {
  indent: number;
  html: string;
}
interface Options {
  /** Turn 5-letter string values (e.g. "MySQL", "Vue.js 3") into Daily Cipher chips. */
  cipher?: boolean;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tk = (cls: string, text: string) => `<span class="tk-${cls}">${esc(text)}</span>`;

const KEYWORDS: Record<'ts' | 'sh', Set<string>> = {
  ts: new Set(
    'export const let var function return interface type as import from default new if else for of in true false null undefined satisfies readonly async await'.split(
      ' ',
    ),
  ),
  sh: new Set(
    'if then else elif fi for in do done while case esac function return local set echo read exit'.split(
      ' ',
    ),
  ),
};

function linkify(raw: string): string | null {
  if (/^https?:\/\/\S+$/.test(raw))
    return `<a href="${esc(raw)}" target="_blank" rel="noopener noreferrer">${esc(raw)}</a>`;
  if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(raw)) return `<a href="mailto:${esc(raw)}">${esc(raw)}</a>`;
  if (/^\/file\/\S+$/.test(raw))
    return `<a href="${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
  return null;
}

function cipherChip(raw: string): string | null {
  const word = raw.replace(/[^A-Za-z]/g, '').toUpperCase();
  if (word.length !== 5 || !isCipherWord(word)) return null;
  return `<span data-word="${word}" class="cipher-chip" role="button" tabindex="0" onclick="window.guessWord && window.guessWord(this.dataset.word)">${esc(raw)}</span>`;
}

function str(token: string, opts: Options): string {
  const quote = token[0];
  const inner = token.slice(1, -1);
  const body = linkify(inner) ?? (opts.cipher ? cipherChip(inner) : null) ?? esc(inner);
  return `<span class="tk-s">${esc(quote)}${body}${esc(quote)}</span>`;
}

const nextChar = (line: string, from: number) => line.slice(from).match(/^\s*(\S)/)?.[1] ?? '';

function ts(line: string, opts: Options): string {
  if (/^\s*(\/\*\*?|\*)/.test(line)) return tk('c', line);
  const re =
    /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b\d[\d_.]*\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$\d'"`]+)/g;
  let out = '';
  for (const m of line.matchAll(re)) {
    const [t, com, s, num, word] = m;
    if (com) out += tk('c', com);
    else if (s) out += str(s, opts);
    else if (num) out += tk('n', num);
    else if (word) {
      const after = nextChar(line, (m.index ?? 0) + word.length);
      if (KEYWORDS.ts.has(word)) out += tk('k', word);
      else if (after === '(') out += tk('f', word);
      else if (after === ':') out += tk('p', word);
      else if (/^[A-Z]/.test(word)) out += tk('t', word);
      else out += tk('v', word);
    } else out += /^\s+$/.test(t) ? t : tk('o', t);
  }
  return out;
}

function json(line: string, opts: Options): string {
  if (/^\s*\/\//.test(line)) return tk('c', line);
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\b\d[\d.]*\b)|\b(true|false|null)\b|(\s+)|([^\s"\d]+)/g;
  let out = '';
  for (const m of line.matchAll(re)) {
    const [t, s, colon, num, lit] = m;
    if (s && colon) out += tk('p', s) + tk('o', colon);
    else if (s) out += str(s, opts);
    else if (num) out += tk('n', num);
    else if (lit) out += tk('k', lit);
    else out += /^\s+$/.test(t) ? t : tk('o', t);
  }
  return out;
}

function env(line: string, opts: Options): string {
  if (/^\s*#/.test(line)) return tk('c', line);
  const m = line.match(/^([A-Z_][A-Z0-9_]*)(=)(.*)$/);
  if (!m) return esc(line);
  const [, key, eq, value] = m;
  const val = /^["'].*["']$/.test(value)
    ? str(value, opts)
    : `<span class="tk-s">${linkify(value) ?? esc(value)}</span>`;
  return tk('p', key) + tk('o', eq) + val;
}

function sh(line: string, opts: Options): string {
  const re =
    /(#.*$)|("(?:[^"\\]|\\.)*"|'[^']*')|(\$\{?[\w#?@]+\}?|\$\(|\$\(\()|(\b\d+\b)|([A-Za-z_][\w-]*)|(\s+)|([^\sA-Za-z_\d"'#$]+)/g;
  let out = '';
  for (const m of line.matchAll(re)) {
    const [t, com, s, variable, num, word] = m;
    if (com) out += tk('c', com);
    else if (s) out += str(s, opts);
    else if (variable) out += tk('p', variable);
    else if (num) out += tk('n', num);
    else if (word) {
      const rest = line.slice((m.index ?? 0) + word.length);
      if (KEYWORDS.sh.has(word)) out += tk('k', word);
      else if (/^\(\)/.test(rest)) out += tk('f', word);
      else out += tk('v', word);
    } else out += /^\s+$/.test(t) ? t : tk('o', t);
  }
  return out;
}

const PASSES = { ts, json, env, sh } as const;

export function highlight(code: string, lang: Lang, opts: Options = {}): CodeLine[] {
  return code
    .replace(/^\n+|\s+$/g, '')
    .split('\n')
    .map((raw) => {
      const indent = raw.match(/^ */)?.[0].length ?? 0;
      return { indent, html: PASSES[lang](raw.slice(indent), opts) };
    });
}
