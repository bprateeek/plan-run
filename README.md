## PlanRun : self-hosted race training PWA

A personal marathon/race training planner. Generates a periodized plan (Daniels VDOT
paces, volume-driven mileage, progressive quality sessions) and lets you log runs.
Everything is stored locally in your browser (IndexedDB) and works fully offline.

## Files

- `index.html` - the whole app (engine + UI + IndexedDB)
- `manifest.webmanifest` - PWA metadata
- `sw.js` - service worker (offline app shell)
- `icons/` - app icons

## Run it / install on your phone

A service worker (needed for offline + "Add to Home Screen") only works over
**HTTPS** or on **localhost** - not from a `file://` path.

**Quick local test (desktop):**

```
cd runplan
npx serve .          # or: python3 -m http.server 8080
```

Open the URL it prints. On localhost the install prompt / Add to Home Screen works.

**On your phone:** host the folder anywhere that serves static files over HTTPS -
your own server/VPS, GitHub Pages, Netlify, Cloudflare Pages, etc. Open the URL in
mobile Safari/Chrome → Share → "Add to Home Screen". It then launches full-screen
like a native app and runs offline.

## Updating

When you edit a cached file, bump the `CACHE` constant in `sw.js` (e.g. `plan-v1` →
`plan-v2`) so clients pick up the new version.

## Data

All plan + log data lives in your browser's IndexedDB under the database `runplan`.
It is not synced anywhere. Clearing site data / browser storage erases it. If you
later want cross-device sync, replace the `dbGet`/`dbSet` calls in `index.html` with
calls to your own backend.

## Notes

The UI loads three fonts from Google Fonts. With a network connection the service worker caches them after first load; fully offline on a fresh install they fall back to system fonts, which is fine.
