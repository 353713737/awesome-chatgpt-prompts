import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Check, Clock, X } from "lucide-react";
import { formatDistanceToNow } from "@/lib/date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type ChangeRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

const STATUS_COLORS: Record<ChangeRequestStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  APPROVED: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

const STATUS_ICONS = {
  PENDING: Clock,
  APPROVED: Check,
  REJECTED: X,
};

export interface ChangeRequestListItem {
  id: string;
  status: ChangeRequestStatus;
  originalTitle: string;
  proposedTitle: string | null;
  reason: string | null;
  createdAt: Date;
  author: { name: string | null; username: string; avatar: string | null };
}

interface ChangeRequestListProps {
  changeRequests: ChangeRequestListItem[];
  /** Page the requests belong to, e.g. "/prompts/abc" or "/bots/abc_slug" */
  basePath: string;
}

export function ChangeRequestList({ changeRequests, basePath }: ChangeRequestListProps) {
  const t = useTranslations("changeRequests");
  const locale = useLocale();

  return (
    <div className="divide-y border rounded-lg">
      {changeRequests.map((cr) => {
        const StatusIcon = STATUS_ICONS[cr.status];
        const hasTitleChange = cr.proposedTitle && cr.proposedTitle !== cr.originalTitle;
        return (
          <Link
            key={cr.id}
            href={`${basePath}/changes/${cr.id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
          >
            <div className={`p-1.5 rounded-full shrink-0 ${
              cr.status === "PENDING"
                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                : cr.status === "APPROVED"
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}>
              <StatusIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">
                  {hasTitleChange ? (
                    <>
                      <span className="line-through text-muted-foreground">{cr.originalTitle}</span>
                      {" → "}
                      <span>{cr.proposedTitle}</span>
                    </>
                  ) : (
                    t("contentChanges")
                  )}
                </span>
              </div>
              {cr.reason && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {cr.reason}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={cr.author.avatar || undefined} />
                  <AvatarFallback className="text-[9px]">
                    {cr.author.name?.[0] || cr.author.username[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">@{cr.author.username}</span>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {formatDistanceToNow(cr.createdAt, locale)}
              </span>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${STATUS_COLORS[cr.status]}`}>
                {t(cr.status.toLowerCase())}
              </Badge>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
