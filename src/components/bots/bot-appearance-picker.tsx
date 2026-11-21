"use client";

import { useTranslations } from "next-intl";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BOT_COLOR_STYLES, BotAvatar, BotIconGlyph } from "@/components/bots/bot-avatar";
import { BOT_COLORS, BOT_ICONS } from "@/lib/bots/schema";
import { cn } from "@/lib/utils";

interface BotAppearancePickerProps {
  /** Preset icon key, or "" for the default */
  icon: string;
  /** Preset color key, or "" for the default */
  color: string;
  onIconChange: (icon: string) => void;
  onColorChange: (color: string) => void;
}

export function BotAppearancePicker({ icon, color, onIconChange, onColorChange }: BotAppearancePickerProps) {
  const t = useTranslations("bots");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="h-auto gap-3 py-2 pl-2 pr-3">
          <BotAvatar icon={icon} color={color} />
          <span className="text-sm">{t("form.changeAppearance")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 space-y-4">
        <div className="space-y-2">
          <p id="bot-icon-label" className="text-xs font-medium text-muted-foreground">{t("form.icon")}</p>
          <div role="radiogroup" aria-labelledby="bot-icon-label" className="grid grid-cols-8 gap-1">
            {BOT_ICONS.map((name) => {
              const selected = (icon || "bot") === name;
              const label = t(`icons.${name}`);
              return (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={label}
                  title={label}
                  onClick={() => onIconChange(name === "bot" ? "" : name)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected && "border-primary bg-primary/10 text-foreground"
                  )}
                >
                  <BotIconGlyph name={name} className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p id="bot-color-label" className="text-xs font-medium text-muted-foreground">{t("form.color")}</p>
          <div role="radiogroup" aria-labelledby="bot-color-label" className="flex flex-wrap gap-1.5">
            {(["", ...BOT_COLORS] as const).map((name) => {
              const selected = color === name;
              const label = name ? t(`colors.${name}`) : t("form.defaultColor");
              return (
                <button
                  key={name || "default"}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={label}
                  title={label}
                  onClick={() => onColorChange(name)}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    name ? cn("border-transparent", BOT_COLOR_STYLES[name].swatch) : "border-border bg-muted",
                    selected && "ring-2 ring-foreground ring-offset-2"
                  )}
                >
                  {selected && <Check className={cn("h-3.5 w-3.5", name ? "text-white" : "text-foreground")} />}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={!icon && !color}
          onClick={() => {
            onIconChange("");
            onColorChange("");
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t("form.resetAppearance")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
