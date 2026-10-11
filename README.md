# OpenGIS Branding

One hosted stylesheet carries Pico CSS, the OpenGIS theme and the syntax palette — consumed by linking it (and optionally the JS exports).

## Quick Start

Link the stylesheet; it bundles Pico CSS, the OpenGIS theme and the highlight.js syntax palette, so one request styles the whole page:

```html
<link rel="stylesheet" href="https://www.ogis.org/branding/assets/css/ogis.css" />
```

Code highlighting needs a highlight.js runtime, supplied by the consumer:

```html
<script src="/your/highlight.min.js"></script>
<script>
  hljs.highlightAll();
</script>
```

Paint a decorative random-country background map into any sized block:

```html
<div data-background-map style="height: 220px"></div>
<script src="https://www.ogis.org/branding/assets/js/background-map.js" defer></script>
```

The default is to load from the ogis.org domain; forking or self-hosting takes one env value (`VITE_PRODUCTION_URL`), which drives the page canonical link and the example URLs.

## Local development

```
npm install      # install dependencies
npm run dev      # styleguide on Vite's local URL
npm run build    # build the page and every export
npm run preview  # serve the production build
npm run format   # Prettier write; format:check verifies
```

- **`scss/`** — SASS tree compiled by Vite into `assets/css/ogis.css`. `_pico.scss` holds Pico-related overrides, `_hljs.scss` the highlight.js syntax palette.
- **`src/`** — ESM modules. `ui/` covers sticky nav, scrollspy, heading anchors, theme switch and code copy; `background-map/` is exported. `vite.exports.config.js` with `scripts/build-exports.mjs` builds the exports to `assets/js/<name>.js` IIFE globals.
- **`.env.example`** — defines `VITE_PRODUCTION_URL`; copy it to `.env`.

## Dependencies

- [Pico CSS](https://github.com/picocss/pico) — bundled into `ogis.css`.
- [highlight.js](https://github.com/highlightjs/highlight.js) — runtime, consumer-supplied.
- [jQuery](https://jquery.com) — loaded by the background map only.
- [Waymark JS v1](https://github.com/OpenGIS/Waymark-JS) — background map only; GPL-2.0; served from ogis.org, not redistributed.

## Licence

MIT (see [`LICENSE`](LICENSE)).
