import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-xl mx-auto min-w-0">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">{t("subtitle")}</p>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
