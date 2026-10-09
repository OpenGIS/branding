// Per-container viewer setup.
//
// Adds the base/invert classes plus a canvas to one host, then paints the
// random country through the v1 viewer. Interaction cannot be switched off
// through the viewer's own options — `map_options` does not reach `L.map`
// directly (only `dragging` is disabled, and hovering re-enables it) — so the
// map is made inert in CSS instead: the whole component ignores pointer
// events while the attribution stays clickable.

import {
  ATTR,
  BASE_CLASS,
  INVERT_CLASS,
  CANVAS_CLASS,
  TILE_LAYER,
  INITIAL_ZOOM,
} from "./config.js";

const HANDLERS = [
  "dragging",
  "scrollWheelZoom",
  "doubleClickZoom",
  "boxZoom",
  "touchZoom",
  "keyboard",
  "tap",
];

let canvasSequence = 0;

function wantsInvert(host) {
  if (host.classList.contains(INVERT_CLASS)) return true;
  const value = (host.getAttribute(ATTR) || "").trim().toLowerCase();
  return value === "invert" || value === "always-invert" || value === "dark";
}

// `map_options` does not reach `L.map`, so the viewer only turns off dragging
// (and re-enables it on wake). Disable every remaining interaction on the live
// map as a belt-and-braces companion to the CSS `pointer-events: none`, and
// drop the Leaflet zoom control so no zoom affordance exists at all.
function disableInteractions(host) {
  const map = window.Waymark && window.Waymark.map;
  if (map) {
    HANDLERS.forEach((name) => {
      const handler = map[name];
      if (handler && typeof handler.disable === "function") handler.disable();
    });
  }
  const zoom = host.querySelector(".leaflet-control-zoom");
  if (zoom) zoom.remove();
}

export function initHost(host) {
  if (host.querySelector("." + CANVAS_CLASS)) return;

  host.classList.add(BASE_CLASS);
  if (wantsInvert(host)) host.classList.add(INVERT_CLASS);

  const canvas = document.createElement("div");
  canvas.id = "background-map-canvas-" + ++canvasSequence;
  canvas.className = CANVAS_CLASS;
  host.appendChild(canvas);

  const viewer = window.Waymark_Map_Factory.viewer();
  viewer.init({
    map_options: {
      map_div_id: canvas.id,
      tile_layers: [TILE_LAYER],
      map_height: null,
      map_init_zoom: INITIAL_ZOOM,
      map_init_latlng: viewer.country_code_to_bounds().getCenter(),
    },
  });

  disableInteractions(host);
}
