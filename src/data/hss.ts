// Content for the Hospital Scheduling System (HSS) showcase.
export const HSS_URL = 'https://hss.adamnajmi.com';
export const HSS_LOGIN_URL = `${HSS_URL}/login`;
export const HSS_REPO_URL = 'https://github.com/adamatnoh/hospital-scheduling-system';

export interface Slide {
  src: string;
  alt: string;
  caption: string;
  mobile?: boolean;
}

const s = (name: string, caption: string, alt: string, mobile = false): Slide => ({
  src: `/hss/${name}.webp`,
  caption,
  alt,
  mobile,
});

export const HIGHLIGHTS: Slide[] = [
  s('dashboard-admin-light', 'Admin dashboard', 'HSS admin dashboard in light mode'),
  s(
    'generator-preview',
    'Generate a roster, check the fairness report, then publish',
    'On-call roster generator showing a preview and fairness report',
  ),
  s(
    'department-calendar',
    'Department calendar — drag a duty to another day',
    'Department on-call calendar in a timeline view',
  ),
  s(
    'review',
    'Review leave, on-call and swap requests',
    'Scheduler reviewing a pending leave request',
  ),
  s('dashboard-doctor', 'Doctor dashboard with upcoming duties', 'Doctor dashboard'),
  s(
    'calendar-subscribe',
    'Subscribe to your duties from Google or Apple Calendar',
    'Calendar subscription page with a private .ics link',
  ),
  s('dashboard-admin-dark', 'Dark mode', 'HSS admin dashboard in dark mode'),
];

export interface Role {
  id: string;
  label: string;
  account: string;
  name: string;
  blurb: string;
  steps: Slide[];
}

export const ROLES: Role[] = [
  {
    id: 'scheduler',
    label: 'Scheduler',
    account: 'scheduler@hss.test',
    name: 'Dr Farah · Orthopedics',
    blurb: 'Builds and publishes the department roster, and handles requests.',
    steps: [
      s(
        'generator-preview',
        '1 · Generate a month of on-call, ward or shift duties and read the fairness report before anything is published.',
        'On-call roster generator with fairness report',
      ),
      s(
        'department-calendar',
        '2 · Fine-tune the published roster on the department calendar by dragging duties between days.',
        'Department on-call calendar',
      ),
      s(
        'review',
        '3 · Approve or reject leave, on-call and swap requests, with a decision history.',
        'Review requests page',
      ),
    ],
  },
  {
    id: 'doctor',
    label: 'Doctor',
    account: 'doctor@hss.test',
    name: 'Dr Firdaus · Orthopedics',
    blurb: 'Sees their own duties, applies for leave and requests swaps.',
    steps: [
      s(
        'dashboard-doctor',
        '1 · A dashboard with the next duty, upcoming shifts and department announcements.',
        'Doctor dashboard',
      ),
      s(
        'your-schedule',
        '2 · A personal schedule across on-call, ward and shift rosters.',
        'Your schedule page',
      ),
      s(
        'calendar-subscribe',
        '3 · A private calendar feed (.ics) that keeps Google or Apple Calendar in sync.',
        'Subscribe to calendar page',
      ),
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    account: 'admin@hss.test',
    name: 'Dr Adam',
    blurb: 'Oversees departments, users and announcements.',
    steps: [
      s(
        'dashboard-admin-light',
        '1 · A hospital-wide dashboard for every department.',
        'Admin dashboard, light mode',
      ),
      s(
        'dashboard-admin-dark',
        '2 · A full dark mode, one click away in the top bar.',
        'Admin dashboard, dark mode',
      ),
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    account: 'any account',
    name: 'Phone layout',
    blurb: 'The whole app works on a phone.',
    steps: [
      s('mobile-dashboard', 'Dashboard on a phone.', 'HSS dashboard on a phone', true),
      s('mobile-announcements', 'Announcements on a phone.', 'HSS announcements on a phone', true),
    ],
  },
];

export const STACK = [
  'Laravel 12',
  'Livewire 3',
  'Tailwind CSS 4',
  'PostgreSQL (Neon)',
  'FullCalendar',
  'Vercel',
];

export const FEATURES = [
  'On-call, ward rotation & shift generators',
  'Preview + fairness report before publishing',
  'Drag-and-drop department calendar',
  'Leave, on-call & swap requests with review',
  'Private calendar subscription (.ics)',
  'Light/dark mode and a phone-friendly layout',
];
