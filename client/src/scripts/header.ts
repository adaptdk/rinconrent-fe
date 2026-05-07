// ── Mobile main menu toggle ────────────────────────────────────────────────
const toggle = document.getElementById("mobile-toggle") as HTMLButtonElement;
const menu = document.getElementById("mobile-menu") as HTMLDivElement;
const iconOpen = document.getElementById("icon-open") as SVGElement;
const iconClose = document.getElementById("icon-close") as SVGElement;

function closeMainMenu() {
  menu.classList.add("hidden");
  toggle.setAttribute("aria-expanded", "false");
  iconOpen.classList.remove("hidden");
  iconClose.classList.add("hidden");
}

toggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("hidden") === false;
  toggle.setAttribute("aria-expanded", String(isOpen));
  iconOpen.classList.toggle("hidden", isOpen);
  iconClose.classList.toggle("hidden", !isOpen);
  if (isOpen) closeAllSubmenus();
});

// ── Mobile submenu slide-over ──────────────────────────────────────────────
function closeAllSubmenus() {
  document.querySelectorAll<HTMLDivElement>(".header__mobile-overlay").forEach(el => {
    el.classList.remove("is-active");
    el.setAttribute("aria-hidden", "true");
  });
}

document.querySelectorAll<HTMLButtonElement>("[data-submenu-open]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-submenu-open");
    const overlay = document.getElementById(`submenu-${id}`);
    if (!overlay) return;
    overlay.classList.add("is-active");
    overlay.setAttribute("aria-hidden", "false");
    (overlay.querySelector("[data-submenu-close]") as HTMLButtonElement)?.focus();
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-submenu-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    closeAllSubmenus();
    const overlay = btn.closest(".header__mobile-overlay") as HTMLDivElement;
    const id = overlay?.id.replace("submenu-", "");
    (document.querySelector(`[data-submenu-open="${id}"]`) as HTMLButtonElement)?.focus();
  });
});

// ── Desktop dropdown — aria-expanded sync for screen readers ───────────────
// Visual open/close is CSS-only (:hover + :focus-within); JS only syncs state.
document.querySelectorAll<HTMLButtonElement>("[data-dropdown]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const expanded = btn.getAttribute("aria-expanded") === "true";
    document.querySelectorAll<HTMLButtonElement>("[data-dropdown]").forEach(b =>
      b.setAttribute("aria-expanded", "false")
    );
    btn.setAttribute("aria-expanded", String(!expanded));
  });
});

// ── Global keyboard / outside-click cleanup ────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll<HTMLButtonElement>("[data-dropdown]").forEach(b =>
    b.setAttribute("aria-expanded", "false")
  );
  closeAllSubmenus();
  closeMainMenu();
});

document.addEventListener("click", (e) => {
  document.querySelectorAll<HTMLButtonElement>("[data-dropdown]").forEach(btn => {
    if (!btn.parentElement?.contains(e.target as Node)) {
      btn.setAttribute("aria-expanded", "false");
    }
  });
});
