# API Conventions

## Route handlers

- One file per endpoint: `app/api/[domain]/[action]/route.ts`
- Export named HTTP method functions: `export async function GET(request: Request)`
- Always return `NextResponse.json()`
- Auth check at the top of every handler before any DB call
- Validate input at the boundary — never trust `request.json()` without checking shape

```typescript
export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = (await request.json()) as Record<string, unknown>;
  const field = typeof raw?.field === "string" ? raw.field.trim() : "";
  if (!field) return NextResponse.json({ error: "field is required" }, { status: 400 });

  // ... business logic
}
```

## Supabase client selection

| Context | Client | File |
|---|---|---|
| Server components / route handlers | `createClient()` | `lib/supabase/server.ts` |
| Client components | `createBrowserClient()` | `lib/supabase/client.ts` |
| Admin / cron (bypasses RLS) | `createAdminClient()` | `lib/supabase/admin.ts` |

Never import admin client from `"use client"` files.  
Never use browser client in server components.

## RSC payload security

Never pass sensitive fields to client components via props.

```typescript
// Wrong — tokens leak into RSC payload
const { data } = await supabase.from("connections").select("*")

// Correct — select only UI-safe fields
const { data } = await supabase.from("connections")
  .select("id, status, google_email, last_synced_at")
```

## Zod schemas

- All schemas live in `packages/schemas` (or `lib/schemas` in single-app projects)
- Types always inferred: `export type Foo = z.infer<typeof fooSchema>`
- Never write `type Foo = { ... }` manually if a schema exists
- Schema naming: `camelCase` + `Schema` suffix: `siteSchema`, `taskSchema`

## Error handling

- Only validate at system boundaries (user input, external APIs, webhooks)
- Internal code and framework guarantees don't need defensive guards
- Throw descriptive `Error` objects from service functions — route handlers catch and format
- Use `toUserErrorMessage()` pattern to sanitize internal error strings before sending to client

## External API calls

- Always check `response.ok` before parsing body
- Handle 401, 403, 429 explicitly — don't lump them into generic errors
- Refresh tokens before they expire — add 60s buffer
- Persist refreshed tokens back to DB immediately so next call doesn't also refresh

## Named exports only

```typescript
// Correct
export function doThing() {}
export type { Foo }

// Wrong — no default exports from packages or lib
export default function doThing() {}
```

Exception: Next.js App Router pages require `export default` — applies only in `app/`.
