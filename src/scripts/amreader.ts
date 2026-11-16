/**
 * AmReader: renders the resume inside the desktop with pdf.js. This module
 * (and pdf.js with its worker) is only loaded the first time the reader opens.
 */
import { getDocument, GlobalWorkerOptions, type PDFPageProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerUrl;

const CSS_UNITS = 96 / 72; // 100% = the page's real size on screen
const STEPS = [0.5, 0.67, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3];
const GAP = 16;

export interface Reader {
  zoomIn(): void;
  zoomOut(): void;
  fit(): void;
  go(page: number): void;
  step(delta: number): void;
  refit(): void;
  pages: number;
}

export async function mountReader(root: HTMLElement, url: string): Promise<Reader> {
  const view = root.querySelector<HTMLElement>('[data-rd-view]')!;
  const pagesEl = root.querySelector<HTMLElement>('[data-rd-pages]')!;
  const thumbsEl = root.querySelector<HTMLElement>('[data-rd-thumbs]');
  const pageInput = root.querySelector<HTMLInputElement>('[data-rd-page]')!;
  const countEl = root.querySelector<HTMLElement>('[data-rd-count]')!;
  const zoomEl = root.querySelector<HTMLElement>('[data-rd-zoom]')!;
  const fitBtn = root.querySelector<HTMLElement>('[data-rd="fit"]');

  const doc = await getDocument({ url }).promise;
  const n = doc.numPages;
  const pages: PDFPageProxy[] = [];
  for (let i = 1; i <= n; i++) pages.push(await doc.getPage(i));

  countEl.textContent = String(n);
  pageInput.max = String(n);
  root.dataset.pages = String(n);

  // Page shells keep their size before the bitmap is drawn, so scrolling is stable.
  pagesEl.textContent = '';
  const shells = pages.map((_, i) => {
    const shell = document.createElement('div');
    shell.className = 'rd-sheet';
    shell.dataset.page = String(i + 1);
    shell.setAttribute('role', 'img');
    shell.setAttribute('aria-label', `Page ${i + 1} of ${n}`);
    const c = document.createElement('canvas');
    const links = document.createElement('div');
    links.className = 'rd-links';
    shell.append(c, links);
    pagesEl.append(shell);
    return shell;
  });

  // Clickable links from the PDF's own link annotations.
  const annots = await Promise.all(pages.map((p) => p.getAnnotations().catch(() => [])));

  let mode: 'fit' | 'manual' = 'fit';
  let zoom = 1;
  let current = 1;
  let tasks: { cancel(): void }[] = [];

  const fitScale = () => {
    const vp = pages[0].getViewport({ scale: 1 });
    const avail = Math.max(120, view.clientWidth - GAP * 2);
    return avail / vp.width;
  };
  const scaleNow = () => (mode === 'fit' ? fitScale() : zoom * CSS_UNITS);

  async function render() {
    tasks.forEach((t) => t.cancel());
    tasks = [];
    const scale = scaleNow();
    const pct = Math.round((scale / CSS_UNITS) * 100);
    zoomEl.textContent = `${pct}%`;
    fitBtn?.setAttribute('aria-pressed', String(mode === 'fit'));
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    // Keep the reading position when the zoom changes.
    const ratio = view.scrollHeight ? view.scrollTop / view.scrollHeight : 0;
    pages.forEach((page, i) => {
      const vp = page.getViewport({ scale });
      const shell = shells[i];
      shell.style.width = `${Math.floor(vp.width)}px`;
      shell.style.height = `${Math.floor(vp.height)}px`;
      const canvas = shell.querySelector('canvas')!;
      canvas.width = Math.floor(vp.width * dpr);
      canvas.height = Math.floor(vp.height * dpr);
      canvas.style.width = `${Math.floor(vp.width)}px`;
      canvas.style.height = `${Math.floor(vp.height)}px`;
      const task = page.render({
        canvas,
        viewport: vp,
        transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
      });
      tasks.push(task);
      task.promise.catch(() => {
        /* cancelled by a newer render */
      });
      const links = shell.querySelector<HTMLElement>('.rd-links')!;
      links.textContent = '';
      for (const a of annots[i] as any[]) {
        if (a.subtype !== 'Link' || !a.url || !/^(https?:|mailto:)/i.test(a.url)) continue;
        const [x1, y1] = vp.convertToViewportPoint(a.rect[0], a.rect[1]);
        const [x2, y2] = vp.convertToViewportPoint(a.rect[2], a.rect[3]);
        const el = document.createElement('a');
        el.href = a.url;
        el.target = '_blank';
        el.rel = 'noopener';
        el.title = a.url;
        el.setAttribute('aria-label', a.url.replace(/^mailto:/, ''));
        el.style.left = `${Math.min(x1, x2)}px`;
        el.style.top = `${Math.min(y1, y2)}px`;
        el.style.width = `${Math.abs(x2 - x1)}px`;
        el.style.height = `${Math.abs(y2 - y1)}px`;
        links.append(el);
      }
    });
    view.scrollTop = ratio * view.scrollHeight;
  }

  // Thumbnails (desktop widths only show the sidebar, but they are cheap).
  if (thumbsEl) {
    thumbsEl.textContent = '';
    pages.forEach((page, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rd-thumb';
      b.dataset.go = String(i + 1);
      b.setAttribute('aria-label', `Go to page ${i + 1}`);
      const c = document.createElement('canvas');
      const label = document.createElement('span');
      label.textContent = String(i + 1);
      b.append(c, label);
      thumbsEl.append(b);
      const vp = page.getViewport({ scale: 1 });
      const s = (96 / vp.width) * Math.min(window.devicePixelRatio || 1, 2);
      const tvp = page.getViewport({ scale: s });
      c.width = Math.floor(tvp.width);
      c.height = Math.floor(tvp.height);
      page.render({ canvas: c, viewport: tvp }).promise.catch(() => {});
    });
    thumbsEl.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-go]');
      if (b) go(Number(b.dataset.go));
    });
  }

  const setCurrent = (p: number) => {
    current = p;
    if (document.activeElement !== pageInput) pageInput.value = String(p);
    thumbsEl?.querySelectorAll<HTMLElement>('.rd-thumb').forEach((t) => {
      const on = Number(t.dataset.go) === p;
      t.classList.toggle('is-current', on);
      if (on) t.setAttribute('aria-current', 'page');
      else t.removeAttribute('aria-current');
    });
    root.querySelector<HTMLButtonElement>('[data-rd="prev"]')!.disabled = p <= 1;
    root.querySelector<HTMLButtonElement>('[data-rd="next"]')!.disabled = p >= n;
  };
  // The current page is the one covering the middle of the viewport.
  const track = () => {
    const mid = view.getBoundingClientRect().top + view.clientHeight / 2;
    let best = 1;
    for (const s of shells) {
      const r = s.getBoundingClientRect();
      if (r.top <= mid) best = Number(s.dataset.page);
    }
    if (best !== current) setCurrent(best);
  };
  view.addEventListener('scroll', () => requestAnimationFrame(track), { passive: true });

  function go(p: number) {
    const page = Math.min(n, Math.max(1, Math.round(p) || 1));
    const shell = shells[page - 1];
    view.scrollTo({ top: shell.offsetTop - GAP, behavior: 'smooth' });
    setCurrent(page);
  }
  const step = (d: number) => go(current + d);
  const setZoom = (z: number) => {
    mode = 'manual';
    zoom = z;
    void render();
  };
  const zoomIn = () => {
    const now = scaleNow() / CSS_UNITS;
    setZoom(STEPS.find((s) => s > now + 0.01) ?? STEPS[STEPS.length - 1]);
  };
  const zoomOut = () => {
    const now = scaleNow() / CSS_UNITS;
    setZoom([...STEPS].reverse().find((s) => s < now - 0.01) ?? STEPS[0]);
  };
  const fit = () => {
    mode = 'fit';
    void render();
  };

  let rt = 0;
  const refit = () => {
    window.clearTimeout(rt);
    rt = window.setTimeout(() => mode === 'fit' && render(), 80);
  };
  new ResizeObserver(refit).observe(view);

  await render();
  setCurrent(1);
  root.dataset.ready = 'true';

  return { zoomIn, zoomOut, fit, go, step, refit, pages: n };
}
