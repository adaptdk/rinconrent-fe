/**
 * Pure mapping from a Guesty listing payload to a Strapi Property entry.
 *
 * Shared by:
 *   - scripts/seed-properties.ts   (fixture-driven dev seed)
 *   - scripts/sync-properties.ts   (live Guesty sync, Phase 3)
 *
 * Whenever Guesty's response shape differs from what's assumed here,
 * fix this file and both callers benefit.
 */

export type GuestyListing = {
  _id: string;
  title?: string;
  nickname?: string;
  propertyType?: string;
  accommodates?: number;
  bedrooms?: number;
  bathrooms?: number;
  publicDescription?: {
    summary?: string;
    space?: string;
    neighborhood?: string;
  };
  address?: {
    full?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
    lat?: number;
    lng?: number;
  };
  pictures?: { original: string; caption?: string }[];
  amenities?: string[];
  tags?: string[];
  prices?: {
    basePrice?: number;
    currency?: string;
    weeklyPriceFactor?: number;
    monthlyPriceFactor?: number;
    cleaningFee?: number;
  };
  timezone?: string;
  defaultCheckInTime?: string;
  defaultCheckOutTime?: string;
  terms?: { minNights?: number; maxNights?: number };
};

export type PropertyEntryData = {
  guestyId: string;
  title: string;
  slug: string;
  propertyType: string | null;
  accommodates: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  summary: string | null;
  description: string | null;
  minNights: number | null;
  maxNights: number | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  timezone: string | null;
  address: {
    full: string | null;
    street: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zipcode: string | null;
    lat: number | null;
    lng: number | null;
  };
  pricing: {
    basePrice: number;
    currency: string;
    weeklyDiscount: number | null;
    monthlyDiscount: number | null;
    cleaningFee: number | null;
  };
  amenities: { name: string; icon: string | null }[];
  tags: string[];
  pictureUrls: { url: string; caption: string | null }[];
  lastSyncedAt: string;
};

/**
 * Map a Guesty amenity name to a Font Awesome icon class.
 * The icon set matches the rest of the site (fa-solid). If no match,
 * returns null and the UI falls back to a dot.
 */
function iconForAmenity(name: string): string | null {
  const key = name.toLowerCase();
  const map: Record<string, string> = {
    wifi: 'fa-wifi',
    'air conditioning': 'fa-snowflake',
    pool: 'fa-water-ladder',
    kitchen: 'fa-utensils',
    washer: 'fa-soap',
    dryer: 'fa-wind',
    'free parking': 'fa-square-parking',
    parking: 'fa-square-parking',
    'sea view': 'fa-water',
    'mountain view': 'fa-mountain',
    terrace: 'fa-umbrella-beach',
    balcony: 'fa-umbrella-beach',
    patio: 'fa-umbrella-beach',
    bbq: 'fa-fire-burner',
    'hot tub': 'fa-hot-tub-person',
    workspace: 'fa-laptop',
    elevator: 'fa-elevator',
    dishwasher: 'fa-soap',
    fireplace: 'fa-fire',
    garden: 'fa-tree',
    'pet-friendly': 'fa-paw',
    'family-friendly': 'fa-children',
  };
  return map[key] ?? null;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Convert Guesty's price factors (e.g. 0.92 = 8% discount) into a
 * percentage value Strapi stores (e.g. 8.0). Returns null when no factor.
 */
function factorToDiscountPercent(factor: number | undefined): number | null {
  if (factor === undefined || factor === null) return null;
  return Math.round((1 - factor) * 1000) / 10; // one decimal
}

export function mapListingToPropertyEntry(listing: GuestyListing): PropertyEntryData {
  const title = listing.title?.trim() || listing.nickname?.trim() || `Listing ${listing._id}`;
  const summary = listing.publicDescription?.summary ?? null;

  const descriptionParts: string[] = [];
  if (listing.publicDescription?.space) {
    descriptionParts.push(listing.publicDescription.space.trim());
  }
  if (listing.publicDescription?.neighborhood) {
    descriptionParts.push(`**The neighborhood.** ${listing.publicDescription.neighborhood.trim()}`);
  }
  const description = descriptionParts.length ? descriptionParts.join('\n\n') : null;

  return {
    guestyId: listing._id,
    title,
    slug: slugify(title),
    propertyType: listing.propertyType ?? null,
    accommodates: listing.accommodates ?? null,
    bedrooms: listing.bedrooms ?? null,
    bathrooms: listing.bathrooms ?? null,
    summary,
    description,
    minNights: listing.terms?.minNights ?? null,
    maxNights: listing.terms?.maxNights ?? null,
    checkInTime: listing.defaultCheckInTime ?? null,
    checkOutTime: listing.defaultCheckOutTime ?? null,
    timezone: listing.timezone ?? null,
    address: {
      full: listing.address?.full ?? null,
      street: listing.address?.street ?? null,
      city: listing.address?.city ?? null,
      state: listing.address?.state ?? null,
      country: listing.address?.country ?? null,
      zipcode: listing.address?.zipcode ?? null,
      lat: listing.address?.lat ?? null,
      lng: listing.address?.lng ?? null,
    },
    pricing: {
      basePrice: listing.prices?.basePrice ?? 0,
      currency: listing.prices?.currency ?? 'USD',
      weeklyDiscount: factorToDiscountPercent(listing.prices?.weeklyPriceFactor),
      monthlyDiscount: factorToDiscountPercent(listing.prices?.monthlyPriceFactor),
      cleaningFee: listing.prices?.cleaningFee ?? null,
    },
    amenities: (listing.amenities ?? []).map((name) => ({
      name,
      icon: iconForAmenity(name),
    })),
    tags: listing.tags ?? [],
    pictureUrls: (listing.pictures ?? []).map((p) => ({
      url: p.original,
      caption: p.caption ?? null,
    })),
    lastSyncedAt: new Date().toISOString(),
  };
}
