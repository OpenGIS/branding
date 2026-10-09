// Automatic heading anchors.
//
// Every top-level section band gets a linkable heading, WordPress-style: the
// heading carries an id and wraps its own text in an anchor pointing at it, so
// the URL updates on click and a right-click copies a direct link. The id is
// reused from the section when it already has one, otherwise it is slugged from
// the heading text and de-duplicated.

export function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initHeadingAnchors(root = document) {
  const items = [];

  root.querySelectorAll("main .ogis-band").forEach((section) => {
    const heading = section.querySelector(
      ":scope > :is(h1, h2, h3, h4, h5, h6)",
    );
    if (!heading || heading.querySelector("a")) return;
    const id = heading.id || section.id || slugify(heading.textContent);
    if (id) items.push({ section, heading, id });
  });

  const used = new Set(
    Array.from(root.querySelectorAll("[id]"), (el) => el.id),
  );

  items.forEach((item) => {
    let id = item.id;
    let suffix = 1;
    // The candidate only needs de-duplicating when it belongs to some other
    // element; the heading's own id and the section id it is moving from are
    // fine to claim.
    while (used.has(id) && id !== item.heading.id && id !== item.section.id) {
      suffix += 1;
      id = item.id + "-" + suffix;
    }
    item.id = id;
    used.add(id);
  });

  items.forEach(({ section, heading, id }) => {
    heading.id = id;
    if (section.id === id) section.removeAttribute("id");

    const anchor = document.createElement("a");
    anchor.className = "heading-anchor";
    anchor.href = "#" + id;
    while (heading.firstChild) anchor.appendChild(heading.firstChild);
    heading.appendChild(anchor);
  });
}
