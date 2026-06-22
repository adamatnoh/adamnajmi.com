export const WEBSITE_INFO = `
Portfolio Website (adamnajmi.com):

- Built with Astro (static site generator) and Tailwind CSS.
- Uses React for interactive components (the chatbot).
- Deployed on Vercel with serverless functions for the API.
- The chatbot uses Google's Gemini API (gemini-3.1-flash-lite) to answer questions about Adam based on his resume.
- Features a terminal-inspired design with a green-on-black color scheme.
- The domain is registered through Cloudflare.
- The source code is available on GitHub (github.com/adamatnoh).
- The terminal aesthetic reflects Adam's passion for clean, CLI-friendly tools and backend development.
- The chatbot was built from scratch to demonstrate full-stack capabilities, including API integration and UI design.

Daily Cipher Minigame (./daily_cipher.sh):

What it is:
A daily word-guessing challenge (Wordle-style) hidden in the portfolio. The goal is to find the "Secret Word of the Day" by clicking on 5-letter words scattered across the page.

How to play:
1. Open the game by clicking the "$ ./daily_cipher.sh" button at the top-right corner of the screen.
2. A terminal-styled widget will appear showing an empty 6x5 grid.
3. Click on any 5-letter word that appears on the portfolio page (e.g., "MYSQL" in the tech stack, "REACT" in the projects, "NAJMI" in the hero section, or "QUEUE" in the experience bullets). Clickable words turn cyan when hovered.
4. The widget will fill in your guess and give you feedback:
   - 🟩 Green = Correct letter, correct position.
   - 🟨 Yellow = Correct letter, wrong position.
   - ⬜ Grey = Letter is not in the word.
5. You have 6 attempts to guess the Secret Word of the Day.

Rewards:
- If you guess the word within 6 tries, you win a random cat picture!
- Common (89% chance): One of 6 common cats (grey, oyen, siam, tabby, calico, brown).
- Rare (10% chance): One of 3 rare cats (rayyan, bengal, sphynx).
- Super Rare (1% chance): The legendary Oyo cat!
- The reward modal will appear with your cat picture. You can click "continue browsing" to return to the portfolio.

Why it exists:
- To encourage visitors to read through the entire portfolio.
- To test your knowledge of Adam's tech stack and projects.
- To add a fun, memorable Easter egg that makes the site stand out.
- The word changes every day (UTC), so you can come back tomorrow for a new challenge!
`;
