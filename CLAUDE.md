# Project Guidelines

## Stack

- **Frontend:** Astro 6 with Tailwind CSS v4
- **Backend:** Strapi 5 (latest) with SQLite
- **Content loader:** `strapi-community-astro-loader` v4 via Astro's Content Layer API
- **Package manager:** yarn

## UI and Design Preferences

### Design Tokens

This project uses a custom Tailwind v4 theme defined in `client/src/styles/global.css`. Always use semantic tokens — never raw Tailwind colors.

| Token | Purpose |
|---|---|
| `text-secondary` | Headings, primary text |
| `text-muted` | Body text, descriptions |
| `text-faint` | Metadata, captions |
| `text-primary-600` | Accent text, links, labels |
| `bg-surface` | Page background |
| `bg-surface-alt` | Alternate section backgrounds |
| `bg-surface-raised` | Cards, elevated elements |
| `border-border` / `border-border-hover` | Borders and hover states |
| `font-heading` | Heading font family |
| `rounded-xl` | Card corners |

### Design Principles

- **Content-appropriate layouts** — different content types should have different UI patterns. A team page should not look like a blog page. Match the layout to how users expect to see that type of content.
- **Visual hierarchy** — the most important field should be the most prominent element (faces for people, dates for events, prices for products, images for portfolios).
- **Generous spacing** — prefer spacious layouts over cramped ones. Use `gap-8` to `gap-12` for grids, `mt-10` to `mt-16` between sections.
- **Hover feedback on everything clickable** — use `group`/`group-hover` pattern. Options: image zoom, title color shift, shadow lift, border highlight.
- **Image shape matches subject** — circular for faces/headshots, rectangular for products/objects, wide for scenes/articles.
- **Always handle missing images** — use a fallback (initial letter, icon, or colored placeholder), never leave a gap.
- **Responsive by default** — 1 column mobile, 2 tablet, 3 desktop for grids. Horizontal layouts stack vertically on mobile.
- **Hide pagination when not needed** — only show when `totalPages > 1`.
- **Use `StrapiImage` for all images** — never raw `<img>` tags.
- **Use `BaseLayout` on all pages** — wraps content with the global header/footer.

### Components

- `StrapiImage` — handles Strapi image URLs (relative → absolute) with Astro's `<Image />` optimization
- `BaseLayout` — global header + footer wrapper
- `Pagination` — pagination controls, only render when multiple pages exist
- `BlockRenderer` — renders Strapi dynamic zone blocks

## CSS Conventions

**Tailwind-first, BEM for structure.**

- Use Tailwind utilities inline for layout, spacing, color, and responsive variants.
- Use BEM class names when a component needs named states, variants, or selectors too complex for inline utilities (hover border animations, `:focus-visible`, JS-toggled states, active page indicators).
- Each component with BEM styles gets its own partial in `client/src/styles/components/`.
- Import all partials through `client/src/styles/global.css`.

**File structure:**
```
client/src/styles/
├── global.css              ← entry: @import tailwindcss + all partials
├── _theme.css              ← @theme design tokens
├── _base.css               ← html, body, ::selection
└── components/
    ├── _button.css         ← .button, .button-primary, .button-secondary
    └── _header.css         ← .header__* BEM styles
```

**Naming:**
- Block: component name — `.header`, `.topbar`
- Element: `__` — `.header__logo`, `.header__nav-link`
- Modifier: `--` — `.header__nav-link--active`

**When to use each:**
- Tailwind (inline in HTML): layout, spacing, colors, font sizes, responsive prefixes, hover states expressible as a single class
- CSS partials (raw CSS, no `@apply`): hover border-bottom with padding compensation, `aria-expanded` selector states, complex transitions that need exact values, anything Tailwind can't cleanly express inline

**No `@apply`** — if Tailwind can do it inline, do it inline. CSS partials contain real CSS only.

### Astro template gotchas

- **`<video>` boolean attributes** — standalone `autoplay`, `muted`, `loop`, `playsinline` can be dropped by Astro's compiler. Always use explicit `={true}`: `autoplay={true} muted={true} loop={true} playsinline={true}`.

## Strapi Conventions

- Always use `fields` to select only needed columns — never `populate: "*"`
- Media and relation fields must use `.nullable().optional()` in Zod schemas
- Use `populate` with nested `fields` for media and relations
- Seed scripts should set public permissions, upload placeholder images, create entries, and add nav links
- The `uploadImage` function uses `filepath`, `originalFilename`, `mimetype` (not `path`, `name`, `type`)
- Run `yarn clean` in `server/` after deleting content types to clear stale dist files

### Two populate configs — keep both in sync

There are **two independent populate configs** for blocks. When adding or renaming fields on any block, update both:

| File | Used by |
|---|---|
| `client/src/utils/loaders.ts` | Landing page + any direct `strapiClient` call |
| `client/src/content.config.ts` | Astro content collections (`strapiPages`, `strapiPosts`, …) |

Grep for the block key (e.g. `"blocks.hero"`) across `client/src/` to find every occurrence before declaring a field change done.

### Content layer cache

`strapi-community-astro-loader` caches data in `client/.astro/data-store.json`. It does not auto-refresh when Strapi content changes. If the Strapi API returns the correct value but the Astro page still shows old data, clear the cache:

```bash
rm client/.astro/data-store.json
# then restart yarn dev
```

This only affects content collections. Pages using `loaders.ts` always fetch fresh data at request time.

## Skills

- `/add-page` — scaffolds a new page (Strapi content type + seed script + Astro collection + pages). See `.claude/skills/add-page/` for details.
- Reference files: `design-patterns.md` (UI guidance) and `populate-best-practices.md` (data loading)
