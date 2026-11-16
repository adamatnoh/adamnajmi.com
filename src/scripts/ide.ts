/**
 * AmCode workbench controller: tabs, explorer, side views, panel,
 * terminal, command palette, Simple Browser, deep links and layout state.
 * Plain DOM so the editor content stays static HTML (SEO, no-JS fallback,
 * and the Daily Cipher auto-linker can see every word).
 */
import { track } from '../lib/track';

interface Item {
  id: string;
  name: string;
  path: string;
  icon: string;
  lang: string;
  aliases?: string[];
}
type Layout = 'open' | 'closed';
type PanelState = 'open' | 'closed' | 'max';

const root = document.getElementById('ide');
if (root) init(root);

function init(ide: HTMLElement) {
  const meta = JSON.parse(ide.dataset.meta || '{}') as {
    files: Item[];
    browsers: Item[];
    tools: Item[];
  };
  const items = new Map<string, Item>();
  [...meta.files, ...meta.browsers, ...(meta.tools || [])].forEach((i) => items.set(i.id, i));

  const $ = <T extends Element = HTMLElement>(sel: string, el: ParentNode = document) =>
    el.querySelector<T>(sel) as T;
  const $$ = <T extends Element = HTMLElement>(sel: string, el: ParentNode = document) =>
    Array.from(el.querySelectorAll<T>(sel));

  const mobile = window.matchMedia('(max-width: 767px)');
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const store = {
    get(k: string) {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k: string, v: string) {
      try {
        localStorage.setItem(k, v);
      } catch {
        /* private mode */
      }
    },
  };

  $$('[data-kbd]').forEach((k) => (k.textContent = isMac ? '⇧⌘P' : 'Ctrl+Shift+P'));

  // ------------------------------------------------------------------
  // Layout: sidebar / panel / chat
  // ------------------------------------------------------------------
  const setLayout = (key: 'sidebar' | 'chat', state: Layout, persist = true) => {
    ide.dataset[key] = state;
    if (persist && !mobile.matches) store.set(`ide:${key}`, state);
    $$(`[data-pressed-for="${key}"]`).forEach((b) =>
      b.setAttribute('aria-pressed', String(state === 'open')),
    );
    if (key === 'sidebar') {
      $$('.act-btn[data-view]').forEach((b) =>
        b.setAttribute('aria-pressed', String(state === 'open' && b.dataset.view === currentView)),
      );
    }
    if (mobile.matches && state === 'open') {
      // Only one drawer at a time on phones.
      const other = key === 'sidebar' ? 'chat' : 'sidebar';
      ide.dataset[other] = 'closed';
    }
  };
  const setPanel = (state: PanelState, persist = true) => {
    ide.dataset.panel = state;
    if (persist && !mobile.matches && state !== 'max') store.set('ide:panel', state);
    $$('[data-pressed-for="panel"]').forEach((b) =>
      b.setAttribute('aria-pressed', String(state !== 'closed')),
    );
    const collapse = $('.panel-collapse');
    collapse?.setAttribute('aria-label', state === 'closed' ? 'Expand panel' : 'Collapse panel');
    if (state !== 'closed' && activePanel === 'cipher')
      window.dispatchEvent(new CustomEvent('cipher:open'));
  };

  const applyInitialLayout = () => {
    if (mobile.matches) {
      ide.dataset.sidebar = 'closed';
      ide.dataset.chat = 'closed';
      ide.dataset.panel = 'closed';
    } else {
      ide.dataset.sidebar = (store.get('ide:sidebar') as Layout) || 'open';
      ide.dataset.chat =
        (store.get('ide:chat') as Layout) || (window.innerWidth >= 1100 ? 'open' : 'closed');
      ide.dataset.panel = (store.get('ide:panel') as PanelState) || 'open';
    }
    setLayout('sidebar', ide.dataset.sidebar as Layout, false);
    setLayout('chat', ide.dataset.chat as Layout, false);
    setPanel(ide.dataset.panel as PanelState, false);
  };

  const toggleChat = (force?: boolean) => {
    const open = force ?? ide.dataset.chat !== 'open';
    setLayout('chat', open ? 'open' : 'closed');
    if (open) {
      window.dispatchEvent(new CustomEvent('ide:chat-focus'));
      track('chat_open');
    }
  };
  window.addEventListener('ide:chat-toggle', (e) => toggleChat((e as CustomEvent).detail?.open));

  const closeDrawers = () => {
    if (!mobile.matches) return;
    ide.dataset.sidebar = 'closed';
    ide.dataset.chat = 'closed';
  };

  // Panel height drag (desktop).
  const savedH = Number(store.get('ide:panel-h'));
  if (savedH > 80) ide.style.setProperty('--panel-h', `${savedH}px`);
  const handle = $('[data-panel-resize]');
  handle?.addEventListener('pointerdown', (e) => {
    const work = $('.ide-work');
    if (!work) return;
    handle.setPointerCapture(e.pointerId);
    handle.classList.add('dragging');
    const bottom = work.getBoundingClientRect().bottom;
    const max = work.getBoundingClientRect().height - 120;
    const move = (ev: PointerEvent) => {
      const h = Math.max(90, Math.min(max, bottom - ev.clientY));
      ide.style.setProperty('--panel-h', `${h}px`);
      if (ide.dataset.panel === 'max') ide.dataset.panel = 'open';
    };
    const up = () => {
      handle.classList.remove('dragging');
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      const h = parseInt(getComputedStyle(ide).getPropertyValue('--panel-h'), 10);
      if (h) store.set('ide:panel-h', String(h));
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
  });

  // ------------------------------------------------------------------
  // Side views
  // ------------------------------------------------------------------
  let currentView = 'explorer';
  const showView = (view: string) => {
    const same = view === currentView;
    if (same && ide.dataset.sidebar === 'open' && !mobile.matches) {
      setLayout('sidebar', 'closed');
      return;
    }
    currentView = view;
    $$('[data-side-view]').forEach((v) =>
      v.classList.toggle('is-active', v.dataset.sideView === view),
    );
    setLayout('sidebar', 'open');
    if (view === 'search')
      setTimeout(() => $<HTMLInputElement>('[data-search-input]')?.focus(), 30);
  };

  // ------------------------------------------------------------------
  // Editor tabs
  // ------------------------------------------------------------------
  const tabsEl = $('[data-tabs]');
  const crumbs = $('[data-breadcrumbs]');
  const open: string[] = ['readme'];
  let active: string | null = 'readme';

  const iconHtml = (it: Item) => {
    if (it.icon === 'postam') {
      const tpl = document.getElementById('ficon-postam') as HTMLTemplateElement | null;
      return `<span class="ficon ficon-postam" aria-hidden="true">${tpl?.innerHTML ?? '{}'}</span>`;
    }
    const src = $(`.tree-item[data-open="${it.id}"] .ficon`);
    return src ? src.outerHTML : `<span class="ficon ficon-${it.icon}" aria-hidden="true">◎</span>`;
  };

  const renderTabs = () => {
    tabsEl.innerHTML = '';
    open.forEach((id) => {
      const it = items.get(id);
      if (!it) return;
      const isActive = id === active;
      const wrap = document.createElement('div');
      wrap.className = `tab${isActive ? ' is-active' : ''}`;
      wrap.setAttribute('role', 'presentation');
      wrap.dataset.tab = id;
      const label = document.createElement('button');
      label.type = 'button';
      label.className = 'tab-label';
      label.id = `tab-${id}`;
      label.setAttribute('role', 'tab');
      label.setAttribute('aria-selected', String(isActive));
      label.setAttribute('aria-controls', `pane-${id}`);
      label.tabIndex = isActive ? 0 : -1;
      label.title = it.path;
      label.innerHTML = `${iconHtml(it)}<span></span>`;
      label.querySelector('span:last-child')!.textContent = it.id.startsWith('browser-')
        ? it.name
        : it.name;
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'tab-close';
      close.setAttribute('aria-label', `Close ${it.name}`);
      close.dataset.close = id;
      close.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>';
      wrap.append(label, close);
      tabsEl.append(wrap);
    });
    $(`.tab.is-active`, tabsEl)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const renderCrumbs = (it: Item | undefined) => {
    if (!it) {
      crumbs.innerHTML = '';
      return;
    }
    const parts = it.id.startsWith('browser-')
      ? ['Simple Browser', it.path]
      : it.id === 'postam'
        ? ['PostAm', 'adamnajmi.com', 'api']
        : ['adamnajmi.com', ...it.path.split('/')];
    crumbs.innerHTML = '';
    parts.forEach((p, i) => {
      if (i) {
        const sep = document.createElement('span');
        sep.className = 'sep';
        sep.textContent = '›';
        crumbs.append(sep);
      }
      if (i === parts.length - 1) crumbs.insertAdjacentHTML('beforeend', iconHtml(it));
      const s = document.createElement('span');
      s.textContent = p;
      crumbs.append(s);
    });
  };

  const setUrl = (id: string | null) => {
    const url = new URL(location.href);
    url.hash = '';
    const it = id ? items.get(id) : null;
    if (!it || id === 'readme') url.searchParams.delete('file');
    else if (id === 'postam') url.searchParams.set('file', 'postam');
    else
      url.searchParams.set(
        'file',
        id!.startsWith('browser-') ? id!.replace('browser-', 'browser:') : it.path,
      );
    history.replaceState(null, '', url.pathname + url.search);
  };

  const posEl = $('[data-status-pos]');
  const langEl = $('[data-status-lang]');
  const updatePos = () => {
    const pane = active ? $(`#pane-${active}`) : null;
    const ln = pane ? Math.floor(pane.scrollTop / 22) + 1 : 1;
    if (posEl) posEl.textContent = `Ln ${ln}, Col 1`;
  };

  const fillGutter = (pane: HTMLElement | null) => {
    const g = pane?.querySelector<HTMLElement>('.gutter');
    if (!g || !pane) return;
    const content = g.nextElementSibling as HTMLElement | null;
    const lines = Math.max(1, Math.ceil((content?.scrollHeight || pane.clientHeight) / 22));
    if (Number(g.dataset.lines) === lines) return;
    g.dataset.lines = String(lines);
    g.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  };
  const ro =
    'ResizeObserver' in window
      ? new ResizeObserver((entries) =>
          entries.forEach((e) => fillGutter(e.target.closest('.pane'))),
        )
      : null;
  $$('.pv > .md').forEach((el) => ro?.observe(el));

  const activate = (id: string | null, { focus = false, url = true } = {}) => {
    active = id;
    $$('.pane').forEach((p) =>
      p.classList.toggle('is-active', p.dataset.pane === (id ?? 'welcome')),
    );
    renderTabs();
    const it = id ? items.get(id) : undefined;
    renderCrumbs(it);
    if (langEl) langEl.textContent = it?.lang ?? '';
    $$('.tree-item[data-open]').forEach((b) => {
      const on = b.dataset.open === id;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    const pane = $(`#pane-${id ?? 'welcome'}`);
    fillGutter(pane);
    updatePos();
    if (id?.startsWith('browser-')) ensureBrowser(id);
    $$('[data-pressed-for-tab]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.pressedForTab === id)),
    );
    if (id === 'postam') window.dispatchEvent(new CustomEvent('postam:show'));
    if (url) setUrl(id);
    if (focus) pane?.focus({ preventScroll: true });
  };

  const resolve = (q: string): string | null => {
    const s = q.trim().toLowerCase().replace(/^\.\//, '');
    if (!s) return null;
    if (s.startsWith('browser:')) {
      const b = `browser-${s.slice(8)}`;
      return items.has(b) ? b : null;
    }
    for (const it of items.values()) {
      const names = [
        it.id,
        it.name,
        it.path,
        it.name.replace(/\.[^.]+$/, ''),
        ...(it.aliases || []),
      ].map((x) => x.toLowerCase());
      if (names.includes(s)) return it.id;
    }
    return null;
  };

  const openFile = (id: string, opts: { focus?: boolean } = {}) => {
    if (!items.has(id)) return;
    if (!open.includes(id)) {
      const at = active ? open.indexOf(active) + 1 : open.length;
      open.splice(at, 0, id);
    }
    activate(id, opts);
    closeDrawers();
    track('ide_open_file', { file: id });
  };

  const closeTab = (id: string) => {
    const idx = open.indexOf(id);
    if (idx < 0) return;
    open.splice(idx, 1);
    if (active === id) activate(open[Math.max(0, idx - 1)] ?? null);
    else renderTabs();
    if (id.startsWith('browser-')) {
      // Drop the iframe so a hidden app isn't kept running.
      const view = $(`#pane-${id} [data-sb="view"]`);
      view?.querySelector('iframe')?.remove();
      view && delete view.dataset.loaded;
    }
  };

  tabsEl.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const close = t.closest<HTMLElement>('[data-close]');
    if (close) return closeTab(close.dataset.close!);
    const tab = t.closest<HTMLElement>('[data-tab]');
    if (tab) activate(tab.dataset.tab!);
  });
  tabsEl.addEventListener('auxclick', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLElement>('[data-tab]');
    if (tab && e.button === 1) closeTab(tab.dataset.tab!);
  });
  tabsEl.addEventListener('keydown', (e) => {
    if (!active) return;
    const idx = open.indexOf(active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (idx + 1) % open.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + open.length) % open.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = open.length - 1;
    else if (e.key === 'Delete') {
      closeTab(active);
      $<HTMLElement>('.tab.is-active .tab-label', tabsEl)?.focus();
      return;
    }
    if (next < 0) return;
    e.preventDefault();
    activate(open[next]);
    $<HTMLElement>('.tab.is-active .tab-label', tabsEl)?.focus();
  });

  $$('.pane').forEach((p) =>
    p.addEventListener('scroll', () => p.dataset.pane === active && updatePos(), { passive: true }),
  );

  // ------------------------------------------------------------------
  // Bottom panel
  // ------------------------------------------------------------------
  let activePanel = 'terminal';
  const showPanel = (name: string, focus = false) => {
    activePanel = name;
    $$('[data-panel-tab]').forEach((t) => {
      const on = t.dataset.panelTab === name;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    $$('[data-panel-pane]').forEach((p) => (p.hidden = p.dataset.panelPane !== name));
    if (ide.dataset.panel === 'closed') setPanel('open', !mobile.matches);
    else if (name === 'cipher') window.dispatchEvent(new CustomEvent('cipher:open'));
    if (focus && name === 'terminal') termInput?.focus();
  };
  $('[role="tablist"][aria-label="Panel views"]')?.addEventListener('keydown', (e) => {
    const names = ['terminal', 'problems', 'cipher'];
    const i = names.indexOf(activePanel);
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = names[(i + (e.key === 'ArrowRight' ? 1 : -1) + names.length) % names.length];
    showPanel(n);
    $<HTMLElement>(`[data-panel-tab="${n}"]`)?.focus();
  });
  window.addEventListener('cipher:guess', () => {
    if (activePanel !== 'cipher' || ide.dataset.panel === 'closed') showPanel('cipher');
  });

  // ------------------------------------------------------------------
  // Simple Browser
  // ------------------------------------------------------------------
  const sameSite = /(^|\.)adamnajmi\.com$/.test(location.hostname);
  function ensureBrowser(id: string) {
    const wrap = $(`#pane-${id} [data-browser]`);
    if (!wrap || wrap.dataset.embeddable !== 'true') return;
    const view = $('[data-sb="view"]', wrap);
    if (!view || view.dataset.loaded) return;
    view.dataset.loaded = '1';
    const back = $<HTMLButtonElement>('[data-sb="back"]', wrap);
    const reload = $<HTMLButtonElement>('[data-sb="reload"]', wrap);
    const urlInput = $<HTMLInputElement>('[data-sb="url"]', wrap);
    let loading = $('[data-sb="loading"]', view);
    if (!loading) {
      loading = document.createElement('div');
      loading.className = 'sb-loading';
      loading.dataset.sb = 'loading';
      loading.textContent = `Loading ${wrap.dataset.host}…`;
      view.append(loading);
    }
    const frame = document.createElement('iframe');
    frame.title = `Simple Browser: ${wrap.dataset.host}`;
    frame.src = urlInput.value || wrap.dataset.url || '';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'clipboard-write; fullscreen';
    let loads = 0;
    frame.addEventListener('load', () => {
      loads += 1;
      loading?.remove();
      if (back) back.disabled = loads < 2;
    });
    if (back) {
      back.onclick = () => {
        if (loads < 2) return;
        loads -= 2; // the back navigation itself fires another load
        history.back();
      };
    }
    if (reload) reload.onclick = () => (frame.src = urlInput.value || wrap.dataset.url || '');
    view.append(frame);
    if (!sameSite && !$('.sb-note', view)) {
      const note = document.createElement('div');
      note.className = 'sb-note';
      note.textContent =
        'Preview build: signing in inside the frame only works on adamnajmi.com. Use “open in external browser” to log in here.';
      view.append(note);
      setTimeout(() => note.remove(), 9000);
    }
    track('simple_browser_open', { host: wrap.dataset.host || '' });
  }
  $$<HTMLFormElement>('[data-sb="form"]').forEach((form) =>
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const wrap = form.closest<HTMLElement>('[data-browser]')!;
      const input = $<HTMLInputElement>('[data-sb="url"]', form);
      let url: URL;
      try {
        url = new URL(/^https?:\/\//.test(input.value) ? input.value : `https://${input.value}`);
      } catch {
        return;
      }
      const frame = $<HTMLIFrameElement>('iframe', wrap);
      if (frame && url.hostname === wrap.dataset.host) {
        input.value = url.href;
        frame.src = url.href;
      } else {
        window.open(url.href, '_blank', 'noopener,noreferrer');
      }
    }),
  );

  // ------------------------------------------------------------------
  // Ask Adam bridge
  // ------------------------------------------------------------------
  const ask = (q: string) => {
    if (!q.trim()) return toggleChat(true);
    toggleChat(true);
    const w = window as any;
    if (typeof w.__askAdam === 'function') w.__askAdam(q);
    else (w.__askQueue ||= []).push(q);
  };

  // ------------------------------------------------------------------
  // Theme
  // ------------------------------------------------------------------
  const syncThemeMeta = () => {
    const light = document.documentElement.classList.contains('light');
    $('meta[name="theme-color"]')?.setAttribute('content', light ? '#e7eaf0' : '#0a0c12');
  };
  const toggleTheme = () => {
    const light = !document.documentElement.classList.contains('light');
    document.documentElement.classList.toggle('light', light);
    document.documentElement.classList.toggle('dark', !light);
    store.set('theme', light ? 'light' : 'dark');
    syncThemeMeta();
  };
  syncThemeMeta();

  // ------------------------------------------------------------------
  // Search view
  // ------------------------------------------------------------------
  const searchInput = $<HTMLInputElement>('[data-search-input]');
  const searchList = $('[data-search-results]');
  const searchStatus = $('[data-search-status]');
  const escHtml = (s: string) =>
    s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  let searchTimer = 0;
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      const q = searchInput.value.trim().toLowerCase();
      searchList.innerHTML = '';
      if (q.length < 2) {
        searchStatus.textContent = 'Type at least 2 characters.';
        return;
      }
      let total = 0;
      meta.files.forEach((f) => {
        const pane = $(`#pane-${f.id}`);
        const text = (pane?.textContent || '').replace(/\s+/g, ' ');
        const lower = text.toLowerCase();
        let at = lower.indexOf(q);
        let n = 0;
        while (at >= 0 && n < 3) {
          const start = Math.max(0, at - 28);
          const snippet =
            (start ? '…' : '') +
            escHtml(text.slice(start, at)) +
            '<mark>' +
            escHtml(text.slice(at, at + q.length)) +
            '</mark>' +
            escHtml(text.slice(at + q.length, at + q.length + 40)) +
            '…';
          const li = document.createElement('li');
          li.innerHTML = `<button type="button" class="side-row" data-open="${f.id}"><small>${escHtml(f.path)}</small>${snippet}</button>`;
          searchList.append(li);
          n += 1;
          total += 1;
          at = lower.indexOf(q, at + q.length);
        }
      });
      searchStatus.textContent = total
        ? `${total} result${total > 1 ? 's' : ''}`
        : 'No results. Try Ask Adam instead.';
    }, 120);
  });

  // ------------------------------------------------------------------
  // Command palette
  // ------------------------------------------------------------------
  interface Cmd {
    label: string;
    detail?: string;
    group: string;
    icon?: string;
    run: () => void;
  }
  const palWrap = $('[data-palette]');
  const palInput = $<HTMLInputElement>('[data-palette-input]');
  const palList = $('[data-palette-list]');
  let palItems: Cmd[] = [];
  let palIndex = 0;
  let palReturn: HTMLElement | null = null;

  const baseCommands = (): Cmd[] => [
    ...meta.files.map((f) => ({
      label: f.name,
      detail: f.path,
      group: 'files',
      icon: f.icon,
      run: () => openFile(f.id, { focus: true }),
    })),
    {
      label: 'Simple Browser: Open hss.adamnajmi.com',
      group: 'commands',
      run: () => openFile('browser-hss'),
    },
    {
      label: 'Simple Browser: Open ceria.kemas.gov.my',
      group: 'commands',
      run: () => openFile('browser-educeria'),
    },
    { label: 'PostAm: Open API Client', group: 'commands', run: () => openFile('postam') },
    ...['/api/about', '/api/projects', '/api/experience', '/api/stack', '/api/contact'].map(
      (p) => ({
        label: `PostAm: GET ${p}`,
        group: 'commands',
        run: () => {
          openFile('postam');
          (window as any).postam?.send(p);
        },
      }),
    ),
    { label: 'View: Switch to Simple View', group: 'commands', run: () => goSimple() },
    { label: 'View: Show Desktop', group: 'commands', run: () => showDesktop() },
    { label: 'Daily Cipher: Play', group: 'commands', run: () => showPanel('cipher') },
    { label: 'Ask Adam: Open Chat', group: 'commands', run: () => toggleChat(true) },
    {
      label: 'View: Toggle Primary Side Bar',
      detail: isMac ? '⌘B' : 'Ctrl+B',
      group: 'commands',
      run: () => setLayout('sidebar', ide.dataset.sidebar === 'open' ? 'closed' : 'open'),
    },
    {
      label: 'View: Toggle Panel',
      detail: 'Ctrl+`',
      group: 'commands',
      run: () => setPanel(ide.dataset.panel === 'closed' ? 'open' : 'closed'),
    },
    { label: 'View: Toggle Ask Adam', group: 'commands', run: () => toggleChat() },
    {
      label: 'Terminal: Focus Terminal',
      group: 'commands',
      run: () => showPanel('terminal', true),
    },
    { label: 'Preferences: Toggle Light/Dark Theme', group: 'commands', run: toggleTheme },
    { label: 'HSS: Guided Tour (/hss)', group: 'commands', run: () => (location.href = '/hss') },
    {
      label: 'HSS: Launch Live Demo (/hss/live)',
      group: 'commands',
      run: () => (location.href = '/hss/live'),
    },
    {
      label: 'Resume: Open PDF',
      group: 'commands',
      run: () => window.open('/file/resume.pdf', '_blank', 'noopener'),
    },
  ];

  const fuzzy = (q: string, s: string) => {
    let i = 0;
    let score = 0;
    let last = -1;
    for (const ch of q) {
      const at = s.indexOf(ch, i);
      if (at < 0) return -1;
      score += at === last + 1 ? 2 : 0;
      last = at;
      i = at + 1;
    }
    return score + (s.startsWith(q) ? 10 : 0) + (s.includes(q) ? 5 : 0);
  };

  const renderPalette = () => {
    const raw = palInput.value;
    const q = raw
      .replace(/^[>?]\s*/, '')
      .trim()
      .toLowerCase();
    const askMode = raw.startsWith('?');
    let list = baseCommands();
    if (raw.startsWith('>')) list = list.filter((c) => c.group === 'commands');
    if (q && !askMode) {
      list = list
        .map((c) => ({
          c,
          s: Math.max(fuzzy(q, c.label.toLowerCase()), fuzzy(q, (c.detail || '').toLowerCase())),
        }))
        .filter((x) => x.s >= 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.c);
    }
    if (askMode) list = [];
    const question = raw.replace(/^[>?]\s*/, '').trim();
    if (question)
      list.push({
        label: `Ask Adam: “${question}”`,
        group: 'ask',
        icon: 'ask',
        run: () => ask(question),
      });
    palItems = list.slice(0, 40);
    palIndex = 0;
    palList.innerHTML = '';
    let lastGroup = '';
    palItems.forEach((c, i) => {
      if (c.group !== lastGroup && !q) {
        lastGroup = c.group;
        const g = document.createElement('li');
        g.className = 'pal-group';
        g.setAttribute('role', 'presentation');
        g.textContent = c.group === 'files' ? 'files' : c.group === 'ask' ? 'ask' : 'commands';
        palList.append(g);
      }
      const li = document.createElement('li');
      li.id = `pal-${i}`;
      li.setAttribute('role', 'option');
      li.dataset.index = String(i);
      const it = c.group === 'files' ? meta.files.find((f) => f.name === c.label) : undefined;
      const icon = it
        ? iconHtml(it as Item)
        : c.group === 'ask'
          ? '<span class="ficon ficon-browser" aria-hidden="true">✦</span>'
          : '<span class="ficon ficon-folder" aria-hidden="true">›</span>';
      li.innerHTML = `${icon}<span></span><span class="pal-detail"></span>`;
      li.children[1].textContent = c.label;
      li.children[2].textContent = c.detail || '';
      palList.append(li);
    });
    highlightPal();
  };
  const highlightPal = () => {
    $$('[role="option"]', palList).forEach((li) =>
      li.setAttribute('aria-selected', String(Number(li.dataset.index) === palIndex)),
    );
    const sel = $(`#pal-${palIndex}`);
    palInput.setAttribute('aria-activedescendant', sel ? sel.id : '');
    sel?.scrollIntoView({ block: 'nearest' });
  };
  const openPalette = (prefix = '') => {
    palReturn = document.activeElement as HTMLElement;
    palWrap.hidden = false;
    palWrap.classList.add('is-open');
    palInput.value = prefix;
    renderPalette();
    palInput.focus();
  };
  const closePalette = (restore = true) => {
    if (palWrap.hidden) return;
    palWrap.hidden = true;
    palWrap.classList.remove('is-open');
    if (restore) palReturn?.focus?.();
  };
  const runPal = (i: number) => {
    const c = palItems[i];
    if (!c) return;
    closePalette(false);
    c.run();
  };
  palInput.addEventListener('input', renderPalette);
  palInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      palIndex = Math.min(palItems.length - 1, palIndex + 1);
      highlightPal();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      palIndex = Math.max(0, palIndex - 1);
      highlightPal();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runPal(palIndex);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  });
  palList.addEventListener('click', (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (li) runPal(Number(li.dataset.index));
  });
  palWrap.addEventListener('mousedown', (e) => {
    if (e.target === palWrap) closePalette();
  });

  // ------------------------------------------------------------------
  // Terminal
  // ------------------------------------------------------------------
  const termOut = $('[data-term-out]');
  const termForm = $<HTMLFormElement>('[data-term-form]');
  const termInput = $<HTMLInputElement>('[data-term-input]');
  const history_: string[] = [];
  let hIdx = 0;
  const print = (text: string, cls = '') => {
    const p = document.createElement('p');
    p.className = cls ? `pre ${cls}` : 'pre';
    p.textContent = text;
    termOut.append(p);
  };
  const printPrompt = (cmd: string) => {
    const p = document.createElement('p');
    p.className = 'pre';
    p.innerHTML = '<span class="t-user">adam@portfolio</span> <span class="t-path">~</span> % ';
    p.append(document.createTextNode(cmd));
    termOut.append(p);
  };
  const lsLines = () => {
    const rootFiles = meta.files.filter((f) => !f.path.includes('/')).map((f) => f.name);
    const proj = meta.files.filter((f) => f.path.startsWith('projects/')).map((f) => f.name);
    return { rootFiles, proj };
  };
  const COMMANDS: Record<string, (args: string[]) => void> = {
    help: () => {
      [
        'help                 show this list',
        'ls [projects]        list files',
        'open <file>          open a file in the editor (alias: cat, code)',
        'ask <question>       ask the Ask Adam chat',
        'whoami               who is this guy',
        'cipher               play the daily cipher',
        'browser hss          open HSS in the Simple Browser',
        'curl <path>          call the API, e.g. curl /api/stack',
        'postam [path]        open the PostAm API client',
        'simple               switch to the simple view',
        'desktop              back to the desktop (tabs stay open)',
        'theme [light|dark]   switch theme',
        'contact | resume     how to reach Adam',
        'clear                clear the terminal',
      ].forEach((l) => print(l, 't-dim'));
    },
    ls: (a) => {
      const { rootFiles, proj } = lsLines();
      if (a[0]?.replace(/\/$/, '') === 'projects') print(proj.join('   '));
      else print(['projects/', ...rootFiles].join('   '));
    },
    open: (a) => {
      const id = resolve(a.join(' '));
      if (!id) return print(`open: no such file: ${a.join(' ') || '(missing name)'}`, 't-err');
      openFile(id);
      print(`opened ${items.get(id)!.path}`, 't-dim');
    },
    whoami: () =>
      print('Adam Najmi — Full Stack Software Engineer · Fintech & Government · Johor Bahru, MY'),
    ask: (a) => {
      if (!a.length) return print('usage: ask <question>', 't-err');
      ask(a.join(' '));
      print('→ sent to Ask Adam', 't-dim');
    },
    cipher: () => {
      showPanel('cipher');
    },
    browser: (a) => {
      const id = a[0] === 'educeria' || a[0] === 'kemas' ? 'browser-educeria' : 'browser-hss';
      openFile(id);
    },
    theme: (a) => {
      const want = a[0];
      const light = document.documentElement.classList.contains('light');
      if (!want || (want === 'light') !== light) toggleTheme();
      print(
        `theme: ${document.documentElement.classList.contains('light') ? 'light' : 'dark'}`,
        't-dim',
      );
    },
    contact: () => {
      openFile('contact');
      print('adamnajminoh@gmail.com · linkedin.com/in/adamnajmi · github.com/adamatnoh');
    },
    resume: () => {
      window.open('/file/resume.pdf', '_blank', 'noopener');
      print('opening /file/resume.pdf', 't-dim');
    },
    postam: (a) => {
      openFile('postam');
      if (a[0]) (window as any).postam?.send(a[0]);
    },
    curl: async (a) => {
      const raw = a.filter((x) => !x.startsWith('-'))[0] || '/api';
      let path: string;
      try {
        const u = new URL(raw, location.origin);
        if (u.origin !== location.origin || !/^\/api(\/|$)/.test(u.pathname)) throw new Error();
        path = u.pathname;
      } catch {
        return print('curl: only this site’s /api routes, e.g. curl /api/about', 't-err');
      }
      try {
        const res = await fetch(path, { headers: { Accept: 'application/json' } });
        const text = await res.text();
        print(`HTTP ${res.status}`, res.ok ? 't-dim' : 't-err');
        print(text.length > 4000 ? `${text.slice(0, 4000)}\n…` : text);
      } catch {
        print('curl: network error', 't-err');
      }
      const pane = termForm?.closest('.panel-pane');
      if (pane) pane.scrollTop = pane.scrollHeight;
    },
    simple: () => goSimple(),
    desktop: () => {
      print('minimizing AmCode…', 't-dim');
      setTimeout(showDesktop, 120);
    },
    classic: () => goSimple(),
    clear: () => (termOut.innerHTML = ''),
    date: () => print(new Date().toString()),
    echo: (a) => print(a.join(' ')),
    pwd: () => print('/home/adam/adamnajmi.com'),
    sudo: () =>
      print('adam is not in the sudoers file. This incident will be reported. 😄', 't-err'),
    exit: () => setPanel('closed'),
    history: () => history_.forEach((h, i) => print(`${String(i + 1).padStart(4)}  ${h}`, 't-dim')),
  };
  COMMANDS.cat = COMMANDS.open;
  COMMANDS.code = COMMANDS.open;
  COMMANDS.vim = (a) => {
    COMMANDS.open(a);
    print('(you can leave vim any time 😉)', 't-dim');
  };

  const runCommand = (line: string) => {
    const trimmed = line.trim();
    printPrompt(trimmed);
    if (!trimmed) return;
    history_.push(trimmed);
    hIdx = history_.length;
    const [cmd, ...args] = trimmed.split(/\s+/);
    if (/^\.\/daily_cipher\.sh$|^daily_cipher\.sh$|^\.\/daily_cipher$/.test(cmd))
      return COMMANDS.cipher(args);
    const fn = COMMANDS[cmd.toLowerCase()];
    if (fn) fn(args);
    else print(`zsh: command not found: ${cmd}. Try "help".`, 't-err');
  };
  termForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    runCommand(termInput.value);
    termInput.value = '';
    const pane = termForm.closest('.panel-pane');
    if (pane) pane.scrollTop = pane.scrollHeight;
  });
  termInput?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && history_.length) {
      e.preventDefault();
      hIdx = Math.max(0, hIdx - 1);
      termInput.value = history_[hIdx] ?? '';
    } else if (e.key === 'ArrowDown' && history_.length) {
      e.preventDefault();
      hIdx = Math.min(history_.length, hIdx + 1);
      termInput.value = history_[hIdx] ?? '';
    } else if (e.key === 'Tab') {
      const m = termInput.value.match(/^(open|cat|code|vim)\s+(\S*)$/);
      if (!m) return;
      e.preventDefault();
      const hits = meta.files.map((f) => f.name).filter((n) => n.startsWith(m[2]));
      if (hits.length === 1) termInput.value = `${m[1]} ${hits[0]}`;
      else if (hits.length > 1) print(hits.join('   '), 't-dim');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      termOut.innerHTML = '';
    }
  });
  $('[data-panel-pane="terminal"]')?.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('a, button') && !window.getSelection()?.toString())
      termInput?.focus();
  });

  // ------------------------------------------------------------------
  // Simple view (the v1 layout at /classic), remembered per browser
  // ------------------------------------------------------------------
  // Back to the desktop intro. The desktop keeps the editor's state, so
  // reopening AmCode lands on the same tabs.
  function showDesktop() {
    const desk = (window as any).amDesk;
    if (!desk) return;
    closePalette(false);
    closeDrawers();
    track('desktop_show');
    desk.show();
  }
  function toggleFullscreen() {
    const doc = document as Document & { webkitExitFullscreen?: () => void };
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => void;
    };
    try {
      if (document.fullscreenElement) doc.exitFullscreen?.();
      else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      else el.webkitRequestFullscreen?.();
    } catch {
      /* not allowed here: harmless no-op */
    }
  }

  function goSimple() {
    store.set('adam-view', 'classic');
    track('view_switch', { to: 'classic' });
    location.href = '/classic';
  }
  $$('[data-simple-view]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      goSimple();
    }),
  );

  // ------------------------------------------------------------------
  // Delegated clicks
  // ------------------------------------------------------------------
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const opener = t.closest<HTMLElement>('[data-open]');
    if (opener && !opener.closest('[data-tabs]')) {
      e.preventDefault();
      openFile(opener.dataset.open!);
      return;
    }
    const b = t.closest<HTMLElement>('[data-browser-open]');
    if (b) return openFile(b.dataset.browserOpen!);
    const askBtn = t.closest<HTMLElement>('[data-ask]');
    if (askBtn) return ask(askBtn.dataset.ask!);
    const view = t.closest<HTMLElement>('[data-view]');
    if (view) return showView(view.dataset.view!);
    const ptab = t.closest<HTMLElement>('[data-panel-tab]');
    if (ptab) return showPanel(ptab.dataset.panelTab!);
    const popen = t.closest<HTMLElement>('[data-panel-open]');
    if (popen) return showPanel(popen.dataset.panelOpen!);
    const col = t.closest<HTMLElement>('[data-collapse]');
    if (col) {
      const target = document.getElementById(col.getAttribute('aria-controls') || '');
      const expanded = col.getAttribute('aria-expanded') !== 'false';
      col.setAttribute('aria-expanded', String(!expanded));
      if (target) target.hidden = expanded;
      return;
    }
    const action = t.closest<HTMLElement>('[data-action]')?.dataset.action;
    switch (action) {
      case 'toggle-sidebar':
        return setLayout('sidebar', ide.dataset.sidebar === 'open' ? 'closed' : 'open');
      case 'toggle-panel':
        return setPanel(ide.dataset.panel === 'closed' ? 'open' : 'closed');
      case 'panel-max':
        return setPanel(ide.dataset.panel === 'max' ? 'open' : 'max');
      case 'toggle-chat':
        return toggleChat();
      case 'palette':
        return openPalette();
      case 'theme':
        return toggleTheme();
      case 'cipher':
        return showPanel('cipher');
      case 'close-drawers':
        return closeDrawers();
      case 'postam':
        return openFile('postam');
      case 'desktop':
        return showDesktop();
      case 'fullscreen':
        return toggleFullscreen();
    }
  });

  // Keyboard: cipher words are role=button spans.
  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (
      (e.key === 'Enter' || e.key === ' ') &&
      t?.dataset?.word &&
      t.getAttribute('role') === 'button'
    ) {
      e.preventDefault();
      t.click();
      return;
    }
    const mod = e.metaKey || e.ctrlKey;
    const k = e.key.toLowerCase();
    if (mod && ((e.shiftKey && k === 'p') || (!e.shiftKey && k === 'k'))) {
      e.preventDefault();
      if (palWrap.hidden) openPalette();
      else closePalette();
    } else if (mod && !e.shiftKey && k === 'b') {
      e.preventDefault();
      setLayout('sidebar', ide.dataset.sidebar === 'open' ? 'closed' : 'open');
    } else if (e.ctrlKey && (e.key === '`' || e.code === 'Backquote')) {
      e.preventDefault();
      if (ide.dataset.panel === 'closed') showPanel('terminal', true);
      else setPanel('closed');
    } else if (e.key === 'Escape') {
      if (!palWrap.hidden) closePalette();
      else closeDrawers();
    }
  });

  mobile.addEventListener('change', applyInitialLayout);

  // ------------------------------------------------------------------
  // Deep links: ?file=projects/hss.php, ?file=hss.php, #stack, ?panel=cipher
  // ------------------------------------------------------------------
  const HASHES: Record<string, string> = {
    stack: 'stack',
    experience: 'experience',
    projects: 'readme',
    education: 'education',
    contact: 'contact',
    about: 'about',
  };
  applyInitialLayout();
  const params = new URLSearchParams(location.search);
  const hash = location.hash.replace('#', '');
  const fromParam = params.get('file');
  const target =
    (fromParam && resolve(fromParam)) || (hash && (HASHES[hash] || resolve(hash))) || 'readme';
  if (target !== 'readme') {
    open.length = 0;
    open.push('readme', target);
  }
  activate(target, { url: !!(fromParam || hash) });
  if (hash === 'cipher' || params.get('panel') === 'cipher') showPanel('cipher');
  else if (params.get('panel') === 'problems') showPanel('problems');

  (window as any).ide = { open: openFile, ask, showPanel };
}
