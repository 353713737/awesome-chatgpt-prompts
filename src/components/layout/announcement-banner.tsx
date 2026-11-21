"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { useBranding } from "@/components/providers/branding-provider";
import type { AnnouncementConfig } from "@/lib/config";

export function AnnouncementBanner({
  announcement,
}: {
  announcement?: AnnouncementConfig | null;
}) {
  const branding = useBranding();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);

  const storageKey = announcement
    ? `announcement-banner-dismissed:${announcement.id}`
    : null;
  const hideViaQuery = searchParams?.has("no-announcement");

  useEffect(() => {
    if (!storageKey) return;
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed) setIsVisible(true);
  }, [storageKey]);

  if (!announcement || !isVisible || branding.useCloneBranding || hideViaQuery) {
    return null;
  }

  const handleDismiss = () => {
    if (storageKey) localStorage.setItem(storageKey, "true");
    setIsVisible(false);
  };

  const content = (
    <>
      <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate">
        <span className="hidden sm:inline">{announcement.message}</span>
        <span className="sm:hidden">
          {announcement.messageShort ?? announcement.message}
        </span>
        {announcement.cta && (
          <span className="ml-1 underline-offset-2 hover:underline">
            {announcement.cta}
          </span>
        )}
      </span>
    </>
  );

  return (
    <div className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground">
      <div className="container flex items-center justify-between gap-3 py-1.5 text-xs sm:text-sm">
        {announcement.href ? (
          <Link
            href={announcement.href}
            target={announcement.external ? "_blank" : undefined}
            rel={announcement.external ? "noopener noreferrer" : undefined}
            className="flex min-w-0 flex-1 items-center gap-2 hover:underline"
          >
            {content}
          </Link>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2">{content}</div>
        )}
        <button
          type="button"
          onClick={handleDismiss}
          className="-mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-primary-foreground/80 hover:bg-primary-foreground/20 hover:text-primary-foreground"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
