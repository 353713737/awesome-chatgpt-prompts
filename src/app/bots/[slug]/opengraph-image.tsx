import { getBotById, extractBotId } from "@/lib/bots";
import { BOT_OG_SIZE, renderBotOgImage } from "@/components/bots/bot-og-image";

export const alt = "Bot Preview";
export const size = BOT_OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bot = await getBotById(extractBotId(slug));
  // Private bots render the not-found card so their content never leaks into a preview
  return renderBotOgImage(bot && !bot.isPrivate ? bot : null);
}
