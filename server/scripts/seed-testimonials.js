const { createStrapi, compileStrapi } = require('@strapi/strapi');

const TESTIMONIALS = [
  {
    title: 'Kenneth - Santa Barbara Heights',
    content:
      'We absolutely loved this property and would stay forever if we could. If we could give this and the management company especially Miguel 10 stars, we would. Just book it!\nThe location and apartment block are gorgeous too',
    author: 'Kenneth stayed in apartment Santa Barbara Heights',
  },
  {
    title: 'Ken Fowler - Balcon Europa',
    content:
      'Another great property managed by the professional RinconRent team.\n\nThis property is beautiful and has the most magnificent sunny terrace and panoramic view.\nEverything works and the kitchen is very well stocked with everything you will ever need.\n\nWe would be very happy to return to this lovely neighbourhood.',
    author: 'Ken Fowler stayed in apartment Balcon Europa',
  },
  {
    title: 'Charlotte - Malaga Center',
    content:
      "It's the perfect apartment — everything you could ask for. The team was incredibly helpful and the location is unbeatable. The restaurants nearby are phenomenal. We will definitely be returning.",
    author: 'Charlotte stayed in apartment Malaga Center',
  },
  {
    title: 'James - Sea View Penthouse',
    content:
      'Exceptional apartment with stunning sea views. RinconRent made the whole process seamless from booking to check-out. The apartment was spotless and exactly as described.\n\nHighly recommend to anyone visiting Malaga.',
    author: 'James stayed in Sea View Penthouse',
  },
];

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  for (const testimonial of TESTIMONIALS) {
    await app.documents('api::testimonial.testimonial').create({
      data: testimonial,
      status: 'published',
    });
    console.log(`✓ Created: ${testimonial.title}`);
  }

  console.log(`\nSeeded ${TESTIMONIALS.length} testimonials.`);
  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
