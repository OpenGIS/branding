// Styleguide entry.
//
// The styleguide consumes its dependencies straight from npm through Vite. The
// Vite build compiles Pico and the Open GIS theme into the single hosted
// stylesheet consumers link: assets/css/ogis.css. Import order controls the
// cascade in both dev and the build — Pico first, the Open GIS theme after it —
// so the theme's overrides always win.
//
// The page behaviour lives in two modules: `ui/` for the nav (scrollspy,
// sticky nav, heading anchors) and `background-map/` for the hostable map
// widget. Third parties load the built background map from
// assets/js/background-map.js; this entry imports the source instead.

import "@picocss/pico/css/pico.min.css";
import "../scss/ogis.scss";
import hljs from "@highlightjs/cdn-assets/es/highlight.min.js";
import { initUI } from "./ui/index.js";
import { init as initBackgroundMaps } from "./background-map/index.js";

hljs.highlightAll();
document
  .querySelectorAll(":not(pre) > code[class*='language-']")
  .forEach((el) => hljs.highlightElement(el));

initUI();
initBackgroundMaps();
