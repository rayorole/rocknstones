"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mt-6 sm:mt-8 rounded-xl border bg-muted/50 p-6 sm:p-8 text-center">
        <p className="font-medium">{t("thanks")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("thanksSub")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="contact-name">{t("formName")}</Label>
        <Input
          id="contact-name"
          name="name"
          required
          placeholder={t("placeholderName")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">{t("formEmail")}</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder={t("placeholderEmail")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">{t("formMessage")}</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          placeholder={t("placeholderMessage")}
          rows={4}
        />
      </div>
      <Button type="submit">{t("send")}</Button>
    </form>
  );
}
