export const prerender = false;
import type { APIRoute } from 'astro';
import { json } from '../../lib/api';
import { PROJECTS } from '../../data/profile';

export const GET: APIRoute = () => json({ count: PROJECTS.length, projects: PROJECTS });
