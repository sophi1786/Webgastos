# Mi Libreta

App mobile-first para llevar tus gastos personales de julio a diciembre 2026. React + Vite, 100% estática, todo se guarda en `localStorage` (sin backend, sin login).

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

`vite.config.js` usa `base: './'` para que los assets carguen bien en rutas tipo `usuario.github.io/repo/`.

## Deploy a GitHub Pages

1. `npm run build` genera la carpeta `dist/`.
2. Subí el contenido de `dist/` a la rama `gh-pages` (o configurá GitHub Actions para hacerlo automáticamente).
3. Activá GitHub Pages apuntando a esa rama en la configuración del repo.

## Datos

Todo se guarda en `localStorage` del navegador. Usá los botones "Exportar datos" / "Importar datos" (en Inicio) para hacer backup o restaurar, ya que si limpiás el navegador se pierde la información.
