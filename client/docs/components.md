# Component Reference

Reusable Astro components and their configuration options. Each component maps to a Strapi component field and is responsible for its own rendering logic.

---

## PageHeader

**File:** `src/components/PageHeader.astro`  
**Strapi component:** `layout.page-header`  
**Used in:** `pages/[slug]/index.astro`, `pages/index.astro`

The PageHeader renders above the block zone on every page. It is a dedicated field on the Page content type (not a block in the dynamic zone), so it is always available and configurable per page without editors needing to insert it manually.

### Props

| Prop | Type | Description |
|---|---|---|
| `data` | `PageHeaderProps \| null` | The Strapi component data. If null/undefined, nothing renders. |
| `fallbackTitle` | `string \| null` | The page `title` field. Used when `data.title` is blank. |

### Strapi Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| `hideHeader` | Boolean | false | When on, the entire header is suppressed. Use for block-built pages. |
| `headerType` | Enum | text | `text` = plain background. `image`/`video` = full-width media with overlay. |
| `headerSize` | Enum | medium | `small` = compact, `medium` = standard. Controls height/padding. |
| `horizontalLayout` | Boolean | false | Puts title on the left and subtitle on the right (side-by-side on desktop). |
| `pretitle` | String | — | Small label above the title, e.g. a category or section name. |
| `title` | String | — | Overrides the page title. Leave blank to fall back to the page title. |
| `subtitle` | Text | — | Supporting text below the title. |
| `image` | Media (image) | — | Background image. Only used when `headerType = image`. |
| `video` | Media (video) | — | Background video. Only used when `headerType = video`. |

### Rendering Logic

**Title fallback:** `data.title` is used if set; otherwise falls back to `fallbackTitle` (the page's own title field). This means editors never have to duplicate the title just to show it in the header.

**Guard:** If `data` is null/undefined, or `hideHeader` is true, the component renders nothing — no wrapper div, no whitespace.

**Text type** (`headerType = text` or unset):
- Background: `bg-surface-alt`
- Stacked (default): pretitle → h1 title → subtitle, top-to-bottom
- Horizontal (`horizontalLayout = true`): title fills the left column, subtitle fills the right column. Stacks vertically on mobile.
- Size controls vertical padding: small is compact, medium is generous.

**Image / Video type** (`headerType = image` or `video`):
- Full-width section with a fixed viewport height (small ≈ 40vh, medium ≈ 60vh)
- A semi-transparent dark overlay sits above the media for text legibility
- Content (pretitle, title, subtitle) is anchored to the bottom-left of the section
- If no image or video is provided, a dark gradient placeholder is shown
- All text renders in white

### Editorial Guidance

- **Use `text` type** for standard content pages — About, FAQ, Contact, etc.
- **Use `image` type** for visually rich landing sections — hero areas, campaign pages
- **Use `video` type** sparingly — autoplay video has high bandwidth cost; prefer short loops
- **Use `horizontalLayout`** when the subtitle is long and you want it to sit alongside the title rather than below it (matches the first screenshot example above)
- **Set `hideHeader = true`** on pages that open directly with a blocks.hero or a full-screen block — avoids double headers
- The title field is optional; leaving it blank reuses the page title automatically
