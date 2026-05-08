const { createStrapi, compileStrapi } = require("@strapi/strapi");

const FAQS = [
  {
    title: "How do I book a rental?",
    question: "How do I book a rental?",
    answer:
      "Booking is easy — browse our listings, select your dates, and submit an enquiry or book directly online. Our team will confirm availability and send you all the details within 24 hours.",
  },
  {
    title: "What is included in the rental price?",
    question: "What is included in the rental price?",
    answer:
      "All our properties include WiFi, linen, towels, and a fully equipped kitchen. Some properties also include a parking space or pool access — check the individual listing for details.",
  },
  {
    title: "Is there a minimum stay?",
    question: "Is there a minimum stay?",
    answer:
      "Most properties have a minimum stay of 3–7 nights depending on the season. Short breaks may be available outside peak periods — contact us and we will do our best to accommodate.",
  },
  {
    title: "What is the cancellation policy?",
    question: "What is the cancellation policy?",
    answer:
      "Our standard policy allows free cancellation up to 30 days before arrival. Cancellations within 30 days of arrival forfeit the deposit. Full details are provided at the time of booking.",
  },
  {
    title: "Can I bring my pet?",
    question: "Can I bring my pet?",
    answer:
      "Some of our properties are pet-friendly. Please check the listing or contact us before booking so we can match you with a suitable apartment.",
  },
  {
    title: "What time is check-in and check-out?",
    question: "What time is check-in and check-out?",
    answer:
      "Standard check-in is from 3 pm and check-out is by 11 am. Early check-in or late check-out can often be arranged subject to availability — just let us know in advance.",
  },
  {
    title: "Is airport transfer available?",
    question: "Is airport transfer available?",
    answer:
      "Yes, we can arrange airport transfers to and from Málaga–Costa del Sol Airport. Please request this at least 48 hours before your arrival so we can confirm the booking.",
  },
];

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = "error";

  // 1. Set public permissions (skip if already granted)
  const publicRole = await app.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
  });

  for (const action of ["find", "findOne"]) {
    const actionKey = `api::faq.faq.${action}`;
    const existing = await app.query("plugin::users-permissions.permission").findOne({
      where: { action: actionKey, role: publicRole.id },
    });
    if (!existing) {
      await app.query("plugin::users-permissions.permission").create({
        data: { action: actionKey, role: publicRole.id },
      });
      console.log(`✓ Permission granted: ${actionKey}`);
    } else {
      console.log(`  Permission already set: ${actionKey}`);
    }
  }

  // 2. Create FAQ entries (skip if question already exists)
  for (const faq of FAQS) {
    const existing = await app.documents("api::faq.faq").findFirst({
      filters: { question: { $eq: faq.question } },
    });
    if (existing) {
      console.log(`  Skipped (exists): ${faq.title}`);
      continue;
    }
    await app.documents("api::faq.faq").create({
      data: faq,
      status: "published",
    });
    console.log(`✓ Created: ${faq.title}`);
  }

  console.log(`\nSeeded ${FAQS.length} FAQs.`);
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
