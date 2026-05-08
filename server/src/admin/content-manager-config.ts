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
  "blocks.card-grid": {
    fields: {
      title: {
        label: "Section heading",
        description: "Large heading displayed above the card grid.",
      },
      subtitle: {
        label: "Section description",
        description: "Supporting text shown below the heading.",
      },
      noPadding: {
        label: "Remove card padding & background",
        description: "Turn on to display cards as plain content without the white box, border, and shadow.",
      },
      card: {
        label: "Cards",
        description: "Add one card per feature, benefit, or item.",
      },
    },
  },
  "shared.card": {
    mainField: "heading",
    fields: {
      heading: {
        label: "Title",
        description: "Card heading — keep it short and punchy.",
      },
      text: {
        label: "Description",
        description: "Short supporting text shown below the title.",
      },
      icon: {
        label: "Icon (Font Awesome class)",
        description: "Full Font Awesome class string, e.g. 'fa-solid fa-star' or 'fa-solid fa-chart-bar'.",
      },
      link: {
        label: "Link",
        description: "Optional link shown below the description (e.g. email, phone, or a page URL). Max 1.",
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
  "blocks.numbers": {
    fields: {
      title: {
        label: "Section heading",
        description: "Large heading displayed above the stats grid.",
      },
      subtitle: {
        label: "Section description",
        description: "Supporting text shown below the heading.",
      },
      numbers: {
        label: "Stats",
        description: "Each stat card shows a large number/title, a subtitle, and a decorative icon.",
      },
    },
  },
  "blocks.number-item": {
    fields: {
      title: {
        label: "Stat",
        description: "The main stat or number, e.g. '300+' or '$2M'.",
      },
      subtitle: {
        label: "Label",
        description: "Short description shown below the stat.",
      },
      icon: {
        label: "Icon (Font Awesome class)",
        description: "Full Font Awesome class string, e.g. 'fa-solid fa-chart-bar' or 'fa-solid fa-users'. Used as a decorative watermark.",
      },
    },
  },
  "blocks.faqs": {
    fields: {
      title: {
        label: "Section heading",
        description: "Large heading displayed on the left side of the section.",
      },
      subtitle: {
        label: "Section description",
        description: "Supporting text shown below the heading.",
      },
      link: {
        label: "Button",
        description: "Optional call-to-action button shown below the description.",
      },
      faqs: {
        label: "FAQ items",
        description: "Search and select FAQ entries to display in the accordion.",
      },
    },
  },
  "blocks.support": {
    fields: {
      title: {
        label: "Section heading",
        description: "Heading displayed above the support cards.",
      },
      subtitle: {
        label: "Section description",
        description: "Supporting text shown below the heading.",
      },
    },
  },
  "layout.support": {
    fields: {
      contactPhone: {
        label: "Phone number",
        description: "Displayed in the footer. Include country code, e.g. +1 555 123 4567.",
      },
      contactEmail: {
        label: "Email address",
        description: "Displayed in the footer as a mailto link.",
      },
      contactAddress: {
        label: "Address",
        description: "Physical address displayed in the footer.",
      },
      card: {
        label: "Get in touch cards",
        description: "Up to 3 cards shown in the Support block. Each card has a title, description, and optional FA icon.",
      },
    },
  },
  "blocks.featured-guides": {
    fields: {
      title: {
        label: "Section heading",
        description: "Large heading displayed above the guide cards.",
      },
      subtitle: {
        label: "Section description",
        description: "Supporting text shown below the heading.",
      },
      readMoreLink: {
        label: "View all button",
        description: "Optional CTA linking to the guides listing page.",
      },
      showPosts: {
        label: "Which guides to show",
        description:
          "latest_both — 3 newest across both types. latest_travel — 3 newest travel guides. latest_investor — 3 newest investor guides. selected — manually pick below.",
      },
      selectedTravelGuides: {
        label: "Selected travel guides",
        description: "Only used when 'Which guides to show' is set to 'selected'.",
      },
      selectedInvestorGuides: {
        label: "Selected investor guides",
        description: "Only used when 'Which guides to show' is set to 'selected'.",
      },
    },
  },
  "blocks.video-embed": {
    fields: {
      title: {
        label: "Title",
        description: "Heading displayed above or beside the video.",
      },
      subtitle: {
        label: "Subtitle",
        description: "Supporting text shown below the title.",
      },
      videoType: {
        label: "Video source",
        description: "youtube — paste a YouTube URL below. upload — upload a video file.",
      },
      youtubeUrl: {
        label: "YouTube URL",
        description: "Only used when Video source is set to 'youtube'. Paste the full watch URL (e.g. https://www.youtube.com/watch?v=...).",
      },
      videoFile: {
        label: "Video file",
        description: "Only used when Video source is set to 'upload'.",
      },
      twoColumns: {
        label: "Two-column layout",
        description: "On: title and subtitle sit on the left, video on the right. Off: title and subtitle appear above the video full-width (max 6xl).",
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
  "layout.partners": {
    fields: {
      title: {
        label: "Section heading",
        description: "Optional. Leave blank to show logos only.",
      },
      description: {
        label: "Section description",
        description: "Optional supporting text shown beside the heading.",
      },
      partners: {
        label: "Partners",
        description: "Add one entry per partner. Logos render in a horizontal row.",
      },
    },
  },
  "shared.partner": {
    mainField: "name",
    fields: {
      name: {
        label: "Partner name",
        description: "Used as image alt text and screen-reader label for the link.",
      },
      link: {
        label: "Website URL",
        description: "Full URL including https://. Opens in a new tab.",
      },
      logo: {
        label: "Logo image",
        description: "SVG or PNG with transparent background. Max-height 80px mobile / 150px desktop.",
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
  "api::faq.faq": {
    mainField: "question",
    fields: {
      title: {
        label: "Internal title",
        description: "Used only in the admin to identify this FAQ entry — not shown on the site.",
      },
      question: {
        label: "Question",
        description: "The FAQ question shown as the accordion heading.",
      },
      answer: {
        label: "Answer",
        description: "The full answer. Supports rich text — headings, bold, lists, links.",
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
      travelGuidesBasePath: {
        label: "Travel Guides URL segment",
        description: "The URL word used for travel guide pages in this locale (e.g. 'travel-guide' in English, 'guia-de-viaje' in Spanish). Changing this requires a site rebuild.",
      },
      investorGuidesBasePath: {
        label: "Investor Guides URL segment",
        description: "The URL word used for investor guide pages in this locale (e.g. 'investor-guide' in English, 'guia-del-inversor' in Spanish). Changing this requires a site rebuild.",
      },
    },
  },
  "api::travel-guide-category.travel-guide-category": {
    fields: {
      title: {
        label: "Title",
        description: "Category name. Each locale has its own translated title.",
      },
      slug: {
        label: "Slug",
        description: "Auto-generated from the title. Each locale has its own slug — switch locale to set the translated slug.",
      },
      description: {
        label: "Description",
        description: "Short description of what travel guides in this category cover.",
      },
    },
  },
  "api::investor-guide-category.investor-guide-category": {
    fields: {
      title: {
        label: "Title",
        description: "Category name. Each locale has its own translated title.",
      },
      slug: {
        label: "Slug",
        description: "Auto-generated from the title. Each locale has its own slug — switch locale to set the translated slug.",
      },
      description: {
        label: "Description",
        description: "Short description of what investor guides in this category cover.",
      },
    },
  },
  "api::travel-guide.travel-guide": {
    fields: {
      title: {
        label: "Title",
      },
      slug: {
        label: "Slug",
        description: "Auto-generated from the title. Each locale has its own unique slug — switch locale to set the translated slug.",
      },
      description: {
        label: "Excerpt",
        description: "Short summary shown in listing cards and social previews (2–3 sentences).",
      },
      content: {
        label: "Content",
        description: "Main article body. Supports Markdown — headings, bold, lists, links.",
      },
      category: {
        label: "Category",
        description: "The travel guide category this article belongs to.",
      },
      featuredImage: {
        label: "Featured image",
        description: "Hero image shown on the article page and in listing cards. Shared across all locales.",
      },
      blocks: {
        label: "Content blocks",
      },
    },
  },
  "api::investor-guide.investor-guide": {
    fields: {
      title: {
        label: "Title",
      },
      slug: {
        label: "Slug",
        description: "Auto-generated from the title. Each locale has its own unique slug — switch locale to set the translated slug.",
      },
      description: {
        label: "Excerpt",
        description: "Short summary shown in listing cards and social previews (2–3 sentences).",
      },
      content: {
        label: "Content",
        description: "Main article body. Supports Markdown — headings, bold, lists, links.",
      },
      category: {
        label: "Category",
        description: "The investor guide category this article belongs to.",
      },
      featuredImage: {
        label: "Featured image",
        description: "Hero image shown on the article page and in listing cards. Shared across all locales.",
      },
      blocks: {
        label: "Content blocks",
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
  mainField?: string;
  fields: Record<string, FieldConfig>;
}
