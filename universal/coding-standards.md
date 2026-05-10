# Coding Standards

## TypeScript

- Strict mode everywhere — `"strict": true` in every `tsconfig`
- No `any` without a comment explaining why it cannot be avoided
- Named exports only from packages — no `export default` inside `packages/`
- Prefer `type` over `interface` for data shapes; `interface` only for extension points
- Infer types from Zod schemas — do not write matching manual types alongside them
- `const` over `let`, never `var`
- `async`/`await` over `.then()` chains

## Naming

| Thing | Convention |
|---|---|
| Files (non-React) | `kebab-case.ts` |
| React component files | `PascalCase.tsx` |
| Exported functions/constants | `camelCase` |
| Exported types/components | `PascalCase` |
| Zod schemas | `fooSchema` → inferred type `Foo` |
| Test files | `__tests__/foo.test.ts` co-located with `foo.ts` |
| Route handlers | `app/api/[domain]/[action]/route.ts` |
| DB migration files | `NNN_description.sql` (zero-padded, sequential) |

## File size

- Aim for ~100 lines per file — split when longer
- One primary export per file
- No barrel re-export chains deeper than one level
- No circular imports — dependency graph must be a DAG

## Comments

- No comments explaining what the code does — use clear names instead
- Comments only for: non-obvious constraints, invariants, bug workarounds
- No `// TODO` committed to main — open a GitHub issue instead

## React

- Functional components only, server components by default
- Add `"use client"` only when state, effects, or browser APIs are needed
- Props typed with `type`, not `interface`
- No prop spreading except when forwarding to native HTML elements
- No inline `style` objects in shared components — use CSS custom properties
- Inline styles acceptable in one-off page layouts where Tailwind isn't suitable

## Formatting

Prettier handles all whitespace. Do not manually adjust.

Baseline config:
```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

## Principles (non-negotiable)

- Don't add error handling for scenarios that can't happen — trust framework guarantees
- Don't add features, refactor, or abstract beyond what the task requires
- Don't design for hypothetical future requirements
- Three similar lines is better than a premature abstraction
- No half-finished implementations — finish it or don't add it
