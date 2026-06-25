# Engineering Pattern Packs

Lightweight checklists for common engineering workflows. Each pack is a
concise reference an agent reads before starting a specific kind of work.

## Available Packs

| Pack | Use When |
|---|---|
| Verification Loop | Before completion, PR, deploy, or handoff |
| Coding Standards | Refactors, new modules, code review |
| E2E Testing | Browser journeys, Playwright/Cypress, visual QA |
| Deployment | Releases, CI/CD, rollback, health checks |
| Docker | Dockerfiles, Compose, networking, volumes |

## Creating A Pack

1. Create a markdown file in `docs/` or `wiki/concepts/`.
2. Start with a one-line trigger (when to use this).
3. List steps as a checklist (agent checks each item).
4. End with verification criteria.

## Rule

Read the pack before starting the work, not after. Packs are proactive
guardrails, not post-mortem checklists.
