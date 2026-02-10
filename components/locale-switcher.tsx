"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onValueChange(newLocale: string) {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale as "en" | "nl" });
  }

  return (
    <Select value={locale} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 w-[130px]" size="default">
        <SelectValue placeholder={t("label")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {routing.locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc === "en" ? t("en") : t("nl")}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
