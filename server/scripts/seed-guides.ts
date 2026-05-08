/**
 * Seeds travel-guide-category, investor-guide-category, travel-guide,
 * and investor-guide entries via the Strapi REST API.
 *
 * Run from the server/ directory:
 *   npx tsx scripts/seed-guides.ts
 *
 * Requires Strapi to be running on http://localhost:1337.
 * Set STRAPI_ADMIN_EMAIL and STRAPI_ADMIN_PASSWORD env vars, or pass inline:
 *   STRAPI_ADMIN_EMAIL=admin@example.com STRAPI_ADMIN_PASSWORD=pass npx tsx scripts/seed-guides.ts
 */

export {}; // Make this file a module so its variables don't collide with other scripts.

const BASE_URL = "http://localhost:1337";
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL ?? "admin@example.com";
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD ?? "Admin1234!";

// ── Travel guide categories ──────────────────────────────────────────────────

const TRAVEL_CATEGORIES = [
  {
    title: "Beaches & Coastline",
    slug: "beaches-coastline",
    description: "Guides to Málaga's beaches, coves, and coastal walks.",
  },
  {
    title: "Food & Culture",
    slug: "food-culture",
    description: "Restaurants, tapas bars, local markets, and cultural highlights.",
  },
  {
    title: "Day Trips",
    slug: "day-trips",
    description: "Easy excursions from Málaga to Ronda, Granada, and beyond.",
  },
];

// ── Investor guide categories ────────────────────────────────────────────────

const INVESTOR_CATEGORIES = [
  {
    title: "Buying Property",
    slug: "buying-property",
    description: "Step-by-step guides for purchasing residential property in Málaga.",
  },
  {
    title: "Rental Regulations",
    slug: "rental-regulations",
    description: "VFT licences, short-term rental rules, and compliance in Andalusia.",
  },
  {
    title: "Returns & Yields",
    slug: "returns-yields",
    description: "Data-driven analysis of rental yields, occupancy, and net returns.",
  },
];

// ── Travel guide articles ────────────────────────────────────────────────────

