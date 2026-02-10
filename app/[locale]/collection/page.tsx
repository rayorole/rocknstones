import Image from "next/image";
import { Suspense } from "react";
import { client, urlFor } from "@/lib/sanity";
import { groq } from "next-sanity";
import { CollectionFilters } from "@/components/collection-filters";
import {
  PRICE_RANGE_VALUES,
  SORT_OPTION_VALUES,
} from "@/lib/collection-filters";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link as LocaleLink } from "@/i18n/navigation";

type Product = {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  description?: string | null;
  image?: Array<{ asset?: { _ref?: string } }> | null;
  _createdAt: string;
};

function formatPrice(price: number, locale: string) {
  return new Intl.NumberFormat(locale === "nl" ? "nl-NL" : "en-US", {
    style: "currency",
    currency: locale === "nl" ? "EUR" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getPriceBounds(priceRange: string): { min: number; max: number } {
  switch (priceRange) {
    case "under-500":
      return { min: 0, max: 500 };
    case "500-1000":
      return { min: 500, max: 1000 };
    case "1000-2000":
      return { min: 1000, max: 2000 };
    case "2000-plus":
      return { min: 2000, max: 999999 };
    default:
      return { min: 0, max: 999999 };
  }
}

function sortProducts(products: Product[], sort: string): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      return copy.sort(
        (a, b) =>
          new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
      );
  }
}

async function getProducts(
  minPrice: number,
  maxPrice: number
): Promise<Product[]> {
  const query = groq`
    *[_type == "product" && price >= $minPrice && price <= $maxPrice] {
      _id,
      name,
      slug,
      price,
      description,
      image,
      _createdAt,
    }
  `;
  return client.fetch<Product[]>(query, { minPrice, maxPrice });
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ price?: string; sort?: string }>;
};

export default async function CollectionPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Collection");

  const resolvedParams = await searchParams;
  const priceRange =
    resolvedParams.price &&
    PRICE_RANGE_VALUES.includes(resolvedParams.price as any)
      ? resolvedParams.price
      : "any";
  const sort =
    resolvedParams.sort &&
    SORT_OPTION_VALUES.includes(resolvedParams.sort as any)
      ? resolvedParams.sort
      : "newest";

  const { min, max } = getPriceBounds(priceRange);
  const products = await getProducts(min, max);
  const sorted = sortProducts(products, sort);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 py-10 sm:py-16 px-4 bg-muted/50 rounded-lg">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center">
            {t("title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground text-center max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 border-b pb-6">
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            {t("productCount", { count: sorted.length })}
          </p>
          <div className="order-1 sm:order-2 w-full sm:w-auto min-w-0">
            <Suspense fallback={<div className="h-9 w-full sm:w-[180px]" />}>
              <CollectionFilters priceRange={priceRange} sort={sort} />
            </Suspense>
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            {t("noProducts")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 py-6 sm:py-8 sm:grid-cols-2 lg:grid-cols-4">
            {sorted.map((product) => {
              const mainImage = product.image?.[0];
              const slug = product.slug?.current ?? product._id;

              return (
                <LocaleLink
                  href={`/collection/${slug}`}
                  key={product._id}
                  className="group flex flex-col overflow-hidden"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
                    {mainImage ? (
                      <Image
                        src={urlFor(mainImage).width(600).height(600).url()}
                        alt={product.name}
                        width={600}
                        height={600}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        {t("noImage")}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2 min-w-0">
                    <span className="font-medium truncate min-w-0">{product.name}</span>
                    <span className="shrink-0 font-semibold">
                      {formatPrice(product.price, locale)}
                    </span>
                  </div>
                  {product.description ? (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  ) : null}
                </LocaleLink>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
