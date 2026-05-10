# Deployment

## Platform

Vercel. Native Next.js support — no custom server needed.

## Environment variables

Group by concern. All must be set in Vercel dashboard for Production environment.

### Required for every project

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App URL (used in OAuth redirects, absolute links in emails)
NEXTAUTH_URL=https://yourdomain.com
# OR
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### OAuth (if applicable)

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Email (if applicable)

```
RESEND_API_KEY=
RESEND_FROM_EMAIL=Your App <hello@yourdomain.com>
```

### Cron authorization

```
CRON_SECRET=          # Random string — Vercel passes as Bearer token to cron routes
```

## Adding env vars to Vercel

After adding or changing env vars in Vercel dashboard:
- **Redeploy** the project — running deployments use the snapshot from build time
- Verify env var is set for **Production** environment, not just Preview/Development

## Cron jobs

Define in `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/weekly-reports", "schedule": "0 9 * * *" }
  ]
}
```

Hobby plan: 1 cron per day max. Pro plan: up to 20, runs every minute.

Cron route authorization pattern:

```typescript
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim()
  return bearer === secret
}
```

## Database migrations

Supabase migrations run manually or via CI:

```bash
supabase db push        # push local migrations to remote
supabase db reset       # reset local DB and reapply all migrations
```

Naming: `supabase/migrations/NNN_description.sql` — sequential, never rename after merge.

## Build checklist before every deploy

```bash
pnpm lint        # zero lint errors
pnpm typecheck   # zero type errors
pnpm test        # all tests pass
pnpm build       # build succeeds
```

Check:
- No `.env.local` or secrets staged
- New env vars documented in `.env.example`
- New migrations have RLS policies