const TRAVEL_GUIDES = [
  {
    title: "The Best Beaches Near Málaga",
    slug: "best-beaches-near-malaga",
    description:
      "From La Malagueta to hidden coves, our pick of the finest beaches within reach of the city.",
    categoryIndex: 0,
    blocks: [
      {
        __component: "blocks.heading-section",
        heading: "Sun, Sand and Sea",
        subHeading: "Everything you need to know before you pack your towel",
        anchorLink: "",
      },
      {
        __component: "blocks.markdown",
        content:
          "## La Malagueta\n\nThe city beach is minutes from the historic centre. Expect well-maintained sand, sunbeds for hire, and a string of chiringuitos serving fresh fish.\n\n## Playa de la Caleta\n\nA quieter alternative just west of the centre, popular with locals. Arrive early in summer.\n\n## El Palo\n\nThe eastern fishing district retains an authentic character. Try the *espetos* (sardines on a skewer) straight from the fire.",
      },
      {
        __component: "blocks.faqs",
        faq: [
          {
            heading: "What is the sea temperature in summer?",
            text: "The Mediterranean reaches 24–26°C between July and September — warm enough for comfortable swimming.",
          },
          {
            heading: "Are there Blue Flag beaches near Málaga?",
            text: "Yes. Several beaches hold Blue Flag status for water quality and facilities, including Playa de la Caleta and Playa del Palo.",
          },
        ],
      },
    ],
  },
  {
    title: "Top Tapas Bars in Málaga Old Town",
    slug: "top-tapas-bars-malaga-old-town",
    description:
      "A curated list of must-visit tapas bars in the historic centre, from traditional bodegas to modern pintxos.",
    categoryIndex: 1,
    blocks: [
      {
        __component: "blocks.heading-section",
        heading: "Eat Like a Local",
        subHeading: "Our favourite spots in the historic centre",
        anchorLink: "",
      },
      {
        __component: "blocks.markdown",
        content:
          "## El Pimpi\n\nThe most famous bodega in Málaga. Sample the sweet Moscatel wine alongside jamón and manchego.\n\n## Bar La Tranca\n\nA tiny, standing-room-only bar that has been pouring cold beer and free tapas since the 1970s. Arrive early.\n\n## Casa Aranda\n\nThe essential stop for breakfast — churros and thick hot chocolate in a covered courtyard just off the Atarazanas market.",
      },
      {
        __component: "blocks.faqs",
        faq: [
          {
            heading: "Do tapas bars in Málaga serve food at lunch?",
            text: "Yes — most open from around noon and serve until 4 pm, then again from 8 pm. Many offer free tapas with each drink.",
          },
          {
            heading: "Is English widely spoken in the old town bars?",
            text: "In the main tourist areas yes, but off the main streets it helps to know a few words of Spanish. Staff are almost always friendly regardless.",
          },
        ],
      },
    ],
  },
  {
    title: "Day Trip to Ronda from Málaga",
    slug: "day-trip-ronda-from-malaga",
    description:
      "How to visit Ronda — one of Andalusia's most dramatic white villages — in a single day.",
    categoryIndex: 2,
    blocks: [
      {
        __component: "blocks.heading-section",
        heading: "Ronda in a Day",
        subHeading: "Bridges, bullrings, and breathtaking views",
        anchorLink: "",
      },
      {
        __component: "blocks.markdown",
        content:
          "## Getting There\n\nThe direct train from Málaga María Zambrano takes around 2 hours. Book tickets in advance on the Renfe website.\n\n## What to See\n\n- **Puente Nuevo** — the 18th-century bridge spanning the 100-metre gorge\n- **Plaza de Toros** — one of Spain's oldest bullrings, now a museum\n- **Baths of Moors** — well-preserved Arab baths near the old bridge\n\n## Where to Eat\n\nThe streets around Plaza del Socorro have reliable restaurants. Try *rabo de toro* (oxtail stew), a local speciality.",
      },
      {
        __component: "blocks.faqs",
        faq: [
          {
            heading: "Can I do Ronda as a day trip?",
            text: "Easily. The train takes about 2 hours each way, leaving plenty of time to walk the main sights and have lunch.",
          },
          {
            heading: "Is Ronda worth visiting outside summer?",
            text: "Yes — spring and autumn are ideal. The crowds are smaller, the light is beautiful, and the mountain temperatures are comfortable.",
          },
        ],
      },
    ],
  },
  {
    title: "Málaga's Best Street Art and Hidden Murals",
    slug: "malaga-street-art-hidden-murals",
    description:
      "Explore the city's thriving street-art scene across Soho, El Perchel, and beyond.",
    categoryIndex: 1,
    blocks: [
      {
        __component: "blocks.heading-section",
        heading: "The Open-Air Gallery",
        subHeading: "Murals, stencils, and installations across the city",
        anchorLink: "",
      },
      {
        __component: "blocks.markdown",
        content:
          "Málaga's SOHO district hosts MAUS (Málaga Arte Urbano en Soho), a curated programme of large-scale murals by international artists. The district is walkable in 45 minutes.\n\n## Key Areas\n\n- **SOHO / Calle Alemania** — the heart of the mural trail\n- **El Perchel** — older neighbourhood with evolving street art\n- **El Ejido** — residential area with unexpected pieces on side streets",
      },
      {
        __component: "blocks.faqs",
        faq: [
          {
            heading: "Is there a guided street art tour?",
            text: "Yes — several local operators run walking tours of the MAUS district, typically 90 minutes. Book in advance in summer.",
          },
        ],
      },
    ],
  },
];

// ── Investor guide articles ──────────────────────────────────────────────────

