import Image from "next/image";
import { notFound } from "next/navigation";
import { client, urlFor } from "@/lib/sanity";
import { groq } from "next-sanity";
import { PickupModal } from "@/components/pickup-modal";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ArrowLeftIcon } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

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

async function getProduct(slug: string): Promise<Product | null> {
  const query = groq`
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      price,
      description,
      image,
    }
  `;
  return client.fetch<Product | null>(query, { slug });
}

async function getOtherProducts(
  excludeId: string,
  limit: number = 3
): Promise<Product[]> {
  const query = groq`
    *[_type == "product" && _id != $excludeId] | order(_createdAt desc)[0...$limit] {
      _id,
      name,
      slug,
      price,
      description,
      image,
    }
  `;
  return client.fetch<Product[]>(query, { excludeId, limit });
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Product");

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const otherProducts = await getOtherProducts(product._id);

  const imageUrls = (product.image ?? []).map((img) => ({
    url: urlFor(img).width(900).height(900).url(),
  }));

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/collection"
          className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4 shrink-0" />
          {t("backToCollection")}
        </Link>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductImageGallery images={imageUrls} alt={product.name} />

          <div className="flex flex-col min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-xl sm:text-2xl font-semibold">
              {formatPrice(product.price, locale)}
            </p>
            {product.description ? (
              <p className="mt-6 text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            ) : null}

            <div className="pt-6 sm:pt-8">
              <PickupModal />
            </div>
          </div>
        </div>

        {otherProducts.length > 0 && (
          <section className="mt-12 sm:mt-16 border-t pt-12 sm:pt-16">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              {t("youMightAlsoLike")}
            </h2>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
              {otherProducts.map((p) => {
                const productSlug = p.slug?.current ?? p._id;
                const mainImage = p.image?.[0];
                return (
                  <Link
                    key={p._id}
                    href={`/collection/${productSlug}`}
                    className="group flex flex-col overflow-hidden"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
                      {mainImage ? (
                        <Image
                          src={urlFor(mainImage).width(600).height(600).url()}
                          alt={p.name}
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
                    <div className="mt-3 flex items-baseline justify-between gap-2">
                      <span className="font-medium">{p.name}</span>
                      <span className="shrink-0 font-semibold">
                        {formatPrice(p.price, locale)}
                      </span>
                    </div>
                    {p.description ? (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-12 sm:mt-16 border-t py-10 sm:py-16">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
            {t("shippingReturns")}
          </h2>
          <div className="mt-4 sm:mt-6 space-y-4 text-sm sm:text-base text-muted-foreground">
            <p>{t("shippingBody")}</p>
            <p>{t("returnsBody")}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
