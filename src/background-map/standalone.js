// Standalone entry for the hosted artifact (assets/js/background-map.js).
//
// Runs on load and exposes the same API on `window.BackgroundMap`, so third
// parties can load the built script directly. The styleguide itself imports
// `./index.js` through the main bundle instead.

import { init, refresh } from "./index.js";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => init(), { once: true });
} else {
  init();
}

export { init, refresh };