const INVESTOR_GUIDES = [
  {
    title: "Buying Property in Málaga: A Step-by-Step Guide",
    slug: "buying-property-malaga-step-by-step",
    description:
      "Everything international buyers need to know about purchasing residential property in Málaga province.",
    categoryIndex: 0,
    blocks: [
      {
        __component: "blocks.heading-section",
        heading: "From Search to Signature",
        subHeading: "A clear process for buying in Spain",
        anchorLink: "",
      },
      {
        __component: "blocks.markdown",
        content:
          "## Step 1 — Obtain Your NIE\n\nThe *Número de Identificación de Extranjeros* is a tax identification number required for any property purchase in Spain. Apply at the nearest National Police station or through the Spanish consulate in your home country.\n\n## Step 2 — Open a Spanish Bank Account\n\nMost conveyancing payments must be made from a Spanish account. Major banks offer non-resident accounts with minimal paperwork.\n\n## Step 3 — Hire an Independent Solicitor\n\nAlways instruct a *gestor* or *abogado* who acts exclusively for you — not shared with the developer or agent.\n\n## Step 4 — Sign the Reservation Agreement\n\nA small deposit (typically €3,000–€6,000) secures the property and takes it off the market while due diligence is carried out.\n\n## Step 5 — Exchange Contracts (*Contrato de Arras*)\n\nUsually 10% of the purchase price is paid at this stage. If the seller withdraws, they must return double the deposit.\n\n## Step 6 — Complete at the Notary\n\nThe final balance is paid by banker's draft and the title deed (*escritura*) is signed in front of a notary public.",
      },
      {
        __component: "blocks.faqs",
        faq: [
          {
            heading: "What taxes apply to a property purchase?",
            text: "Resale properties attract ITP (Transfer Tax) at 7% in Andalusia. New builds attract VAT (IVA) at 10% plus 1.5% stamp duty (AJD).",
          },
          {
            heading: "How long does completion take?",
            text: "From agreeing a price to signing at the notary typically takes 6–12 weeks, assuming no chain complications.",
          },
          {
            heading: "Do I need to be in Spain to complete?",
            text: "No — you can grant power of attorney (Poder Notarial) to your solicitor to act on your behalf at the notary.",
          },
        ],
      },
    ],
  },
  {
    title: "Short-Term Rental Licensing in Málaga",
    slug: "short-term-rental-licensing-malaga",
    description:
      "Understanding the VFT licence requirements, caps, and application process for holiday rentals in Andalusia.",
    categoryIndex: 1,
    blocks: [
      {
        __component: "blocks.heading-section",
        heading: "Renting Out Your Property",
        subHeading: "What every investor needs to know about VFT licences",
        anchorLink: "",
      },
      {
        __component: "blocks.markdown",
        content:
          "## What is a VFT Licence?\n\nA *Vivienda con Fines Turísticos* (VFT) licence is required to legally rent any residential property for tourist purposes in Andalusia. Properties must be registered with the Junta de Andalucía Tourism Registry.\n\n## Key Requirements\n\n- Property must be furnished and equipped to a defined standard\n- Maximum 15 guests or one occupant per 14 m²\n- The owner or an authorised manager must be contactable 24 hours a day\n- A complaints book (*libro de reclamaciones*) must be available\n\n## Recent Changes\n\nMálaga city centre has introduced zonal caps on new VFT licences in certain areas. Check with your solicitor before purchasing a property with the intention of short-term letting.",
      },
      {
        __component: "blocks.faqs",
        faq: [
          {
            heading: "How long does a VFT licence application take?",
            text: "Typically 1–3 months from submission of a complete application, though processing times vary by municipality.",
          },
          {
            heading: "Can I rent without a VFT licence?",
            text: "No — operating without a licence risks fines of up to €18,000 under Andalusian tourist legislation.",
          },
        ],
      },
    ],
  },
  {
    title: "ROI Projections for Málaga Rental Properties",
    slug: "roi-projections-malaga-rental-properties",
    description:
      "A data-driven look at rental yields, occupancy rates, and net returns for short-term lets in central Málaga.",
    categoryIndex: 2,
    blocks: [
      {
        __component: "blocks.heading-section",
        heading: "Making the Numbers Work",
        subHeading: "Typical yields and what drives them",
        anchorLink: "",
      },
      {
        __component: "blocks.markdown",
        content:
          "## Gross Rental Yield\n\nCentral Málaga 1–2 bedroom apartments typically achieve 70–85% annual occupancy through professional management, with average daily rates between €90 and €160 depending on season and location.\n\nGross yield before costs generally ranges from **8–12%** per annum for well-located properties.\n\n## Net Yield After Costs\n\nDeducting management fees (typically 15–20%), maintenance, community charges, IBI (council tax), and income tax, net yields generally settle at **5–8%** per annum.\n\n## What Drives Performance\n\n- **Location** — central, walkable areas consistently outperform peripheral locations\n- **Quality of fit-out** — well-photographed, well-equipped properties command higher nightly rates\n- **Professional management** — occupancy rates and guest ratings are directly linked to response times and property upkeep",
      },
      {
        __component: "blocks.faqs",
        faq: [
          {
            heading: "Are these yields guaranteed?",
            text: "No — yields vary based on location, property condition, management quality, and market conditions. These figures are indicative based on market data.",
          },
          {
            heading: "How does Málaga compare to other Spanish cities?",
            text: "Málaga consistently ranks among the top 5 Spanish cities for short-term rental occupancy, alongside Barcelona, Madrid, and Seville.",
          },
        ],
      },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

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
  const json = (await res.json()) as { data?: { token?: string } };
  const token = json.data?.token;
  if (!token) throw new Error("No token in admin login response");
  return token;
}

async function uploadPlaceholderImage(token: string, seed: string): Promise<number> {
  const imageRes = await fetch(`https://picsum.photos/seed/${seed}/800/500`);
  const imageBuffer = await imageRes.arrayBuffer();
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });
  const form = new FormData();
  form.append("files", blob, `guide-placeholder-${seed}.jpg`);
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Image upload failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { id: number }[];
  return json[0].id;
}

