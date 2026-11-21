import {
  BellIcon,
  BookOpenIcon,
  BotIcon,
  BrainIcon,
  BriefcaseIcon,
  BugIcon,
  CalendarIcon,
  CameraIcon,
  ChartLineIcon,
  ClockIcon,
  CodeIcon,
  CoffeeIcon,
  DollarSignIcon,
  GitBranchIcon,
  GlobeIcon,
  GraduationCapIcon,
  HeartIcon,
  InboxIcon,
  LightbulbIcon,
  MailIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  MusicIcon,
  NewspaperIcon,
  PaletteIcon,
  PlaneIcon,
  RadarIcon,
  ReceiptIcon,
  RocketIcon,
  SearchIcon,
  ShieldIcon,
  ShoppingCartIcon,
  SparklesIcon,
  TerminalIcon,
  WalletIcon,
  WrenchIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";
import { isBotColor, isBotIconName, type BotColor, type BotIconName } from "@/lib/bots/schema";
import { cn } from "@/lib/utils";

export const BOT_ICON_COMPONENTS: Record<BotIconName, LucideIcon> = {
  bot: BotIcon,
  sparkles: SparklesIcon,
  rocket: RocketIcon,
  brain: BrainIcon,
  zap: ZapIcon,
  mail: MailIcon,
  inbox: InboxIcon,
  "message-square": MessageSquareIcon,
  bell: BellIcon,
  calendar: CalendarIcon,
  clock: ClockIcon,
  newspaper: NewspaperIcon,
  megaphone: MegaphoneIcon,
  search: SearchIcon,
  radar: RadarIcon,
  globe: GlobeIcon,
  plane: PlaneIcon,
  receipt: ReceiptIcon,
  wallet: WalletIcon,
  "dollar-sign": DollarSignIcon,
  chart: ChartLineIcon,
  briefcase: BriefcaseIcon,
  "shopping-cart": ShoppingCartIcon,
  code: CodeIcon,
  terminal: TerminalIcon,
  "git-branch": GitBranchIcon,
  bug: BugIcon,
  shield: ShieldIcon,
  "book-open": BookOpenIcon,
  "graduation-cap": GraduationCapIcon,
  lightbulb: LightbulbIcon,
  wrench: WrenchIcon,
  palette: PaletteIcon,
  camera: CameraIcon,
  music: MusicIcon,
  heart: HeartIcon,
  coffee: CoffeeIcon,
};

/** Full class strings so Tailwind keeps them; tints stay readable in light and dark mode */
export const BOT_COLOR_STYLES: Record<BotColor, { tile: string; swatch: string }> = {
  slate: { tile: "border-slate-500/30 bg-slate-500/15 text-slate-700 dark:text-slate-300", swatch: "bg-slate-500" },
  red: { tile: "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-300", swatch: "bg-red-500" },
  orange: { tile: "border-orange-500/30 bg-orange-500/15 text-orange-700 dark:text-orange-300", swatch: "bg-orange-500" },
  amber: { tile: "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300", swatch: "bg-amber-500" },
  lime: { tile: "border-lime-500/30 bg-lime-500/15 text-lime-700 dark:text-lime-300", swatch: "bg-lime-500" },
  emerald: { tile: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", swatch: "bg-emerald-500" },
  teal: { tile: "border-teal-500/30 bg-teal-500/15 text-teal-700 dark:text-teal-300", swatch: "bg-teal-500" },
  sky: { tile: "border-sky-500/30 bg-sky-500/15 text-sky-700 dark:text-sky-300", swatch: "bg-sky-500" },
  blue: { tile: "border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-300", swatch: "bg-blue-500" },
  indigo: { tile: "border-indigo-500/30 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300", swatch: "bg-indigo-500" },
  violet: { tile: "border-violet-500/30 bg-violet-500/15 text-violet-700 dark:text-violet-300", swatch: "bg-violet-500" },
  pink: { tile: "border-pink-500/30 bg-pink-500/15 text-pink-700 dark:text-pink-300", swatch: "bg-pink-500" },
};

const SIZES = {
  sm: { tile: "h-7 w-7 rounded-md", icon: "h-3.5 w-3.5" },
  md: { tile: "h-9 w-9 rounded-md", icon: "h-4 w-4" },
  lg: { tile: "h-14 w-14 rounded-lg", icon: "h-7 w-7" },
};

interface BotAvatarProps {
  icon?: string | null;
  color?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Decorative; unknown or empty values fall back to the default bot icon on a neutral tile */
export function BotAvatar({ icon, color, size = "md", className }: BotAvatarProps) {
  const sizes = SIZES[size];
  const tint = color && isBotColor(color) ? BOT_COLOR_STYLES[color].tile : "bg-muted text-muted-foreground";

  return (
    <div aria-hidden="true" className={cn("flex shrink-0 items-center justify-center border", sizes.tile, tint, className)}>
      <BotIconGlyph name={icon && isBotIconName(icon) ? icon : "bot"} className={sizes.icon} />
    </div>
  );
}

export function BotIconGlyph({ name, className }: { name: BotIconName; className?: string }) {
  const Icon = BOT_ICON_COMPONENTS[name];
  return <Icon className={className} />;
}
