# Seguridad

## Datos Excluidos

La distribución no debe incluir:

- API keys, tokens, passwords o private keys;
- exports de memoria personales;
- datos de clientes;
- logs de conversaciones;
- repositorios o roadmap privados;
- binarios multimedia.

## Gates Humanos

Requieren aprobación explícita:

- installs y updates;
- MCP/plugin activation;
- secrets y paid APIs;
- commit, push y PR;
- deploy y publicaciones;
- borrado o migraciones destructivas.

## Reporte De Vulnerabilidades

No abras un issue público con secretos o datos privados. Contacta al owner del
repositorio mediante un canal privado y rota cualquier credencial expuesta.

## Verificación Antes De Publicar

```bash
npm run check:secrets
npm test
npm run smoke
```
