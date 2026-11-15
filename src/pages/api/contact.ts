export const prerender = false;
import type { APIRoute } from 'astro';
import { json } from '../../lib/api';
import { CONTACT } from '../../data/profile';

export const GET: APIRoute = () => json(CONTACT);
