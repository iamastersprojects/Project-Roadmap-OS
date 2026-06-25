# OS Context Bus

Shared context layer so agents across different IDEs (OpenCode, Codex, Claude
Code, Antigravity) can share state without depending on a single provider.

## Concept

Each agent publishes compact context delta records (decisions, evidence, locks,
handoffs) to a shared directory. Other agents read these records on startup or
on demand. The bus is file-based — no runtime, no database, no API.

## How It Works

1. Agent starts → reads recent deltas from shared directory.
2. Agent works → publishes delta records (decision, evidence, lock, handoff).
3. Other agents → discover deltas on their next startup or via explicit refresh.

## File Convention

```
context-events/YYYY-MM-DD-<slug>-<type>.md
```

Each file has YAML frontmatter: `type`, `project`, `agent`, `created`, `summary`.

## When To Use

- Multi-agent projects where two or more IDEs touch the same workspace.
- Long-running work that spans multiple agent sessions.
- Handoffs between OpenCode, Codex, Claude Code, or Antigravity.

## When Not To Use

- Single-agent, single-session work (unnecessary overhead).
- Secrets or private chain-of-thought (never store these in shared context).
