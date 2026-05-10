# Security Guidelines

## Secrets

- No API keys, tokens, passwords, or secrets in source code — ever
- `.env.example` contains only placeholder values: `SOME_KEY=your_key_here`
- `.env` and `.env.local` are gitignored — verify before every commit with `git diff --staged`
- Rotate credentials immediately if accidentally committed — don't just delete and amend

## RSC payload / token leakage

Never send OAuth tokens or secrets to client components via props or RSC payload.

```typescript
// Wrong — access_token, refresh_token go into RSC payload
const { data } = await supabase.from("connections").select("*")
<ClientCard connection={data} />

// Correct — select only display fields
const { data } = await supabase.from("connections")
  .select("id, status, google_email, last_synced_at")
```

Define a separate `*Safe` interface for client component props containing only UI-safe fields.

## Input validation

- Validate all external input at system boundaries — user input, webhooks, external API responses
- Use Zod schemas for request body validation on API routes
- For simple cases, manual type-narrowing is fine: `typeof raw?.field === "string"`
- Never pass user-supplied strings to `eval()`, `new Function()`, or dynamic `import()`
- Trim and enforce length limits on all user-supplied text fields

## Supabase RLS

- Every table must have Row Level Security enabled
- RLS policies must be written before any data is inserted
- Use `auth.uid()` in policies — never rely on application-level filtering alone
- Admin client (`SERVICE_ROLE_KEY`) bypasses RLS — use only in trusted server contexts (cron, admin routes)
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser

## React / XSS

- No `dangerouslySetInnerHTML` with non-static content
- No user-supplied strings injected into CSS custom properties at runtime
- All external links (`<a href>` to third-party domains): `rel="noopener noreferrer"`
- Images from external URLs: validate domain allowlist before rendering

## OAuth flows

- Use `state` parameter with CSRF validation (random UUID stored in httpOnly cookie)
- State cookie: `httpOnly: true`, `sameSite: "lax"`, `secure: true` in production
- Delete state cookie after callback regardless of success or failure
- Never log access tokens or refresh tokens
- Persist refreshed tokens back to DB immediately — don't leave stale tokens

## Concurrency / race conditions

Avoid TOCTOU patterns in status checks:

```typescript
// Wrong — read then write creates a race
const { data } = await supabase.from("jobs").select("status").eq("id", id).single()
if (data.status === "running") return conflict
await supabase.from("jobs").update({ status: "running" }).eq("id", id)

// Correct — atomic claim
const { data } = await supabase
  .from("jobs")
  .update({ status: "running" })
  .neq("status", "running")
  .eq("id", id)
  .select("id")
  .maybeSingle()
if (!data) return conflict
```

## Dependencies

- Review every new dependency before adding
- Run `pnpm audit` before merging PRs that change `pnpm-lock.yaml`
- Do not add packages with known critical CVEs
- Prefer packages with built-in TypeScript types
