---
roadmap_type: artifact
created: 2026-06-24
updated: 2026-06-24
status: recorded
priority: medium
source: Project Roadmap OS CLI
project: Project Roadmap OS
tags: [drift, documentation, pilot, evidence]
---

# Documentation Drift Pilot

## Hypothesis

Explicit code-to-document ownership can identify likely stale context without
adding another runtime or blocking normal work.

## Scenario 1: Missing Documentation

Changed files:

- `src/cli.mjs`

Result:

- `ok: false`
- missing `docs/ARCHITECTURE.md`
- missing `README.md`

## Scenario 2: Aligned Change

Changed files:

- `src/cli.mjs`
- `docs/ARCHITECTURE.md`
- `README.md`

Result:

- `ok: true`
- no findings

## Decision

Adopt the detector as informational by default. A project may enable `--strict`
only after its ownership rules have been evaluated for false positives and
maintenance cost.
