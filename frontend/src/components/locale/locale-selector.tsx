"use client";

import { Check, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSelector() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("LocaleSelector");

  const languages = [
    {
      locale: "en",
      label: "English",
    },
    {
      locale: "vi",
      label: "Tiếng Việt",
    },
  ];

  function ChangeLocale({
    currentPath,
    locale,
  }: {
    currentPath: string;
    locale: string;
  }) {
    router.replace(currentPath, { locale: locale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="size-4" />
          <span className="sr-only">{t("changeLocale")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="flex flex-col gap-0.5">
        {languages.map((language) => {
          return (
            <DropdownMenuItem
              key={language.locale}
              className={cn(locale === language.locale && "bg-muted")}
              onClick={() =>
                ChangeLocale({ currentPath: pathname, locale: language.locale })
              }
            >
              <div className="size-4">
                {locale === language.locale && <Check className="size-4" />}
              </div>
              {language.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
