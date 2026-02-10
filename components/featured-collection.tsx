import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { client, urlFor } from "@/lib/sanity";
import { groq } from "next-sanity";
import { Button } from "@/components/ui/button";
import { getLocale, getTranslations } from "next-intl/server";

const FEATURED_LIMIT = 4;

type Product = {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  description?: string | null;
  image?: Array<{ asset?: { _ref?: string } }> | null;
};

function formatPrice(price: number, locale: string) {
  return new Intl.NumberFormat(locale === "nl" ? "nl-NL" : "en-US", {
    style: "currency",
    currency: locale === "nl" ? "EUR" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function FeaturedCollection() {
  const t = await getTranslations("Featured");
  const tCollection = await getTranslations("Collection");
  const locale = await getLocale();

  const query = groq`
    *[_type == "product"] | order(_createdAt desc)[0...${FEATURED_LIMIT}] {
      _id,
      name,
      slug,
      price,
      description,
      image,
    }
  `;
  const products = await client.fetch<Product[]>(query);

  if (!products?.length) {
    return null;
  }

  return (
    <section className="w-full py-10 sm:py-16 px-4 sm:px-6">
      {/* Section header */}
      <div className="mb-8 sm:mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-medium tracking-tight sm:text-3xl">
          {t("latestProducts")}
        </h2>
        <Link
          href="/collection"
          className="text-sm font-medium tracking-wide hover:text-primary hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => {
          const mainImage = product.image?.[0];
          const slug = product.slug?.current ?? product._id;

          return (
            <Link
              href={`/collection/${slug}`}
              key={product._id}
              className="flex flex-col overflow-hidden"
            >
              <div className="block aspect-square w-full overflow-hidden rounded-xl">
                {mainImage ? (
                  <Image
                    src={urlFor(mainImage).width(600).height(600).url()}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover transition-transform hover:scale-105 rounded-xl overflow-hidden"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-600">
                    {tCollection("noImage")}
                  </div>
                )}
              </div>
              <div className="flex flex-row items-start justify-between gap-2 px-2 sm:px-4 pt-3 sm:pt-4 pb-1">
                <span className="text-base sm:text-lg font-medium truncate min-w-0">{product.name}</span>
                <span className="shrink-0 text-base sm:text-lg font-bold">
                  {formatPrice(product.price, locale)}
                </span>
              </div>
              {product.description ? (
                <p className="px-2 sm:px-4 text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              ) : null}
              <div className="flex-1 px-4 pb-0" />
              <div className="px-2 sm:px-4 pb-4 pt-2">
                <Button variant="default" className="w-full">
                  {tCollection("viewProduct")}
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
