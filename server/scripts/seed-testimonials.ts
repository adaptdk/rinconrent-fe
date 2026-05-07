/**
 * Seeds sample testimonial entries via the Strapi REST API.
 * Run from the server/ directory:
 *   npx tsx scripts/seed-testimonials.ts
 *
 * Requires Strapi to be running on http://localhost:1337.
 * Set STRAPI_ADMIN_EMAIL and STRAPI_ADMIN_PASSWORD env vars, or pass inline:
 *   STRAPI_ADMIN_EMAIL=admin@example.com STRAPI_ADMIN_PASSWORD=pass npx tsx scripts/seed-testimonials.ts
 */

const BASE_URL = "http://localhost:1337";
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL ?? "admin@example.com";
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD ?? "Admin1234!";

const TESTIMONIALS = [
  {
    title: "Kenneth - Santa Barbara Heights",
    content:
      "We absolutely loved this property and would stay forever if we could. If we could give this and the management company especially Miguel 10 stars, we would. Just book it!\nThe location and apartment block are gorgeous too",
    author: "Kenneth stayed in apartment Santa Barbara Heights",
  },
  {
    title: "Ken Fowler - Balcon Europa",
    content:
      "Another great property managed by the professional RinconRent team.\n\nThis property is beautiful and has the most magnificent sunny terrace and panoramic view.\nEverything works and the kitchen is very well stocked with everything you will ever need.\n\nWe would be very happy to return to this lovely neighbourhood.",
    author: "Ken Fowler stayed in apartment Balcon Europa",
  },
  {
    title: "Charlotte - Malaga Center",
    content:
      "It's the perfect apartment — everything you could ask for. The team was incredibly helpful and the location is unbeatable. The restaurants nearby are phenomenal. We will definitely be returning.",
    author: "Charlotte stayed in apartment Malaga Center",
  },
  {
    title: "James - Sea View Penthouse",
    content:
      "Exceptional apartment with stunning sea views. RinconRent made the whole process seamless from booking to check-out. The apartment was spotless and exactly as described.\n\nHighly recommend to anyone visiting Malaga.",
    author: "James stayed in Sea View Penthouse",
  },
];

async function getAdminToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Admin login failed: ${res.status} ${text}`);
  }
  const json = await res.json() as { data?: { token?: string } };
  const token = json.data?.token;
  if (!token) throw new Error("No token in admin login response");
  return token;
}

async function createTestimonial(data: (typeof TESTIMONIALS)[0], token: string) {
  const res = await fetch(`${BASE_URL}/api/testimonials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        ...data,
        publishedAt: new Date().toISOString(),
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create testimonial "${data.title}": ${res.status} ${text}`);
  }

  const json = await res.json() as { data?: { id?: number } };
  console.log(`✓ Created: ${data.title} (id: ${json.data?.id})`);
  return json.data;
}

async function main() {
  console.log("Seeding testimonials...\n");

  const token = await getAdminToken();

  for (const testimonial of TESTIMONIALS) {
    await createTestimonial(testimonial, token);
  }

  console.log("\nDone. Add a Testimonials block to a page in the Strapi admin and select these entries.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
