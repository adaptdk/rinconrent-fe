const toggle = document.querySelector("[data-lang-toggle]") as HTMLButtonElement | null;
if (toggle) {
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggle.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
  });
}
