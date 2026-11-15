/**
 * PostAm controller: sends GET requests to this site's /api routes and
 * renders the response (status, time, size, headers, highlighted JSON).
 */
import { track } from '@vercel/analytics';

const root = document.querySelector<HTMLElement>('[data-postam]');
if (root) init(root);

function init(pm: HTMLElement) {
  const $ = <T extends Element = HTMLElement>(s: string) => pm.querySelector<T>(s) as T;
  const form = $<HTMLFormElement>('[data-pm-form]');
  const url = $<HTMLInputElement>('[data-pm-url]');
  const send = $<HTMLButtonElement>('[data-pm-send]');
  const stats = $('[data-pm-stats]');
  const statusEl = $('[data-pm-status]');
  const timeEl = $('[data-pm-time]');
  const sizeEl = $('[data-pm-size]');
  const empty = $('[data-pm-empty]');
  const pre = $('[data-pm-json]');
  const headersEl = $('[data-pm-headers]');
  const origin = $('[data-pm-origin]');
  origin.textContent = location.host;

  let view: 'body' | 'headers' = 'body';
  let hasResponse = false;
  const showView = () => {
    pm.querySelectorAll<HTMLElement>('[data-pm-view]').forEach((b) =>
      b.setAttribute('aria-selected', String(b.dataset.pmView === view)),
    );
    pre.hidden = !hasResponse || view !== 'body';
    headersEl.hidden = !hasResponse || view !== 'headers';
    empty.hidden = hasResponse;
  };

  const esc = (s: string) =>
    s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
  // Token-level JSON highlighting on already pretty-printed text.
  const highlight = (text: string) =>
    esc(text).replace(
      /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
      (m, str, colon, lit, num) => {
        if (str)
          return colon
            ? `<span class="j-k">${str}</span>${colon}`
            : `<span class="j-s">${str}</span>`;
        if (lit) return `<span class="j-l">${lit}</span>`;
        if (num) return `<span class="j-n">${num}</span>`;
        return m;
      },
    );

  const normalise = (raw: string): string | null => {
    let v = raw.trim();
    if (!v) return null;
    try {
      const u = new URL(v, location.origin);
      if (u.origin !== location.origin) return null;
      v = u.pathname + u.search;
    } catch {
      return null;
    }
    v = v.replace(/\/+$/, '') || '/';
    return v === '/api' || v.startsWith('/api/') ? v : null;
  };

  const fmtSize = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(2)} KB`);
  const STATUS: Record<number, string> = {
    200: 'OK',
    400: 'Bad Request',
    404: 'Not Found',
    405: 'Method Not Allowed',
    500: 'Server Error',
  };

  const setActiveReq = (path: string) =>
    pm.querySelectorAll<HTMLElement>('[data-pm-req]').forEach((b) => {
      const on = b.dataset.pmReq === path;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });

  let busy = false;
  const run = async () => {
    if (busy) return;
    const path = normalise(url.value);
    if (!path) {
      hasResponse = true;
      stats.hidden = false;
      statusEl.className = 'pm-status err';
      statusEl.textContent = 'Blocked';
      timeEl.textContent = '–';
      sizeEl.textContent = '–';
      pre.innerHTML = highlight(
        JSON.stringify(
          { error: 'PostAm only calls this site’s API. Try /api/about or /api/projects.' },
          null,
          2,
        ),
      );
      headersEl.innerHTML = '';
      showView();
      return;
    }
    url.value = path;
    setActiveReq(path);
    busy = true;
    send.disabled = true;
    pm.classList.add('is-loading');
    const t0 = performance.now();
    try {
      const res = await fetch(path, { headers: { Accept: 'application/json' }, cache: 'no-store' });
      const text = await res.text();
      const ms = Math.round(performance.now() - t0);
      let body = text;
      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* not JSON: show as-is */
      }
      hasResponse = true;
      stats.hidden = false;
      statusEl.className = `pm-status ${res.ok ? 'ok' : 'err'}`;
      statusEl.textContent = `${res.status} ${res.statusText || STATUS[res.status] || ''}`.trim();
      timeEl.textContent = `${ms} ms`;
      sizeEl.textContent = fmtSize(new Blob([text]).size);
      pre.innerHTML = highlight(body);
      headersEl.innerHTML = '';
      res.headers.forEach((v, k) => {
        const dt = document.createElement('dt');
        dt.textContent = k;
        const dd = document.createElement('dd');
        dd.textContent = v;
        headersEl.append(dt, dd);
      });
      track('postam_send', { path, status: res.status });
    } catch (err) {
      hasResponse = true;
      stats.hidden = false;
      statusEl.className = 'pm-status err';
      statusEl.textContent = 'Network error';
      timeEl.textContent = `${Math.round(performance.now() - t0)} ms`;
      sizeEl.textContent = '–';
      pre.innerHTML = highlight(JSON.stringify({ error: String(err) }, null, 2));
    } finally {
      busy = false;
      send.disabled = false;
      pm.classList.remove('is-loading');
      showView();
      pm.querySelector('.pm-body')?.scrollTo({ top: 0 });
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run();
  });
  pm.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const req = t.closest<HTMLElement>('[data-pm-req]');
    if (req) {
      url.value = req.dataset.pmReq!;
      run();
      return;
    }
    const v = t.closest<HTMLElement>('[data-pm-view]');
    if (v) {
      view = v.dataset.pmView as typeof view;
      showView();
      return;
    }
    const curl = t.closest<HTMLElement>('[data-pm-curl]');
    if (curl) {
      const path = normalise(url.value) || '/api';
      const cmd = `curl -H "Accept: application/json" ${location.origin}${path}`;
      navigator.clipboard?.writeText(cmd).then(
        () => {
          const label = curl.querySelector('span');
          if (!label) return;
          label.textContent = 'Copied';
          setTimeout(() => (label.textContent = 'Copy cURL'), 1400);
        },
        () => {},
      );
    }
  });

  // Auto-send the first time the tab is shown, so there's something to look at.
  let primed = false;
  const prime = () => {
    if (primed) return;
    primed = true;
    run();
  };
  window.addEventListener('postam:show', prime);
  (window as any).postam = { send: (p?: string) => (p && (url.value = p), run()) };
  showView();
}
