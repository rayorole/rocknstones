import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations, setRequestLocale } from "next-intl/server";

function PhotoPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`bg-neutral-200 dark:bg-neutral-700 rounded-xl min-h-[200px] w-full ${className ?? ""}`}
      aria-hidden
    />
  );
}

type Props = { params: Promise<{ locale: string }> };

export default async function AboutUsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <header className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </header>

        <section className="space-y-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {t("howItStarted")}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t("howItStartedBody")}
              </p>
            </div>
            <PhotoPlaceholder className="min-h-[280px] lg:min-h-[320px]" />
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
            <PhotoPlaceholder className="min-h-[280px] lg:min-h-[320px] order-2 lg:order-1" />
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                {t("craftAndCuration")}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t("craftBody")}
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {t("whyBlackDiamonds")}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t("whyBody")}
              </p>
            </div>
            <PhotoPlaceholder className="min-h-[280px] lg:min-h-[320px]" />
          </div>
        </section>

        <section className="mt-20 text-center">
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t("ctaText")}
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/contact">{t("contactUs")}</Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
