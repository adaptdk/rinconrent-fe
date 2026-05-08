import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { strapiLoader } from "strapi-community-astro-loader";

const clientConfig = {
  baseURL: import.meta.env.STRAPI_BASE_URL || "http://localhost:1337/api",
};

// ── Reusable schemas ──

const imageSchema = z.object({
  id: z.number().optional(),
  documentId: z.string().optional(),
  url: z.string(),
  alternativeText: z.string().nullable().optional(),
});

const linkSchema = z.object({
  href: z.string(),
  label: z.string().optional(),
  isExternal: z.boolean().optional(),
  isButtonLink: z.boolean().optional(),
  type: z.enum(["PRIMARY", "SECONDARY"]).nullable().optional(),
});

const pageHeaderSchema = z.object({
  hideHeader: z.boolean().optional(),
  headerType: z.enum(["text", "image", "video"]).optional(),
  headerSize: z.enum(["small", "medium"]).optional(),
  horizontalLayout: z.boolean().optional(),
  pretitle: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  subtitle: z.string().nullable().optional(),
  image: imageSchema.nullable().optional(),
  video: z.object({
    url: z.string(),
    alternativeText: z.string().nullable().optional(),
    mime: z.string().optional(),
  }).nullable().optional(),
}).nullable().optional();

const blockBase = {
  id: z.number().optional(),
  __component: z.string(),
  documentId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  publishedAt: z.string().optional(),
};

// ── Block schemas ──

const blockSchema = z.discriminatedUnion("__component", [
  z.object({
    ...blockBase,
    __component: z.literal("blocks.hero"),
    heading: z.string(),
    text: z.string(),
    mediaType: z.enum(["image", "video"]).nullable().optional(),
    image: imageSchema.nullable().optional(),
    video: z.object({
      url: z.string(),
      alternativeText: z.string().nullable().optional(),
      mime: z.string().optional(),
    }).nullable().optional(),
    textDark: z.preprocess(v => (typeof v === "boolean" ? v : false), z.boolean()).optional(),
    links: z.array(linkSchema).optional(),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.heading-section"),
    heading: z.string(),
    subHeading: z.string(),
    anchorLink: z.string().nullable().optional(),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.card-grid"),
    card: z.array(
      z.object({
        id: z.number().optional(),
        heading: z.string(),
        text: z.string(),
        image: imageSchema.optional(),
      })
    ),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.content-with-image"),
    heading: z.string(),
    text: z.string(),
    imagePosition: z.enum(["left", "right", "full_width"]).nullish().transform(v => v ?? "right"),
    image: imageSchema,
    links: z.array(linkSchema).optional(),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.faqs"),
    faq: z.array(
      z.object({
        heading: z.string(),
        text: z.string(),
      })
    ),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.person-card"),
    personName: z.string(),
    personJob: z.string(),
    image: imageSchema.optional(),
    text: z.string(),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.markdown"),
    content: z.string(),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.featured-articles"),
    articles: z.array(
      z.object({
        id: z.number().optional(),
        documentId: z.string().optional(),
        title: z.string(),
        description: z.string(),
        slug: z.string(),
        publishedAt: z.string().optional(),
        updatedAt: z.string().optional(),
        author: z.object({
          id: z.number().optional(),
          documentId: z.string().optional(),
          fullName: z.string(),
          image: imageSchema.optional(),
        }),
        featuredImage: imageSchema,
      })
    ),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.newsletter"),
    heading: z.string(),
    text: z.string(),
    placeholder: z.string(),
    label: z.string(),
    formId: z.string().nullable().optional(),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.community-links"),
    heading: z.string().nullable().optional(),
    link: z.array(
      z.object({
        id: z.number().optional(),
        title: z.string(),
        description: z.string(),
        href: z.string(),
        label: z.string(),
      })
    ).optional(),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.featured-destinations"),
    title: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    destinations: z.array(
      z.object({
        id: z.number().optional(),
        documentId: z.string().optional(),
        title: z.string().nullable().optional(),
        slug: z.string(),
        teaserImage: imageSchema.nullable().optional(),
      })
    ).optional(),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.featured-workshops"),
    workshops: z.array(
      z.object({
        id: z.number().optional(),
        documentId: z.string().optional(),
        title: z.string(),
        description: z.string(),
        slug: z.string(),
        instructor: z.string().nullable().optional(),
        skillLevel: z.string().nullable().optional(),
        duration: z.string().nullable().optional(),
        price: z.number().nullable().optional(),
        coverImage: imageSchema.nullable().optional(),
      })
    ),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.embed-code"),
    code: z.string().nullable().optional(),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.testimonials"),
    title: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    testimonials: z.array(
      z.object({
        id: z.number().optional(),
        documentId: z.string().optional(),
        content: z.string(),
        author: z.string(),
      })
    ).optional(),
  }),
]);

// ── Populate configs ──
// Use `fields` to select only needed columns and `on` for dynamic zones.

