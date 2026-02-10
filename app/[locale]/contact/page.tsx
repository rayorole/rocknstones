import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
