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
        image: {
          fields: ["url", "alternativeText"],
        },
        link: true,
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
      }
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

export { getGlobalPageData, getLandingPageData, getPageHeader };
