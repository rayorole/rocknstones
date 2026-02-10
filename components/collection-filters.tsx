"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PRICE_RANGES, SORT_OPTIONS } from "@/lib/collection-filters";
import { useRouter as useIntlRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export { PRICE_RANGES, SORT_OPTIONS } from "@/lib/collection-filters";

type CollectionFiltersProps = {
  priceRange: string;
  sort: string;
};

export function CollectionFilters({ priceRange, sort }: CollectionFiltersProps) {
  const router = useIntlRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Collection");
  const tFilters = useTranslations("CollectionFilters");

  const updateParams = useCallback(
    (updates: { priceRange?: string; sort?: string }) => {
      const next = new URLSearchParams(searchParams.toString());
      if (updates.priceRange !== undefined) {
        if (updates.priceRange === "any") next.delete("price");
        else next.set("price", updates.priceRange);
      }
      if (updates.sort !== undefined) {
        if (updates.sort === "newest") next.delete("sort");
        else next.set("sort", updates.sort);
      }
      const q = next.toString();
      router.replace(`/collection${q ? `?${q}` : ""}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label
          htmlFor="price-filter"
          className="text-sm font-medium text-muted-foreground"
        >
          {t("price")}
        </label>
        <NativeSelect
          id="price-filter"
          value={priceRange}
          onChange={(e) => updateParams({ priceRange: e.target.value })}
          className="min-w-[180px]"
        >
          {PRICE_RANGES.map((r) => (
            <NativeSelectOption key={r.value} value={r.value}>
              {tFilters(r.labelKey)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="flex items-center gap-2">
        <label
          htmlFor="sort"
          className="text-sm font-medium text-muted-foreground"
        >
          {t("orderBy")}
        </label>
        <NativeSelect
          id="sort"
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="min-w-[180px]"
        >
          {SORT_OPTIONS.map((o) => (
            <NativeSelectOption key={o.value} value={o.value}>
              {tFilters(o.labelKey)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
    </div>
  );
}
