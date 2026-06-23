# [adamnajmi.com](https://adamnajmi.com/) — Personal Portfolio

This is my personal portfolio website, built as a terminal-inspired digital resume. It showcases my experience, technical skills, and includes an AI-powered chatbot that answers questions about my background. It also features a daily word-hunt minigame with streak-based rewards to keep things interactive.

🔗 **Live Site:** [adamnajmi.com](https://adamnajmi.com)

---

## 📦 Tech Stack

| Category          | Tools                                                            |
| :---------------- | :--------------------------------------------------------------- |
| **Framework**     | [Astro](https://astro.build) (Static Site Generator)             |
| **Styling**       | [Tailwind CSS](https://tailwindcss.com)                          |
| **UI Components** | [React](https://reactjs.org) (Islands architecture)              |
| **Deployment**    | [Vercel](https://vercel.com) (Serverless Functions)              |
| **Domain**        | [Cloudflare](https://cloudflare.com)                             |
| **AI API**        | [Google Gemini](https://ai.google.dev) (`gemini-3.1-flash-lite`) |

## ✨ Features

- **Terminal-Inspired UI** – Green-on-black color scheme with a custom terminal-style layout.

- **AI Chatbot** – Ask questions about my experience, skills, or the portfolio itself. Powered by Google Gemini.

- **Daily Cipher (Word-Hunt Game)** – A Wordle-style minigame where the word changes daily via deterministic hashing (no database required).

- **Streak-Based Rewards** – Guess the word and win a random cat picture. The longer your streak, the higher your chance of landing a Super Rare cat (1% base → up to 30% bonus, with a guaranteed drop at 100 days).

- **State Persistence** – Game state (attempts, wins, losses, streak) is stored in localStorage, so users can close and reopen the game without losing progress.

- **Responsive** – Works on mobile, tablet, and desktop.

- **Fast & Lightweight** – Built with Astro, ships minimal JavaScript by default.

- **Serverless API** – Chat endpoint runs as a Vercel serverless function.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/adamatnoh/adam-portfolio.git
cd adam-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your-google-gemini-api-key
```

You can get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 4. Run the development server

```bash
npm run dev
```

Open `http://localhost:4321` to preview the site.

## 📁 Project Structure

```text
src/
├── components/
│   ├── Chatbot.jsx
│   ├── DailyCipher.jsx
|   └── Word.astro
├── data/
│   ├── personal.ts
│   ├── resume.ts
│   └── website.ts
├── pages/
│   ├── index.astro
│   └── api/
│       └── chat.ts
└── styles/
    └── global.css
```

## 🔧 Deployment

The project is configured to deploy on Vercel with serverless functions.

1. Push the code to GitHub.
2. Import the repository to [Vercel](https://vercel.com/).
3. Add the `GEMINI_API_KEY` environment variable in the Vercel dashboard.
4. Deploy.

## 🧠 About the Chatbot

The chatbot is powered by Google Gemini API and uses a retrieval-augmented approach. It pulls context from:

- `src/data/resume.ts` – Professional experience and skills.
- `src/data/personal.ts` – Contact details and personal info.
- `src/data/website.ts` – Website technology and design choices.

The API route (`src/pages/api/chat.ts`) handles the request, constructs a prompt, and streams the response back to the React component.

## 🎮 About the Daily Cipher Game

The Daily Cipher is a Wordle-style game designed to make the portfolio interactive and encourage visitors to explore the content.

- Word Selection: The word of the day is chosen using a deterministic hashing function based on the current date (UTC). This ensures all visitors see the same word on the same day without requiring a database or cron job.

- Gameplay: Visitors click on any 5-letter word visible on the portfolio page to make a guess. The grid provides colour-coded feedback: 🟩 correct spot, 🟨 wrong spot, ⬜ not in the word.

- State Persistence: Game progress (attempts, wins/losses, reward status) is saved in the browser's localStorage, so users can close and reopen the game without losing their place.

- Streak System: Winning on consecutive days builds a streak. The streak:
  - Increases by 1 for each consecutive daily win.
  - Resets to 0 if the user loses or misses a day.
  - Boosts the drop rate for the Super Rare cat (1% base + up to 30% bonus, with a 100% guarantee at a 100-day streak).

## 📄 License

MIT © [Adam Najmi](https://adamnajmi.com)

## 📬 Contact

- Email: adamnajminoh@gmail.com
- LinkedIn: [linkedin.com/in/adamnajmi](https://linkedin.com/in/adamnajmi)
- GitHub: [github.com/adamatnoh](http://github.com/adamatnoh)
