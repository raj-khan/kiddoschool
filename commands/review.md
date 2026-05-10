# Review Command

Review staged changes: `git diff --staged`

Check each category. Reference exact file paths and line numbers.

**1. Correctness**
- Does the code do what it claims?
- Are edge cases handled (empty arrays, null inputs, missing rows)?
- Are error paths returning appropriate HTTP status codes?

**2. Security**
- No OAuth tokens or secrets in RSC payload or client component props
- Auth check at top of every new route handler
- New tables have RLS enabled and policies
- User input validated before use
- State cookie validated in OAuth callbacks
- No TOCTOU races in status checks

**3. Types**
- No `any` without explanatory comment
- No unsafe `as Foo` assertions that hide runtime errors
- Types inferred from Zod schemas — no manual duplicates

**4. Scope**
- No features added beyond what was asked
- No premature abstractions
- No half-finished code

**5. Tests**
- New business logic in `lib/` has matching Vitest tests
- Tests assert behavior, not implementation

**6. Git hygiene**
- No secrets staged
- No `pnpm-lock.yaml` touched unnecessarily

Output format — one line per finding:

```
[BLOCKING]  path/to/file.ts:42  — problem. required action.
[WARNING]   path/to/file.ts:88  — problem. should fix before merge.
[NITPICK]   path/to/file.ts:101 — optional improvement.
```
