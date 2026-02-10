import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { client, urlFor } from "@/lib/sanity";
import { groq } from "next-sanity";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("Hero");

  let data: Array<{
    heading?: string;
    subheading?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
    backgroundImage?: { asset?: { _ref?: string } };
  }> = [];

  try {
    const query = groq`
      *[_type == "hero"] {
        heading,
        backgroundImage,
        subheading,
        ctaButtonText,
        ctaButtonLink,
      }
    `;
    data = await client.fetch(query);
  } catch {
    // use fallback when Sanity is unavailable
  }

  const hero = data?.[0];
  const heading = hero?.heading ?? t("fallbackHeading");
  const subheading = hero?.subheading ?? t("fallbackSubheading");
  const ctaText = hero?.ctaButtonText ?? t("viewCollection");
  const ctaLink = hero?.ctaButtonLink ?? "/collection";
  const backgroundImage = hero?.backgroundImage;

  return (
    <section className="relative h-[700px] w-full flex items-center justify-center overflow-hidden rounded-xl">
      {/* Background image */}
      <div className="absolute inset-0 bg-neutral-950">
        {backgroundImage ? (
          <Image
            src={urlFor(backgroundImage).width(1920).height(1080).url()}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.35 0.08 280), transparent 70%), linear-gradient(180deg, oklch(0.15 0.02 280), oklch(0.08 0 0))",
            }}
          />
        )}
        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0 0 0 / 0.4) 0%, oklch(0 0 0 / 0.6) 100%)",
          }}
        />
      </div>

      {/* Centered content */}
      <div className="relative z-10 px-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight uppercase">
          {(() => {
            const parts = heading.trim().split(/\s+/);
            const first = parts[0] ?? "";
            const rest = parts.slice(1).join(" ");
            return (
              <>
                {first}
                <br />
                {rest || t("dark")}
              </>
            );
          })()}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-white/90 font-light max-w-xl mx-auto">
          {subheading}
        </p>
        <div className="mt-10">
          <Button asChild size="lg" variant="secondary">
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
