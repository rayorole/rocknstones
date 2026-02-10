"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Link as LocaleLink } from "@/i18n/navigation";

const DEBOUNCE_MS = 300;

type SearchProduct = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
};

function formatPrice(price: number, locale: string) {
  return new Intl.NumberFormat(locale === "nl" ? "nl-NL" : "en-US", {
    style: "currency",
    currency: locale === "nl" ? "EUR" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function NavSearch() {
  const t = useTranslations("Search");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);

  const runSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setProducts([]);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="default" className="h-9 gap-2">
          <SearchIcon className="w-4 h-4" />
          <span className="text-sm">{t("search")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(20rem,calc(100vw-2rem))] p-0" sideOffset={8}>
        <div className="p-2 border-b">
          <Input
            ref={inputRef}
            type="search"
            placeholder={t("placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 rounded-lg"
            autoComplete="off"
            aria-label={t("ariaLabel")}
          />
        </div>
        <div className="max-h-[min(60vh,320px)] overflow-y-auto">
          {loading && (
            <p className="p-4 text-sm text-muted-foreground text-center">
              {t("searching")}
            </p>
          )}
          {!loading && debouncedQuery.length >= 2 && products.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground text-center">
              {t("noResults")}
            </p>
          )}
          {!loading && debouncedQuery.length < 2 && query.length > 0 && (
            <p className="p-4 text-sm text-muted-foreground text-center">
              {t("typeMore")}
            </p>
          )}
          {!loading && products.length > 0 && (
            <ul className="py-2">
              {products.map((p) => (
                <li key={p._id}>
                  <LocaleLink
                    href={`/collection/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 text-left",
                      "hover:bg-muted/80 focus:bg-muted/80 outline-none"
                    )}
                  >
                    {p.imageUrl ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={p.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 shrink-0 rounded-md bg-muted" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(p.price, locale)}
                      </p>
                    </div>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
