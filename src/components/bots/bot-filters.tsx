"use client";

import { useTranslations } from "next-intl";
import { PromptFilters } from "@/components/prompts/prompt-filters";
import { analyticsBot } from "@/lib/analytics";
import { BOT_PLATFORMS, BOT_PLATFORM_INFO } from "@/lib/bots/schema";

type PromptFiltersProps = Parameters<typeof PromptFilters>[0];

interface BotFiltersProps {
  categories: PromptFiltersProps["categories"];
  tags: PromptFiltersProps["tags"];
  currentFilters: PromptFiltersProps["currentFilters"];
}

/** The /prompts sidebar with a platform select in place of the prompt type */
export function BotFilters({ categories, tags, currentFilters }: BotFiltersProps) {
  const t = useTranslations("bots");

  return (
    <PromptFilters
      basePath="/bots"
      categories={categories}
      tags={tags}
      currentFilters={currentFilters}
      searchPlaceholder={t("searchPlaceholder")}
      primaryFilter={{
        param: "platform",
        label: t("form.platform"),
        options: BOT_PLATFORMS.map((platform) => ({
          value: BOT_PLATFORM_INFO[platform].param,
          label: BOT_PLATFORM_INFO[platform].name,
        })),
        onSelect: (value) => analyticsBot.filter(value),
      }}
    />
  );
}
