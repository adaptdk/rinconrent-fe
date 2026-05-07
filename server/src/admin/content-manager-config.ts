/**
 * Content Manager edit view configuration.
 * This is the source of truth for field labels and descriptions shown in the
 * Strapi admin edit view. Applied on every startup via bootstrap().
 *
 * To add a new component: add an entry to COMPONENT_CONFIGS below using the
 * component's UID as the key (e.g. "layout.page-header").
 */

export const COMPONENT_CONFIGS: Record<string, ComponentConfig> = {
  "layout.page-header": {
    fields: {
      hideHeader: {
        label: "Hide header",
        description: "Turn on to suppress the header entirely — use this when the page opens with a full-screen block.",
      },
      headerType: {
        label: "Header type",
        description: "Text = plain background. Image / Video = full-width media with a dark overlay.",
      },
      headerSize: {
        label: "Size",
        description: "Small = compact padding. Medium = generous padding / taller media area.",
      },
      horizontalLayout: {
        label: "Horizontal layout",
        description: "Places the title on the left and the subtitle on the right side by side.",
      },
      pretitle: {
        label: "Pretitle",
        description: "Small accent label above the title — e.g. a category or section name.",
      },
      title: {
        label: "Title",
        description: "Leave blank to fall back to the page title automatically.",
      },
      subtitle: {
        label: "Subtitle",
        description: "Supporting text shown below (or beside) the title.",
      },
      image: {
        label: "Background image",
        description: "Used when Header type is set to Image.",
      },
      video: {
        label: "Background video",
        description: "Used when Header type is set to Video. Keep clips short — autoplay has a bandwidth cost.",
      },
    },
  },
};

// ── Types ─────────────────────────────────────────────────────────────────

interface FieldConfig {
  label?: string;
  description?: string;
}

interface ComponentConfig {
  fields: Record<string, FieldConfig>;
}
