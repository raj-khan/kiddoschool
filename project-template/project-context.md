# Project Context — {{PROJECT_NAME}}

Fill this file in for each new project. It is the project-specific layer that sits
on top of the universal boilerplate conventions.

---

## Product

**What it is:**
{{PRODUCT_DESCRIPTION}}

**Who it's for:**
{{TARGET_USER}}

**Core problem it solves:**
{{CORE_PROBLEM}}

**MVP definition of done:**
{{MVP_DOD}}
A user can: {{USER_JOURNEY}}

---

## Domain terminology

Define terms specific to this product so agents use consistent language:

| Term | Meaning |
|---|---|
| {{TERM_1}} | {{DEFINITION_1}} |
| {{TERM_2}} | {{DEFINITION_2}} |

---

## Key data models

List the primary DB tables and their purpose (not full schema — just intent):

| Table | Purpose |
|---|---|
| `{{TABLE_1}}` | {{PURPOSE_1}} |
| `{{TABLE_2}}` | {{PURPOSE_2}} |

---

## External integrations

| Service | What it's used for | Auth method |
|---|---|---|
| {{SERVICE_1}} | {{USE_CASE_1}} | OAuth / API key |

---

## Business rules

Constraints that are not obvious from the code:

- {{RULE_1}}
- {{RULE_2}}

---

## Scope boundaries

### Do not build in {{VERSION}}

- {{DEFERRED_1}}
- {{DEFERRED_2}}

### Do not touch

- {{FROZEN_FILE_1}} — {{REASON}}

---

## Build order

1. {{STEP_1}}
2. {{STEP_2}}
3. {{STEP_3}}
