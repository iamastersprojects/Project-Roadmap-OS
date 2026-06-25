# Glob Pattern Pack

Lightweight file-discovery decision tree for agents working in any codebase.

## Decision Tree

| Situation | Tool | Reason |
|---|---|---|
| Know the filename or pattern (<100 expected) | `glob` | Fast pattern matching, case-insensitive by default |
| Know the filename or pattern (>=100 expected) | `find` / `Get-ChildItem` | Glob tools silently truncate at 100 results |
| Searching file **content** | `grep` / `rg` | Content, not filename |
| Finding a symbol definition | `code_def` (GBrain) | Structural, not text |
| Finding symbol callers | `code_callers` (GBrain) | Call graph, not text |

## Checklist

- [ ] Know what you're looking for (filename or content?)
- [ ] Estimate result count (under or over 100?)
- [ ] Pick tool from decision tree
- [ ] Verify: does the result match your intent?

## Traps

- Glob tools often have a hard cap (e.g., 100 results) with silent truncation.
- Grep is case-insensitive by default on most systems.
- Prefix matching: `glob` matches `log*` to `logger.go`, not just `log.go`.
