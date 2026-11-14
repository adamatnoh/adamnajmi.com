/**
 * Content + structure for the VS Code-style portfolio shell.
 * Every fact here comes from resume.ts / personal.ts / website.ts or the
 * previous home page; nothing new is claimed.
 */

export type FileIcon = 'md' | 'ts' | 'log' | 'tsx' | 'php' | 'kt' | 'json' | 'env' | 'sh';

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
    name: 'islamic-tv-launcher.kt',
    path: 'projects/islamic-tv-launcher.kt',
    icon: 'kt',
    lang: 'Kotlin',
    folder: 'projects',
    aliases: ['tv', 'islamic-tv'],
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

export const RESUME_URL = '/file/resume.pdf';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/adamnajmi';
export const GITHUB_URL = 'https://github.com/adamatnoh';
export const EMAIL = 'adamnajminoh@gmail.com';
export const EDUCERIA_URL = 'https://ceria.kemas.gov.my/';
export const TV_REPO_URL = 'https://github.com/adamatnoh/islamic-tv-launcher';
export const CREDLY_URL = 'https://www.credly.com/badges/790fa709-42ef-4f85-9c1e-813f69223625';

export const SKILLS: { group: string; items: string[] }[] = [
  { group: 'languages', items: ['TypeScript', 'JavaScript', 'PHP', 'Java', 'SQL'] },
  { group: 'backend_apis', items: ['Node.js', 'NestJS', 'Laravel', 'REST APIs', 'Swagger'] },
  {
    group: 'frontend',
    items: ['Vue.js 3', 'React Native', 'Next.js', 'Pinia', 'Tailwind CSS', 'Vite'],
  },
  { group: 'database_orm', items: ['PostgreSQL', 'MySQL', 'Prisma'] },
  { group: 'testing_quality', items: ['Playwright', 'ESLint', 'Prettier'] },
  {
    group: 'devops_tooling',
    items: ['Git', 'GitHub', 'Docker', 'Sentry', 'npm', 'Postman', 'Axios'],
  },
  { group: 'data_reporting', items: ['Power BI', 'DAX'] },
];

export const STATS = [
  { value: '3', label: 'years shipping production software' },
  { value: '5,000+', label: 'TABIKA centres on Kemas EduCeria' },
  { value: 'AWS', label: 'Solutions Architect Associate · SAA-C03' },
  { value: '3.88', label: 'CGPA · BCS (Software Eng.), UTM' },
];

export const README_BADGES = [
  { k: 'role', v: 'full stack engineer' },
  { k: 'location', v: 'Johor Bahru, MY' },
  { k: 'status', v: 'open to remote & on-site', tone: 'ok' },
  { k: 'AWS', v: 'SAA-C03' },
  { k: 'CGPA', v: '3.88 · UTM' },
];

export const README_TECH = [
  'TypeScript',
  'Node.js',
  'NestJS',
  'Laravel',
  'Vue.js 3',
  'React Native',
  'PostgreSQL',
  'MySQL',
  'Docker',
  'Playwright',
  'Power BI',
];

export interface LogEntry {
  level: 'INFO' | 'LEAD' | 'SHIP' | 'SEC' | 'FIX' | 'DOCS';
  text: string;
  href?: string;
}
export interface LogJob {
  range: string;
  state: 'RUNNING' | 'EXITED';
  role: string;
  company: string;
  companyNote?: string;
  sector: string;
  entries: LogEntry[];
}

export const EXPERIENCE: LogJob[] = [
  {
    range: '2026-08 → present',
    state: 'RUNNING',
    role: 'Full Stack Developer',
    company: 'Mechanikos Sdn. Bhd.',
    sector: 'GovTech · Education',
    entries: [
      {
        level: 'LEAD',
        text: 'Directing full-stack development of Kemas EduCeria, a national MIS for 5,000+ TABIKA preschool centres under KEMAS (Ministry of Rural and Regional Development): registration, GPS-verified attendance, digital library and role-based access across centre, district, state and HQ.',
      },
      { level: 'INFO', text: 'Live at ceria.kemas.gov.my', href: EDUCERIA_URL },
      {
        level: 'LEAD',
        text: 'Leading a team of developers through code reviews, unblocking technical decisions and aligning Laravel backend with Vue 3 + TypeScript frontend work across parallel feature streams.',
      },
      {
        level: 'SHIP',
        text: 'Restructured sprint planning, ticketing, backlog prioritisation and module ownership in the first week.',
      },
      {
        level: 'SHIP',
        text: 'Established Playwright E2E testing, TypeScript strict mode and structured API/repository patterns for maintainability at scale.',
      },
      {
        level: 'INFO',
        text: 'Coordinating cross-module delivery (system management, registration & attendance, digital library, finance) across staging and pre-production government environments.',
      },
    ],
  },
  {
    range: '2023-10 → 2026-05',
    state: 'EXITED',
    role: 'Software Engineer (Backend / Full-Stack)',
    company: 'Rapidz Inc.',
    companyNote: '@ Clarity Techworks Sdn. Bhd.',
    sector: 'Fintech · Crypto',
    entries: [
      {
        level: 'SEC',
        text: 'Hardened API security with server-to-server HMAC request signing and replay-attack protection.',
      },
      {
        level: 'SEC',
        text: 'Engineered a JWT (RS256) access & refresh token system with automated revocation for 2FA, biometric and OAuth flows.',
      },
      {
        level: 'SHIP',
        text: 'Architected a Power BI reporting ecosystem from scratch for real-time revenue and campaign performance visibility.',
      },
      {
        level: 'INFO',
        text: 'Contributed to the migration from Laravel/PHP to NestJS + React Native stack.',
      },
      {
        level: 'INFO',
        text: 'Onboarded third-party providers across vendor transitions, and integrated Sentry error tracking with standardised exception handling.',
      },
    ],
  },
  {
    range: '2022-10 → 2023-02',
    state: 'EXITED',
    role: 'Software Engineer Intern',
    company: 'Intel Technology Sdn. Bhd.',
    sector: 'Semiconductor',
    entries: [
      {
        level: 'FIX',
        text: 'Diagnosed, fixed and integrated a system GUI with its Perl & Python scripts for mass deployment across Intel departments.',
      },
      { level: 'DOCS', text: 'Authored user manuals and end-user testing protocols.' },
      {
        level: 'INFO',
        text: 'Hands-on chipset design verification with Python, Perl, Tk, Verilog & SystemVerilog on Unix/Linux.',
      },
      {
        level: 'INFO',
        text: 'Collaborated with cross-geo teams (USA, India) through design meetings and knowledge-sharing sessions.',
      },
    ],
  },
];

