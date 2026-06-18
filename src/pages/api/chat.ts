export const prerender = false;

// src/pages/api/chat.ts
import type { APIRoute } from "astro";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ==============================================
// 1. YOUR "KNOWLEDGE BASE" (Resume Context)
// ==============================================
const RESUME_CONTEXT = `
Adam Najmi is a Software Engineer based in Johor, Malaysia, with a First-Class Honours degree in Computer Science (Software Engineering) from UTM (CGPA 3.88).

He has 2+ years of experience as a Software Engineer at Rapidz Inc., a fintech/crypto company.
- Backend: Node.js, TypeScript, NestJS, Laravel, PHP.
- Database: MySQL, Prisma.
- Security: Implemented HMAC request signing and JWT (RS256) authentication.
- Integrations: Built push notification queues (FCM) and integrated third-party vendors.
- Reporting: Architected a Power BI reporting ecosystem (P&L, yield, product performance) from scratch.
- Migration: Helped migrate the core system from Laravel/PHP to NestJS + React Native.

He also interned at Intel, working with Python, Perl, Verilog, and SystemVerilog.

He is currently open to remote, hybrid, or on-site roles in Johor or Singapore, specifically in backend, full-stack, or fintech engineering.
`;

// ==============================================
// 2. THE API HANDLER
// ==============================================
export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the user's question from the request body
    const body = await request.json();
    const userMessage = body.message;

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
      });
    }

    // Initialize Gemini
    const apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY environment variable");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build the prompt
    const prompt = `
You are a friendly, professional AI assistant for Adam Najmi's portfolio website.
Your job is to answer questions about Adam based *only* on the context provided below.
If the user asks something outside of this context, politely say you don't have that information and suggest they email adamnajminoh@gmail.com.

Context about Adam:
${RESUME_CONTEXT}

User's question: ${userMessage}
`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    // Correct way: pass status as part of the options object
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 },
    );
  }
};
