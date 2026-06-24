# Project Roadmap OS Distribution Design

## Goal

Publish a clean, reproducible Human-Agent Roadmap OS that can be installed from
zero on Windows, macOS, and Linux and used from Codex, Claude Code, OpenCode, or
generic agent-capable IDEs.

## Product Boundary

The distribution contains methodology, schemas, starter templates, a portable
CLI, IDE adapters, and verification. It does not contain Rafa's projects,
Engram exports, tokens, secrets, generated reports, private context, media, or
the complete ObsidianBrain vault.

## Architecture

The package uses a portable core plus thin IDE adapters:

- `src/`: dependency-free Node.js CLI and reusable operations.
- `core/`: canonical starter methodology and templates copied into new OS
  workspaces.
- `adapters/`: Codex, Claude Code, OpenCode, and generic-agent instructions.
- `installers/`: PowerShell and POSIX launchers around the same Node CLI.
- `tests/`: black-box tests against disposable directories.
- `docs/`: installation, security, architecture, and IDE guidance.

Node.js is the source of truth because it is portable across the target
operating systems. Shell scripts are launchers, not independent implementations.

## Commands

### `roadmap-os init`

Creates a new workspace with minimum methodology, roadmap directories, learning
directories, templates, a config manifest, and selected IDE adapters.

### `roadmap-os upgrade`

Creates missing files only. It never overwrites existing human-owned context
unless an explicit future migration supports a reviewed state diff.

### `roadmap-os doctor`

Checks runtime, Git, required files, directory structure, config validity, and
adapter installation. It can emit human-readable output or JSON.

### `roadmap-os repair`

Captures a concrete broken tool or workflow as a Roadmap repair item. It may
also create a reusable learning record when `--learning` is supplied. This is
the durable route for failures involving sandboxing, Playwright, WSL,
PowerShell, Node, MCPs, CLIs, or methodology scripts.

### `roadmap-os drift`

Reads `roadmap-os.config.json`, compares changed code paths with their owned
documentation paths, and reports missing documentation updates. It is
informational by default and becomes blocking only through an explicit
project-level decision.

## Initial Context Model

Every installed workspace starts with:

- `AGENTS.md`
- `index.md`
- append-only `log.md`
- `docs/knowledge/business.md`
- `docs/knowledge/product.md`
- `docs/knowledge/tech.md`
- `docs/knowledge/open-questions.md`
- Roadmap, Learning, evidence, and context-pack directories

Project state is one of `new`, `pre-ai`, or `legacy`. Detailed planning is not
ready while blocking questions remain open unless a human resolves, accepts an
evidence-backed assumption, or explicitly defers them.

## IDE Adapters

- Codex: `AGENTS.md` plus `.codex/README.md`.
- Claude Code: `CLAUDE.md` and bounded project commands.
- OpenCode: `AGENTS.md`, `opencode.jsonc`, and command prompts.
- Generic: `AGENTS.md` and a concise startup prompt.

Adapters may explain how to call the CLI. They do not fork the methodology.

## Safety

- No automatic commit or push hooks.
- No plaintext secrets.
- No copying of user vault data.
- No external writes during `init`, `upgrade`, `doctor`, `repair`, or `drift`.
- Existing files are preserved.
- Publication runs a secret-pattern scan and clean-clone installation smoke.

## Testing

Black-box Node tests use disposable directories and verify:

1. clean initialization;
2. repeated initialization preserves user edits;
3. upgrade creates missing files only;
4. doctor reports missing and healthy states;
5. repair writes valid durable records;
6. drift reports missing docs and passes aligned changes;
7. adapters install only when selected.

## External Repository Intake

Useful patterns absorbed from `stagemidia21/dobralabs-ccos-ratos`:

- one-command onboarding;
- one question at a time during human setup;
- explicit start, map, and sync workflows;
- local versus reusable skill distinction;
- search existing capabilities before creating new ones.

Rejected patterns:

- automatic `git add -A`, commit, and push on every session stop;
- storing tokens inside context folders;
- coupling the OS to one provider, business, or publishing pipeline;
- copying domain-specific skills into the Roadmap OS core.

## Rollback

Installation writes only inside the selected target. Rollback is deleting that
new target or reverting explicitly listed adapter files. Upgrade produces a
report of created and preserved files.
