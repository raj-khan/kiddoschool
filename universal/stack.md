# Canonical Stack

These choices apply across all projects in this architecture. Do not introduce alternatives without replacing the canonical tool.

## Runtime

- **Language:** TypeScript 5, strict mode everywhere
- **Node:** >=20
- **Package manager:** pnpm workspaces
- **Build:** Turborepo (task graph, remote caching)

## Frontend

- **Framework:** Next.js 15 App Router
- **Styling:** CSS custom properties + Tailwind CSS (app layer only, never in shared packages)
- **Validation:** Zod 3 (schemas in a dedicated package, types always inferred)
- **Testing:** Vitest

## Backend / Data

- **Database + Auth:** Supabase Postgres with Row Level Security
- **ORM:** None — use Supabase JS client directly
- **Migrations:** SQL files in `supabase/migrations/`, numbered sequentially
- **Admin operations:** Supabase service role client, never in browser

## Deployment

- **Hosting:** Vercel (Next.js native)
- **Scheduled jobs:** Vercel Cron (`vercel.json`) — hobby plan: 1 cron/day max
- **Email:** Resend + `react-email` templates
- **File storage:** Supabase Storage (if needed)

## Dependency graph rule

No cycles. Packages always depend in one direction:

```
schemas ← core ← apps/web
```

Shared logic goes in packages. App-specific logic stays in `app/` or `lib/`.

## Commands (universal)

```bash
pnpm install        # install all workspaces
pnpm dev            # dev server at localhost:3000
pnpm build          # build all packages + app
pnpm lint           # lint all workspaces
pnpm typecheck      # tsc --noEmit across all
pnpm test           # run all Vitest tests
```
