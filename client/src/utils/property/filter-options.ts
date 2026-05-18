/**
 * Build the filter sidebar's options from the actual property dataset.
 * Every filter group is derived from real data — no hardcoded categories,
 * no whitelisted features. If a value isn't present in the data, it doesn't
 * appear in the UI, so a click can never produce zero results.
 */

import { currencySymbol } from "./currency";

export interface CountedOption {
  /** Slug-style value used in data-attributes and URL params */
  value: string;
  /** Display label shown in the UI */
  label: string;
  /** How many properties match this option */
  count: number;
}

export interface PropertyForFilters {
  address?: { city?: string | null } | null;
  propertyType?: string | null;
  amenities?: { name: string }[] | null;
  tags?: string[] | null;
  pricing?: { basePrice: number; currency?: string | null } | null;
  accommodates?: number | null;
}

export interface FilterOptions {
  /** Unique city names, sorted */
  cities: string[];
  /** Property types with counts, sorted by count desc */
  types: CountedOption[];
  /** Editorial categories derived from raw tags, sorted by count desc */
  categories: CountedOption[];
  /** Amenities with counts, sorted by count desc */
  features: CountedOption[];
  /** Lowest base price across the set, floored to nearest 10 */
  minPrice: number;
  /** Highest base price, ceiled to nearest 50 */
  maxPrice: number;
  /** Max accommodates value in the set */
  maxGuests: number;
  /** Symbol of the currency used by the first priced property */
  currencySymbol: string;
}

/**
 * "sea-view" → "Sea view". Slug stays as-is for the filter value.
 */
function slugToLabel(slug: string): string {
  const cleaned = slug.replace(/[-_]+/g, " ").trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function slugify(input: string): string {
  return input.toLowerCase().replace(/\s+/g, "-");
}

export function buildFilterOptions(properties: PropertyForFilters[]): FilterOptions {
  const cities = new Set<string>();
  const typeCounts = new Map<string, number>();
  const featureCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  let firstCurrency: string | null | undefined;
  let priceLow = Infinity;
  let priceHigh = 0;
  let maxGuests = 0;

  for (const p of properties) {
    if (p.address?.city) cities.add(p.address.city);

    if (p.propertyType) {
      typeCounts.set(p.propertyType, (typeCounts.get(p.propertyType) ?? 0) + 1);
    }

    for (const a of p.amenities ?? []) {
      if (!a.name) continue;
      featureCounts.set(a.name, (featureCounts.get(a.name) ?? 0) + 1);
    }

    for (const t of p.tags ?? []) {
      if (!t) continue;
      const v = t.toLowerCase();
      categoryCounts.set(v, (categoryCounts.get(v) ?? 0) + 1);
    }

    if (p.pricing) {
      if (p.pricing.basePrice < priceLow) priceLow = p.pricing.basePrice;
      if (p.pricing.basePrice > priceHigh) priceHigh = p.pricing.basePrice;
      firstCurrency = firstCurrency ?? p.pricing.currency;
    }
    if (p.accommodates && p.accommodates > maxGuests) maxGuests = p.accommodates;
  }

  const toCountedOption = ([value, count]: [string, number]): CountedOption => ({
    value,
    label: value,
    count,
  });
  const byCountDesc = (a: CountedOption, b: CountedOption) =>
    b.count - a.count || a.label.localeCompare(b.label);

  const types = [...typeCounts.entries()].map(toCountedOption).sort(byCountDesc);

  const features = [...featureCounts.entries()].map(toCountedOption).sort(byCountDesc).map(
    (f) => ({ ...f, value: slugify(f.value) })
  );

  const categories = [...categoryCounts.entries()]
    .map(([value, count]) => ({ value, label: slugToLabel(value), count }))
    .sort(byCountDesc);

  return {
    cities: [...cities].sort(),
    types,
    categories,
    features,
    minPrice: Number.isFinite(priceLow) ? Math.floor(priceLow / 10) * 10 : 0,
    maxPrice: priceHigh > 0 ? Math.ceil(priceHigh / 50) * 50 : 1000,
    maxGuests: maxGuests || 16,
    currencySymbol: currencySymbol(firstCurrency),
  };
}