const blocksPopulate = {
  on: {
    "blocks.hero": {
      fields: ["heading", "text", "mediaType", "textDark"],
      populate: {
        image: { fields: ["url", "alternativeText"] },
        video: { fields: ["url", "alternativeText", "mime"] },
        links: { fields: ["href", "label", "isExternal", "isButtonLink", "type"] },
      },
    },
    "blocks.heading-section": {
      fields: ["heading", "subHeading", "anchorLink"],
    },
    "blocks.card-grid": {
      populate: {
        card: { fields: ["heading", "text"] },
      },
    },
    "blocks.content-with-image": {
      fields: ["heading", "text", "imagePosition"],
      populate: {
        image: { fields: ["url", "alternativeText"] },
        links: true,
      },
    },
    "blocks.faqs": {
      populate: {
        faq: { fields: ["heading", "text"] },
      },
    },
    "blocks.person-card": {
      fields: ["personName", "personJob", "text"],
      populate: {
        image: { fields: ["url", "alternativeText"] },
      },
    },
    "blocks.markdown": {
      fields: ["content"],
    },
    "blocks.featured-articles": {
      populate: {
        articles: {
          fields: ["title", "description", "slug", "publishedAt", "updatedAt"],
          populate: {
            featuredImage: { fields: ["url", "alternativeText"] },
            author: {
              fields: ["fullName"],
              populate: {
                image: { fields: ["url", "alternativeText"] },
              },
            },
          },
        },
      },
    },
    "blocks.newsletter": {
      fields: ["heading", "text", "placeholder", "label", "formId"],
    },
    "blocks.community-links": {
      fields: ["heading"],
      populate: {
        link: { fields: ["title", "description", "href", "label"] },
      },
    },
    "blocks.featured-workshops": {
      populate: {
        workshops: {
          fields: ["title", "description", "slug", "instructor", "skillLevel", "duration", "price"],
          populate: {
            coverImage: { fields: ["url", "alternativeText"] },
          },
        },
      },
    },
    "blocks.featured-destinations": {
      fields: ["title", "content"],
      populate: {
        destinations: {
          fields: ["title", "slug"],
          populate: {
            teaserImage: { fields: ["url", "alternativeText"] },
          },
        },
      },
    },
    "blocks.embed-code": {
      fields: ["code"],
    },
    "blocks.testimonials": {
      fields: ["title", "content"],
      populate: {
        testimonials: {
          fields: ["content", "author"],
        },
      },
    },
  },
};

const pageHeaderPopulate = {
  fields: ["hideHeader", "headerType", "headerSize", "horizontalLayout", "pretitle", "title", "subtitle"],
  populate: {
    image: { fields: ["url", "alternativeText"] },
    video: { fields: ["url", "alternativeText", "mime"] },
  },
};

// ── Collections ──

const strapiPosts = defineCollection({
  loader: strapiLoader({
    contentType: "article",
    clientConfig,
    params: {
      fields: ["title", "slug", "description", "content", "publishedAt", "updatedAt"],
      populate: {
        featuredImage: { fields: ["url", "alternativeText"] },
        author: {
          fields: ["fullName"],
          populate: {
            image: { fields: ["url", "alternativeText"] },
          },
        },
        contentTags: { fields: ["title"] },
        blocks: blocksPopulate,
      },
    },
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    publishedAt: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    featuredImage: imageSchema.optional(),
    author: z
      .object({
        id: z.number().optional(),
        documentId: z.string().optional(),
        fullName: z.string(),
        image: imageSchema.optional(),
      })
      .optional(),
    contentTags: z
      .array(
        z.object({
          id: z.number().optional(),
          documentId: z.string().optional(),
          title: z.string(),
        })
      )
      .optional(),
    blocks: z.array(blockSchema).optional(),
  }),
});

const strapiPages = defineCollection({
  loader: strapiLoader({
    contentType: "page",
    clientConfig,
    params: {
      fields: ["title", "slug"],
      populate: {
        blocks: blocksPopulate,
      },
    },
  }),
  schema: z.object({
    title: z.string().nullable().optional(),
    slug: z.preprocess(v => (typeof v === "string" ? v : null), z.string().nullable().optional()),
    blocks: z.array(blockSchema).optional(),
  }),
});

const strapiWorkshops = defineCollection({
  loader: strapiLoader({
    contentType: "workshop",
    clientConfig,
    params: {
      fields: ["title", "slug", "description", "instructor", "skillLevel", "duration", "date", "price", "learningOutcomes"],
      populate: {
        coverImage: { fields: ["url", "alternativeText"] },
      },
    },
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    instructor: z.string().nullable().optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced"]).nullable().optional(),
    duration: z.string().nullable().optional(),
    date: z.string().nullable().optional(),
    price: z.number().nullable().optional(),
    coverImage: imageSchema.nullable().optional(),
    learningOutcomes: z.string().nullable().optional(),
  }),
});

