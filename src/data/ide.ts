/**
 * Structure for the AmCode editor shell (files, browser tabs, generated
 * file sources). Profile facts live in profile.ts.
 */
import {
  SKILLS,
  EMAIL,
  LINKEDIN_URL,
  GITHUB_URL,
  RESUME_URL,
  PROFILE,
  SPOKEN,
  CERTIFICATIONS,
  CONTACT,
} from './profile';

export * from './profile';

export type FileIcon = 'md' | 'ts' | 'log' | 'tsx' | 'php' | 'java' | 'json' | 'env' | 'sh';

export interface IdeFile {
  id: string;
  name: string;
  path: string;
  icon: FileIcon;
  /** Language mode shown in the status bar. */
  lang: string;
  folder?: 'projects';
  aliases?: string[];
}

export const FILES: IdeFile[] = [
  {
    id: 'readme',
    name: 'README.md',
    path: 'README.md',
    icon: 'md',
    lang: 'Markdown',
    aliases: ['home', 'readme'],
  },
  {
    id: 'about',
    name: 'about.ts',
    path: 'about.ts',
    icon: 'ts',
    lang: 'TypeScript',
    aliases: ['about'],
  },
  {
    id: 'experience',
    name: 'experience.log',
    path: 'experience.log',
    icon: 'log',
    lang: 'Log',
    aliases: ['experience', 'work'],
  },
  {
    id: 'educeria',
    name: 'kemas-educeria.tsx',
    path: 'projects/kemas-educeria.tsx',
    icon: 'tsx',
    lang: 'TypeScript JSX',
    folder: 'projects',
    aliases: ['educeria', 'kemas'],
  },
  {
    id: 'hss',
    name: 'hss.php',
    path: 'projects/hss.php',
    icon: 'php',
    lang: 'PHP',
    folder: 'projects',
    aliases: ['hss'],
  },
  {
    id: 'tv',
    name: 'islamic-tv-launcher.java',
    path: 'projects/islamic-tv-launcher.java',
    icon: 'java',
    lang: 'Java',
    folder: 'projects',
    aliases: ['tv', 'islamic-tv', 'islamic-tv-launcher.kt', 'projects/islamic-tv-launcher.kt'],
  },
  {
    id: 'rapidz',
    name: 'rapidz.md',
    path: 'projects/rapidz.md',
    icon: 'md',
    lang: 'Markdown',
    folder: 'projects',
    aliases: ['rapidz'],
  },
  {
    id: 'stack',
    name: 'stack.json',
    path: 'stack.json',
    icon: 'json',
    lang: 'JSON with Comments',
    aliases: ['stack', 'skills'],
  },
  {
    id: 'education',
    name: 'education.md',
    path: 'education.md',
    icon: 'md',
    lang: 'Markdown',
    aliases: ['education', 'edu'],
  },
  {
    id: 'contact',
    name: 'contact.env',
    path: 'contact.env',
    icon: 'env',
    lang: 'Properties',
    aliases: ['contact'],
  },
  {
    id: 'cipher',
    name: 'daily_cipher.sh',
    path: 'daily_cipher.sh',
    icon: 'sh',
    lang: 'Shell Script',
    aliases: ['cipher', 'daily_cipher'],
  },
];

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  host: string;
  embeddable: boolean;
}

export const BROWSERS: BrowserTab[] = [
  {
    id: 'browser-hss',
    title: 'Simple Browser — hss.adamnajmi.com',
    url: 'https://hss.adamnajmi.com/login',
    host: 'hss.adamnajmi.com',
    embeddable: true,
  },
  {
    id: 'browser-educeria',
    title: 'Simple Browser — ceria.kemas.gov.my',
    url: 'https://ceria.kemas.gov.my/',
    host: 'ceria.kemas.gov.my',
    // Sends X-Frame-Options: SAMEORIGIN and CSP frame-src 'self', so it cannot be framed.
    embeddable: false,
  },
];

