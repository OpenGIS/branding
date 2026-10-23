import { defineConfig, loadEnv } from "vite";

// Canonical URL fallback when `VITE_PRODUCTION_URL` is unset (see `.env.example`).
// The site is a GitHub Pages project page served under the /branding/ sub-path.
const DEFAULT_PRODUCTION_URL = "https://www.ogis.org/branding";

// Replace the `%VITE_PRODUCTION_URL%` placeholder in index.html with the
// resolved production URL. This runs as a pre transform so it resolves the
// placeholder before Vite's own HTML env hook, which keeps the build
// warning-free even when the variable is absent.
function canonicalUrlPlugin(productionUrl) {
  return {
    name: "ogis:canonical-url",
    transformIndexHtml: {
      order: "pre",
      handler: (html) =>
        html.replaceAll("%VITE_PRODUCTION_URL%", productionUrl),
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const productionUrl = env.VITE_PRODUCTION_URL || DEFAULT_PRODUCTION_URL;

  return {
    // Relative base so injected asset URLs resolve at an origin root and under
    // a GitHub Pages project sub-path (e.g. /branding/) alike.
    base: "./",
    plugins: [canonicalUrlPlugin(productionUrl)],
    build: {
      rollupOptions: {
        output: {
          // Pin the compiled stylesheet to the stable consumer URL. The build
          // emits one CSS asset (Pico + the Open GIS theme); JS keeps its default
          // content-hashed name.
          assetFileNames: (assetInfo) =>
            (assetInfo.names ?? []).some((name) => name.endsWith(".css"))
              ? "assets/css/ogis.css"
              : "assets/[name]-[hash][extname]",
        },
      },
    },
  };
});
