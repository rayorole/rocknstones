import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/hero";
import FeaturedCollection from "@/components/featured-collection";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="space-y-8 sm:space-y-10 p-5 sm:p-6 min-w-0">
      <Hero />
      <FeaturedCollection />
    </main>
  );
}
