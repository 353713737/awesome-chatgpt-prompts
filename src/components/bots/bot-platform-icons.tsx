"use client";

import { BotPlatformIcon } from "@/components/bots/bot-platform-icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BOT_PLATFORM_INFO, type BotPlatform } from "@/lib/bots/schema";
import { cn } from "@/lib/utils";

interface BotPlatformIconsProps {
  platforms: BotPlatform[];
  className?: string;
}

export function BotPlatformIcons({ platforms, className }: BotPlatformIconsProps) {
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {platforms.map((platform) => {
        const name = BOT_PLATFORM_INFO[platform].name;
        return (
          <li key={platform}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  role="img"
                  aria-label={name}
                  className="flex h-6 w-6 items-center justify-center rounded-md border bg-background"
                >
                  <BotPlatformIcon platform={platform} className="h-3.5 w-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">{name}</TooltipContent>
            </Tooltip>
          </li>
        );
      })}
    </ul>
  );
}
