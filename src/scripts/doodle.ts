/**
 * Doodle: a scribble layer on the desktop intro. Strokes are kept as vectors
 * (CSS px), so the canvas can be redrawn sharply at any devicePixelRatio and
 * after a resize, undone/redone, and saved to localStorage cheaply.
 */

type Tool = 'pen' | 'eraser';
type Stroke =
  | { t: Tool; c: string; s: number; p: number[] } // p = flat [x0, y0, x1, y1, ...]
  | { t: 'clear' };

const KEY = 'adam-doodle';
const MAX_SAVE = 1_500_000; // characters of JSON; beyond this we just don't persist

export interface Doodle {
  open(): void;
  close(): void;
  isOn(): boolean;
}

export function initDoodle(
  desk: HTMLElement,
  hooks: { onOpen?: () => void; onClose?: () => void } = {},
): Doodle | null {
  const canvas = desk.querySelector<HTMLCanvasElement>('[data-doodle-canvas]');
  const bar = desk.querySelector<HTMLElement>('[data-doodle-bar]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !bar || !ctx) return null;

  let strokes: Stroke[] = load();
  let redoStack: Stroke[] = [];
  let cur: Extract<Stroke, { p: number[] }> | null = null;
  let pointerId: number | null = null;
  let tool: Tool = 'pen';
  let color = '#ffffff';
  let size = 6;
  let on = false;
  let dpr = 1;
  let saveTimer = 0;

  const sizeInput = bar.querySelector<HTMLInputElement>('[data-doodle-size]');
  const sizeDot = bar.querySelector<HTMLElement>('[data-doodle-dot]');
  const undoBtn = bar.querySelector<HTMLButtonElement>('[data-doodle="undo"]');
  const redoBtn = bar.querySelector<HTMLButtonElement>('[data-doodle="redo"]');
  const clearBtn = bar.querySelector<HTMLButtonElement>('[data-doodle="clear"]');

  function load(): Stroke[] {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }
  function save() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      try {
        // Only what is visible matters: drop everything before the last clear.
        const last = strokes.map((s) => s.t).lastIndexOf('clear');
        const keep = strokes.slice(last + 1);
        const data = JSON.stringify(keep);
        if (!keep.length) localStorage.removeItem(KEY);
        else if (data.length <= MAX_SAVE) localStorage.setItem(KEY, data);
      } catch {
        /* storage full or private mode: the doodle just won't persist */
      }
    }, 300);
  }

  const hasInk = () => {
    for (let i = strokes.length - 1; i >= 0; i--) {
      const s = strokes[i];
      if (s.t === 'clear') return false;
      if (s.t === 'pen') return true;
    }
    return false;
  };
  const syncButtons = () => {
    if (undoBtn) undoBtn.disabled = !strokes.length;
    if (redoBtn) redoBtn.disabled = !redoStack.length;
    if (clearBtn) clearBtn.disabled = !hasInk();
  };

  // ---------------------------------------------------------------- drawing
  const style = (s: Extract<Stroke, { p: number[] }>) => {
    ctx.globalCompositeOperation = s.t === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = ctx.fillStyle = s.t === 'eraser' ? '#000' : s.c;
    ctx.lineWidth = s.t === 'eraser' ? s.s * 2.5 : s.s;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };
  const dot = (s: Extract<Stroke, { p: number[] }>, x: number, y: number) => {
    style(s);
    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  };
  /** Whole stroke, smoothed with quadratic curves through midpoints. */
  const drawStroke = (s: Stroke) => {
    if (s.t === 'clear') {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      return;
    }
    const p = s.p;
    if (p.length < 4) return dot(s, p[0], p[1]);
    style(s);
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    for (let i = 2; i < p.length - 2; i += 2) {
      ctx.quadraticCurveTo(p[i], p[i + 1], (p[i] + p[i + 2]) / 2, (p[i + 1] + p[i + 3]) / 2);
    }
    ctx.lineTo(p[p.length - 2], p[p.length - 1]);
    ctx.stroke();
  };
  /** Live: only the newest segment, ending at the midpoint of the last two points. */
  const drawTail = (s: Extract<Stroke, { p: number[] }>) => {
    const p = s.p;
    const n = p.length / 2;
    style(s);
    ctx.beginPath();
    if (n === 2) {
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo((p[0] + p[2]) / 2, (p[1] + p[3]) / 2);
    } else {
      const i = (n - 3) * 2;
      ctx.moveTo((p[i] + p[i + 2]) / 2, (p[i + 1] + p[i + 3]) / 2);
      ctx.quadraticCurveTo(
        p[i + 2],
        p[i + 3],
        (p[i + 2] + p[i + 4]) / 2,
        (p[i + 3] + p[i + 5]) / 2,
      );
    }
    ctx.stroke();
  };
  const redraw = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const s of strokes) drawStroke(s);
    ctx.globalCompositeOperation = 'source-over';
  };
  const fit = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    redraw();
  };

  // ---------------------------------------------------------------- input
  const pos = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return [Math.round((e.clientX - r.left) * 10) / 10, Math.round((e.clientY - r.top) * 10) / 10];
  };
  canvas.addEventListener('pointerdown', (e) => {
    if (!on || pointerId !== null || e.button > 0) return;
    e.preventDefault();
    pointerId = e.pointerId;
    canvas.setPointerCapture(e.pointerId);
    const [x, y] = pos(e);
    cur = { t: tool, c: color, s: size, p: [x, y] };
    dot(cur, x, y);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!cur || e.pointerId !== pointerId) return;
    e.preventDefault();
    const evs = e.getCoalescedEvents?.() || [e];
    for (const ev of evs.length ? evs : [e]) {
      const [x, y] = pos(ev);
      const p = cur.p;
      if (Math.hypot(x - p[p.length - 2], y - p[p.length - 1]) < 1.5) continue;
      p.push(x, y);
      drawTail(cur);
    }
  });
  const end = (e: PointerEvent) => {
    if (!cur || e.pointerId !== pointerId) return;
    strokes.push(cur);
    redoStack = [];
    cur = null;
    pointerId = null;
    redraw(); // replace the live segments with one clean, smoothed path
    syncButtons();
    save();
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('contextmenu', (e) => on && e.preventDefault());

  // ---------------------------------------------------------------- actions
  const undo = () => {
    const s = strokes.pop();
    if (!s) return;
    redoStack.push(s);
    redraw();
    syncButtons();
    save();
  };
  const redo = () => {
    const s = redoStack.pop();
    if (!s) return;
    strokes.push(s);
    redraw();
    syncButtons();
    save();
  };
  const clear = () => {
    if (!hasInk()) return;
    strokes.push({ t: 'clear' });
    redoStack = [];
    redraw();
    syncButtons();
    save();
  };
  const savePng = () => {
    const out = document.createElement('canvas');
    out.width = canvas.width;
    out.height = canvas.height;
    const o = out.getContext('2d')!;
    // Paint a copy of the wallpaper so light strokes stay visible in the file.
    const w = out.width;
    const h = out.height;
    const base = o.createLinearGradient(0, 0, w * 0.35, h);
    base.addColorStop(0, '#0b1020');
    base.addColorStop(0.55, '#0a0c16');
    base.addColorStop(1, '#120a1f');
    o.fillStyle = base;
    o.fillRect(0, 0, w, h);
    const glow = (x: number, y: number, r: number, c: string) => {
      const g = o.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, c);
      g.addColorStop(1, 'transparent');
      o.fillStyle = g;
      o.fillRect(0, 0, w, h);
    };
    glow(w * 0.18, h * 0.2, Math.max(w, h) * 0.45, 'rgba(45,212,191,0.28)');
    glow(w * 0.85, h * 0.25, Math.max(w, h) * 0.42, 'rgba(124,58,237,0.32)');
    glow(w * 0.6, h, Math.max(w, h) * 0.45, 'rgba(225,29,72,0.18)');
    o.drawImage(canvas, 0, 0);
    o.font = `${Math.round(13 * dpr)}px ui-sans-serif, system-ui, sans-serif`;
    o.fillStyle = 'rgba(255,255,255,0.45)';
    o.textAlign = 'right';
    o.fillText('drawn on adamnajmi.com', w - 16 * dpr, h - 14 * dpr);
    out.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `doodle-adamnajmi-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.append(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, 'image/png');
  };

  const setTool = (t: Tool) => {
    tool = t;
    bar.querySelectorAll<HTMLElement>('[data-tool]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.tool === t));
    });
    canvas.dataset.tool = t;
  };
  const setColor = (c: string) => {
    color = c;
    bar.querySelectorAll<HTMLElement>('[data-color]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.color === c));
    });
    if (sizeDot) sizeDot.style.background = c;
    setTool('pen');
  };
  const setSize = (v: number) => {
    size = Math.max(2, Math.min(28, v));
    if (sizeInput) sizeInput.value = String(size);
    if (sizeDot) sizeDot.style.setProperty('--d', `${Math.max(4, Math.min(size, 18))}px`);
  };

  bar.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const b = t.closest<HTMLElement>('[data-tool],[data-color],[data-doodle]');
    if (!b) return;
    e.stopPropagation();
    if (b.dataset.tool) return setTool(b.dataset.tool as Tool);
    if (b.dataset.color) return setColor(b.dataset.color);
    const a = b.dataset.doodle;
    if (a === 'undo') undo();
    else if (a === 'redo') redo();
    else if (a === 'clear') clear();
    else if (a === 'save') savePng();
    else if (a === 'close') close();
  });
  sizeInput?.addEventListener('input', () => setSize(Number(sizeInput.value)));

  const onKey = (e: KeyboardEvent) => {
    if (!on) return;
    const mod = e.metaKey || e.ctrlKey;
    const k = e.key.toLowerCase();
    if (mod && k === 'z') {
      e.preventDefault();
      return e.shiftKey ? redo() : undo();
    }
    if (mod && k === 'y') {
      e.preventDefault();
      return redo();
    }
    if (mod || e.altKey || (e.target as HTMLElement).closest?.('input,textarea')) return;
    if (k === 'p' || k === 'b') setTool('pen');
    else if (k === 'e') setTool('eraser');
    else if (k === '[') setSize(size - 2);
    else if (k === ']') setSize(size + 2);
  };

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(fit, 120);
  };

  function open() {
    if (on) return;
    on = true;
    desk.classList.add('is-drawing');
    bar!.hidden = false;
    fit();
    syncButtons();
    document.addEventListener('keydown', onKey);
    hooks.onOpen?.();
    bar!.querySelector<HTMLElement>('[data-tool="pen"]')?.focus({ preventScroll: true });
  }
  function close() {
    if (!on) return;
    on = false;
    cur = null;
    pointerId = null;
    desk.classList.remove('is-drawing');
    bar!.hidden = true;
    document.removeEventListener('keydown', onKey);
    hooks.onClose?.();
  }

  // The drawing stays visible on the desktop after leaving draw mode.
  window.addEventListener('resize', onResize);
  setTool('pen');
  setColor(color);
  setSize(size);
  fit();
  syncButtons();

  return { open, close, isOn: () => on };
}
