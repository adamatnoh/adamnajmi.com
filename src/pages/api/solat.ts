export const prerender = false;
import type { APIRoute } from 'astro';
import { json } from '../../lib/api';
import { DEFAULT_SOLAT_ZONE, SOLAT_ZONES } from '../../data/solat-zones';

/**
 * GET /api/solat?zone=JHR02            official JAKIM times for a zone
 * GET /api/solat?lat=1.49&lng=103.74   map a coordinate to its JAKIM zone first
 *
 * Times come from JAKIM's e-solat API (proxied here for CORS and reliability).
 * If e-solat is down we fall back to api.waktusolat.app, which mirrors the
 * same JAKIM tables. Responses are cached at the edge until midnight MYT.
 */

const MYT_OFFSET_MS = 8 * 3600 * 1000;
const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabiulawal',
  'Rabiulakhir',
  'Jamadilawal',
  'Jamadilakhir',
  'Rejab',
  'Syaaban',
  'Ramadan',
  'Syawal',
  'Zulkaedah',
  'Zulhijjah',
];
// Generous box around Peninsular Malaysia, Sabah and Sarawak.
const inMalaysia = (lat: number, lng: number) =>
  lat >= 0.6 && lat <= 7.6 && lng >= 99.4 && lng <= 119.6;

type Times = {
  imsak: string;
  subuh: string;
  syuruk: string;
  zohor: string;
  asar: string;
  maghrib: string;
  isyak: string;
};

const hhmm = (v: string) => v.slice(0, 5);

function mytToday() {
  const d = new Date(Date.now() + MYT_OFFSET_MS);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
}

function secondsToMidnightMYT() {
  const s = Math.floor((Date.now() + MYT_OFFSET_MS) / 1000) % 86400;
  return Math.max(60, 86400 - s);
}

function hijriLabel(raw?: string) {
  const m = raw?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const month = HIJRI_MONTHS[Number(m[2]) - 1];
  return month ? `${Number(m[3])} ${month} ${m[1]}H` : null;
}

async function getJson(url: string, ms = 7000): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json', 'User-Agent': 'adamnajmi.com (prayer-times widget)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fromJakim(zone: string) {
  const data = await getJson(
    `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=${zone}`,
  );
  const p = Array.isArray(data?.prayerTime) ? data.prayerTime[0] : null;
  if (data?.status !== 'OK!' || !p?.fajr) throw new Error('e-solat returned no record');
  const times: Times = {
    imsak: hhmm(p.imsak),
    subuh: hhmm(p.fajr),
    syuruk: hhmm(p.syuruk),
    zohor: hhmm(p.dhuhr),
    asar: hhmm(p.asr),
    maghrib: hhmm(p.maghrib),
    isyak: hhmm(p.isha),
  };
  return { date: p.date as string, hijri: p.hijri as string, times, provider: 'JAKIM e-solat' };
}

async function fromMirror(zone: string) {
  const data = await getJson(`https://api.waktusolat.app/v2/solat/${zone}`);
  const today = mytToday();
  const p = data?.prayers?.find((x: any) => x.day === today.d);
  if (!p?.fajr) throw new Error('mirror returned no record');
  const t = (unix: number) => {
    const d = new Date(unix * 1000 + MYT_OFFSET_MS);
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  };
  const times: Times = {
    imsak: t(p.imsak),
    subuh: t(p.fajr),
    syuruk: t(p.syuruk),
    zohor: t(p.dhuhr),
    asar: t(p.asr),
    maghrib: t(p.maghrib),
    isyak: t(p.isha),
  };
  const date = new Date(Date.UTC(today.y, today.m - 1, today.d))
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .replace(/ /g, '-');
  return { date, hijri: p.hijri as string, times, provider: 'JAKIM via waktusolat.app' };
}

async function zoneFor(lat: number, lng: number) {
  if (!inMalaysia(lat, lng)) return { zone: DEFAULT_SOLAT_ZONE, via: 'default', place: null };
  try {
    const r = await getJson(`https://api.waktusolat.app/zones/${lat}/${lng}`, 5000);
    const code = String(r?.zone || '').toUpperCase();
    if (SOLAT_ZONES[code])
      return { zone: code, via: 'location', place: (r.district as string) || null };
  } catch {
    /* fall through to the default zone */
  }
  return { zone: DEFAULT_SOLAT_ZONE, via: 'default', place: null };
}

const fail = (status: number, error: string, extra: object = {}) =>
  json({ error, ...extra }, { status, headers: { 'Cache-Control': 'no-store' } });

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams;
  let zone = (q.get('zone') || '').trim().toUpperCase();
  let via = 'zone';
  let place: string | null = null;

  if (!zone && (q.has('lat') || q.has('lng'))) {
    const lat = Number(q.get('lat'));
    const lng = Number(q.get('lng'));
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)
      return fail(400, 'lat and lng must be valid coordinates, e.g. ?lat=2.03&lng=103.32');
    ({ zone, via, place } = await zoneFor(
      Math.round(lat * 1e3) / 1e3,
      Math.round(lng * 1e3) / 1e3,
    ));
  }
  if (!zone) {
    zone = DEFAULT_SOLAT_ZONE;
    via = 'default';
  }
  const info = SOLAT_ZONES[zone];
  if (!info) return fail(400, `Unknown JAKIM zone "${zone}". Try JHR02, WLY01 or SGR01.`);

  let day;
  try {
    day = await fromJakim(zone);
  } catch {
    try {
      day = await fromMirror(zone);
    } catch {
      return fail(502, 'Prayer times are unavailable right now (JAKIM e-solat did not respond).', {
        zone,
      });
    }
  }

  const ttl = secondsToMidnightMYT();
  return json(
    {
      zone,
      state: info.state,
      area: info.area,
      place: place || info.area.split(',')[0].trim(),
      resolvedBy: via,
      date: day.date,
      hijri: day.hijri || null,
      hijriLabel: hijriLabel(day.hijri),
      timezone: 'Asia/Kuala_Lumpur',
      times: day.times,
      source: day.provider,
    },
    {
      headers: {
        'Cache-Control': `public, max-age=0, s-maxage=${ttl}, stale-while-revalidate=600`,
      },
    },
  );
};
