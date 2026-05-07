/**
 * Content Manager edit view configuration.
 * This is the source of truth for field labels and descriptions shown in the
 * Strapi admin edit view. Applied on every startup via bootstrap().
 *
 * To add a new component: add an entry to COMPONENT_CONFIGS using the
 * component's UID as the key (e.g. "layout.page-header").
 *
 * To add a new content type: add an entry to CONTENT_TYPE_CONFIGS using the
 * content type's UID as the key (e.g. "api::destination.destination").
 */

export const COMPONENT_CONFIGS: Record<string, ComponentConfig> = {
  "shared.link": {
    mainField: "label",
    fields: {
      label: {
        label: "Label",
        description: "Button or link text visible to the user.",
      },
      href: {
        label: "URL",
        description: "Destination URL — use a relative path (e.g. /about) for internal pages.",
      },
      isExternal: {
        label: "Opens in new tab",
        description: "Turn on for links to external websites.",
      },
      isButtonLink: {
        label: "Styled as button",
        description: "Renders as a button instead of a plain text link.",
      },
      type: {
        label: "Button style",
        description: "PRIMARY = filled / accent colour. SECONDARY = outlined.",
      },
    },
  },
  "blocks.content-with-image": {
    fields: {
      heading: {
        label: "Heading",
        description: "Section heading displayed above the body text.",
      },
      text: {
        label: "Content",
        description: "Body text. Supports rich text formatting.",
      },
      imagePosition: {
        label: "Image position",
        description: "left — image on left; right — image on right; full_width — image spans full width below the text.",
      },
      image: {
        label: "Image",
        description: "Upload or select a media image.",
      },
      links: {
        label: "Buttons",
        description: "Add one or more call-to-action buttons. Use PRIMARY / SECONDARY type to style them differently.",
      },
    },
  },
  "blocks.featured-destinations": {
    fields: {
      title: {
        label: "Heading",
        description: "Large heading displayed on the left side of the section.",
      },
      content: {
        label: "Description",
        description: "Supporting text shown below the heading.",
      },
      destinations: {
        label: "Destinations",
        description: "Select the destination pages to feature in the slider.",
      },
    },
  },
  "blocks.embed-code": {
    fields: {
      code: {
        label: "Embed code",
        description: "Paste raw HTML — script tags, iframes, widgets. Rendered as-is on the page.",
      },
    },
  },
  "blocks.testimonials": {
    fields: {
      title: {
        label: "Heading",
        description: "Section heading displayed above the testimonial slider.",
      },
      content: {
        label: "Description",
        description: "Supporting text shown below the heading.",
      },
      testimonials: {
        label: "Testimonials",
        description: "Select testimonials to display in the slider.",
      },
    },
  },
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

export const CONTENT_TYPE_CONFIGS: Record<string, ContentTypeConfig> = {
  "api::destination.destination": {
    fields: {
      title: {
        label: "Title",
      },
      slug: {
        label: "Slug",
        description: "Auto-generated from the title. Each locale has its own unique slug — switch locale to set the translated slug.",
      },
      description: {
        label: "Description",
      },
      teaserImage: {
        label: "Teaser image",
        description: "Shown in cards and listings when this destination is referenced. Shared across all locales.",
      },
      pageHeader: {
        label: "Page header",
      },
      blocks: {
        label: "Content blocks",
      },
    },
  },
  "api::testimonial.testimonial": {
    fields: {
      title: {
        label: "Internal title",
        description: "Used only in the admin for identifying this testimonial — not shown on the site.",
      },
      content: {
        label: "Testimonial text",
        description: "The guest's review. Line breaks are preserved on the site.",
      },
      author: {
        label: "Author",
        description: "Displayed in bold below the testimonial text, e.g. \"Kenneth stayed in apartment Santa Barbara Heights\".",
      },
    },
  },
  "api::seo-config.seo-config": {
    fields: {
      destinationsBasePath: {
        label: "Destinations URL segment",
        description: "The URL word used for destination pages in this locale (e.g. 'destinations' in English, 'destinos' in Spanish). Changing this requires a site rebuild.",
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
  mainField?: string;
  fields: Record<string, FieldConfig>;
}

interface ContentTypeConfig {
  fields: Record<string, FieldConfig>;
}
