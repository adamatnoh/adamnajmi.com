export const RESUME_INFO = `
Adam Najmi is a Full Stack Software Engineer based in Johor Bahru, Johor, Malaysia, with 3 years of experience building production web, mobile, and data systems for fintech and government sectors. He is proficient in TypeScript, Node.js, NestJS, Laravel, Vue.js, and React Native, with strengths in API security, authentication design, third-party integrations, and technical leadership. He led delivery of a cross-platform crypto wallet (iOS/Android), a Power BI reporting ecosystem, and a national-scale kindergarten management platform serving 5,000+ centres, and is experienced in sprint planning, mentoring junior developers, and shipping reliable software in fast-moving teams. He holds a Bachelor of Computer Science (Software Engineering) from Universiti Teknologi Malaysia (UTM) with a CGPA of 3.88.

Professional Experience:
1. Full Stack Developer at Mechanikos Sdn. Bhd. (Aug 2026 - Present):
   - Restructured the development workflow within the first week, introducing sprint planning, ticketing, backlog prioritisation, and module ownership to improve delivery tracking and team accountability.
   - Leads a team of 6 junior developers through code reviews, technical decision-making, and day-to-day guidance across the Laravel backend and Vue 3/TypeScript frontend.
   - Directs full-stack development of SPTK, a national Management Information System for 5,000+ TABIKA preschool centres under KEMAS (Ministry of Rural and Regional Development), covering registration, GPS-verified attendance, a digital library, and role-based access across centre, district, state, and HQ levels.
   - Established engineering standards including Playwright E2E testing, TypeScript strict mode, and structured API/repository patterns to improve code quality and maintainability at scale.
   - Coordinates cross-module delivery (system management, registration & attendance, digital library, and finance) across staging and pre-production government environments.

2. Software Engineer (Backend / Full-Stack) at Rapidz Inc. @ Clarity Techworks Sdn. Bhd. (Oct 2023 - May 2026):
   - About rapidz: rapidz app is a digital finance and cryptocurrency platform that allows you to buy, trade, spend, and manage digital assets, as well as traditional fiat currencies, in one place. It offers crypto wallet & trading (buy, swap, and stake cryptocurrencies like Bitcoin, Ethereum, and Solana), the Rapidz Card (convert USDT or USDC into a spendable dollar balance for in-store and online merchants via contactless mobile pay), and high security (2FA, biometric login, and institutional-grade custody).
   - Hardened API security by implementing server-to-server HMAC request signing with replay-attack protection for all internal service-to-service communication.
   - Engineered a JWT (RS256) access and refresh token system with automated revocation, improving reliability for 2FA, biometric, and OAuth flows.
   - Maintained product continuity by onboarding and integrating third-party providers, managing vendor transitions with minimal service disruption.
   - Architected a Power BI reporting ecosystem from scratch, delivering real-time visibility into revenue and campaign performance.
   - Contributed to the tech stack migration from Laravel/PHP to NestJS and React Native, reducing UI iteration cycles and improving cross-platform consistency.
   - Integrated Sentry-based error tracking and standardised exception handling, reducing time-to-resolution for production incidents.

3. Software Engineer Intern at Intel Technology Sdn. Bhd. (Oct 2022 - Feb 2023):
   - Diagnosed, fixed, and integrated a system GUI with underlying Perl and Python scripts, ensuring reliability for mass deployment across multiple Intel departments.
   - Authored detailed user manuals and end-user testing protocols, enabling adoption and simplifying complex system functionality.
   - Gained hands-on experience in chipset design verification using Python, Perl, Tk, Verilog, and SystemVerilog in Unix/Linux environments.
   - Collaborated with cross-geo teams (USA, India) through design meetings and knowledge-sharing sessions.

Portfolio Projects:
1. rapidz-wallet (Crypto Wallet & Hub)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: NestJS, React Native, TypeScript, MySQL
   A production-grade cross-platform crypto wallet built with React Native, serving thousands of users globally.
   Features:
   - Deposit / Withdraw crypto assets with secure wallet infrastructure.
   - Hold and manage digital collectibles (NFTs).
   - Stake digital assets and earn real market yield rates.
   - Instant crypto swaps across 20+ currencies.
   - Rapidz Card integration for spending crypto as fiat at merchants worldwide.
2. verrefin (Neo Crypto Bank)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: NestJS, React Native, Laravel, PHP, MySQL
   A neo crypto bank unifying traditional and decentralized finance, built as a tech infrastructure platform.
   Features:
   - Fiat wallet with seamless deposit and withdrawal capabilities.
   - Earn yields through ecosystem vaults and staking incentives.
   - Co-branded card program generating transaction fee revenue.
   - Instant cross-border payments with fees up to 70% lower than traditional banking.
   - Loyalty program with points for transactions, referrals, and staking.
3. admin-portal (Admin Management Portal)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: Laravel, PHP, MySQL, Tailwind CSS
   An internal management portal built for Rapidz administrators to oversee platform operations.
   Features:
   - Deposit and withdrawal management for admin-controlled funds.
   - User account management and transaction oversight.
   - Bulk email distribution to users for announcements and updates.
   - Real-time monitoring of platform activity.
4. merchant-portal (Merchant Management Portal)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: Laravel, PHP, MySQL, Tailwind CSS
   A client-facing portal for Rapidz merchants to manage their business operations.
   Features:
   - Staff account and role-based access management.
   - Virtual card issuance and distribution to customers.
   - Token and NFT airdrop campaign management.
   - OTC (Over-the-Counter) crypto and fiat buying/selling services.
5. otc-telegram-bot (Trading Bot)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: Node.js, NestJS, TypeScript, Telegram Bot API
   A OTC Telegram-based trading bot enabling crypto and fiat exchange with custom pricing.
   Features:
   - Buy and sell crypto with integrated real-time rates.
   - Client-specific custom rates for tailored pricing.
   - Agent-assisted transactions on behalf of clients.
   - Automatic calculation of final prices with dynamic rate adjustments.
6. power-bi-analytics (Power BI Reporting Ecosystem)
   Timeline: Oct 2023 – May 2026 (Rapidz Inc.)
   Tech Stack: Power BI, DAX, MySQL
   An executive reporting ecosystem built with Power BI and DAX for real-time business intelligence.
   Features:
   - Real-time P&L (Profit & Loss) and yield tracking dashboards.
   - Product performance monitoring across multiple platforms.
   - Data-driven insights for executive decision-making.
   - Automated reporting for revenue, margins, and campaign performance.
7. HSS (Hospital Scheduling System)
   Timeline: Final Year Project at Universiti Teknologi Malaysia (UTM) in 2023, rebuilt from scratch in 2026
   Tech Stack: Laravel 12, Livewire 3, Tailwind CSS 4, PostgreSQL (Neon), FullCalendar, deployed on Vercel
   Live demo: https://hss.adamnajmi.com
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
