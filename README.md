# 🐝 Hive Friend v4.1

A mobile-first PWA dashboard for monitoring a "Hive" compute swarm — real-time stats, a world map of clusters, a control panel, and a log stream, fed by a local WebSocket relay server.

## Features

- **PWA installable** — `public/manifest.json` ("Planetary Swarm Dashboard", standalone, portrait) plus `public/sw.js` for offline support; designed to be added to a phone's home screen
- **WebSocket relay server** (`websocket/server.ts`) — polls three Hive cluster endpoints (localhost:8080/8082/8083, labeled us-east/eu-west/ap-south) every 2s and broadcasts `metrics`, `members`, `gpu`, `anchor`, and `log` events; clients subscribe to channels, get the last 50 events replayed on connect, and are kept alive with heartbeat pings
- **Live dashboard** (`app/page.tsx`) — `RealtimeStats` (recharts), `RealtimeWorldMap`, `ControlPanel`, and `LogStream`, all wired through the `useHiveWebSocket` hook with exponential-backoff reconnects
- **Hive API client** (`lib/hive.ts`) — fetchers for `/health`, `/members`, `/metrics`, `/gpu/status`, `/gpu/infer`, `/anchor/status`, and `/chaos/trigger` against a configurable `HIVE_API` (default `http://localhost:8080`)
- **Mobile UX** — touch gestures (pull-to-refresh, swipe navigation), haptic feedback (`lib/haptics.ts`), bottom-sheet controls, dark/light/auto themes

## Tech stack

Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, `ws` (WebSocket server), SWR, recharts, lucide-react, `ts-node` + `concurrently` for dev.

## Getting started

```bash
npm install
./start.sh
```

`start.sh` detects the machine's LAN IP, points `NEXT_PUBLIC_HIVE_API` at it, starts the WebSocket relay on port 3001, and runs `next dev` on port 3000 — then open the printed URL on your phone and tap **Add to Home Screen**. npm scripts: `dev` (Next.js + WS server together), `build`, `start`, `ws` (relay only).

## Project structure

```
app/                    Next.js routes: layout, page (Swarm Overview), globals.css
components/             Header, RealtimeStats, RealtimeWorldMap, ControlPanel,
                        LogStream, MobileNav, TouchGestures, theme/
lib/                    hive.ts (REST client), websocket.ts (useHiveWebSocket),
                        haptics.ts
websocket/server.ts     WS relay polling the Hive clusters
public/                 manifest.json, sw.js
start.sh                LAN-aware one-command launcher
```

## Status

Working dashboard, but it is a frontend for infrastructure that is **not in this repo**: it expects Hive API servers on ports 8080/8082/8083 (unreachable clusters surface as "unreachable" chaos events). Two gaps in the repo itself: the icons referenced by `manifest.json` (`/icons/icon-192x192.png`, `/icons/icon-512x512.png`) are missing from `public/`, and there are no tests.
