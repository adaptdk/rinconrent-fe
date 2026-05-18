# Properties on the Astro client

How the Properties section is structured. The data model and sync lifecycle live in [server/docs/guesty-integration.md](../../server/docs/guesty-integration.md).

## File layout

```
client/src/
├── pages/[...propertyPath]/index.astro      Thin router (~90 lines)
│
├── components/property/                     One folder, one responsibility
│   ├── PropertyListing.astro                Listing view: search + filters + grid
│   ├── PropertyDetail.astro                 Detail view: gallery + body + booking
│   ├── PropertyCard.astro                   Grid card (uses data-* for filters)
│   ├── PropertyFilters.astro                Sidebar markup (script lives in scripts/)
│   ├── PropertySearchBar.astro              Top pill: town/dates/type/guests
│   └── PropertySortToolbar.astro            "N properties" + Grid/Map + Sort
│
├── scripts/property/                        Client-side TS, imported via <script>
│   ├── filters.ts                           Filter state machine (initPropertyFilters)
│   └── booking.ts                           Guesty booking redirect (initBookingForms)
│
└── utils/property/                          Pure helpers, no DOM, easy to test
    ├── filter-options.ts                    Build counted options from a property list
    ├── currency.ts                          Symbol lookup
    └── booking-url.ts                       Build the Guesty deep-link
```

Every file has a single concern. No file exceeds ~300 lines. The biggest is `scripts/property/filters.ts` (the filter state machine) and it's the natural place for that complexity.

## How things connect

**Page → composition.** The page file at [src/pages/[...propertyPath]/index.astro](../src/pages/[...propertyPath]/index.astro) does only routing: `getStaticPaths` builds locale-aware paths for the listing and each detail, then the body dispatches to `<PropertyListing>` or `<PropertyDetail>`.

**Listing → data flow.** `<PropertyListing>` receives the property list as a prop, derives filter options (`buildFilterOptions` in `utils/property/filter-options.ts`), and renders the SearchBar / Filters / Toolbar / Grid. Filter options are computed from the actual dataset — if a value isn't in the data, it isn't in the UI, so a click can't produce zero results.

**Filters → cards.** Each `<PropertyCard>` carries its filterable values in `data-*` attributes (`data-price`, `data-bedrooms`, `data-amenities`, `data-tags`, …). The client-side script (`scripts/property/filters.ts`) reads these attributes — no fetching, no re-rendering. State syncs to `?q=…&minPrice=…&type=…&cat=…&amenity=…&bath=…&city=…&guests=…` so any view is a shareable link.

**Search bar ↔ Filters.** The top search bar dispatches `property-filter-change` custom events; the filters script listens and merges. This keeps the two components decoupled — either can be removed without breaking the other.

**Booking redirect.** `<PropertyDetail>` builds the deep-link URL with `buildBookingUrl` and stores it in `data-booking-base` on the form. The shared `initBookingForms` script intercepts submit and opens the URL with `?checkIn=…&checkOut=…&guests=…`. The button is disabled with a tooltip when `PUBLIC_GUESTY_BOOKING_URL` isn't set.

## Routing

Single catch-all at [src/pages/[...propertyPath]/index.astro](../src/pages/[...propertyPath]/index.astro). `getStaticPaths` loops over `SUPPORTED_LOCALES` (just `["en"]` in v1), reads `propertiesBasePath` from `seo-config` for that locale, and generates:

- `/<basePath>` — the listing (e.g. `/properties`, `/propiedades`, `/propriétés`)
- `/<basePath>/<slug>` — one detail page per property

> **Astro quirk**: `SUPPORTED_LOCALES` is declared *inside* `getStaticPaths`, not at module scope. Astro runs `getStaticPaths` in an isolated scope and module-level constants in the same file are not visible there.

## Booking redirect

The form builds:

```
${PUBLIC_GUESTY_BOOKING_URL}/<guestyId>?checkIn=…&checkOut=…&guests=…
```

`PUBLIC_GUESTY_BOOKING_URL` is read from `client/.env` (Astro exposes `PUBLIC_*` env vars to the browser). When unset, the button is disabled and labelled "Booking not configured" so the page still renders.

## Adding a filter

Three small changes:

1. **PropertyCard** ([src/components/property/PropertyCard.astro](../src/components/property/PropertyCard.astro)): add a `data-<your-filter>` attribute populated from the property data.
2. **PropertyFilters** ([src/components/property/PropertyFilters.astro](../src/components/property/PropertyFilters.astro)): add the input markup with `data-filter="<your-filter>"`.
3. **filters.ts** ([src/scripts/property/filters.ts](../src/scripts/property/filters.ts)): add the input to the `els` object, extend `readState` and `matches`, and (optionally) extend `syncUrl` / `hydrateFromUrl` if the filter should live in the query string.

## Things to know

- All images use [src/components/StrapiImage.astro](../src/components/StrapiImage.astro) (rewrites relative Strapi URLs to absolute and passes through to Astro's optimised `<Image />`).
- The `strapi-community-astro-loader` caches Strapi responses in `client/node_modules/.astro/data-store.json`. After a Guesty sync, restart `astro dev` (hot reload doesn't pick up content config changes reliably).
- **Locale strategy in v1**: the `strapiProperties` collection in [src/content.config.ts](../src/content.config.ts) does **not** request `locale: "all"`. Strapi v5's public REST returns an empty array for `locale=all` without authentication. v1 ships English only — when a second locale lands, see "Adding a new locale" in [server/docs/guesty-integration.md](../../server/docs/guesty-integration.md).
- **No hardcoded filter values**. Categories, types, and features are all derived from the actual data in `utils/property/filter-options.ts`. A filter that would return zero results never appears.
