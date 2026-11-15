export const prerender = false;
import type { APIRoute } from 'astro';
import { json } from '../../lib/api';
import { EXPERIENCE } from '../../data/profile';

export const GET: APIRoute = () =>
  json({
    count: EXPERIENCE.length,
    experience: EXPERIENCE.map((j) => ({
      role: j.role,
      company: j.companyNote ? `${j.company} ${j.companyNote}` : j.company,
      sector: j.sector,
      period: j.range,
      current: j.state === 'RUNNING',
      highlights: j.entries.map((e) => e.text),
    })),
  });
