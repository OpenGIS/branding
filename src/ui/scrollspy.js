// Header nav scrollspy.
//
// Marks the nav link whose section is currently at the top of the viewport
// with `aria-current`, which the stylesheet paints in the primary green. The
// active target is the last section to have crossed the stuck-nav offset; the
// scroll handler is rAF-throttled and also runs on resize, hash change and
// load so the state stays correct at any width.

export function initScrollspy(root = document) {
  const nav = root.querySelector(".site-nav");
  if (!nav) return;

  const items = Array.from(nav.querySelectorAll('a[href^="#"]'))
    .map((link) => {
      const id = decodeURIComponent(link.hash.slice(1));
      const target = document.getElementById(id);
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if (!items.length) return;

  let active = null;

  function setActive(link) {
    if (link === active) return;
    items.forEach((item) => {
      if (item.link === link) {
        item.link.setAttribute("aria-current", "true");
      } else {
        item.link.removeAttribute("aria-current");
      }
    });
    active = link;
  }

  function update() {
    // Sits just past the headings' scroll-margin-top, so an anchor jump marks
    // the section it landed on rather than the one above it.
    const offset = nav.getBoundingClientRect().height + 16;
    let current = items[0];
    let currentTop = -Infinity;
    items.forEach((item) => {
      const top = item.target.getBoundingClientRect().top;
      if (top <= offset && top > currentTop) {
        currentTop = top;
        current = item;
      }
    });
    setActive(current.link);
  }

  let ticking = false;
  function schedule() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("hashchange", schedule);
  window.addEventListener("load", schedule, { once: true });

  update();
}
