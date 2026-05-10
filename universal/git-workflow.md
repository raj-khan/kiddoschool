# Git Workflow

## Branch rules

- Never push directly to `main`
- Every change — including hotfixes — goes through a feature branch + PR
- Branch naming: `feat/short-description`, `fix/short-description`, `refactor/short-description`
- One logical change per branch

## Commit format

Imperative mood. Short subject line. No period at the end.

```
Add draft_reply tool with disclosure flag

Optional body when the why isn't obvious from the subject.
```

Prefixes:

| Prefix | Use for |
|---|---|
| `Add` | New feature |
| `Fix` | Bug fix |
| `Update` | Change to existing behavior |
| `Remove` | Deletion |
| `Refactor` | No behavior change |
| `Test` | Test-only change |

## Staging

```bash
# Correct — stage specific files
git add app/api/feature/route.ts lib/feature/service.ts

# Wrong — never do this
git add .
git add -A
```

## Commit rules

- No AI co-author lines or AI signatures in commit messages
- No file lists in commit message bodies
- No `--no-verify` to skip hooks — fix the underlying issue
- No amending published commits
- Keep commits small — one logical change per commit

## PR process

1. Branch from latest `main`
2. Run `pnpm lint && pnpm typecheck && pnpm test` — must all pass
3. Open PR with short title (<70 chars) and summary of what + why
4. No force push to shared branches
5. Merge via GitHub — squash or merge commit, never rebase on shared branches

## Do not commit

- `.env`, `.env.local`, or any file containing real credentials
- `node_modules/`, `dist/`, `.next/`
- `pnpm-lock.yaml` changes caused by accidental `pnpm install` in a subdir
