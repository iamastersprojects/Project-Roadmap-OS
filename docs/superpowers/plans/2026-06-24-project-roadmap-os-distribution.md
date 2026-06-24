# Project Roadmap OS Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a portable Roadmap OS with safe installation, repair capture, and documentation-code drift detection.

**Architecture:** A dependency-free Node CLI owns all cross-platform behavior. Static core files and IDE adapters are installed from package assets; PowerShell and Bash only invoke the CLI.

**Tech Stack:** Node.js 20+, `node:test`, Git, Markdown, JSON, PowerShell, POSIX shell.

---

### Task 1: Define CLI Contracts

**Files:**
- Create: `package.json`
- Create: `src/cli.mjs`
- Create: `tests/cli.test.mjs`

- [ ] Write black-box tests for `init`, no-overwrite, `doctor`, `repair`, and `drift`.
- [ ] Run `node --test` and confirm failures are caused by the missing CLI.
- [ ] Add argument parsing and command routing.
- [ ] Run focused tests until command routing passes.

### Task 2: Implement Portable Workspace Bootstrap

**Files:**
- Create: `src/lib/workspace.mjs`
- Create: `core/starter/**`
- Modify: `tests/cli.test.mjs`

- [ ] Add tests for required files and selected adapters.
- [ ] Implement create-missing-only asset installation.
- [ ] Add `new`, `pre-ai`, and `legacy` project state to generated context.
- [ ] Verify repeated initialization preserves a sentinel edit.

### Task 3: Implement Doctor And Repair Capture

**Files:**
- Create: `src/lib/doctor.mjs`
- Create: `src/lib/repair.mjs`
- Modify: `tests/cli.test.mjs`

- [ ] Add failing tests for healthy/missing workspaces.
- [ ] Add failing tests for repair and optional learning records.
- [ ] Implement deterministic reports with no external writes.
- [ ] Verify generated frontmatter and evidence sections.

### Task 4: Implement Documentation Drift Detection

**Files:**
- Create: `src/lib/drift.mjs`
- Create: `roadmap-os.config.example.json`
- Modify: `tests/cli.test.mjs`

- [ ] Add a failing test for code changed without owned docs.
- [ ] Add a passing test for aligned code and documentation changes.
- [ ] Implement Git changed-file discovery and explicit `--changed` fixtures.
- [ ] Keep exit code informational by default and support `--strict`.

### Task 5: Add IDE Adapters And Installers

**Files:**
- Create: `adapters/codex/**`
- Create: `adapters/claude-code/**`
- Create: `adapters/opencode/**`
- Create: `adapters/generic/**`
- Create: `installers/install.ps1`
- Create: `installers/install.sh`

- [ ] Add adapter installation assertions.
- [ ] Ensure adapters refer to the same core contracts.
- [ ] Add PowerShell and Bash launchers.
- [ ] Verify installers in disposable directories.

### Task 6: Documentation And Security

**Files:**
- Create: `README.md`
- Create: `docs/INSTALL.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/SECURITY.md`
- Create: `.gitignore`
- Create: `LICENSE`

- [ ] Document zero-to-working installation for each OS and IDE.
- [ ] Document private data exclusions and secret policy.
- [ ] Add repository secret-pattern scan.
- [ ] Run full tests and package smoke.

### Task 7: Publish And Validate

**Files:**
- Modify: repository Git history

- [ ] Review `git diff` and secret scan.
- [ ] Commit intentionally.
- [ ] Push `main` to `iamastersprojects/Project-Roadmap-OS`.
- [ ] Clone the remote into a fresh directory.
- [ ] Run tests, init, doctor, repair, and drift smoke from the clean clone.

### Task 8: Windows Sandbox Repair And Real Drift Pilot

**Files:**
- Create/update: ObsidianBrain repair and learning records
- Create: Roadmap OS sandbox diagnostic evidence

- [ ] Reproduce the Windows sandbox failure with the smallest write fixture.
- [ ] Inspect Codex configuration and official guidance without exposing secrets.
- [ ] Repair configuration if locally controllable; otherwise document the exact external limitation and safe fallback.
- [ ] Verify `apply_patch`, shell writes, Node, PowerShell, Playwright, and WSL probes.
- [ ] Run `roadmap-os drift` against the real Project Roadmap OS repo.
- [ ] Record results in Roadmap OS, Engram, and Context Bus.
