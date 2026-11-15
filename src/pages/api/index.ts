export const prerender = false;
import type { APIRoute } from 'astro';
import { json, API_ROUTES } from '../../lib/api';

export const GET: APIRoute = () =>
  json({
    name: 'adamnajmi.com public API',
    version: '2.0.0',
    note: 'Read-only. Same data as the AmCode editor and the simple view.',
    routes: API_ROUTES,
  });
