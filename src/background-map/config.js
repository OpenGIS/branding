// Shared configuration for the background map.
//
// One public name is used everywhere: the container attribute is
// `data-background-map`, the classes are `background-map`,
// `background-map--invert` and `background-map__canvas`, and the global is
// `window.BackgroundMap`.

export const ATTR = "data-background-map";
export const BASE_CLASS = "background-map";
export const INVERT_CLASS = "background-map--invert";
export const CANVAS_CLASS = "background-map__canvas";

// The viewer's CSS, jQuery and bundle are fetched from the waymark-js project
// at runtime — nothing is vendored into this repository. The URLs are pinned
// so the component keeps working even if the project's `latest` alias moves.
export const DEPENDENCIES = {
  css: "https://www.ogis.org/waymark-js/v1/dist/latest/css/waymark-js.min.css",
  jquery: "https://code.jquery.com/jquery-3.7.1.min.js",
  waymark:
    "https://www.ogis.org/waymark-js/v1/dist/latest/js/waymark-js.min.js",
};

export const TILE_LAYER = {
  layer_name: "OpenStreetMap",
  layer_url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?r=1",
  layer_attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  layer_max_zoom: "17",
};

export const INITIAL_ZOOM = 8;
