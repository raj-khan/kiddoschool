# Next.js + Supabase SaaS Boilerplate

Reusable architecture, coding-agent workflow, and engineering conventions extracted from production SaaS projects.

## How to use

1. Copy `project-template/CLAUDE.md.template` → root `CLAUDE.md`, fill in `{{PLACEHOLDERS}}`
2. Copy `project-template/.env.example.template` → `.env.example`
3. Copy `.agent/` folder structure into the new repo
4. Replace agent persona references (project name, domain, brand rules) in `agents/`
5. Keep `universal/` unchanged — these rules apply to every project

## Structure

```
boilerplate/
  universal/              # Stack-agnostic rules — copy verbatim
    stack.md              # Canonical tech stack and tool choices
    folder-structure.md   # Standard app layout
    coding-standards.md   # TypeScript, naming, file size, comments
    api-conventions.md    # Exports, Zod schemas, error handling
    git-workflow.md       # Branches, commits, PRs
    testing-strategy.md   # Vitest, co-locate, behavior-first
    security-guidelines.md# Secrets, RLS, input validation, XSS
    deployment.md         # Vercel, env vars, cron, migrations
    review-checklist.md   # Pre-merge gate
    agent-workflow.md     # How to brief and use coding agents
  agents/                 # Persona definitions for agent roles
    code-reviewer.md
    security-auditor.md
  commands/               # Slash-command scripts for agents
    review.md
    ship.md
    fix-issue.md
  project-template/       # Fill-in-the-blank starters for each new project
    CLAUDE.md.template
    .env.example.template
    project-context.md
```

## Two-layer model

| Layer | What goes here | Changes per project? |
|---|---|---|
| Universal | Conventions, stack, agent workflow | Never |
| Project-specific | Product context, brand, schema, build order | Always |

Universal rules live in `universal/`. Project context lives in `CLAUDE.md` and `project-template/project-context.md`.