async function createCategory(
  endpoint: string,
  data: { title: string; slug: string; description: string },
  token: string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create category "${data.title}": ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { data?: { documentId?: string } };
  const documentId = json.data?.documentId!;
  console.log(`  ✓ ${data.title} (documentId: ${documentId})`);
  return documentId;
}

async function createGuide(
  endpoint: string,
  data: { title: string; slug: string; description: string; blocks: object[] },
  categoryDocumentId: string,
  imageId: number,
  token: string
) {
  const res = await fetch(`${BASE_URL}/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      data: {
        ...data,
        category: categoryDocumentId,
        featuredImage: imageId,
        publishedAt: new Date().toISOString(),
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create guide "${data.title}": ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { data?: { id?: number } };
  console.log(`  ✓ ${data.title} (id: ${json.data?.id})`);
  return json.data;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding guides...\n");
  const token = await getAdminToken();

  // Upload placeholder images
  console.log("Uploading placeholder images...");
  const travelImageId = await uploadPlaceholderImage(token, "travel");
  const investorImageId = await uploadPlaceholderImage(token, "investor");
  console.log(`  ✓ Travel image id: ${travelImageId}`);
  console.log(`  ✓ Investor image id: ${investorImageId}\n`);

  // Create travel guide categories
  console.log("Creating travel guide categories...");
  const travelCategoryIds: string[] = [];
  for (const cat of TRAVEL_CATEGORIES) {
    travelCategoryIds.push(await createCategory("travel-guide-categories", cat, token));
  }

  // Create investor guide categories
  console.log("\nCreating investor guide categories...");
  const investorCategoryIds: string[] = [];
  for (const cat of INVESTOR_CATEGORIES) {
    investorCategoryIds.push(await createCategory("investor-guide-categories", cat, token));
  }

  // Create travel guides
  console.log("\nCreating travel guides...");
  for (const guide of TRAVEL_GUIDES) {
    const { categoryIndex, ...guideData } = guide;
    await createGuide("travel-guides", guideData, travelCategoryIds[categoryIndex], travelImageId, token);
  }

  // Create investor guides
  console.log("\nCreating investor guides...");
  for (const guide of INVESTOR_GUIDES) {
    const { categoryIndex, ...guideData } = guide;
    await createGuide("investor-guides", guideData, investorCategoryIds[categoryIndex], investorImageId, token);
  }

  console.log("\nDone! Visit the Strapi admin to review entries.");
  console.log("Then visit /travel-guide and /investor-guide on the Astro site.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
