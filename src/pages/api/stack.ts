export const prerender = false;
import type { APIRoute } from 'astro';
import { json } from '../../lib/api';
import { SKILLS, SPOKEN, CERTIFICATIONS } from '../../data/profile';

export const GET: APIRoute = () =>
  json({
    stack: Object.fromEntries(SKILLS.map((s) => [s.group, s.items])),
    spoken: SPOKEN,
    certifications: CERTIFICATIONS,
    thisSite: ['Astro', 'React', 'Tailwind CSS', 'Vercel', 'Gemini API'],
  });
