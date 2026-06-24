# Arquitectura

## Núcleo

`src/cli.mjs` enruta comandos hacia módulos pequeños:

- `workspace.mjs`: instalación y upgrade create-missing-only.
- `doctor.mjs`: diagnóstico determinista.
- `repair.mjs`: repair backlog y learning opcional.
- `drift.mjs`: ownership y deriva documentación-código.

## Assets

`core/starter/` contiene la estructura mínima copiable. `adapters/` agrega
instrucciones específicas sin duplicar reglas centrales.

## Flujo De Contexto

1. El humano define conocimiento mínimo.
2. Los agentes leen `AGENTS.md`, índice, log y contexto del proyecto.
3. El roadmap conserva futuro trabajo y estado.
4. Artifacts/evidence prueban lo ejecutado.
5. Learning conserva rutas reutilizables.
6. Repair backlog conserva componentes rotos hasta verificarlos.

## Deriva

`roadmap-os.config.json` relaciona patrones de código con documentos:

```json
{
  "ownership": [
    {
      "code": ["src/**"],
      "docs": ["docs/ARCHITECTURE.md"]
    }
  ]
}
```

El detector analiza cambios explícitos o `git diff`. No intenta decidir si el
contenido documental es correcto; detecta que una superficie potencialmente
afectada no cambió.
