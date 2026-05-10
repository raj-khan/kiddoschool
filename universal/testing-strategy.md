# Testing Strategy

## Framework

Vitest. Co-locate tests with source files.

```
lib/scoring/engine.ts
lib/scoring/__tests__/engine.test.ts
```

## Writing tests

- Test behavior, not implementation — assert what a function returns, not how it works internally
- Test names describe the scenario in plain English: `it('returns empty array when no rows match')`
- One logical assertion per test where possible
- No `describe` nesting deeper than two levels
- Independent tests — no shared mutable state between tests
- Avoid `beforeAll`/`afterAll` unless there is no reasonable alternative

## Mocking

- Mock only at system boundaries: HTTP calls, filesystem, clocks, external APIs
- Never mock internal modules — import and use the real implementation
- Use `vi.fn()` for injected dependencies, not module-level mocks
- Supabase calls in service functions: test against real DB or use typed mock at the boundary

## Fixture-based testing for deterministic engines

Business logic that scores or transforms data should be tested with fixtures:

```typescript
// fixtures/gsc-rows.ts — realistic snapshot of input data
// __tests__/engine.test.ts — feed fixture, assert output shape

it('generates striking_distance opportunity for page with avg_position between 4 and 10', () => {
  const result = scoreOpportunities(fixtures.strikingDistance)
  expect(result[0].type).toBe('striking_distance')
  expect(result[0].confidence).toBeGreaterThan(0.5)
})
```

## CI gate

`pnpm test` must pass before any PR merges. Failing test = merge blocker.

## What requires tests

| Code | Test required? |
|---|---|
| Scoring/transform functions in `lib/` | Yes — fixture-based |
| Route handlers | No unit tests — test via integration or manually |
| React components | No — visual review is sufficient for MVP |
| Zod schemas | Yes — valid + invalid fixture for each schema |
| Utility functions with non-trivial logic | Yes |
| Trivial getters/formatters | No |

## What does not require tests

- Next.js page components
- Supabase migration SQL
- Tailwind class composition
- One-liners with no branching logic
