"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPinIcon, PhoneIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const PICKUP_INFO = {
  phone: "+32475430399",
  address: "Hoveniersstraat 2, 6e verdieping bureau 630",
};

export function PickupModal() {
  const t = useTranslations("Product");
  const tModal = useTranslations("PickupModal");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          {t("pickupInStore")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[min(100vw-2rem,28rem)] max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tModal("title")}</DialogTitle>
          <DialogDescription>{tModal("description")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
            <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {tModal("phone")}
              </p>
              <a
                href={`tel:${PICKUP_INFO.phone.replace(/\D/g, "")}`}
                className="mt-1 hover:underline"
              >
                {PICKUP_INFO.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
            <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {tModal("address")}
              </p>
              <p className="mt-1 whitespace-pre-line">{PICKUP_INFO.address}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
