# Guesty Integration

How vacation rental property data gets from Guesty PMS into Strapi, and from Strapi onto the Astro site.

## Overview

```
┌─────────────┐  daily cron      ┌─────────────┐                  ┌─────────────┐
│   Guesty    │ ───────────────► │   Strapi    │  REST + Astro    │    Astro    │
│  Open API   │  sync-properties │  property   │  content loader  │   client    │
│  (listings) │                  │   entries   │ ───────────────► │  pre-built  │
└─────────────┘                  └─────────────┘                  └─────────────┘
                                                                         │
                                                                         │ "Book now"
                                                                         ▼
                                                              ${PUBLIC_GUESTY_BOOKING_URL}
                                                                /<guestyId>?dates…
```

### v1 decisions

| Decision | Choice |
|---|---|
| Render strategy | Static (SSG). Astro pre-builds every property page from Strapi at build time. |
| Source of truth | Guesty for English content. Strapi is a synced cache. |
| Sync trigger | Daily cron running `yarn sync:properties`. No in-process scheduler, no webhooks. |
| Booking handoff | Configurable redirect URL: `${PUBLIC_GUESTY_BOOKING_URL}/<guestyId>?checkIn=…&checkOut=…&guests=…` |
| In scope for v1 | List page + client-side filters, detail page, booking redirect |
| Out of scope for v1 | Map view, live availability calendar, webhook sync, editor overrides |

## Property data model

The Property content type lives at [src/api/property/](../src/api/property/). It is i18n-enabled: the Guesty sync writes only English, and translations to other locales sit alongside as sibling entries (same `documentId`, different `locale`).

