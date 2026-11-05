export const RESUME_INFO = `
Adam Najmi is a Full Stack Software Engineer based in Johor Bahru, Johor, Malaysia, with 3 years of experience building production web, mobile, and data systems for fintech and government sectors. He is proficient in TypeScript, Node.js, NestJS, Laravel, Vue.js, and React Native, with strengths in API security, authentication design, third-party integrations, and technical leadership. He led delivery of a cross-platform crypto wallet (iOS/Android), a Power BI reporting ecosystem, and a national-scale kindergarten management platform serving 5,000+ centres, and is experienced in sprint planning, mentoring junior developers, and shipping reliable software in fast-moving teams. He holds a Bachelor of Computer Science (Software Engineering) from Universiti Teknologi Malaysia (UTM) with a CGPA of 3.88. He is an AWS Certified Solutions Architect – Associate (SAA-C03), issued September 2026.

Professional Experience:
1. Full Stack Developer at Mechanikos Sdn. Bhd. (Aug 2026 - Present):
   - Accelerated delivery momentum within the first week by restructuring sprint planning, proper ticketing, backlog prioritisation, and module ownership across a multi-module government platform.
   - Led a team of developers, conducting code reviews, unblocking technical decisions, and aligning backend (Laravel) and frontend (Vue 3, TypeScript) work across parallel feature streams.
   - Directed full-stack development for SPTK / Kemas EduCeria (live at https://ceria.kemas.gov.my/), a national MIS digitising operations for 5,000+ TABIKA preschool centres under KEMAS (Ministry of Rural and Regional Development), covering registration, GPS-verified attendance, digital library, and role-based access across centre/district/state/HQ hierarchies. EduCeria also serves TABIKA & TASKA KEMAS registration.
   - Established engineering quality practices including Playwright E2E test coverage, TypeScript strict-mode standards, and structured API/repository patterns to support long-term maintainability at scale.
   - Coordinated cross-module delivery (system management, registration & attendance, digital library, finance) while maintaining production stability for staging and pre-production government environments.

2. Software Engineer (Backend / Full-Stack) at Rapidz Inc. @ Clarity Techworks Sdn. Bhd. (Oct 2023 - May 2026):
   - About rapidz: rapidz app is a digital finance and cryptocurrency platform that allows you to buy, trade, spend, and manage digital assets, as well as traditional fiat currencies, in one place. It offers crypto wallet & trading (buy, swap, and stake cryptocurrencies like Bitcoin, Ethereum, and Solana), the Rapidz Card (convert USDT or USDC into a spendable dollar balance for in-store and online merchants via contactless mobile pay), and high security (2FA, biometric login, and institutional-grade custody).
   - Reduced authentication-related security exposure by implementing server-to-server HMAC request signing with replay-attack protection across internal service-to-service communication on the Rapidz platform.
   - Improved reliability for 2FA, biometric, and OAuth flows by engineering a JWT (RS256) access and refresh token system with automated revocation, used across multiple client applications.
   - Maintained product continuity across vendor transitions by onboarding and integrating third-party providers with minimal end-user disruption.
   - Accelerated executive decision-making by architecting a Power BI reporting ecosystem from scratch, delivering real-time visibility into revenue and campaign performance.
   - Increased developer velocity by contributing to migration from Laravel/PHP to NestJS and React Native, improving cross-platform UI consistency and iteration speed.
   - Enhanced production reliability by integrating Sentry-based error tracking and standardised exception handling, reducing time-to-resolution for incidents.

3. Software Engineer Intern at Intel Technology Sdn. Bhd. (Oct 2022 - Feb 2023):
   - Diagnosed, fixed, and integrated a system GUI with underlying Perl and Python scripts, enabling reliable mass deployment across multiple Intel departments.
   - Authored user manuals and end-user testing protocols that accelerated stakeholder adoption of complex tooling.
   - Gained hands-on experience in chipset design verification using Python, Perl, Tk, Verilog, and SystemVerilog on Unix/Linux environments.
   - Collaborated with cross-geo engineering teams (USA, India) through design meetings and knowledge-sharing sessions.

Portfolio Projects:
1. Kemas EduCeria (national kindergarten MIS; work product at Mechanikos)
   Timeline: Aug 2026 – Present (Mechanikos Sdn. Bhd.)
   Tech Stack: Laravel, Vue.js 3, TypeScript, Playwright
   Live: https://ceria.kemas.gov.my/ (public EduCeria / TABIKA & TASKA KEMAS)
   Internal system name: SPTK. User-facing product name: Kemas EduCeria.
   A national Management Information System digitising operations for 5,000+ TABIKA preschool centres under KEMAS (Ministry of Rural and Regional Development).
   Features:
   - Centre registration and child enrolment for TABIKA & TASKA KEMAS.
   - GPS-verified attendance.
   - Digital library.
   - Role-based access across centre, district, state, and HQ hierarchies.
   - Cross-module delivery covering system management, registration & attendance, digital library, and finance.
2. rapidz-wallet (Crypto Wallet & Hub)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: NestJS, React Native, TypeScript, MySQL
   A production-grade cross-platform crypto wallet built with React Native, serving thousands of users globally.
   Features:
   - Deposit / Withdraw crypto assets with secure wallet infrastructure.
   - Hold and manage digital collectibles (NFTs).
   - Stake digital assets and earn real market yield rates.
   - Instant crypto swaps across 20+ currencies.
   - Rapidz Card integration for spending crypto as fiat at merchants worldwide.
3. verrefin (Neo Crypto Bank)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: NestJS, React Native, Laravel, PHP, MySQL
   A neo crypto bank unifying traditional and decentralized finance, built as a tech infrastructure platform.
   Features:
   - Fiat wallet with seamless deposit and withdrawal capabilities.
   - Earn yields through ecosystem vaults and staking incentives.
   - Co-branded card program generating transaction fee revenue.
   - Instant cross-border payments with fees up to 70% lower than traditional banking.
   - Loyalty program with points for transactions, referrals, and staking.
4. admin-portal (Admin Management Portal)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: Laravel, PHP, MySQL, Tailwind CSS
   An internal management portal built for Rapidz administrators to oversee platform operations.
   Features:
   - Deposit and withdrawal management for admin-controlled funds.
   - User account management and transaction oversight.
   - Bulk email distribution to users for announcements and updates.
   - Real-time monitoring of platform activity.
5. merchant-portal (Merchant Management Portal)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: Laravel, PHP, MySQL, Tailwind CSS
   A client-facing portal for Rapidz merchants to manage their business operations.
   Features:
   - Staff account and role-based access management.
   - Virtual card issuance and distribution to customers.
   - Token and NFT airdrop campaign management.
   - OTC (Over-the-Counter) crypto and fiat buying/selling services.
6. otc-telegram-bot (Trading Bot)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: Node.js, NestJS, TypeScript, Telegram Bot API
   A OTC Telegram-based trading bot enabling crypto and fiat exchange with custom pricing.
   Features:
   - Buy and sell crypto with integrated real-time rates.
   - Client-specific custom rates for tailored pricing.
   - Agent-assisted transactions on behalf of clients.
   - Automatic calculation of final prices with dynamic rate adjustments.
7. power-bi-analytics (Power BI Reporting Ecosystem)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: Power BI, DAX, MySQL
   An executive reporting ecosystem built with Power BI and DAX for real-time business intelligence.
   Features:
   - Real-time P&L (Profit & Loss) and yield tracking dashboards.
   - Product performance monitoring across multiple platforms.
   - Data-driven insights for executive decision-making.
   - Automated reporting for revenue, margins, and campaign performance.
8. HSS (Hospital Scheduling System)
   Timeline: Final Year Project at Universiti Teknologi Malaysia (UTM) in 2023, rebuilt from scratch in 2026
   Tech Stack: Laravel 12, Livewire 3, Tailwind CSS 4, PostgreSQL (Neon), FullCalendar, deployed on Vercel
   Live demo: https://hss.adamnajmi.com (guided tour and case study at adamnajmi.com/hss; adamnajmi.com/hss/live opens the live app)
   Source code: https://github.com/adamatnoh/hospital-scheduling-system
   A duty-roster web app for hospital departments, with three roles: admin, scheduler, and doctor.
   Features:
   - Three schedule generators: on-call, ward rotation, and shifts, each with a preview and a fairness report before publishing.
   - Leave, on-call, and swap requests that schedulers review and approve.
   - Department calendar (FullCalendar) where duties can be dragged to adjust the roster.
   - Personal schedule for doctors with a calendar subscription link (.ics) for their own calendar app.
   - Announcements, light/dark mode, and a mobile-friendly layout.
   - Public demo accounts on the login page (admin, scheduler, doctor; password "password").

Education:
- Universiti Teknologi Malaysia (UTM) — Bachelor of Computer Science (Software Engineering)
2019 - 2023 | CGPA: 3.88
- Kolej Matrikulasi Johor — KPM Matriculation Certificate
2018 - 2019 | CGPA: 3.75

Certificate:
- AWS Certified Solutions Architect Associate (SAA-C03)
  Amazon Web Services (AWS) | Issued: September 2026
  Credential: https://www.credly.com/badges/790fa709-42ef-4f85-9c1e-813f69223625

Technical Skills:
- Languages: TypeScript, JavaScript, PHP, Java, SQL.
- Backend & APIs: Node.js, NestJS, Laravel, REST APIs, Swagger.
- Frontend: Vue.js 3, React Native, Next.js, Pinia, Tailwind CSS, Vite.
- Database & ORM: PostgreSQL, MySQL, Prisma.
- Testing & Quality: Playwright, ESLint, Prettier.
- DevOps & Tooling: Git, GitHub, Docker, Sentry, npm, Postman, Axios.
- Data & Reporting: Power BI, DAX.

Languages: Bahasa Melayu (Native Speaker), English (Fluent).

References:
1. Guilherme (Gilly) Santos
Technology and Product Director,
Rapidz Inc,
+6590964602
guilherme@camacho.com.au
 2. Prof Madya Dr Hishammuddin Bin Asmuni @ Hasmuni
Senior Lecturer,
Universiti Teknologi Malaysia,
+60167178314
hishamudin@utm.my

Contact: adamnajminoh@gmail.com | linkedin.com/in/adamnajmi | adamnajmi.com | +60-10-551-0581 | Johor Bahru, Johor
`;
