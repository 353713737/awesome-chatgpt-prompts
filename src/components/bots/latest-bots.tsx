import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BotCard } from "@/components/bots/bot-card";
import { listLatestBots } from "@/lib/bots";

export async function LatestBots() {
  const t = await getTranslations("bots");
  const bots = await listLatestBots(6);

  if (bots.length === 0) return null;

  return (
    <section className="py-12 border-b">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-violet-500" />
            <h2 className="text-xl font-semibold">{t("latestBots")}</h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/bots" prefetch={false}>
              {t("viewAll")}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <BotCard key={bot.id} bot={bot} />
          ))}
        </div>
      </div>
    </section>
  );
}