export interface RapidzProject {
  title: string;
  tags: string[];
  summary: string;
  points: string[];
}

export const RAPIDZ_ABOUT =
  'Rapidz is a digital finance and cryptocurrency platform to buy, trade, spend and manage digital assets and fiat currencies in one place: crypto wallet & trading, the Rapidz Card, and high security (2FA, biometric login, institutional-grade custody).';

export const RAPIDZ_PROJECTS: RapidzProject[] = [
  {
    title: 'rapidz',
    tags: ['crypto', 'api', 'nestjs', 'react-native'],
    summary: 'Production-grade wallet serving thousands of users globally.',
    points: [
      'Deposit / Withdraw crypto',
      'Hold & receive digital collectibles (NFT)',
      'Stake & earn real yield rates',
      'Instant swaps (20+ cryptos)',
      'Rapidz Card spending integration',
    ],
  },
  {
    title: 'verrefin',
    tags: ['defi', 'webapp', 'nestjs', 'react-native'],
    summary: 'Neo crypto bank unifying traditional and decentralized finance.',
    points: [
      'Fiat wallet & cross-border payments',
      'Earn yields through ecosystem vault',
      '70% lower fees than traditional banks',
      'Co-branded card program',
    ],
  },
  {
    title: 'admin-portal',
    tags: ['webapp', 'laravel', 'php', 'admin'],
    summary: 'Internal management portal built for Rapidz administrators.',
    points: [
      'Deposit / Withdraw admin funds',
      'User account & transaction management',
      'Bulk email distribution to users',
    ],
  },
  {
    title: 'merchant-portal',
    tags: ['merchant', 'webapp', 'laravel', 'php'],
    summary: 'Management portal for Rapidz merchants/clients.',
    points: [
      'Staff account & role management',
      'Virtual card issuance & distribution',
      'Token/NFT airdrops for campaigns',
    ],
  },
  {
    title: 'otc-telegram-bot',
    tags: ['telegram', 'bot', 'nodejs', 'nestjs'],
    summary: 'Trading bot enabling crypto/fiat exchange via Telegram.',
    points: [
      'Buy & sell crypto with integrated rates',
      'Custom rates per client/agent',
      'Agent-assisted transactions on behalf of clients',
    ],
  },
  {
    title: 'power-bi-analytics',
    tags: ['dax', 'reporting', 'ms-power-bi'],
    summary: 'Real-time Rapidz executive dashboards for revenue, yield, and product performance.',
    points: [
      'Real-time P&L & yield tracking',
      'Revenue & campaign performance dashboards',
      'Data-driven executive decision-making',
    ],
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

export const ABOUT_TS = `
/**
 * about.ts — the short version.
 * Full Stack Software Engineer building production web, mobile
 * and data systems for fintech and government.
 */

export const adam = {
  name: 'Adam Najmi bin Mat Noh',
  nickname: 'Adam',
  role: 'Full Stack Software Engineer',
  company: 'Mechanikos Sdn. Bhd.', // since Aug 2026
  currentProduct: 'Kemas EduCeria', // live for 5,000+ TABIKA centres
  sectors: ['Fintech', 'Government'],
  yearsShipping: 3,
  basedIn: 'Johor Bahru, Johor, Malaysia',
  hometown: 'Kluang, Johor',
  strengths: [
    'API security',
    'authentication design',
    'third-party integrations',
    'technical leadership',
  ],
  certified: 'AWS Solutions Architect – Associate (SAA-C03)',
  education: 'BCS (Software Engineering), UTM · CGPA 3.88',
  languages: ['Bahasa Melayu', 'English'],
  availability: 'Open to remote, hybrid, or on-site roles in Johor or Singapore',
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
  "spoken": { "Bahasa Melayu": "native", "English": "fluent" },
  "certifications": ["AWS Certified Solutions Architect – Associate (SAA-C03)"],
  "thisSite": ["Astro", "React", "Tailwind CSS", "Vercel", "Gemini API"]
}
`;

export const CONTACT_ENV = `
# contact.env — public on purpose, safe to commit
NAME="Adam Najmi"
ROLE="Full Stack Software Engineer"
EMAIL=${EMAIL}
LINKEDIN=${LINKEDIN_URL}
GITHUB=${GITHUB_URL}
WEBSITE=https://adamnajmi.com
RESUME=${RESUME_URL}
LOCATION="Johor Bahru, Johor, Malaysia"
AVAILABILITY="Open to remote, hybrid, or on-site roles in Johor or Singapore"
STATUS=open_for_opportunities
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
