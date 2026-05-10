# Coding Agent Workflow

How to work effectively with Claude Code (or any coding agent) on this stack.

## Briefing an agent

Be specific. Agents produce generic work from generic prompts.

Good brief:
> "Add a `POST /api/sites/disconnect` route that deletes the row from `gsc_connections` where `user_id = auth.uid()` and redirects to `/dashboard/sites`. Auth check at top. No cascade needed — FK handles cleanup."

Bad brief:
> "Add a disconnect endpoint"

Always include: the exact file path, the exact table/column names, the expected behavior, and any edge cases to handle.

## What agents do well

- Implementing a described spec with known conventions
- Refactoring within a single file
- Writing tests for a described behavior
- Tracing a bug with a specific error message
- Reviewing code against a checklist

## What agents do poorly

- Making product decisions (tell them the decision, not the dilemma)
- Knowing when to stop (they over-engineer if not constrained)
- Catching their own mistakes across multiple files

## Rules for agent tasks

- One task per agent run — don't chain multiple unrelated changes
- Give the agent the relevant file contents or line numbers upfront
- After agent writes code: read the diff before accepting
- Run `pnpm typecheck` immediately — agents frequently introduce type errors
- Don't let agents `git add -A` or `git add .` — always review staged files

## CLAUDE.md structure

Every project has a `CLAUDE.md` at the root. It is the agent's primary context.
It must contain:

1. **Product one-liner** — what this is and who it's for
2. **Stack** — exact tools (not "React" but "Next.js 15 App Router")
3. **Commands** — copy-pasteable commands
4. **Architecture** — folder structure, dependency graph, key invariants
5. **Rules** — the short list of hard constraints
6. **Do not build** — scope boundaries for the current version
7. **Do not touch** — files that must not be modified

Keep CLAUDE.md under 100 lines. Agents read it on every turn — bloat degrades attention.

## Agent command files (`.agent/commands/`)

Short markdown scripts that tell the agent what to do for common workflows:

- `review.md` — code review checklist
- `ship.md` — pre-merge gate (lint, typecheck, test, build)
- `fix-issue.md` — how to investigate and fix a reported bug

## Agent persona files (`.agent/agents/`)

Define specialized agent personas:

- `code-reviewer.md` — focus areas, output format
- `security-auditor.md` — attack surface, severity levels

## Single source of truth

`agent.md` (or `CLAUDE.md`) is the canonical instructions file.
If you use multiple agents (Claude, Copilot, Cursor), use `@agent-anatomy/agent` to sync one source to all targets:

```bash
npx @agent-anatomy/agent   # syncs agent.md → CLAUDE.md, AGENTS.md, .cursorrules, etc.
```

Edit only the source file — never edit generated targets directly.
