"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { NavSearch } from "./nav-search";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";

const navItems = [
  { key: "home" as const, href: "/" },
  { key: "collection" as const, href: "/collection" },
  { key: "aboutUs" as const, href: "/about-us" },
  { key: "contact" as const, href: "/contact" },
];

export default function Navbar() {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");

  return (
    <nav className="z-50 bg-white/50 dark:bg-background/50 backdrop-blur-sm border-b border-gray-200 dark:border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image src="/logo.png" alt="logo" width={32} height={32} />
              <span className="text-2xl font-bold">
                {tCommon("brandName")}
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 space-x-4 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-1 justify-end *:h-9 *:shrink-0">
            <NavSearch />
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
