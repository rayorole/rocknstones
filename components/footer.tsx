"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { MapPinIcon, PhoneIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const siteLinks = [
  { key: "home" as const, href: "/" },
  { key: "collection" as const, href: "/collection" },
  { key: "aboutUs" as const, href: "/about-us" },
  { key: "contact" as const, href: "/contact" },
];

const contact = {
  phone: "+32475430399",
  address: "Hoveniersstraat 2, 6e verdieping bureau 630",
};

export default function Footer() {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const tFooter = useTranslations("Footer");

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo.png" alt="" width={36} height={36} />
              <span className="text-xl font-bold">
                {tCommon("brandName")}
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              {tFooter("tagline")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {tFooter("links")}
            </h3>
            <ul className="mt-3 space-y-2">
              {siteLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {tFooter("contactUs")}
            </h3>
            <div className="mt-3 space-y-4">
              <a
                href={`tel:${contact.phone.replace(/\D/g, "")}`}
                className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0" />
                {contact.phone}
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="whitespace-pre-line">{contact.address}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-8 sm:mt-10 pt-6 text-center text-xs text-muted-foreground border-t px-2">
          {tFooter("allRightsReserved", {
            year: new Date().getFullYear(),
          })}
        </p>
      </div>
    </footer>
  );
}
