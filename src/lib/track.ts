/**
 * Fire-and-forget analytics for the vanilla editor scripts. @vercel/analytics
 * is loaded lazily, so if it fails to load (an ad blocker, a flaky network or
 * a stale Vite dependency cache in dev) the editor itself keeps working.
 */
type Analytics = typeof import('@vercel/analytics');
type Props = Parameters<Analytics['track']>[1];

let mod: Promise<Analytics> | null = null;

export function track(name: string, props?: Props): void {
  mod ??= import('@vercel/analytics');
  mod
    .then((m) => m.track(name, props))
    .catch(() => {
      mod = null; // try again next time
    });
}
