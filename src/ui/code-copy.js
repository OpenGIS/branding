// One-click code copy.
//
// Adds a small copy control to the top-right of every code block in <main>.
// The button is part of the UI module: it copies the block's text to the
// clipboard and swaps its glyph for a brief confirmation. The control is
// positioned inside the block, so it never changes the code layout.

const FEEDBACK_MS = 1200;
const GLYPH = "<>";
const DONE = "\u2713";

function fallbackCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "-1000px";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch (error) {
    ok = false;
  }
  area.remove();
  return ok;
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => fallbackCopy(text),
    );
  }
  return Promise.resolve(fallbackCopy(text));
}

function textOf(pre) {
  const code = pre.querySelector("code");
  return (code || pre).textContent;
}

export function initCodeCopy(root = document) {
  root.querySelectorAll("main pre").forEach((pre) => {
    if (pre.querySelector(".code-copy")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy";
    button.setAttribute("aria-label", "Copy code");
    button.textContent = GLYPH;

    let timer = null;

    button.addEventListener("click", () => {
      copyText(textOf(pre)).then((ok) => {
        if (!ok) return;
        button.textContent = DONE;
        button.classList.add("is-copied");
        button.setAttribute("aria-label", "Copied");
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          button.textContent = GLYPH;
          button.classList.remove("is-copied");
          button.setAttribute("aria-label", "Copy code");
          timer = null;
        }, FEEDBACK_MS);
      });
    });

    pre.appendChild(button);
  });
}
