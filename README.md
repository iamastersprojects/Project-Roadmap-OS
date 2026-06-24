# Project Roadmap OS

Sistema operativo portátil para que humanos y agentes compartan roadmap,
contexto, evidencia, reparaciones y aprendizaje sin depender de una sola IDE o
proveedor de LLM.

Funciona con Codex, Claude Code, OpenCode y agentes genéricos que lean
`AGENTS.md`.

## Qué Instala

- contexto mínimo de negocio, producto y tecnología;
- Roadmap OS para proyectos, iniciativas, items, ciclos y evidencia;
- Learning OS para errores, fixes y mejoras reutilizables;
- registro de roturas operativas;
- detector informativo de deriva entre código y documentación;
- adaptadores delgados por IDE;
- doctor y actualización conservadora sin sobrescritura.

No incluye memorias personales, proyectos privados, API keys, exports de
Engram, medios, logs históricos ni el vault de otra persona.

## Requisitos

- Node.js 20 o superior.
- Git recomendado, pero no obligatorio para `init`, `doctor` y `repair`.

## Instalación Rápida

```bash
git clone https://github.com/iamastersprojects/Project-Roadmap-OS.git
cd Project-Roadmap-OS
npm test
node src/cli.mjs init --target ../MiRoadmapOS --name "Mi Roadmap OS" --state new --ide codex,claude-code,opencode,generic
node src/cli.mjs doctor --target ../MiRoadmapOS
```

En Windows también puedes usar:

```powershell
.\installers\install.ps1 -Target "$HOME\Documents\MiRoadmapOS" -Name "Mi Roadmap OS" -State new -Ide "codex,claude-code"
```

En macOS/Linux:

```bash
./installers/install.sh "$HOME/Documents/MiRoadmapOS" "Mi Roadmap OS" new "codex,opencode"
```

Consulta [docs/INSTALL.md](docs/INSTALL.md) para el paso a paso completo.

## Comandos

```text
roadmap-os init
roadmap-os upgrade
roadmap-os doctor
roadmap-os repair
roadmap-os drift
```

Ejemplo cuando una herramienta se rompe:

```bash
node src/cli.mjs repair \
  --target ../MiRoadmapOS \
  --component playwright \
  --signal "El browser smoke no pudo iniciar Chromium" \
  --severity high \
  --learning "Verificar browser, binario y permisos antes de cambiar el test"
```

Ejemplo de deriva:

```bash
node src/cli.mjs drift --target . --base HEAD~1
```

Por defecto informa y no bloquea. Usa `--strict` únicamente cuando el proyecto
haya demostrado que sus reglas de ownership tienen pocos falsos positivos.

## Principios

- Una metodología, varios adaptadores.
- Crear faltantes sin pisar contexto humano.
- Evidencia antes de afirmar que algo funciona.
- Capturar roturas concretas en roadmap y lessons reutilizables en learning.
- No instalar runtimes paralelos cuando alcanza con absorber un patrón.
- No guardar secretos en Markdown, Git, logs o memoria compartida.

## Origen Metodológico

Project Roadmap OS combina patrones propios de Human-Agent Roadmap OS,
LLM Wiki, OpenSpec/Gentle, Learning OS, context packs, agent briefs, repair
backlog, task harnesses y evaluación por evidencia.

También absorbe selectivamente patrones públicos como onboarding guiado,
contexto mínimo, skills locales/globales y búsqueda antes de creación. No
adopta auto-push silencioso ni almacenamiento de tokens en carpetas de contexto.

## Licencia

MIT.
