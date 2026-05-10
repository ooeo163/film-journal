# Film Journal — Agent Guide

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · PostgreSQL · Prisma 7.7 (PrismaPg adapter) · sharp

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Production build | `npm run build` |
| Prisma migrate | `npx prisma migrate dev` |
| Prisma generate | `npx prisma generate` |
| Seed admin user | `node scripts/seed-admin.cjs` |
| Import local albums | `npm run import:local-albums` |
| Dedupe imports | `npm run dedupe:local-imports` |

No test framework is configured. There is no `typecheck` script — use `npm run build` to catch type errors.

## Next.js 16 — Read Before Writing Code

This is **not** the Next.js you know. APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key differences in this repo:
- Server Actions body size limit is set to **100 MB** in `next.config.ts` (for bulk photo uploads).
- `cookies()` is async — always `await cookies()`.

## Prisma

- Uses `@prisma/adapter-pg` (not the default engine). Connection string comes from `DATABASE_URL` env var.
- Global singleton in `lib/prisma.ts` includes a **schema version string** and model-existence checks. If you add a new Prisma model, bump `prismaSchemaVersion` and add a guard check, otherwise HMR will serve a stale client.
- Schema at `prisma/schema.prisma`. Migrations in `prisma/migrations/`.
- Prisma client is generated to default location (`node_modules/.prisma/client`), **not** to `app/generated/prisma` (that path is gitignored as a leftover).

## Tailwind CSS 4

This repo uses Tailwind v4 with `@tailwindcss/postcss`. There is **no** `tailwind.config.*` file. Configuration is done in CSS:
- `app/globals.css` uses `@import "tailwindcss"` and `@theme inline {}` for custom tokens.
- Custom colors are CSS variables (`--background`, `--foreground`), not Tailwind config values.
- Font stack: Georgia / Noto Serif SC / Songti SC (serif), set globally.

## Auth & Middleware

- Cookie-based auth with three cookies: `fj_session`, `fj_user_name`, `fj_user_role`.
- `middleware.ts` protects all routes except `/`, `/login`, `/api/auth/*`, static assets, and `/_next/`.
- Admin-only routes (`/admin`, `/admin/users`) require `fj_user_role === "system_admin"`.
- Login is minimal: username/email lookup, scrypt password hashing. No session table.
- Seed admin: `node scripts/seed-admin.cjs` creates `admin_0` / `admin123` with `system_admin` role.

## Local Media

- Uploaded images are stored in `storage/local-media/` (gitignored). Path is configurable via `LOCAL_MEDIA_ROOT` env var.
- Served to the browser via `/api/local-media?path=...`.
- Upload processing in `lib/local-media-server.ts`: auto-compresses images > 1 MB, generates thumbnails (max 400px, quality 70). Uses `sharp`.
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- `LOCAL_IMPORT_SOURCE_ROOT` env var (defaults to `D:\workspace\film-journal-img`) controls where batch import reads from.

## Architecture

- `app/` — Next.js App Router pages and API routes
  - `app/api/auth/` — login/logout endpoints
  - `app/api/admin/` — CRUD for photos, albums, journals, users, local-upload
  - `app/api/local-media/` — serves files from `storage/`
  - `app/admin/` — admin dashboard (photos, albums, journals, media, users)
  - `app/me/` — user profile area
- `components/` — all components are flat in root, prefixed by domain: `admin-*`, `album-*`, `photo-*`, `site-*`
- `lib/` — `prisma.ts` (DB client), `local-media.ts` (URL helper), `local-media-server.ts` (upload/save logic), `password.ts`
- `scripts/` — CJS scripts for seeding and data import
- `design-systems/` — reference DESIGN.md files from 70+ brands (not app code). Used via the `design-md` OpenCode skill.
- `public/images/` — static assets (homepage background, etc.)

## Style Conventions

- Project language is Chinese (zh-CN). UI strings, README, and comments are in Chinese.
- Dark theme by default (`bg-[#171310]` / `text-[#ebe1d2]`). Admin has an `.admin-light` CSS class override for light mode.
- Components use Tailwind utility classes directly — no CSS modules, no styled-components.
- Path alias: `@/*` maps to project root.

## Env Vars

Required:
- `DATABASE_URL` — PostgreSQL connection string

Optional:
- `LOCAL_MEDIA_ROOT` — override local media storage path
- `LOCAL_IMPORT_SOURCE_ROOT` — override batch import source directory
