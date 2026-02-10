import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/hero";
import FeaturedCollection from "@/components/featured-collection";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="space-y-10 p-4 sm:p-6">
      <Hero />
      <FeaturedCollection />
    </main>
  );
}
