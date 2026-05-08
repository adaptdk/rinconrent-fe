import { strapiClient } from "./strapi-client";

const blocksPopulate = {
  on: {
    "blocks.hero": {
      fields: ["heading", "text", "mediaType", "textDark"],
      populate: {
        image: { fields: ["url", "alternativeText"] },
        video: { fields: ["url", "alternativeText", "mime"] },
        links: true,
      },
    },
    "blocks.heading-section": true,
    "blocks.card-grid": {
      populate: {
        card: true,
      },
    },
    "blocks.content-with-image": {
      populate: {
        image: { fields: ["url", "alternativeText"] },
        links: { fields: ["href", "label", "isExternal", "type"] },
      },
    },
    "blocks.faqs": {
      populate: {
        faq: true,
      },
    },
    "blocks.person-card": {
      populate: {
        image: {
          fields: ["url", "alternativeText"],
        },
      },
    },
    "blocks.markdown": true,
    "blocks.featured-articles": {
      populate: {
        articles: {
          populate: {
            featuredImage: {
              fields: ["url", "alternativeText"],
            },
            author: {
              populate: {
                image: {
                  fields: ["url", "alternativeText"],
                },
              },
            },
          },
        },
      },
    },
    "blocks.newsletter": true,
    "blocks.community-links": {
      populate: {
        link: true,
      },
    },
    "blocks.featured-workshops": {
      populate: {
        workshops: {
          populate: {
            coverImage: {
              fields: ["url", "alternativeText"],
            },
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

async function getSingleType(name: string, params: object) {
  const data = await strapiClient.single(name).find(params);
  return data;
}

async function getGlobalPageData() {
  const data = await getSingleType("global", {
    populate: {
      banner: {
        populate: {
          link: {
            fields: ["href", "label", "isExternal"],
          },
        },
      },
      header: {
        populate: {
          logo: {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
          topNav: true,
          navItems: {
            populate: {
              children: true,
            },
          },
          ctaGroup: {
            populate: {
              children: true,
            },
          },
        },
      },
      footer: {
        populate: {
          logo: {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
          footerMenus: {
            populate: {
              links: {
                fields: ["href", "label", "isExternal", "isButtonLink", "type"],
              },
            },
          },
        },
      },
      socialLinks: {
        fields: ["platform", "href", "label"],
      },
      partners: {
        fields: ["title", "description"],
        populate: {
          partners: {
            fields: ["name", "link"],
            populate: {
              logo: { fields: ["url", "alternativeText"] },
            },
          },
        },
      },
    },
  });
  const globalData = data?.data;
  if (!globalData) throw new Error("No global data found");
  return globalData;
}

async function getLandingPageData() {
  const data = await getSingleType("landing-page", {
    populate: {
      pageHeader: {
        fields: ["hideHeader", "headerType", "headerSize", "horizontalLayout", "pretitle", "title", "subtitle"],
        populate: {
          image: { fields: ["url", "alternativeText"] },
          video: { fields: ["url", "alternativeText", "mime"] },
        },
      },
      blocks: blocksPopulate,
    },
  });
  return data;
}

const pageHeaderPopulate = {
  fields: ["hideHeader", "headerType", "headerSize", "horizontalLayout", "pretitle", "title", "subtitle"],
  populate: {
    image: { fields: ["url", "alternativeText"] },
    video: { fields: ["url", "alternativeText", "mime"] },
  },
};

async function getPageHeader(slug: string) {
  const data = await strapiClient.collection("pages").find({
    filters: { slug: { $eq: slug } },
    fields: ["slug"],
    populate: { pageHeader: pageHeaderPopulate },
    pagination: { limit: 1 },
  } as any);
  return (data?.data?.[0] as any)?.pageHeader ?? null;
}

async function getAllPageSlugs(): Promise<string[]> {
  const pages = await strapiClient.collection("pages").find({
    fields: ["slug"],
    pagination: { limit: 200 },
  } as any);
  return (pages?.data ?? []).map((p: any) => p.slug).filter(Boolean);
}

async function getPageData(slug: string) {
  const data = await strapiClient.collection("pages").find({
    filters: { slug: { $eq: slug } },
    fields: ["title", "slug", "description"],
    populate: {
      pageHeader: pageHeaderPopulate,
      blocks: blocksPopulate,
    },
    pagination: { limit: 1 },
  } as any);
  return (data?.data?.[0] as any) ?? null;
}

async function getAllDestinationSlugs(locale = "en"): Promise<string[]> {
  const destinations = await strapiClient.collection("destinations").find({
    locale,
    fields: ["slug"],
    pagination: { limit: 200 },
  } as any);
  return (destinations?.data ?? []).map((d: any) => d.slug).filter(Boolean);
}

async function getDestinationData(slug: string, locale = "en") {
  const data = await strapiClient.collection("destinations").find({
    locale,
    filters: { slug: { $eq: slug } },
    fields: ["title", "slug", "description", "locale"],
    populate: {
      teaserImage: { fields: ["url", "alternativeText"] },
      pageHeader: pageHeaderPopulate,
      blocks: blocksPopulate,
    },
    pagination: { limit: 1 },
  } as any);
  return (data?.data?.[0] as any) ?? null;
}

async function getSeoConfig(locale = "en"): Promise<{
  destinationsBasePath?: string;
  travelGuidesBasePath?: string;
  investorGuidesBasePath?: string;
}> {
  try {
    const data = await strapiClient.single("seo-config").find({
      locale,
      fields: ["destinationsBasePath", "travelGuidesBasePath", "investorGuidesBasePath"],
    } as any);
    return (data?.data ?? {}) as {
      destinationsBasePath?: string;
      travelGuidesBasePath?: string;
      investorGuidesBasePath?: string;
    };
  } catch {
    // No entry created yet — use schema defaults.
    return {};
  }
}

// ── Guide block populate (used by all guide loader functions) ─────────────────

const guidesBlocksPopulate = {
  on: {
    "blocks.markdown": true,
    "blocks.faqs": { populate: { faq: true } },
    "blocks.heading-section": true,
  },
};

// ── Travel guide loaders ──────────────────────────────────────────────────────

async function getAllTravelGuideSlugs(locale = "en"): Promise<string[]> {
  const guides = await strapiClient.collection("travel-guides").find({
    locale,
    fields: ["slug"],
    pagination: { limit: 200 },
  } as any);
  return (guides?.data ?? []).map((g: any) => g.slug).filter(Boolean);
}

async function getTravelGuideData(slug: string, locale = "en") {
  const data = await strapiClient.collection("travel-guides").find({
    locale,
    filters: { slug: { $eq: slug } },
    fields: ["title", "slug", "description", "content", "locale", "publishedAt"],
    populate: {
      featuredImage: { fields: ["url", "alternativeText"] },
      category: { fields: ["title", "slug"] },
      blocks: guidesBlocksPopulate,
    },
    pagination: { limit: 1 },
  } as any);
  return (data?.data?.[0] as any) ?? null;
}

async function getTravelGuideCategories(locale = "en") {
  const data = await strapiClient.collection("travel-guide-categories").find({
    locale,
    fields: ["title", "slug", "description"],
    pagination: { limit: 100 },
  } as any);
  return (data?.data ?? []) as any[];
}

// ── Investor guide loaders ────────────────────────────────────────────────────

async function getAllInvestorGuideSlugs(locale = "en"): Promise<string[]> {
  const guides = await strapiClient.collection("investor-guides").find({
    locale,
    fields: ["slug"],
    pagination: { limit: 200 },
  } as any);
  return (guides?.data ?? []).map((g: any) => g.slug).filter(Boolean);
}

async function getInvestorGuideData(slug: string, locale = "en") {
  const data = await strapiClient.collection("investor-guides").find({
    locale,
    filters: { slug: { $eq: slug } },
    fields: ["title", "slug", "description", "content", "locale", "publishedAt"],
    populate: {
      featuredImage: { fields: ["url", "alternativeText"] },
      category: { fields: ["title", "slug"] },
      blocks: guidesBlocksPopulate,
    },
    pagination: { limit: 1 },
  } as any);
  return (data?.data?.[0] as any) ?? null;
}

async function getInvestorGuideCategories(locale = "en") {
  const data = await strapiClient.collection("investor-guide-categories").find({
    locale,
    fields: ["title", "slug", "description"],
    pagination: { limit: 100 },
  } as any);
  return (data?.data ?? []) as any[];
}

export {
  getGlobalPageData,
  getLandingPageData,
  getPageHeader,
  getAllPageSlugs,
  getPageData,
  getAllDestinationSlugs,
  getDestinationData,
  getSeoConfig,
  getAllTravelGuideSlugs,
  getTravelGuideData,
  getTravelGuideCategories,
  getAllInvestorGuideSlugs,
  getInvestorGuideData,
  getInvestorGuideCategories,
};