const strapiProducts = defineCollection({
  loader: strapiLoader({
    contentType: "product",
    clientConfig,
    params: {
      fields: ["title", "slug", "description", "price", "category", "material"],
      populate: {
        image: { fields: ["url", "alternativeText"] },
      },
    },
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    price: z.number(),
    category: z.enum(["outerwear", "tops", "bottoms", "accessories"]),
    material: z.string().nullable().optional(),
    image: imageSchema.nullable().optional(),
  }),
});

const strapiDestinations = defineCollection({
  loader: strapiLoader({
    contentType: "destination",
    clientConfig,
    params: {
      locale: "all",
      fields: ["title", "slug", "locale"],
      populate: {
        teaserImage: { fields: ["url", "alternativeText"] },
        pageHeader: pageHeaderPopulate,
        blocks: blocksPopulate,
      },
    },
  }),
  schema: z.object({
    title: z.string().nullable().optional(),
    slug: z.string(),
    locale: z.string().optional(),
    teaserImage: imageSchema.nullable().optional(),
    pageHeader: pageHeaderSchema,
    blocks: z.array(blockSchema).optional(),
  }),
});

// ── Guide block populate (only the 3 blocks used by guides) ──────────────────
// NOTE: Keep in sync with guidesBlocksPopulate in client/src/utils/loaders.ts

const guideBlocksPopulate = {
  on: {
    "blocks.markdown": {
      fields: ["content"],
    },
    "blocks.faqs": {
      populate: {
        faq: { fields: ["heading", "text"] },
      },
    },
    "blocks.heading-section": {
      fields: ["heading", "subHeading", "anchorLink"],
    },
  },
};

// ── Guide block schema ────────────────────────────────────────────────────────

const guideBlockSchema = z.discriminatedUnion("__component", [
  z.object({
    ...blockBase,
    __component: z.literal("blocks.markdown"),
    content: z.string(),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.faqs"),
    faq: z.array(
      z.object({
        id: z.number().optional(),
        heading: z.string(),
        text: z.string(),
      })
    ),
  }),
  z.object({
    ...blockBase,
    __component: z.literal("blocks.heading-section"),
    heading: z.string(),
    subHeading: z.string().nullable().optional(),
    anchorLink: z.string().nullable().optional(),
  }),
]);

// ── Guide category schema ─────────────────────────────────────────────────────

const guideCategorySchema = z.object({
  id: z.number().optional(),
  documentId: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
});

// ── Guide collection schema ───────────────────────────────────────────────────

const guideCollectionSchema = z.object({
  title: z.string().nullable().optional(),
  slug: z.string(),
  locale: z.string().optional(),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  featuredImage: imageSchema.nullable().optional(),
  category: guideCategorySchema.nullable().optional(),
  blocks: z.array(guideBlockSchema).optional(),
});

// ── Guide collections ─────────────────────────────────────────────────────────

const strapiTravelGuides = defineCollection({
  loader: strapiLoader({
    contentType: "travel-guide",
    clientConfig,
    params: {
      locale: "all",
      fields: ["title", "slug", "locale", "description", "content", "publishedAt"],
      populate: {
        featuredImage: { fields: ["url", "alternativeText"] },
        category: { fields: ["title", "slug"] },
        blocks: guideBlocksPopulate,
      },
    },
  }),
  schema: guideCollectionSchema,
});

const strapiInvestorGuides = defineCollection({
  loader: strapiLoader({
    contentType: "investor-guide",
    clientConfig,
    params: {
      locale: "all",
      fields: ["title", "slug", "locale", "description", "content", "publishedAt"],
      populate: {
        featuredImage: { fields: ["url", "alternativeText"] },
        category: { fields: ["title", "slug"] },
        blocks: guideBlocksPopulate,
      },
    },
  }),
  schema: guideCollectionSchema,
});

const strapiTravelGuideCategories = defineCollection({
  loader: strapiLoader({
    contentType: "travel-guide-category",
    pluralContentType: "travel-guide-categories",
    clientConfig,
    params: {
      locale: "all",
      fields: ["title", "slug", "locale", "description"],
    },
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    locale: z.string().optional(),
    description: z.string().nullable().optional(),
  }),
});

const strapiInvestorGuideCategories = defineCollection({
  loader: strapiLoader({
    contentType: "investor-guide-category",
    pluralContentType: "investor-guide-categories",
    clientConfig,
    params: {
      locale: "all",
      fields: ["title", "slug", "locale", "description"],
    },
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    locale: z.string().optional(),
    description: z.string().nullable().optional(),
  }),
});

export const collections = {
  strapiPosts,
  strapiPages,
  strapiWorkshops,
  strapiProducts,
  strapiDestinations,
  strapiTravelGuides,
  strapiInvestorGuides,
  strapiTravelGuideCategories,
  strapiInvestorGuideCategories,
};
