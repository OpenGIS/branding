import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

// Smoke coverage: every page loads, its app JavaScript initialises and each
// band is captured for review. Add new pages to this table as the site grows.
const pages = [{ name: "home", path: "/" }];

// Heading anchors move each section's id onto its heading at runtime, so bands
// are selected through their headings rather than `section#id`. The hero band
// has no id; its heading text supplies the linkable slug.
const bands = [
  // The typography band also has a direct h1 (its heading example), so the
  // hero is pinned to the first band.
  { slug: "hero", selector: "main > section.ogis-band:has(> h1)", first: true },
  { slug: "quick-start", selector: "section:has(#quick-start)" },
  { slug: "map-bg", selector: "section:has(#map-bg)" },
  { slug: "logo", selector: "section:has(#logo)" },
  { slug: "palette", selector: "section:has(#palette)" },
  { slug: "dark-light", selector: "section:has(#dark-light)" },
  { slug: "typography", selector: "section:has(#typography)" },
  { slug: "forms", selector: "section:has(#forms)" },
  { slug: "code", selector: "section:has(#code)" },
  { slug: "dependencies", selector: "section:has(#dependencies)" },
];

const screenshotsDir = path.resolve("screenshots");
fs.mkdirSync(screenshotsDir, { recursive: true });

for (const pageItem of pages) {
  test(`${pageItem.name} loads and captures its bands`, async ({ page }) => {
    await page.goto(pageItem.path, { waitUntil: "load" });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // The heading anchors are injected by `src/ui/heading-anchors.js`, so their
    // presence proves the page's module graph has initialised.
    await expect(page.locator("main .heading-anchor").first()).toBeVisible();
    await expect(page).toHaveTitle(/OpenGIS Styleguide/);
    await expect(page.locator("main h1").first()).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, `${pageItem.name}.png`),
      fullPage: true,
    });

    // The sticky nav would otherwise sit over the top of each band capture.
    await page.addStyleTag({
      content: ".site-nav { position: static !important; }",
    });

    for (const band of bands) {
      const locator = page.locator(band.selector);
      await (band.first ? locator.first() : locator).screenshot({
        path: path.join(screenshotsDir, `section-${band.slug}.png`),
      });
    }
  });
}
