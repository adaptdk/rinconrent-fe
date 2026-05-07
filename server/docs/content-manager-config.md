# Content Manager Configuration

## The problem

Strapi uses two separate systems for field configuration:

| System | Controls | Stored in |
|---|---|---|
| `schema.json` attributes | Field types, validations, defaults, required | Code (git) |
| "Configure the view" in admin | Field labels, descriptions, order in edit view | Database only |

The `description` key on a schema attribute is **Content-Type Builder metadata only** — it shows as a tooltip in the schema editor, not as hint text when editing content. There is no native Strapi JSON key that maps to Content Manager edit view labels or descriptions.

## The solution

`src/admin/content-manager-config.ts` is the source of truth for Content Manager field labels and descriptions. On every Strapi startup, `src/index.ts` bootstrap reads this file and patches the database store so the admin UI stays in sync with the code.

**Rule: never use "Configure the view" in the Strapi admin to set labels or descriptions.** Changes made there live only in the database and will be overwritten on the next restart. Always edit `content-manager-config.ts` instead.

## Adding configuration for a new component or content type

Open `src/admin/content-manager-config.ts` and add an entry to `COMPONENT_CONFIGS`:

```ts
"layout.my-component": {
  fields: {
    myField: {
      label: "My field",
      description: "What this field does and when to use it.",
    },
  },
},
```

The key is the component or content type UID (same value used in `schema.json` → `component` or `api::name.name`).

For **content types** (not components), the store key prefix is `configuration_content_types::` instead of `configuration_components::`. The bootstrap currently only handles components — extend `applyContentManagerConfig` in `src/index.ts` if you need content type support.

## What this does not cover

- **Field order** in the edit view — still database-only, configure once via "Configure the view" and leave it
- **List view columns** — same, database-only
- **Relation display fields** — same

These are one-time admin configurations that don't change often. The label/description workflow is the one that matters for keeping editorial guidance in code.
