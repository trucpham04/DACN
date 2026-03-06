import Image from "next/image";
import { useTranslations } from "next-intl";
import { LocaleSelector } from "@/components/locale/locale-selector";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex min-h-screen items-center justify-center px-8 font-sans">
      <div className="flex w-full max-w-xl flex-col space-y-24 pb-40">
        <div className="flex w-full justify-end gap-2 py-4">
          <ThemeToggle />
          <LocaleSelector />
        </div>

        <div className="flex w-full flex-1 flex-col items-start justify-start gap-12">
          <div className="flex flex-col items-start justify-center gap-4">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
            <div className="text-3xl font-semibold">{t("title")}</div>
          </div>

          <p className="max-w-md text-lg">{t("description")}</p>
        </div>
      </div>
    </div>
  );
}
