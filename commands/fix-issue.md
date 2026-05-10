# Fix Issue Command

Given a bug report or error message, investigate and fix it.

## Step 1 — Locate

Identify the exact file and line causing the error.

- Grep for the error string or function name
- Check the route handler that handles the failing request
- Check the service function it calls
- Check the Supabase query (table name, column name, filter)

## Step 2 — Understand

Before writing any code, state clearly:

- What is the expected behavior?
- What is the actual behavior?
- What is the root cause?

Do not guess. Read the code. If the cause is not clear, say so.

## Step 3 — Fix

Fix only the root cause. Do not:

- Refactor surrounding code
- Add unrelated improvements
- Change behavior beyond what the bug report requires

## Step 4 — Verify

```bash
pnpm typecheck   # confirm no new type errors
pnpm test        # confirm no regressions
```

If the bug should have been caught by a test, add a test that would have caught it.

## Step 5 — Commit

Small, focused commit:

```
Fix [brief description of what was wrong]

One sentence explaining the root cause if not obvious from the subject.
```
