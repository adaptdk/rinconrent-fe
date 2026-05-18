/**
 * Seeds Property entries from a Guesty-shaped fixture file.
 *
 * Run from the server/ directory:
 *   STRAPI_API_TOKEN=<full-access token> npx tsx scripts/seed-properties.ts
 *
 * To generate a token: Strapi admin → Settings → API Tokens → Create new
 *   - Name: "Property seed/sync"
 *   - Token type: Full access
 *   - Duration: Unlimited (or whatever you prefer)
 *
 * Requires Strapi to be running on http://localhost:1337.
 * Re-runnable: deletes any property with a matching guestyId before recreating.
 *
 * When real Guesty access lands, this script is replaced by sync-properties.ts
 * which uses the same mapper but pulls listings from the Guesty Open API.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  mapListingToPropertyEntry,
  type GuestyListing,
  type PropertyEntryData,
} from './lib/guesty-mapper';

export {}; // Make this file a module so its variables don't collide with other scripts.

const BASE_URL = process.env.STRAPI_BASE_URL ?? 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const FIXTURE_PATH = resolve(__dirname, 'fixtures/guesty-listings.sample.json');

if (!API_TOKEN) {
  console.error(
    'Missing STRAPI_API_TOKEN.\n\n' +
      'Generate a full-access API token in Strapi admin → Settings → API Tokens,\n' +
      'then re-run:\n\n' +
      '  STRAPI_API_TOKEN=<token> yarn seed:properties\n'
  );
  process.exit(1);
}

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    Authorization: `Bearer ${API_TOKEN}`,
    ...extra,
  };
}

async function uploadImageFromUrl(url: string, filename: string): Promise<number> {
  const imageRes = await fetch(url);
  if (!imageRes.ok) {
    throw new Error(`Failed to download ${url}: ${imageRes.status}`);
  }
  const buffer = await imageRes.arrayBuffer();
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  const form = new FormData();
  form.append('files', blob, filename);
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  });
  if (!res.ok) {
    throw new Error(`Image upload failed for ${filename}: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { id: number }[];
  return json[0].id;
}

// ── Property CRUD via REST API (locale: 'en' is implicit — defaultLocale) ────

async function findExistingPropertyDocumentIds(guestyId: string): Promise<string[]> {
  // Search across all locales so we delete sibling entries too.
  const res = await fetch(
    `${BASE_URL}/api/properties?filters[guestyId][$eq]=${encodeURIComponent(guestyId)}&locale=all&fields[0]=documentId`,
    { headers: authHeaders() }
  );
  if (!res.ok) {
    throw new Error(`Find by guestyId failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { data?: { documentId: string }[] };
  const ids = (json.data ?? []).map((d) => d.documentId);
  return Array.from(new Set(ids));
}

async function deletePropertyByDocumentId(documentId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/properties/${documentId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Delete failed for ${documentId}: ${res.status} ${await res.text()}`);
  }
}

async function createProperty(
  data: PropertyEntryData,
  imageIds: number[]
): Promise<{ documentId: string; id: number }> {
  // Step 1: create the draft.
  // In Strapi v5, REST POST always creates a draft regardless of `publishedAt`
  // in the payload. Publishing is a separate action.
  const body = {
    data: {
      guestyId: data.guestyId,
      title: data.title,
      slug: data.slug,
      propertyType: data.propertyType,
      accommodates: data.accommodates,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      summary: data.summary,
      description: data.description,
      minNights: data.minNights,
      maxNights: data.maxNights,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      timezone: data.timezone,
      address: data.address,
      pricing: data.pricing,
      amenities: data.amenities,
      tags: data.tags,
      images: imageIds,
      lastSyncedAt: data.lastSyncedAt,
    },
  };
  const createRes = await fetch(`${BASE_URL}/api/properties?locale=en`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });
  if (!createRes.ok) {
    throw new Error(`Create property failed for "${data.title}": ${createRes.status} ${await createRes.text()}`);
  }
  const createJson = (await createRes.json()) as { data?: { id: number; documentId: string } };
  if (!createJson.data) throw new Error(`Create returned no data for "${data.title}"`);
  const { documentId, id } = createJson.data;

  // Step 2: publish.
  // In Strapi v5 REST, there is no exposed /actions/publish endpoint —
  // the way to publish via REST is a PUT with ?status=published. An empty
  // data body is fine; the server treats it as a no-op update + publish.
  const publishRes = await fetch(
    `${BASE_URL}/api/properties/${documentId}?status=published&locale=en`,
    {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ data: {} }),
    }
  );
  if (!publishRes.ok) {
    throw new Error(`Publish property failed for "${data.title}": ${publishRes.status} ${await publishRes.text()}`);
  }

  return { documentId, id };
}

// ── Nav link reminder ────────────────────────────────────────────────────────
// We intentionally do NOT touch /api/global from this script.
//
// Strapi v5's REST PUT on a single type replaces nested components wholesale,
// not field-by-field — issuing { data: { header: { navItems: [...] } } } wipes
// `logo`, `topNav`, `ctaGroup`, and any other fields not included. The safe
// path is either the Document Service (with the full header re-supplied) or
// the admin UI. For a one-line nav link, the admin UI is simpler and matches
// what every other seed script in this project does (none of them mutate
// Global).

function printNavLinkReminder(): void {
  console.log(
    '\nNext: add the Properties link to the navigation manually.\n' +
      '  Strapi admin → Content Manager → Global → Header → navItems\n' +
      '  → Add an entry: label="Properties", href="/properties", isExternal=false'
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding properties from Guesty fixture...\n');

  const fixtureRaw = readFileSync(FIXTURE_PATH, 'utf8');
  const listings: GuestyListing[] = JSON.parse(fixtureRaw);
  console.log(`Loaded ${listings.length} listings from ${FIXTURE_PATH}\n`);

  let created = 0;
  let replaced = 0;

  for (const listing of listings) {
    const data = mapListingToPropertyEntry(listing);
    console.log(`• ${data.title}`);

    // Upsert behaviour: if an entry with this guestyId already exists
    // (from a prior seed run), delete all locale siblings first so this script
    // is idempotent. The real sync (Phase 3) does this differently — it
    // updates the English entry in place and preserves translations.
    const existing = await findExistingPropertyDocumentIds(data.guestyId);
    for (const documentId of existing) {
      await deletePropertyByDocumentId(documentId);
      replaced += 1;
    }

    // Upload images first, get media IDs.
    const imageIds: number[] = [];
    for (let i = 0; i < data.pictureUrls.length; i += 1) {
      const pic = data.pictureUrls[i];
      const filename = `${data.slug}-${i + 1}.jpg`;
      const id = await uploadImageFromUrl(pic.url, filename);
      imageIds.push(id);
    }
    console.log(`  ↳ uploaded ${imageIds.length} image(s)`);

    const result = await createProperty(data, imageIds);
    console.log(`  ↳ created (documentId: ${result.documentId})`);
    created += 1;
  }

  console.log(`\nDone. Created ${created} properties (${replaced} prior entries replaced).`);
  console.log('Visit Strapi admin → Content Manager → Properties to review.');
  printNavLinkReminder();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
