/** Tiny helpers for the public read-only JSON API that PostAm talks to. */

export function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      // Cheap at the edge: the data only changes on deploy.
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      'X-Powered-By': 'adamnajmi.com',
      ...(init.headers || {}),
    },
  });
}

export const API_ROUTES = [
  { path: '/api/about', description: 'Who Adam is, in one object' },
  { path: '/api/projects', description: 'Featured projects with links' },
  { path: '/api/experience', description: 'Work history, newest first' },
  { path: '/api/stack', description: 'Tech stack, languages and certifications' },
  { path: '/api/contact', description: 'How to reach Adam' },
  {
    path: '/api/solat',
    description: 'Today’s JAKIM prayer times (?zone=JHR02 or ?lat=&lng=)',
  },
] as const;
