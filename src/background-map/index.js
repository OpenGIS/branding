// Background map — public API.
//
// `init()` finds every element marked with `data-background-map`, loads the
// viewer dependencies once, then paints each host. `refresh()` re-runs `init()`
// so a host added after page load picks up a map. Both are safe to call before
// the dependencies resolve: the work is shared through the loader's promise.

import { ATTR } from "./config.js";
import { loadDependencies } from "./dependencies.js";
import { initHost } from "./viewer.js";

export function init(root = document) {
  const hosts = root.querySelectorAll("[" + ATTR + "]");
  if (!hosts.length) return Promise.resolve();

  return loadDependencies()
    .then(() => {
      hosts.forEach((host) => {
        try {
          initHost(host);
        } catch (error) {
          console.warn("background-map.js: " + error.message);
        }
      });
    })
    .catch(() => {
      // loadDependencies already warned; nothing more to do.
    });
}

export const refresh = init;

// Expose the API for manual refreshes, matching the hosted build's global.
if (typeof window !== "undefined") {
  window.BackgroundMap = { init, refresh };
}
