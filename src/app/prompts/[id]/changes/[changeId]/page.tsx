import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ChangeRequestDetail } from "@/components/prompts/change-request-detail";
import { NOINDEX_ROBOTS } from "@/lib/seo";

// Signed-in or workflow page with no search value
export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};

interface ChangeRequestPageProps {
  params: Promise<{ id: string; changeId: string }>;
}

/**
 * Extracts the prompt ID from a URL parameter that may contain a slug
 */
function extractPromptId(idParam: string): string {
  const underscoreIndex = idParam.indexOf("_");
  if (underscoreIndex !== -1) {
    return idParam.substring(0, underscoreIndex);
  }
  return idParam;
}

export default async function ChangeRequestPage({ params }: ChangeRequestPageProps) {
  const t = await getTranslations("changeRequests");
  const { id: idParam, changeId } = await params;
  const promptId = extractPromptId(idParam);

  return (
    <ChangeRequestDetail
      promptId={promptId}
      changeId={changeId}
      basePath={`/prompts/${promptId}`}
      backLabel={t("backToPrompt")}
    />
  );
}
