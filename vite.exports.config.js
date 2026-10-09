import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL(".", import.meta.url));

// Hosted exports — the single source of truth for the standalone artifacts that
// third parties load directly. Each key is the public export name (also the
// emitted filename) and each value names its ES module entry under `src/`,
// bundled as a classic, self-executing IIFE that exposes `window.<global>`.
//
// The output convention is fixed and derived from the key:
//
//   assets/js/<export-name>.js
//
// Adding a future export — say a UI module — is one line in this table:
//
//   ui: { entry: "src/ui/standalone.js", global: "OGISUI" },
//
// Nothing else changes: scripts/build-exports.mjs walks the table and builds
// each entry in turn.
export const exports = {
  "background-map": {
    entry: "src/background-map/standalone.js",
    global: "BackgroundMap",
  },
};

// The Vite config for a single export. IIFE output cannot share one Rollup pass
// with other entries (Rollup/Rolldown reject multiple inputs in IIFE mode), so
// each export gets its own pass — see scripts/build-exports.mjs. This writes
// into the dist/ tree the site build just produced, so it must not empty the
// output directory or copy public/ again.
export function exportConfig(name) {
  const spec = exports[name];
  if (!spec) {
    throw new Error(
      `Unknown export "${name}". Known exports: ${Object.keys(exports).join(", ")}`,
    );
  }

  return {
    root: dir,
    publicDir: false,
    build: {
      outDir: "dist/assets/js",
      emptyOutDir: false,
      lib: {
        entry: resolve(dir, spec.entry),
        name: spec.global,
        formats: ["iife"],
        fileName: () => `${name}.js`,
      },
    },
  };
}

// Default Vite config so the file is usable on its own for a one-off build:
//
//   vite build --config vite.exports.config.js --mode background-map
export default defineConfig(({ mode }) => exportConfig(mode));
