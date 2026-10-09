// Runtime dependency loader.
//
// Injects the viewer's stylesheet, jQuery and the Waymark-JS bundle into the
// DOM once and shares the one promise across every container on the page.
// jQuery and the bundle are skipped when a page already provides them, so the
// component composes safely with a host that loads its own copies. On failure
// it warns once and rejects; callers no-op gracefully.

import { DEPENDENCIES } from "./config.js";

const CSS_MARKER = "data-background-map-dependency-css";

let pending = null;
let warned = false;

function appendCss(href) {
  if (document.querySelector("link[" + CSS_MARKER + "]")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute(CSS_MARKER, "");
  document.head.appendChild(link);
}

function appendScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("could not load " + src));
    document.head.appendChild(script);
  });
}

export function loadDependencies() {
  if (window.Waymark_Map_Factory) return Promise.resolve();
  if (pending) return pending;

  appendCss(DEPENDENCIES.css);

  const jquery = window.jQuery
    ? Promise.resolve()
    : appendScript(DEPENDENCIES.jquery);

  pending = jquery
    .then(() => appendScript(DEPENDENCIES.waymark))
    .then(() => {
      if (!window.Waymark_Map_Factory) {
        throw new Error("Waymark-JS loaded but did not initialise");
      }
    })
    .catch((error) => {
      // Clear the cache so a later refresh can retry.
      pending = null;
      if (!warned) {
        warned = true;
        console.warn(
          "background-map.js: " + error.message + ". Background maps disabled.",
        );
      }
      throw error;
    });

  return pending;
}
