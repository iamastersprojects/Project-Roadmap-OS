# Instalación Desde Cero

## 1. Instalar Requisitos

Instala Git y Node.js 20 o superior. Comprueba:

```bash
git --version
node --version
```

## 2. Obtener Project Roadmap OS

```bash
git clone https://github.com/iamastersprojects/Project-Roadmap-OS.git
cd Project-Roadmap-OS
```

Si el repositorio es privado, inicia sesión en GitHub CLI o usa las
credenciales Git autorizadas por tu organización.

## 3. Verificar La Distribución

```bash
npm test
npm run check:secrets
npm run smoke
```

## 4. Crear Tu Workspace

```bash
node src/cli.mjs init \
  --target ../MiRoadmapOS \
  --name "Mi Roadmap OS" \
  --state new \
  --language es \
  --ide codex,claude-code,opencode,generic
```

Estados:

- `new`: proyecto nuevo que necesita contexto mínimo.
- `pre-ai`: proyecto existente con documentación parcial.
- `legacy`: sistema heredado que primero necesita inventario y restricciones.

## 5. Completar Contexto

Edita:

- `docs/knowledge/business.md`
- `docs/knowledge/product.md`
- `docs/knowledge/tech.md`
- `docs/knowledge/open-questions.md`

No generes un roadmap detallado mientras existan preguntas `blocking` abiertas.

## 6. Abrir En Tu IDE

### Codex

Abre la carpeta del workspace. Codex leerá `AGENTS.md`.

### Claude Code

Abre la carpeta y ejecuta Claude Code. Usa `/roadmap-start`.

### OpenCode

Abre la carpeta; `opencode.jsonc` apunta a `AGENTS.md`.

### Otro Agente

Pídele que lea `AGENTS.md`, `index.md`, `log.md` y
`.agents/ROADMAP-OS.md`.

## 7. Doctor

```bash
node /ruta/Project-Roadmap-OS/src/cli.mjs doctor --target .
```

## 8. Actualizar Sin Sobrescribir

Desde una versión nueva de Project Roadmap OS:

```bash
node /ruta/Project-Roadmap-OS/src/cli.mjs upgrade --target . --ide codex,claude-code
```

`upgrade` crea archivos faltantes. No reemplaza archivos existentes.

## 9. Registrar Roturas

```bash
node /ruta/Project-Roadmap-OS/src/cli.mjs repair \
  --target . \
  --component windows-sandbox \
  --signal "Descripción exacta del fallo"
```

Agrega `--learning` solamente cuando exista una ruta correcta reutilizable.
