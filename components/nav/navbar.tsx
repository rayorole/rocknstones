"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { MenuIcon } from "lucide-react";
import { NavSearch } from "./nav-search";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { key: "home" as const, href: "/" },
  { key: "collection" as const, href: "/collection" },
  { key: "aboutUs" as const, href: "/about-us" },
  { key: "contact" as const, href: "/contact" },
];

const navLinkClass =
  "text-sm font-medium text-muted-foreground hover:text-foreground";

export default function Navbar() {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="z-50 bg-white/50 dark:bg-background/50 backdrop-blur-sm border-b border-gray-200 dark:border-border">
      <div className="container mx-auto px-4 py-2 sm:py-2">
        <div className="flex items-center justify-between gap-2">
          {/* Logo - always visible */}
          <Link href="/" className="flex items-center gap-2 w-fit shrink-0 min-w-0">
            <Image src="/logo.png" alt="" width={32} height={32} className="shrink-0" />
            <span className="text-lg font-bold truncate sm:text-2xl">
              {tCommon("brandName")}
            </span>
          </Link>

          {/* Center nav - hidden on mobile */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Right: search, locale, theme on desktop; menu on mobile */}
          <div className="flex items-center gap-2 shrink-0 *:h-9 *:shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <NavSearch />
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="h-9 w-9" aria-label="Open menu">
                  <MenuIcon className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(320px,100vw-2rem)] flex flex-col p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col flex-1 overflow-y-auto px-6 pt-14 pb-6 pr-14">
                  <nav className="flex flex-col gap-1" aria-label="Main">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-lg py-3 px-3 text-base font-medium text-foreground hover:bg-muted hover:text-foreground -mx-3"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">Language</span>
                      <LocaleSwitcher />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
