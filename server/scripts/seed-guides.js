const { createStrapi, compileStrapi } = require('@strapi/strapi');
const fs = require('fs');
const path = require('path');
const https = require('https');

// ── Image helpers ─────────────────────────────────────────────────────────────

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => { file.close(); resolve(filepath); });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(filepath); });
      }
    }).on('error', reject);
  });
}

async function uploadImage(app, filepath, name) {
  const file = {
    filepath,
    originalFilename: name,
    mimetype: 'image/jpeg',
    size: fs.statSync(filepath).size,
  };
  const [uploaded] = await app.plugin('upload').service('upload').upload({
    data: {},
    files: file,
  });
  return uploaded;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const TRAVEL_CATEGORIES = [
  { title: 'Beaches & Coastline', slug: 'beaches-coastline', description: "Guides to Málaga's beaches, coves, and coastal walks." },
  { title: 'Food & Culture',      slug: 'food-culture',      description: 'Restaurants, tapas bars, local markets, and cultural highlights.' },
  { title: 'Day Trips',           slug: 'day-trips',         description: 'Easy excursions from Málaga to Ronda, Granada, and beyond.' },
];

const INVESTOR_CATEGORIES = [
  { title: 'Buying Property',    slug: 'buying-property',    description: 'Step-by-step guides for purchasing residential property in Málaga.' },
  { title: 'Rental Regulations', slug: 'rental-regulations', description: 'VFT licences, short-term rental rules, and compliance in Andalusia.' },
  { title: 'Returns & Yields',   slug: 'returns-yields',     description: 'Data-driven analysis of rental yields, occupancy, and net returns.' },
];

const TRAVEL_GUIDES = [
  {
    title: 'The Best Beaches Near Málaga',
    slug: 'best-beaches-near-malaga',
    description: 'From La Malagueta to hidden coves — our pick of the finest beaches within reach of the city centre, with practical tips on getting there.',
    categoryIndex: 0,
    content: `## La Malagueta

The city beach sits minutes from the historic centre. Expect well-maintained sand, sunbeds for hire, and a long promenade lined with chiringuitos serving fresh fish and cold beer. It can get busy in July and August — arrive before 10 am or head east toward El Palo for more breathing room.

## Playa de la Caleta

A quieter alternative just west of the centre, popular with locals who know to avoid the tourist crowds. The water is clean and the atmosphere is relaxed. There are no large beach clubs here — just small family-run bars and a calm vibe.

## El Palo

The eastern fishing district retains an authentic character that the centre has largely lost. The *espetos* — sardines grilled on bamboo skewers over an open fire directly on the beach — are worth the short bus ride alone. Try the restaurants along the Calle El Palo seafront.

## Pedregalejo

Just beyond El Palo, Pedregalejo is a string of small coves separated by rocky outcrops. Each cove has its own chiringuito. It's a favourite Sunday lunch spot for Malagueños and feels a world away from the city beach.

## Getting There

All beaches are reachable by the EMT city bus network. Lines 11 and 3 run along the coastal road from the centre to El Palo and Pedregalejo. A single ticket costs €1.40. Taxis from the centre to Pedregalejo take around 10 minutes.`,
    blocks: [
      { __component: 'blocks.faqs', faq: [
        { heading: 'What is the sea temperature in summer?', text: 'The Mediterranean reaches 24–26°C between July and September — warm enough for comfortable swimming from June through October.' },
        { heading: 'Are there Blue Flag beaches near Málaga?', text: 'Yes. Several beaches hold Blue Flag status for water quality and facilities, including Playa de la Caleta and Playa del Palo.' },
        { heading: 'Are the beaches sandy or pebbly?', text: 'Most city beaches are dark volcanic sand. Pedregalejo has small pebble coves. Further east toward Nerja the sand becomes lighter and finer.' },
      ]},
    ],
  },
  {
    title: 'Top Tapas Bars in Málaga Old Town',
    slug: 'top-tapas-bars-malaga-old-town',
    description: 'A curated list of must-visit tapas bars in the historic centre — from traditional bodegas pouring sweet Moscatel to modern standing bars with free tapas.',
    categoryIndex: 1,
    content: `## El Pimpi

The most famous bodega in Málaga, housed in an 18th-century mansion near the Alcazaba. The barrel-lined interior is plastered with signed photographs from decades of celebrity visitors. Order the sweet Moscatel wine alongside jamón ibérico and manchego. It's a tourist institution — but a genuinely good one.

**Address:** Calle Granada, 62 | **Hours:** 11:00–02:00 daily

## Bar La Tranca

A tiny, standing-room-only bar on Calle Carretería that has been pouring cold draught beer and free tapas since the 1970s. The tapa changes daily — it might be a wedge of tortilla, a slice of morcilla, or a small plate of patatas bravas. Arrive before 8 pm or you won't get near the bar.

**Address:** Calle Carretería, 93 | **Hours:** 13:00–16:00 and 20:00–00:00, closed Sunday

## Casa Aranda

The essential stop for breakfast in Málaga. Churros and thick hot chocolate served in a covered courtyard just off the Atarazanas market, where locals have been starting their mornings since 1932. Queue at the counter, pay, find a seat. Simple, perfect.

**Address:** Calle Herrería del Rey, 3 | **Hours:** 08:00–13:00 and 18:00–21:00

## Uvedoble Taberna

A more modern option for those who want natural wines alongside their tapas. The menu changes with the seasons and the portions are generous. Book ahead for evenings — it fills quickly.

**Address:** Calle Císter, 15 | **Hours:** 13:00–16:30 and 20:00–00:00, closed Monday`,
    blocks: [
      { __component: 'blocks.faqs', faq: [
        { heading: 'Do tapas bars in Málaga serve food at lunch?', text: 'Yes — most open from around noon and serve until 4 pm, then again from 8 pm. Many offer a free tapa with each drink ordered at the bar.' },
        { heading: 'Is English widely spoken?', text: 'In the main tourist areas yes, but off the main streets it helps to know a few words of Spanish. Staff are almost always friendly regardless.' },
        { heading: 'Should I book in advance?', text: 'For the busiest spots (El Pimpi, Uvedoble) a reservation for dinner is a good idea in summer and at weekends. Bar La Tranca and Casa Aranda are first-come, first-served.' },
      ]},
    ],
  },
  {
    title: 'Day Trip to Ronda from Málaga',
    slug: 'day-trip-ronda-from-malaga',
    description: 'How to visit Ronda — one of Andalusia\'s most dramatic white villages — as a day trip from Málaga, including transport options, what to see, and where to eat.',
    categoryIndex: 2,
    content: `## Getting There

**By train:** The direct train from Málaga María Zambrano takes around 1 hour 50 minutes and costs approximately €12 each way. Trains run several times daily — book in advance on the Renfe website, especially at weekends. The Ronda station is a 10-minute walk from the historic centre.

**By car:** The A-357 and A-367 take around 1 hour 15 minutes. The mountain road through the Serranía de Ronda is scenic but winding. Parking is available near the bullring.

## What to See

### Puente Nuevo

The defining image of Ronda — an 18th-century stone bridge spanning a 100-metre gorge carved by the Guadalevín river. Walk across it and down to the viewpoint at the base of the gorge for the best perspective. The bridge took 42 years to build and the engineer reportedly fell to his death during construction.

### Plaza de Toros

One of Spain's oldest and most beautiful bullrings, built in 1785. It now operates as a museum of bullfighting and is worth visiting even for those indifferent to the sport — the architecture alone is remarkable. Entry costs €8.

### La Ciudad (The Old Town)

The historic Arab quarter with narrow streets, whitewashed houses, and the 13th-century Arab baths (*Baños Árabes*) — among the best-preserved Moorish baths in Spain.

### Jardines de Cuenca

Hidden gardens cut into the side of the gorge with views across the valley. Often overlooked by day-trippers but one of the most peaceful spots in Ronda.

## Where to Eat

The streets around Plaza del Socorro have several reliable restaurants. Try *rabo de toro* (slow-braised oxtail stew) — a local speciality — at Restaurante Pedro Romero opposite the bullring, or the more casual Taberna El Lechuguita for tapas and local wine.

## Timing

Ronda is very manageable as a day trip. A 9 am train allows 6–7 hours in town before the last train back in the late afternoon. In summer, the midday heat makes the gorge viewpoints uncomfortable — plan the walk before noon.`,
    blocks: [
      { __component: 'blocks.faqs', faq: [
        { heading: 'Can I do Ronda as a day trip?', text: 'Easily. The train takes about 2 hours each way, leaving plenty of time to walk the main sights and have lunch.' },
        { heading: 'Is Ronda worth visiting outside summer?', text: 'Yes — spring and autumn are ideal. The crowds are smaller, the light is beautiful, and the mountain temperatures are comfortable.' },
        { heading: 'Do I need to book train tickets in advance?', text: 'Yes, especially at weekends and in summer. The Renfe website sells tickets up to 60 days ahead and prices increase closer to departure.' },
      ]},
    ],
  },
  {
    title: "Málaga's Best Street Art and Hidden Murals",
    slug: 'malaga-street-art-hidden-murals',
    description: "A self-guided walking tour of Málaga's thriving street-art scene — from the curated MAUS murals in SOHO to the raw, unofficial work found in El Perchel and beyond.",
    categoryIndex: 1,
    content: `## MAUS: Málaga Arte Urbano en Soho

Málaga's SOHO district is home to MAUS, a curated programme of large-scale murals by international artists. The project began in 2013 and has transformed a formerly overlooked neighbourhood south of the centre into an open-air gallery. Highlights include works by Aryz, Fintan Magee, and Okuda San Miguel. The full trail takes about 45 minutes at a relaxed pace.

**Starting point:** Calle Tomás Heredia, a 10-minute walk from the Cathedral.

## El Perchel

The working-class neighbourhood of El Perchel, north-west of the train station, has developed its own parallel street-art scene — less curated, more raw. Look for work on the walls of Calle Héroe de Sostoa and the streets immediately west of the Guadalmedina river. The area is in the early stages of gentrification, so pieces change regularly.

## El Ejido

The residential district of El Ejido, east of the centre, has unexpected pieces tucked onto side streets and the sides of apartment blocks. It rewards slow walking with a phone camera rather than a structured tour.

## Guided Tours

Several operators run walking tours of the MAUS district, typically 90 minutes and €15–20 per person. Málaga Street Art and Urban Tours are well regarded. Book in advance in summer.

## Practical Tips

- The SOHO murals are best photographed in the morning before the streets fill with traffic
- A free map of the MAUS trail is available at the Málaga tourism office on Plaza de la Marina
- Most murals are on public streets with no entry fee
- Some of the larger works are best seen from the opposite side of the street — step back`,
    blocks: [
      { __component: 'blocks.faqs', faq: [
        { heading: 'Is there a guided street art tour?', text: 'Yes — several local operators run walking tours of the MAUS district, typically 90 minutes and around €15–20. Book in advance in summer.' },
        { heading: 'Can I do it without a guide?', text: 'Absolutely. The SOHO district is compact and walkable. A free map is available from the tourism office.' },
      ]},
    ],
  },
];

const INVESTOR_GUIDES = [
  {
    title: 'Buying Property in Málaga: A Step-by-Step Guide',
    slug: 'buying-property-malaga-step-by-step',
    description: 'A practical walkthrough of the Spanish property purchase process for international buyers — from obtaining your NIE to signing at the notary.',
    categoryIndex: 0,
    content: `## Overview

Buying property in Spain as a non-resident is entirely straightforward provided you follow the correct process and work with the right professionals. The key difference from buying in the UK or US is that the legal and financial steps happen in a different order, and several documents you won't have encountered before are required.

Allow 6–12 weeks from offer acceptance to completion. This is normal — it is not a sign that something is wrong.

## Step 1 — Obtain Your NIE

The *Número de Identificación de Extranjeros* (NIE) is a tax identification number assigned to foreign nationals. It is required for almost every legal and financial transaction in Spain, including property purchase, opening a bank account, and paying taxes.

Apply at the nearest National Police station (*Comisaría*) in Málaga, or through the Spanish consulate in your home country before travelling. Processing takes 2–4 weeks. Bring your passport, a completed EX-15 form, and proof of the reason for application (a property purchase letter from your solicitor is sufficient).

## Step 2 — Open a Spanish Bank Account

Most conveyancing payments must be made from a Spanish bank account in the form of a certified banker's draft (*cheque bancario*). Open a non-resident account with any major bank — BBVA, Santander, and CaixaBank all offer straightforward non-resident accounts with online banking in English.

## Step 3 — Appoint an Independent Solicitor

Always instruct a *gestor* or *abogado* who acts exclusively for you — not a solicitor recommended by the developer or estate agent, and not one who represents both parties. Your solicitor will:

- Verify the property is free of debts, mortgages, and legal disputes
- Confirm the seller has legal title to sell
- Check planning permissions and building licences
- Review the preliminary contract before you sign
- Attend completion at the notary on your behalf if you grant power of attorney

Solicitor fees are typically 1–1.5% of the purchase price.

## Step 4 — Sign the Reservation Agreement

Once you agree a price, a reservation agreement takes the property off the market. You pay a small deposit — typically €3,000–€6,000 — which is held by the estate agent or solicitor and deducted from the purchase price at completion.

## Step 5 — Sign the *Contrato de Arras*

The private purchase contract, signed once legal checks are complete. At this stage you pay 10% of the purchase price. If you withdraw from the purchase after signing, you lose this deposit. If the seller withdraws, they must return double.

## Step 6 — Complete at the Notary

The final balance is transferred via certified banker's draft on the day of signing. The *escritura de compraventa* (title deed) is signed before a notary public, who verifies the identity of both parties and the legality of the transaction. You receive the keys.

## Taxes and Additional Costs

Budget for approximately 10–13% of the purchase price on top of the agreed price:

| Cost | Approximate amount |
|---|---|
| ITP Transfer Tax (resale) | 7% of purchase price |
| VAT + stamp duty (new build) | 11.5% combined |
| Notary fees | €600–€1,500 |
| Land registry fees | €400–€1,000 |
| Solicitor fees | 1–1.5% |
| Mortgage arrangement (if applicable) | 1–2% |`,
    blocks: [
      { __component: 'blocks.faqs', faq: [
        { heading: 'How long does the purchase process take?', text: 'From offer acceptance to signing at the notary typically takes 6–12 weeks. New-build purchases may take longer due to construction timelines.' },
        { heading: 'Do I need to be in Spain to complete?', text: 'No — you can grant power of attorney (Poder Notarial) to your solicitor, who can then sign the title deed on your behalf.' },
        { heading: 'Can I get a mortgage as a non-resident?', text: 'Yes. Spanish banks offer non-resident mortgages, typically up to 60–70% LTV. You will need your NIE, proof of income, and Spanish bank account.' },
        { heading: 'What is the annual cost of owning property in Spain?', text: 'Expect to pay IBI (council tax, typically €200–€800/year depending on property value), community fees if in an urbanisation, and non-resident income tax if you do not rent the property.' },
      ]},
    ],
  },
  {
    title: 'Short-Term Rental Licensing in Málaga',
    slug: 'short-term-rental-licensing-malaga',
    description: 'What you need to know about VFT licences, recent restrictions on new licences in Málaga city centre, and the steps to legally rent your property to tourists.',
    categoryIndex: 1,
    content: `## What is a VFT Licence?

A *Vivienda con Fines Turísticos* (VFT) is the licence required to legally rent any residential property to tourists in Andalusia. Without a registered VFT number, you cannot legally list a property on Airbnb, Booking.com, or any similar platform. Operating without a licence risks fines of up to €18,000 under Andalusian tourist legislation.

## Eligibility Requirements

To apply for a VFT licence, the property must meet the following minimum standards:

- Fully furnished and equipped for immediate occupation
- Heating and, in properties above 900m altitude or built after 2008, air conditioning
- First-aid kit on the premises
- Tourist information pack (maps, emergency numbers, local services)
- A complaints book (*libro de reclamaciones*) available on request
- Maximum occupancy: 15 guests or one person per 14 m² of habitable space
- The owner or an authorised manager must be contactable 24 hours a day

## The Application Process

1. **Request a *certificado de compatibilidad urbanística*** from the Málaga City Council (Gerencia de Urbanismo). This confirms the property is in a zone where tourist rentals are permitted. Allow 2–4 weeks.

2. **Submit a *declaración responsable*** to the Junta de Andalucía Tourism Registry via the online portal (Ventanilla Única Empresarial). This is a self-declaration that the property meets all requirements — there is no inspection before approval.

3. **Receive your VFT registration number.** This arrives by email within a few days of submission and must be displayed on all advertising.

## Zonal Restrictions in Málaga City

Since 2024, Málaga City Council has introduced significant restrictions on new VFT licences in certain central districts — including El Centro, Soho, and La Malagueta. In these zones:

- No new licences are being granted for properties in buildings where more than 50% of dwellings already hold VFT licences
- The Council is actively reviewing existing licences for compliance

**This makes it essential to check the planning status of any property before purchasing with the intention of tourist letting.** Your solicitor should request a *certificado de compatibilidad* before you sign any contracts.

## Outside the City Centre

Properties in municipalities outside Málaga city (Marbella, Nerja, Torremolinos, Estepona, etc.) are subject to their own local regulations. Most do not currently have the same zonal restrictions as Málaga city, but this is changing rapidly. Always verify with a local solicitor.`,
    blocks: [
      { __component: 'blocks.faqs', faq: [
        { heading: 'How long does the VFT application take?', text: 'The declaration itself is processed within days. The prior step — the urbanistic compatibility certificate — takes 2–4 weeks from the City Council.' },
        { heading: 'Can I manage the licence myself or do I need a manager?', text: 'You can self-manage, but you must be reachable 24/7. Most investors use a professional property management company who handles guest communications, check-in, cleaning, and licence compliance.' },
        { heading: 'What happens if I sell a property with a VFT licence?', text: 'VFT licences are tied to the property, not the owner. When you sell, the licence can be transferred to the new owner subject to the same zonal rules applying at the time of transfer.' },
      ]},
    ],
  },
  {
    title: 'ROI Projections for Málaga Rental Properties',
    slug: 'roi-projections-malaga-rental-properties',
    description: 'A data-driven look at rental yields, occupancy rates, and net returns for short-term lets in central Málaga — including what drives performance and how to stress-test the numbers.',
    categoryIndex: 2,
    content: `## The Market Context

Málaga has become one of Europe's fastest-growing short-term rental markets. Year-round demand from sun-seekers, digital nomads, and business travellers keeps occupancy high even outside peak summer months. The expansion of Málaga Airport — now serving over 100 routes — and the opening of major tech companies (Google, TikTok, Vodafone) have added a new layer of long-stay corporate demand.

## Gross Yield

For a well-located 1–2 bedroom apartment in the historic centre or La Malagueta:

- **Annual occupancy:** 72–88% (averaging around 78% with professional management)
- **Average daily rate:** €90–€160 depending on season, quality, and location
- **Peak season (June–September):** €130–€200/night
- **Shoulder season (March–May, October–November):** €80–€120/night
- **Low season (December–February):** €65–€90/night

Gross annual revenue for a 2-bedroom apartment at 78% occupancy and an average daily rate of €120 ≈ **€34,000–€36,000**.

At a purchase price of €350,000, this produces a gross yield of approximately **9.7–10.3%**.

## Net Yield After Costs

Gross yield is easy to calculate. Net yield is what you actually earn.

| Cost | Annual amount (approximate) |
|---|---|
| Management fees (18%) | €6,100–€6,500 |
| Cleaning & laundry | €2,000–€3,500 |
| Utilities | €1,200–€2,000 |
| IBI (council tax) | €300–€700 |
| Community fees | €600–€1,500 |
| Maintenance & repairs | €800–€1,500 |
| Non-resident income tax | €1,500–€2,500 |
| **Total costs** | **€12,500–€18,200** |

Net revenue after costs: **€16,000–€22,000**

Net yield on a €350,000 property: **4.6–6.3%**

## What Drives Outperformance

Properties that consistently outperform the market share several characteristics:

**Location within the centre** — walkability to the Cathedral, Picasso Museum, and the Atarazanas market correlates directly with higher nightly rates and fewer vacant nights.

**Outdoor space** — a terrace or private rooftop adds 15–25% to nightly rates and extends the bookable season.

**High-quality photography and listing presentation** — the difference between average and excellent professional photography translates to measurably higher conversion rates on listing platforms.

**Professional management** — response time to enquiries, guest review scores, and Superhost/Premier Partner status all drive algorithmic visibility on Airbnb and Booking.com.

## Stress-Testing the Numbers

Before committing to a purchase, model a downside scenario:

- Occupancy drops to 60% (realistic if a zonal licence cap forces you off platforms)
- Average daily rate falls 20% (new supply entering the market)
- Management fees increase to 22%

At these parameters, gross revenue falls to approximately €21,000 and net yield drops to around **2.5–3%** — still positive but materially different from the base case. Ensure your finances can sustain this scenario.`,
    blocks: [
      { __component: 'blocks.faqs', faq: [
        { heading: 'Are these yields guaranteed?', text: 'No. Yields vary based on location, property condition, management quality, and market conditions. These figures are indicative and based on current market data.' },
        { heading: 'How does Málaga compare to other Spanish cities?', text: 'Málaga consistently ranks among the top 5 Spanish cities for short-term rental occupancy alongside Barcelona, Madrid, and Seville, and benefits from a longer season than most northern European destinations.' },
        { heading: 'Is it better to do short-term or long-term rental?', text: 'Short-term lets typically generate 30–60% higher gross revenue but require active management. Long-term rentals (12+ months) are more passive but yields are lower. The right choice depends on your involvement and risk appetite.' },
      ]},
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function upsertCategory(app, uid, cat) {
  const existing = await app.documents(uid).findFirst({ filters: { slug: cat.slug } });
  if (existing) {
    const updated = await app.documents(uid).update({ documentId: existing.documentId, data: cat });
    console.log(`  ↻ updated: ${cat.title}`);
    return updated;
  }
  const created = await app.documents(uid).create({ data: cat });
  console.log(`  ✓ created: ${cat.title} (documentId: ${created.documentId})`);
  return created;
}

async function upsertGuide(app, uid, guide, categoryDocumentId, imageId) {
  const { categoryIndex, ...data } = guide;
  const payload = { ...data, category: categoryDocumentId, featuredImage: imageId };
  const existing = await app.documents(uid).findFirst({ filters: { slug: guide.slug } });
  if (existing) {
    await app.documents(uid).update({ documentId: existing.documentId, data: payload, status: 'published' });
    console.log(`  ↻ updated: ${guide.title}`);
  } else {
    const created = await app.documents(uid).create({ data: payload, status: 'published' });
    console.log(`  ✓ created: ${guide.title} (documentId: ${created.documentId})`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  // 1. Upload placeholder images
  const tmpDir = path.join(__dirname, '..', '.tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  console.log('Uploading placeholder images...');
  const travelImgPath   = path.join(tmpDir, 'guide-travel.jpg');
  const investorImgPath = path.join(tmpDir, 'guide-investor.jpg');
  await downloadImage('https://picsum.photos/seed/travel-malaga/800/500',   travelImgPath);
  await downloadImage('https://picsum.photos/seed/investor-malaga/800/500', investorImgPath);
  const travelImage   = await uploadImage(app, travelImgPath,   'guide-travel.jpg');
  const investorImage = await uploadImage(app, investorImgPath, 'guide-investor.jpg');
  fs.unlinkSync(travelImgPath);
  fs.unlinkSync(investorImgPath);
  console.log(`  ✓ Travel image (id: ${travelImage.id})`);
  console.log(`  ✓ Investor image (id: ${investorImage.id})\n`);

  // 2. Upsert travel guide categories
  console.log('Upserting travel guide categories...');
  const travelCategoryDocs = [];
  for (const cat of TRAVEL_CATEGORIES) {
    travelCategoryDocs.push(await upsertCategory(app, 'api::travel-guide-category.travel-guide-category', cat));
  }

  // 3. Upsert investor guide categories
  console.log('\nUpserting investor guide categories...');
  const investorCategoryDocs = [];
  for (const cat of INVESTOR_CATEGORIES) {
    investorCategoryDocs.push(await upsertCategory(app, 'api::investor-guide-category.investor-guide-category', cat));
  }

  // 4. Upsert travel guides
  console.log('\nUpserting travel guides...');
  for (const guide of TRAVEL_GUIDES) {
    await upsertGuide(app, 'api::travel-guide.travel-guide', guide, travelCategoryDocs[guide.categoryIndex].documentId, travelImage.id);
  }

  // 5. Upsert investor guides
  console.log('\nUpserting investor guides...');
  for (const guide of INVESTOR_GUIDES) {
    await upsertGuide(app, 'api::investor-guide.investor-guide', guide, investorCategoryDocs[guide.categoryIndex].documentId, investorImage.id);
  }

  console.log('\nDone. Restart Strapi and clear client/.astro/data-store.json if needed.');
  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
