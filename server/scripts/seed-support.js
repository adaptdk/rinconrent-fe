const { createStrapi, compileStrapi } = require("@strapi/strapi");

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = "error";

  const global = await app.documents("api::global.global").findFirst({});

  if (!global) {
    console.error(
      "Global entry not found. Ensure Strapi has been started at least once.",
    );
    await app.destroy();
    process.exit(1);
  }

  await app.documents("api::global.global").update({
    documentId: global.documentId,
    data: {
      support: {
        contactPhone: "+34 952 472 429",
        contactEmail: "info@rinconrent.com",
        contactAddress:
          "Centro Idea, Carretera de Mijas, km 3.6, 29650 Mijas (Málaga)",
        card: [
          {
            icon: "fa-solid fa-comments",
            heading: "Chat to team",
            text: "Speak to our friendly team",
            link: {
              href: "mailto:info@rinconrent.com",
              label: "info@rinconrent.com",
              isExternal: false,
              isButtonLink: false,
            },
          },
          {
            icon: "fa-solid fa-phone",
            heading: "Call us",
            text: "We're here to help",
            link: {
              href: "tel:+34952472429",
              label: "+34 952 472 429",
              isExternal: false,
              isButtonLink: false,
            },
          },
          {
            icon: "fa-solid fa-location-dot",
            heading: "Visit us",
            text: "Centro Idea, Carretera de Mijas, km 3.6, 29650 Mijas (Málaga)",
            link: {
              href: "https://share.google/ZYFILuz6BmGawjP4S",
              label: "Get directions",
              isExternal: true,
              isButtonLink: false,
            },
          },
        ],
      },
    },
    status: "published",
  });

  console.log("Support seeded successfully.");
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
