/**
 * profile.ts — the single source of truth for who Adam is.
 *
 * AmCode's editor files, the PostAm API client (/api/*.json endpoints) and the
 * simple view all read from here. Every fact comes from resume.ts /
 * personal.ts or the previous home page; nothing new is claimed.
 */
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

export const SITE_URL = 'https://adamnajmi.com';

export const PROFILE = {
  name: 'Adam Najmi bin Mat Noh',
  nickname: 'Adam',
  role: 'Full Stack Software Engineer',
  company: 'Mechanikos Sdn. Bhd.',
  companySince: '2026-08',
  currentProduct: 'Kemas EduCeria',
  sectors: ['Fintech', 'Government'],
  yearsShipping: 3,
  basedIn: 'Johor Bahru, Johor, Malaysia',
  hometown: 'Kluang, Johor',
  summary:
    'Full Stack Software Engineer with 3 years of experience building production web, mobile and data systems for fintech and government.',
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
  status: 'open_for_opportunities',
} as const;

export interface Project {
  id: string;
  name: string;
  kind: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
  links: Record<string, string>;
}

export const PROJECTS: Project[] = [
  {
    id: 'kemas-educeria',
    name: 'Kemas EduCeria',
    kind: 'work · GovTech',
    period: '2026-08 → present',
    summary:
      'National MIS for 5,000+ TABIKA preschool centres under KEMAS (Ministry of Rural and Regional Development).',
    highlights: [
      'TABIKA & TASKA registration',
      'GPS-verified attendance',
      'Digital library',
      'RBAC across centre → district → state → HQ',
      'Playwright E2E + TypeScript strict mode',
    ],
    stack: ['Laravel', 'Vue.js 3', 'TypeScript', 'Playwright'],
    links: { live: EDUCERIA_URL },
  },
  {
    id: 'hss',
    name: 'Hospital Scheduling System',
    kind: 'final year project · UTM',
    period: '2023 → rebuilt 2026',
    summary:
      'Duty-roster app where hospital departments generate fair on-call, ward and shift rosters, then let doctors request leave and swaps.',
    highlights: [
      'Fair roster generation',
      'Leave & swap requests',
      'Live demo with sample accounts',
    ],
    stack: ['Laravel 12', 'Livewire 3', 'Tailwind CSS 4', 'PostgreSQL (Neon)', 'Vercel'],
    links: {
      live: 'https://hss.adamnajmi.com',
      tour: `${SITE_URL}/hss`,
      source: 'https://github.com/adamatnoh/hospital-scheduling-system',
    },
  },
  {
    id: 'islamic-tv-launcher',
    name: 'islamic-tv-launcher',
    kind: 'side project · Android TV',
    period: '2026',
    summary:
      'Android TV home launcher with JAKIM prayer times, azan alerts, child lock and an Islamic-themed screensaver.',
    highlights: [
      'Custom Android TV home',
      'JAKIM prayer times + azan',
      'Child lock / parental controls',
      'Islamic screensaver',
    ],
    stack: ['Java', 'Android TV'],
    links: { source: TV_REPO_URL },
  },
  {
    id: 'rapidz',
    name: 'Rapidz',
    kind: 'work · Fintech',
    period: '2023-10 → 2026-05',
    summary: RAPIDZ_ABOUT,
    highlights: RAPIDZ_PROJECTS.map((p) => `${p.title}: ${p.summary}`),
    stack: ['NestJS', 'React Native', 'Laravel', 'Power BI'],
    links: {},
  },
];

export const EDUCATION = [
  {
    school: 'Universiti Teknologi Malaysia (UTM)',
    award: 'Bachelor of Computer Science (Software Engineering)',
    period: '2019 – 2023',
    grade: 'CGPA 3.88',
  },
  {
    school: 'Kolej Matrikulasi Johor',
    award: 'KPM Matriculation Certificate',
    period: '2018 – 2019',
    grade: 'CGPA 3.75',
  },
];

export const CERTIFICATIONS = [
  {
    name: 'AWS Certified Solutions Architect – Associate',
    code: 'SAA-C03',
    issuer: 'Amazon Web Services',
    issued: '2026-09',
    verify: CREDLY_URL,
  },
];

export const SPOKEN = { 'Bahasa Melayu': 'native', English: 'fluent' } as const;

export const CONTACT = {
  name: 'Adam Najmi',
  role: PROFILE.role,
  email: EMAIL,
  linkedin: LINKEDIN_URL,
  github: GITHUB_URL,
  website: SITE_URL,
  resume: `${SITE_URL}${RESUME_URL}`,
  location: PROFILE.basedIn,
  availability: PROFILE.availability,
  status: PROFILE.status,
};
