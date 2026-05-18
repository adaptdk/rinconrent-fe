/**
 * Client-side filter state machine for the properties listing.
 *
 * Wires together:
 *   - The sidebar filters ([data-property-filters])
 *   - The top search bar ([data-property-search])  → dispatches "property-filter-change" events
 *   - The sort dropdown    ([data-property-sort])
 *   - The grid             ([data-property-grid])  + cards ([data-property-card])
 *
 * All filtering is done by toggling card visibility — no re-fetching.
 * State is mirrored to ?q=…&minPrice=…&type=…&cat=…&amenity=…&bath=…&city=…&guests=…
 * so any view is a shareable link.
 *
 * Card data-attributes consumed:
 *   data-price, data-bedrooms, data-bathrooms, data-guests,
 *   data-property-type, data-amenities (space-separated slugs),
 *   data-tags (space-separated slugs), data-city, data-title
 */

type FilterState = {
  name: string;
  minPrice: number;
  maxPrice: number;
  bathrooms: number;
  types: Set<string>;
  categories: Set<string>;
  amenities: Set<string>;
  city: string;
  guests: number;
  propertyType: string;
};

type SearchEventDetail = {
  city?: string;
  guests?: number;
  propertyType?: string;
};

const PRESSED_CLASSES = ["bg-secondary", "text-white"];
const UNPRESSED_CLASSES = [
  "bg-surface",
  "text-secondary",
  "border",
  "border-border",
  "hover:border-border-hover",
];

function setBathroomButtonState(button: HTMLButtonElement, active: boolean) {
  button.setAttribute("aria-pressed", active ? "true" : "false");
  for (const cls of PRESSED_CLASSES) button.classList.toggle(cls, active);
  for (const cls of UNPRESSED_CLASSES) button.classList.toggle(cls, !active);
}

