// Sticky nav measurement.
//
// The nav sticks to the top of the viewport with CSS; this only publishes its
// height as `--ogis-nav-height` so headings can reserve the right
// `scroll-margin-top`. The nav wraps to more rows at narrow widths, so the
// value is re-measured on resize and once more after `load` settles fonts and
// images.

export function initStickyNav(root = document) {
  const nav = root.querySelector(".site-nav");
  if (!nav) return;

  const measure = () => {
    const height = Math.round(nav.getBoundingClientRect().height);
    document.documentElement.style.setProperty(
      "--ogis-nav-height",
      height + "px",
    );
  };

  measure();
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure, { once: true });
}
