import { useLocale } from "next-intl";
import { redirect } from "@/i18n/navigation";

export default function HomeLayout() {
  const locale = useLocale();
  redirect({ href: "/", locale });
}