export function initPropertyFilters(): void {
  const root = document.querySelector<HTMLElement>("[data-property-filters]");
  if (!root) return;

  const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-property-card]"));
  const summary = document.querySelector<HTMLElement>("[data-results-summary]");
  const emptyState = document.querySelector<HTMLElement>("[data-property-empty]");
  const sortSelect = document.querySelector<HTMLSelectElement>("[data-property-sort]");
  const grid = document.querySelector<HTMLElement>("[data-property-grid]");

  const els = {
    name: root.querySelector<HTMLInputElement>('[data-filter="name"]'),
    minPrice: root.querySelector<HTMLInputElement>('[data-filter="min-price"]'),
    maxPrice: root.querySelector<HTMLInputElement>('[data-filter="max-price"]'),
    priceTrack: root.querySelector<HTMLElement>("[data-price-track]"),
    types: Array.from(root.querySelectorAll<HTMLInputElement>('[data-filter="type"]')),
    bathroomButtons: Array.from(
      root.querySelectorAll<HTMLButtonElement>('[data-filter="bathrooms"]')
    ),
    categories: Array.from(root.querySelectorAll<HTMLInputElement>('[data-filter="category"]')),
    amenities: Array.from(root.querySelectorAll<HTMLInputElement>('[data-filter="amenity"]')),
    reset: root.querySelector<HTMLButtonElement>("[data-filter-reset]"),
  };

  if (!els.name || !els.minPrice || !els.maxPrice) return;

  const minBound = Number(els.minPrice.min) || 0;
  const maxBound = Number(els.maxPrice.max) || 1000;

  const fromSearch: SearchEventDetail & Required<Pick<SearchEventDetail, "city" | "guests" | "propertyType">> = {
    city: "",
    guests: 0,
    propertyType: "",
  };

  const readState = (): FilterState => ({
    name: els.name!.value.trim().toLowerCase(),
    minPrice: Number(els.minPrice!.value) || 0,
    maxPrice: Number(els.maxPrice!.value) || Infinity,
    bathrooms: Number(
      els.bathroomButtons.find((b) => b.getAttribute("aria-pressed") === "true")?.dataset.value ?? "0"
    ),
    types: new Set(els.types.filter((i) => i.checked).map((i) => i.value)),
    categories: new Set(els.categories.filter((i) => i.checked).map((i) => i.value)),
    amenities: new Set(els.amenities.filter((i) => i.checked).map((i) => i.value)),
    city: fromSearch.city,
    guests: fromSearch.guests,
    propertyType: fromSearch.propertyType,
  });

  const matches = (card: HTMLElement, s: FilterState): boolean => {
    const price = Number(card.dataset.price ?? 0);
    const bathrooms = Number(card.dataset.bathrooms ?? 0);
    const guests = Number(card.dataset.guests ?? 0);
    const propertyType = card.dataset.propertyType ?? "";
    const tags = (card.dataset.tags ?? "").split(/\s+/).filter(Boolean);
    const amenities = (card.dataset.amenities ?? "").split(/\s+/).filter(Boolean);
    const city = card.dataset.city ?? "";
    const title = card.dataset.title ?? "";

    if (s.name && !title.includes(s.name)) return false;
    if (price < s.minPrice || price > s.maxPrice) return false;
    if (s.bathrooms > 0) {
      const matchesBath = s.bathrooms === 4 ? bathrooms >= 4 : Math.floor(bathrooms) === s.bathrooms;
      if (!matchesBath) return false;
    }
    if (s.types.size > 0 && !s.types.has(propertyType)) return false;
    if (s.categories.size > 0) {
      const tagSet = new Set(tags);
      let hit = false;
      for (const c of s.categories) if (tagSet.has(c)) { hit = true; break; }
      if (!hit) return false;
    }
    for (const a of s.amenities) {
      if (!amenities.includes(a)) return false;
    }
    if (s.city && city !== s.city) return false;
    if (s.guests > 0 && guests < s.guests) return false;
    if (s.propertyType && propertyType !== s.propertyType) return false;
    return true;
  };

  const sortVisibleCards = (visible: HTMLElement[]): void => {
    if (!grid || !sortSelect) return;
    const mode = sortSelect.value;
    const sorted = [...visible];
    if (mode === "price-asc") {
      sorted.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    } else if (mode === "price-desc") {
      sorted.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
    } else if (mode === "beds-desc") {
      sorted.sort((a, b) => Number(b.dataset.bedrooms) - Number(a.dataset.bedrooms));
    }
    for (const card of sorted) grid.appendChild(card);
  };

  const updatePriceTrack = (state: FilterState): void => {
    if (!els.priceTrack) return;
    const span = Math.max(1, maxBound - minBound);
    const left = Math.max(0, ((state.minPrice - minBound) / span) * 100);
    const right = Math.max(0, ((maxBound - Math.min(state.maxPrice, maxBound)) / span) * 100);
    els.priceTrack.style.left = `${left}%`;
    els.priceTrack.style.right = `${right}%`;
  };

  const syncUrl = (state: FilterState): void => {
    const params = new URLSearchParams();
    if (state.name) params.set("q", state.name);
    if (state.minPrice > minBound) params.set("minPrice", String(state.minPrice));
    if (state.maxPrice < maxBound) params.set("maxPrice", String(state.maxPrice));
    if (state.bathrooms > 0) params.set("bath", String(state.bathrooms));
    if (state.types.size > 0) params.set("type", [...state.types].join(","));
    if (state.categories.size > 0) params.set("cat", [...state.categories].join(","));
    if (state.amenities.size > 0) params.set("amenity", [...state.amenities].join(","));
    if (state.city) params.set("city", state.city);
    if (state.guests > 0) params.set("guests", String(state.guests));
    const qs = params.toString();
    window.history.replaceState({}, "", qs ? `${location.pathname}?${qs}` : location.pathname);
  };

  const apply = (): void => {
    const state = readState();
    const visibleCards: HTMLElement[] = [];
    for (const card of cards) {
      const show = matches(card, state);
      card.style.display = show ? "" : "none";
      if (show) visibleCards.push(card);
    }
    sortVisibleCards(visibleCards);
    if (summary) {
      summary.textContent = `${visibleCards.length} ${
        visibleCards.length === 1 ? "property" : "properties"
      }`;
    }
    if (emptyState) emptyState.hidden = visibleCards.length !== 0;
    updatePriceTrack(state);
    syncUrl(state);
  };

  const hydrateFromUrl = (): void => {
    const params = new URLSearchParams(location.search);
    if (params.has("q") && els.name) els.name.value = params.get("q")!;
    if (params.has("minPrice") && els.minPrice) els.minPrice.value = params.get("minPrice")!;
    if (params.has("maxPrice") && els.maxPrice) els.maxPrice.value = params.get("maxPrice")!;
    if (params.has("bath")) {
      const v = params.get("bath")!;
      for (const b of els.bathroomButtons) {
        setBathroomButtonState(b, b.dataset.value === v);
      }
    }
    const setCheckedFromCsv = (inputs: HTMLInputElement[], key: string) => {
      if (!params.has(key)) return;
      const wanted = new Set(params.get(key)!.split(","));
      for (const i of inputs) i.checked = wanted.has(i.value);
    };
    setCheckedFromCsv(els.types, "type");
    setCheckedFromCsv(els.categories, "cat");
    setCheckedFromCsv(els.amenities, "amenity");
    if (params.has("city")) fromSearch.city = params.get("city")!;
    if (params.has("guests")) fromSearch.guests = Number(params.get("guests"));
  };

  // ── Wire events ────────────────────────────────────────────────────────────

  els.name.addEventListener("input", apply);
  els.minPrice.addEventListener("input", apply);
  els.maxPrice.addEventListener("input", apply);

  for (const b of els.bathroomButtons) {
    b.addEventListener("click", () => {
      for (const other of els.bathroomButtons) {
        setBathroomButtonState(other, other === b);
      }
      apply();
    });
  }

  for (const input of [...els.types, ...els.categories, ...els.amenities]) {
    input.addEventListener("change", apply);
  }

  sortSelect?.addEventListener("change", apply);

  window.addEventListener("property-filter-change", (e) => {
    const detail = (e as CustomEvent).detail as SearchEventDetail;
    if (detail.city !== undefined) fromSearch.city = detail.city;
    if (detail.guests !== undefined) fromSearch.guests = detail.guests;
    if (detail.propertyType !== undefined) fromSearch.propertyType = detail.propertyType;
    apply();
  });

  els.reset?.addEventListener("click", () => {
    if (els.name) els.name.value = "";
    if (els.minPrice) els.minPrice.value = String(minBound);
    if (els.maxPrice) els.maxPrice.value = String(maxBound);
    for (const b of els.bathroomButtons) setBathroomButtonState(b, b.dataset.value === "0");
    for (const i of [...els.types, ...els.categories, ...els.amenities]) i.checked = false;
    fromSearch.city = "";
    fromSearch.guests = 0;
    fromSearch.propertyType = "";
    apply();
  });

  // External reset trigger (the empty-state link reuses this).
  for (const trigger of document.querySelectorAll<HTMLElement>("[data-filter-reset]")) {
    if (trigger === els.reset) continue;
    trigger.addEventListener("click", () => els.reset?.click());
  }

  hydrateFromUrl();
  apply();
}

export function initPropertySearchBar(): void {
  const root = document.querySelector<HTMLElement>("[data-property-search]");
  if (!root) return;

  const city = root.querySelector<HTMLSelectElement>('[data-search="city"]');
  const guests = root.querySelector<HTMLInputElement>('[data-search="guests"]');
  const type = root.querySelector<HTMLSelectElement>('[data-search="type"]');

  const dispatch = () => {
    window.dispatchEvent(
      new CustomEvent("property-filter-change", {
        detail: {
          source: "search-bar",
          city: city?.value ?? "",
          guests: Number(guests?.value ?? 0),
          propertyType: type?.value ?? "",
        },
      })
    );
  };

  city?.addEventListener("change", dispatch);
  guests?.addEventListener("input", dispatch);
  type?.addEventListener("change", dispatch);

  root
    .querySelector<HTMLButtonElement>("[data-search-trigger]")
    ?.addEventListener("click", dispatch);
}