| Strapi field | Type | Localized? | Source (Guesty field) |
|---|---|---|---|
| `guestyId` | string, unique, required | no | `_id` |
| `title` | string, required | **yes** | `title` or `nickname` |
| `slug` | uid (targetField: title) | **yes** | derived per-locale from the translated title |
| `propertyType` | string | no | `propertyType` |
| `accommodates` | integer | no | `accommodates` |
| `bedrooms` | integer | no | `bedrooms` |
| `bathrooms` | decimal | no | `bathrooms` |
| `summary` | text | **yes** | `publicDescription.summary` |
| `description` | richtext | **yes** | `publicDescription.space` + `publicDescription.neighborhood` |
| `minNights` / `maxNights` | integer | no | `terms.minNights` / `maxNights` |
| `checkInTime` / `checkOutTime` | string | no | `defaultCheckInTime` / `defaultCheckOutTime` |
| `timezone` | string | no | `timezone` |
| `address` | component `property.address` | no | `address` |
| `pricing` | component `property.pricing` | no | `prices` (Guesty's `weeklyPriceFactor` / `monthlyPriceFactor` are normalised to discount percentages) |
| `amenities` | repeatable component `property.amenity` | `name` yes, `icon` no | `amenities[]` (icon mapped to Font Awesome by [`scripts/lib/guesty-mapper.ts`](../scripts/lib/guesty-mapper.ts)) |
| `tags` | json | no | `tags[]` |
| `images` | media multiple | no — media is per-document | downloaded from `pictures[].original` |
| `lastSyncedAt` | datetime | no | timestamp of the last successful English sync |

The mapping lives in one place: [scripts/lib/guesty-mapper.ts](../scripts/lib/guesty-mapper.ts). Both the fixture seed (`seed-properties.ts`) and the future live sync (`sync-properties.ts`) go through it — if Guesty's response shape changes, fix this file and both callers benefit.

## Sync lifecycle (Phase 3 — when Guesty access lands)

`yarn sync:properties` will:

1. **OAuth** — POST to `${GUESTY_API_BASE}/oauth2/token` with client credentials, cache the token in memory until it expires (~24h).
2. **Paginate listings** — GET `${GUESTY_API_BASE}/listings?limit=100&skip=…` until the result set is exhausted, fetching only the fields the mapper consumes.
3. **Per listing, map → upsert on `locale: 'en'`**:
   - `findFirst({ filters: { guestyId }, locale: 'en' })`
   - If found, `update({ documentId, locale: 'en', data })`
   - If not, `create({ data: { …, locale: 'en' }, status: 'published' })`
   - Set `lastSyncedAt: new Date().toISOString()`.
4. **Image dedup** — for each `pictures[].original`, check whether an existing image on the property already has a matching `caption` (used as a content hash). If yes, keep it. If not, download via `https.get` and upload via `strapi.plugin('upload').service('upload').upload({ data: {}, files: { filepath, originalFilename, mimetype } })`.
5. **Archive removed listings** — any Property whose `guestyId` is no longer in the Guesty response is unpublished (`status: 'draft'`) so the site stops rendering it without losing its translations and overrides.
6. **Log** — `Synced N, created M, updated K, archived J` to `strapi.log.info`.

The sync **never touches non-English locale entries**. Translation siblings share the `documentId` but a different `locale`, so they sit outside the upsert path.

## i18n model

Strapi i18n is enabled in [server/config/plugins.ts](../config/plugins.ts). Only `en` is configured today; the schema is ready for more.

- **Localized text fields**: `title`, `slug`, `summary`, `description`, `amenities[].name`. These are what a guest reads.
- **Shared (non-localized) fields**: every fact about the building — `guestyId`, `bedrooms`, `bathrooms`, `accommodates`, `pricing`, `address`, `amenities[].icon`, `tags`, `images`, `lastSyncedAt`.
- **URL prefix** is per-locale via `seo-config.propertiesBasePath` (default `"properties"`). Translating this field lets the route change to `/propiedades`, `/propriétés`, etc.

### Adding a new locale

1. **Enable in Strapi** — add the locale code to `server/config/plugins.ts` `i18n.config.locales`, restart Strapi.
2. **Translate** — run `yarn translate:properties --target=<locale>` (Phase 6, see below) to populate translations from English via DeepL. Or translate manually in the admin.
3. **Make the data multi-locale-readable on the public API** — the current `strapiProperties` content collection in [client/src/content.config.ts](../../client/src/content.config.ts) does **not** set `locale: "all"` because the Astro loader is unauthenticated and Strapi v5 returns an empty array for `locale=all` without an admin/API token. Either:
   - pass an API token via the loader's `clientConfig.headers` so `locale: "all"` is allowed, or
   - declare one collection per locale (`strapiPropertiesEn`, `strapiPropertiesEs`, …) and merge them in `getStaticPaths`.
4. **Render** — add the locale code to `SUPPORTED_LOCALES` in [client/src/pages/[...propertyPath]/index.astro](../../client/src/pages/[...propertyPath]/index.astro) (declared inside `getStaticPaths`, not at module scope — see [client/docs/properties.md](../../client/docs/properties.md)) and rebuild Astro.

## Translation pipeline (Phase 6 — deferred)

Runs against Strapi only — Guesty is not involved.

- **Provider**: [DeepL](https://www.deepl.com/pro-api) by default. Good quality for hospitality prose, free tier covers ~500k characters/month. Pluggable behind `src/lib/translation/provider.ts`.
- **Staleness detection**: a target-locale entry is considered stale if it does not exist, or if its `updatedAt` predates the English sibling's `lastSyncedAt`.
- **What gets translated**: `title`, `summary`, `description`, `amenities[].name`. The `slug` is re-derived from the translated title.
- **What doesn't**: anything non-localized (price, geo, photos, amenity icons).

## Local dev without Guesty access (Phase 1)

You can stand the whole feature up against fixture data without credentials:

```bash
# 1. Create a Full Access API token in Strapi admin
#    → Settings → API Tokens → Create new API Token
#    Copy the value (shown only once).

cd server
STRAPI_API_TOKEN=<your token> yarn seed:properties
```

`seed-properties.ts` reads from [scripts/fixtures/guesty-listings.sample.json](../scripts/fixtures/guesty-listings.sample.json) — a hand-authored payload mirroring the Guesty listing shape — and runs it through the same mapper the real sync will use. Re-run safely: any property with a matching `guestyId` is deleted across all locales before being recreated.

The seed script does **not** add the "Properties" link to the Global navigation. That step is manual: in Strapi admin → Content Manager → Global → Header → navItems, add `{ label: "Properties", href: "/properties", isExternal: false }`. Reason: Strapi v5's REST PUT on a single type's nested components replaces the whole component (it does not merge field-by-field), so a programmatic nav-link insertion via REST risks wiping the rest of the header (logo, topNav, ctaGroup). Strapi History is not available on Community Edition, so the data is unrecoverable. Done once at setup time, the manual edit is faster than building a correct merge. See the "Strapi v5 gotchas" section in [CLAUDE.md](../../CLAUDE.md).

### Publishing over REST

POSTing to `/api/properties` in Strapi v5 creates a **draft**, regardless of whether `publishedAt` is in the payload. The seed script follows every create with a `PUT /api/properties/:documentId?status=published` (empty `{ data: {} }` body) to publish. The same pattern will apply to the live sync.

When real Guesty access lands, capture the live response shape into the fixture file (or replace it with a curl-saved sample), then diff against the mapper assumptions.

## Operational runbook

| Task | Command |
|---|---|
| Ad-hoc resync from Guesty | `cd server && yarn sync:properties` |
| Re-seed from the fixture (local dev) | `cd server && STRAPI_API_TOKEN=… yarn seed:properties` |
| Invalidate the Astro content cache | `rm client/.astro/data-store.json` |
| Force a full Astro rebuild after sync | run the cache invalidation above, then `cd client && yarn build` |
| Inspect Properties in admin | http://localhost:1337/admin → Content Manager → Properties |

Important: the Astro `strapi-community-astro-loader` caches Strapi data in `client/.astro/data-store.json` and does **not** auto-invalidate. Always delete it after a sync if you're about to rebuild Astro.

## Environment variables

| Variable | Where | Purpose | Behaviour when missing |
|---|---|---|---|
| `STRAPI_API_TOKEN` | `server/.env` for sync; passed inline for seed | Full-access API token used by sync/seed scripts | Scripts exit with a setup hint. |
| `GUESTY_API_BASE` | `server/.env` (Phase 3) | Base URL of the Guesty Open API | Sync errors at boot. |
| `GUESTY_CLIENT_ID` / `GUESTY_CLIENT_SECRET` | `server/.env` (Phase 3) | OAuth2 client credentials | Sync errors at boot. |
| `PUBLIC_GUESTY_BOOKING_URL` | `client/.env` | Base URL the "Book on Guesty" CTA deep-links to (e.g. `https://book.example.guestybookings.com/properties`) | Button is disabled with a "Booking not configured" tooltip — page still renders. |
| `DEEPL_API_KEY` | `server/.env` (Phase 6) | DeepL key for the translation script | Translation script exits with a setup hint. |
