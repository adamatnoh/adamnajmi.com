# [adamnajmi.com](https://adamnajmi.com/) — Personal Portfolio

This is my personal portfolio website, built as a terminal-inspired digital resume. It showcases my experience, technical skills, and includes an AI-powered chatbot that answers questions about my background.

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

---

## ✨ Features

- **Terminal-Inspired UI** – Green-on-black color scheme with a custom terminal-style layout.
- **AI Chatbot** – Ask questions about my experience, skills, or the portfolio itself. Powered by Google Gemini.
- **Responsive** – Works on mobile, tablet, and desktop.
- **Fast & Lightweight** – Built with Astro, ships minimal JavaScript by default.
- **Serverless API** – Chat endpoint runs as a Vercel serverless function.

---

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
│   └── Chatbot.jsx        # Terminal-style AI chatbot
├── data/
│   ├── resume.ts          # Work experience, education, skills
│   ├── personal.ts        # Name, contact, location
│   └── portfolio.ts       # Website tech stack & design info
├── layouts/
├── pages/
│   ├── index.astro        # Main portfolio page
│   └── api/
│       └── chat.ts        # Serverless API endpoint for the chatbot
└── styles/
    └── global.css         # Tailwind imports & custom styles
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
- `src/data/portfolio.ts` – Website technology and design choices.

The API route (`src/pages/api/chat.ts`) handles the request, constructs a prompt, and streams the response back to the React component.

## 📄 License

MIT © [Adam Najmi](https://adamnajmi.com)

## 📬 Contact

- Email: adamnajminoh@gmail.com
- LinkedIn: [linkedin.com/in/adamnajmi](https://linkedin.com/in/adamnajmi)
- GitHub: [github.com/adamatnoh](http://github.com/adamatnoh)
