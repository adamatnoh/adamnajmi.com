export const prerender = false;

// src/pages/api/chat.ts
import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RESUME_INFO } from '../../data/resume';
import { PERSONAL_INFO } from '../../data/personal';
import { WEBSITE_INFO } from '../../data/website';
import { getDailySecret } from '../../data/cipher';
import {
  cipherMode,
  cipherPrompt,
  cleanHistory,
  leaksWord,
  serverHint,
} from '../../lib/cipher-chat';

// ==============================================
// 2. THE API HANDLER
// ==============================================
export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the user's question from the request body
    const body = await request.json();
    const userMessage = body.message;
    // Earlier user messages in this chat, used only to decide what the model may
    // know about the Daily Cipher (see src/lib/cipher-chat.ts).
    const history = cleanHistory(body.history);
    const dailyWord = getDailySecret(); // per request, so it rolls over at midnight UTC
    const mode = cipherMode(String(userMessage || ''), history);

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
${cipherPrompt(mode, dailyWord)}

Context about Adam:
${PERSONAL_INFO}
${RESUME_INFO}
${WEBSITE_INFO}

User's question: ${userMessage}
`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let reply = response.text();
    // A hint turn must never give the word away, whatever the model writes.
    if ((mode === 'hint' || mode === 'hint2') && leaksWord(reply, dailyWord))
      reply = `${serverHint(dailyWord, mode === 'hint2')} Ask me again if you want the answer.`;

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
