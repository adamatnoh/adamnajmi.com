export const prerender = false;
import type { APIRoute } from 'astro';
import { json } from '../../lib/api';
import { PROFILE, STATS } from '../../data/profile';

export const GET: APIRoute = () => json({ ...PROFILE, stats: STATS });
