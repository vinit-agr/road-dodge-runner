# Road Dodge Runner

A 3D nostalgic endless road dodging game prototype built with React Three Fiber.

## Tech Stack
- React 19 + TypeScript
- Vite
- Three.js + React Three Fiber
- @react-three/rapier (physics)
- Zustand (state)
- Framer Motion (UI transitions)
- Howler (audio)

## Prerequisites
- Node.js 20+
- pnpm (Corepack recommended)

## Install
```bash
pnpm install
```

## Run Dev Server
```bash
pnpm dev
```

By default this runs on `http://localhost:5173`.

To run on a specific host/port:
```bash
pnpm dev -- --host 0.0.0.0 --port 5173
```

## Build (Production)
```bash
pnpm build
```

Build output is generated in `dist/`.

## Preview Production Build
```bash
pnpm preview
```

## Scripts
- `pnpm dev` — start local dev server
- `pnpm build` — type-check + production build
- `pnpm preview` — preview production build
- `pnpm lint` — run lint checks
