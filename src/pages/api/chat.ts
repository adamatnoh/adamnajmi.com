export const prerender = false;

// src/pages/api/chat.ts
import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RESUME_INFO } from '../../data/resume';
import { PERSONAL_INFO } from '../../data/personal';
import { WEBSITE_INFO } from '../../data/website';

// ============================================
// 1. WORDLE WORD POOL (Same as frontend)
// ============================================
const WORDS = [
  'NAJMI',
  'JOHOR',
  'TOOLS',
  'MYSQL',
  'POWER',
  'REACT',
  'INTEL',
  'FLOWS',
  'TEAMS',
  'BUILT',
  'QUEUE',
  'DAILY',
  'YIELD',
  'GRADE',
  'USERS',
  'STACK',
  'STAKE',
  'RATES',
  'SWAPS',
  'CROSS',
  'VAULT',
  'LOWER',
  'BANKS',
  'ADMIN',
  'FUNDS',
  'EMAIL',
  'STAFF',
  'TOKEN',
  'AGENT',
  'FINAL',
];

const getDailySecret = () => {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % WORDS.length;
  return WORDS[index];
};

const DAILY_WORD = getDailySecret();

// ==============================================
// 2. THE API HANDLER
// ==============================================
export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the user's question from the request body
    const body = await request.json();
    const userMessage = body.message;

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
      });
    }

    // Initialize Gemini
    const apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    // Build the prompt
    const prompt = `
You are a friendly, professional AI assistant for Adam Najmi's portfolio website.
Your job is to answer questions about Adam based *only* on the context provided below.
If the user asks something outside of this context, politely say you don't have that information and suggest they email adamnajminoh@gmail.com or dm him in linkedin.

**Important: Wordle Game**
There is a Wordle-style game on the portfolio called "Daily Cipher". The secret word for today is "${DAILY_WORD}".
- If a user asks for the word of the day, you can give them a **hint** (e.g., "It's a name of the developer of this portfolio", if the word is NAJMI or "It's where we put our money", if the word is BANKS).
- Only if they insist after several attempts, you may reveal the word to them.
- Encourage them to explore the portfolio and click on technical words to find it!

Context about Adam:
${PERSONAL_INFO}
${RESUME_INFO}
${WEBSITE_INFO}

User's question: ${userMessage}
`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    // Correct way: pass status as part of the options object
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 },
    );
  }
};
