# Standard Folder Structure

## Next.js App Router (single-app layout)

```
app/
  (auth)/             # Auth routes: /login, /signup, /reset-password
  (dashboard)/        # Protected dashboard routes
    dashboard/
      page.tsx        # Main dashboard
      [feature]/
        page.tsx
  api/
    [domain]/
      route.ts        # Route handler — one file per endpoint
  layout.tsx
  page.tsx            # Public landing page

components/
  dashboard/          # Dashboard-only components
  [feature]/          # Feature-scoped components
  ui/                 # Generic UI primitives

lib/
  supabase/
    client.ts         # Browser client
    server.ts         # Server client (cookies)
    admin.ts          # Service role client (server-only)
  google/             # External OAuth integrations
  email/              # Email rendering + send helpers
  [domain]/           # Domain logic (scoring, sync, reports, etc.)
  user-facing-errors.ts

types/
  database.ts         # Hand-written DB row types (supplement generated types)

supabase/
  migrations/         # 001_init.sql, 002_rls.sql, …

public/
content/              # MDX/MD blog or docs content (if needed)
```

## Monorepo layout (multi-package)

```
packages/
  schemas/            # Zod schemas + inferred TS types. Zero logic.
  core/               # Business logic. Deterministic, no LLM, no network.
  react/              # React component library (if applicable)
apps/
  web/                # Next.js app (imports from packages)
```

## Key conventions

- Route handler per file: `app/api/[domain]/[action]/route.ts`
- Server components by default — add `"use client"` only where state/effects needed
- Co-locate page-specific components in `components/[feature]/` not inside `app/`
- Never put business logic in `app/` — it belongs in `lib/` or `packages/core`
- `lib/supabase/admin.ts` must never be imported from client components
