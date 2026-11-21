import { getTranslations } from "next-intl/server";
import { BOT_OG_SIZE, renderBotsListingOgImage } from "@/components/bots/bot-og-image";

export const alt = "AI Agent Bots";
export const size = BOT_OG_SIZE;
export const contentType = "image/png";
export const revalidate = 86400;

export default async function OGImage() {
  const tSeo = await getTranslations("seo.bots");
  const t = await getTranslations("bots");
  return renderBotsListingOgImage({ heading: tSeo("heading"), description: t("description") });
}