/** Career milestones shown in the Source Control view, newest first. */
export const TIMELINE = [
  {
    hash: 'a3f9c21',
    msg: 'feat: AWS Certified Solutions Architect – Associate',
    when: 'Sep 2026',
    open: 'education',
  },
  {
    hash: '7be04d8',
    msg: 'feat: join Mechanikos as Full Stack Developer',
    when: 'Aug 2026',
    open: 'experience',
  },
  {
    hash: 'c51e7a0',
    msg: 'refactor: rebuild HSS from scratch on Laravel 12',
    when: '2026',
    open: 'hss',
  },
  { hash: '19d2b6e', msg: 'chore: wrap up at Rapidz Inc.', when: 'May 2026', open: 'rapidz' },
  {
    hash: 'e84a1f3',
    msg: 'feat: join Rapidz Inc. as Software Engineer',
    when: 'Oct 2023',
    open: 'experience',
  },
  {
    hash: '0c7d5b9',
    msg: 'release: BCS (Software Engineering), UTM · CGPA 3.88',
    when: '2023',
    open: 'education',
  },
  { hash: '5f2e8aa', msg: 'feat: HSS final year project at UTM', when: '2023', open: 'hss' },
  {
    hash: 'b6a30d4',
    msg: 'feat: Software Engineer Intern at Intel',
    when: 'Oct 2022',
    open: 'experience',
  },
  { hash: '2d91f6c', msg: 'init: Universiti Teknologi Malaysia', when: '2019', open: 'education' },
] as const;

const P = PROFILE;
const tsArr = (xs: readonly string[]) => `[${xs.map((x) => `'${x}'`).join(', ')}]`;

export const ABOUT_TS = `
/**
 * about.ts — the short version.
 * Full Stack Software Engineer building production web, mobile
 * and data systems for fintech and government.
 */

export const adam = {
  name: '${P.name}',
  nickname: '${P.nickname}',
  role: '${P.role}',
  company: '${P.company}', // since Aug 2026
  currentProduct: '${P.currentProduct}', // live for 5,000+ TABIKA centres
  sectors: ${tsArr(P.sectors)},
  yearsShipping: ${P.yearsShipping},
  basedIn: '${P.basedIn}',
  hometown: '${P.hometown}',
  strengths: [
${P.strengths.map((x) => `    '${x}',`).join('\n')}
  ],
  certified: '${P.certified}',
  education: '${P.education}',
  languages: ${tsArr(P.languages)},
  availability: '${P.availability}',
} as const;

// Led delivery of a cross-platform crypto wallet (iOS/Android),
// a Power BI reporting ecosystem and a national-scale kindergarten
// management platform. Comfortable with sprint planning, mentoring
// junior developers and shipping reliable software in fast-moving teams.

export function pitch(): string {
  return \`\${adam.role} · \${adam.sectors.join(' & ')}\`;
}
`;

const jsonArray = (items: string[]) => `[${items.map((i) => JSON.stringify(i)).join(', ')}]`;

export const STACK_JSON = `
{
  // tip: 5-letter names (MySQL, Axios, Pinia…) are Daily Cipher guesses
  "owner": "Adam Najmi",
  "stack": {
${SKILLS.map((s, i) => `    ${JSON.stringify(s.group)}: ${jsonArray(s.items)}${i < SKILLS.length - 1 ? ',' : ''}`).join('\n')}
  },
  "spoken": { ${Object.entries(SPOKEN)
    .map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`)
    .join(', ')} },
  "certifications": ${jsonArray(CERTIFICATIONS.map((c) => `${c.name} (${c.code})`))},
  "thisSite": ["Astro", "React", "Tailwind CSS", "Vercel", "Gemini API"]
}
`;

export const CONTACT_ENV = `
# contact.env — public on purpose, safe to commit
NAME="${CONTACT.name}"
ROLE="${CONTACT.role}"
EMAIL=${EMAIL}
LINKEDIN=${LINKEDIN_URL}
GITHUB=${GITHUB_URL}
WEBSITE=https://adamnajmi.com
RESUME=${RESUME_URL}
LOCATION="${CONTACT.location}"
AVAILABILITY="${CONTACT.availability}"
STATUS=${CONTACT.status}
`;

export const CIPHER_SH = `
#!/usr/bin/env bash
# daily_cipher.sh — a Wordle-style easter egg hidden in this portfolio.
#
# How to play:
#   1. Click any 5-letter word in the editor (it turns cyan on hover).
#   2. Check the colours: 🟩 correct spot · 🟨 wrong spot · ⬜ not in the word
#   3. You get 6 attempts. A new word every day (UTC).
#   4. Win a random cat: 🐱 common, 🌟 rare (10%), 👑 super rare Oyo (1%+).
#      Your daily streak raises the super rare odds.
# Stuck? Ask the ASK ADAM panel for a hint.

ATTEMPTS=6
WORD_LENGTH=5

play() {
  for try in 1 2 3 4 5 6; do
    read_click guess          # click a word on the page
    score "$guess"            # 🟩 🟨 ⬜
    if [ "$guess" = "$SECRET" ]; then
      reward_cat && streak=$((streak + 1))
      return 0
    fi
  done
  echo "Game over. Come back tomorrow."
}

play   # ▶ run it from the CIPHER tab in the panel below
`;
