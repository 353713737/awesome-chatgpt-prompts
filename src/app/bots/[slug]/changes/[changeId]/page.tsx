import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { ChangeRequestDetail } from "@/components/prompts/change-request-detail";
import { extractBotId, getBotById } from "@/lib/bots";
import { canViewPrompt } from "@/lib/prompt-access";
import { NOINDEX_ROBOTS } from "@/lib/seo";
import { getBotUrl } from "@/lib/urls";

// Signed-in or workflow page with no search value
export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};

interface BotChangeRequestPageProps {
  params: Promise<{ slug: string; changeId: string }>;
}

export default async function BotChangeRequestPage({ params }: BotChangeRequestPageProps) {
  const { slug, changeId } = await params;
  const session = await auth();
  const bot = await getBotById(extractBotId(slug), { includeDeleted: session?.user?.role === "ADMIN" });
  if (!bot || !canViewPrompt(bot, session)) {
    notFound();
  }

  const t = await getTranslations("changeRequests");

  return (
    <ChangeRequestDetail
      promptId={bot.id}
      changeId={changeId}
      basePath={getBotUrl(bot.id, bot.slug)}
      backLabel={t("backToBot")}
    />
  );
}
