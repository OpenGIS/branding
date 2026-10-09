// Colour-scheme switch.
//
// The segmented Auto / Light / Dark control forces the theme by setting (or
// removing) `data-theme` on the root element. "Auto" removes the attribute so
// the theme follows the operating system again; there is no persistence.

const VALID = ["auto", "light", "dark"];

export function initThemeSwitch(root = document) {
  const control = root.querySelector("[data-theme-switch]");
  if (!control) return;

  const buttons = Array.from(control.querySelectorAll("[data-theme-choice]"));
  if (!buttons.length) return;

  function setActive(choice) {
    buttons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        button.dataset.themeChoice === choice ? "true" : "false",
      );
    });
  }

  function applyTheme(choice) {
    const html = document.documentElement;
    if (choice === "auto") {
      delete html.dataset.theme;
    } else {
      html.dataset.theme = choice;
    }
    setActive(choice);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () =>
      applyTheme(button.dataset.themeChoice),
    );
  });

  const current = document.documentElement.dataset.theme;
  setActive(VALID.includes(current) ? current : "auto");
}
