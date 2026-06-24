# Adaptadores De IDE

## Contrato

Los adaptadores no son forks del OS. Solamente indican a cada IDE:

- qué archivos leer;
- cómo iniciar una sesión;
- cómo registrar una rotura;
- cuáles son los gates humanos.

## Codex

Usa `AGENTS.md` y `.codex/README.md`.

## Claude Code

Usa `CLAUDE.md` y comandos acotados bajo `.claude/commands/`.

## OpenCode

Usa `opencode.jsonc` y `.opencode/commands/`.

## Genérico

Usa `AGENTS.md` y `.agents/ROADMAP-OS.md`.

Ningún adaptador debe activar commits, pushes, deploys, instalaciones, APIs
pagas o secretos de forma automática.
