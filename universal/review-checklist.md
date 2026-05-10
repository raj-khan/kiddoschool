# Pre-Merge Review Checklist

Run in order. Stop and fix if any step fails.

## Automated gates

```bash
pnpm lint        # zero errors
pnpm typecheck   # zero errors
pnpm test        # all pass
pnpm build       # succeeds
```

## Security

- [ ] No `.env` files or real credentials staged (`git diff --staged`)
- [ ] No `access_token`, `refresh_token`, or service role key passed to client components
- [ ] New API routes have auth check at the top
- [ ] User input validated before use (Zod or manual type-narrowing)
- [ ] No `dangerouslySetInnerHTML` with non-static content
- [ ] External OAuth: state cookie created and validated

## Code quality

- [ ] No `any` without an explanatory comment
- [ ] Named exports only from `packages/` and `lib/`
- [ ] No circular imports introduced
- [ ] New business logic co-located with tests

## Database

- [ ] New tables have RLS enabled and policies defined
- [ ] Migration file is sequentially numbered
- [ ] No `select("*")` in server components or route handlers that pass data to client

## API

- [ ] New route handlers return typed responses
- [ ] Errors surfaced to users go through `toUserErrorMessage()` or equivalent sanitizer
- [ ] Atomic DB updates used where race conditions are possible (`.neq().update().select()`)

## Git

- [ ] Branch is off latest `main`
- [ ] No AI co-author lines in commits
- [ ] No `--no-verify` used
- [ ] No `pnpm-lock.yaml` changes caused by accidental installs

## Final check

- [ ] New env vars documented in `.env.example`
- [ ] No half-finished implementations (feature flags, commented-out code, placeholder returns)
