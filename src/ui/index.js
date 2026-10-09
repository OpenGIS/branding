// UI module — page behaviour.
//
// Aggregates the independent concerns so the entry point only calls `initUI()`.
// Order matters: heading ids are assigned before the scrollspy resolves its
// targets, and the copy controls are added after highlight.js has run.

import { initCodeCopy } from "./code-copy.js";
import { initHeadingAnchors } from "./heading-anchors.js";
import { initScrollspy } from "./scrollspy.js";
import { initStickyNav } from "./sticky-nav.js";
import { initThemeSwitch } from "./theme-switch.js";

export function initUI(root = document) {
  initStickyNav(root);
  initHeadingAnchors(root);
  initScrollspy(root);
  initThemeSwitch(root);
  initCodeCopy(root);
}

export {
  initCodeCopy,
  initHeadingAnchors,
  initScrollspy,
  initStickyNav,
  initThemeSwitch,
};
