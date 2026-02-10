export const PRICE_RANGES = [
  { value: "any", labelKey: "anyPrice" as const },
  { value: "under-500", labelKey: "under500" as const },
  { value: "500-1000", labelKey: "500to1000" as const },
  { value: "1000-2000", labelKey: "1000to2000" as const },
  { value: "2000-plus", labelKey: "2000plus" as const },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", labelKey: "newest" as const },
  { value: "price-asc", labelKey: "priceLowHigh" as const },
  { value: "price-desc", labelKey: "priceHighLow" as const },
  { value: "name", labelKey: "nameAZ" as const },
] as const;

export const PRICE_RANGE_VALUES = PRICE_RANGES.map((r) => r.value);
export const SORT_OPTION_VALUES = SORT_OPTIONS.map((o) => o.value);
