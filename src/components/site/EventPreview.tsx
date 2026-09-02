import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, CalendarDays, MapPin, X } from "lucide-react";

import { getEventVisual } from "@/components/site/event-visuals";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date";
import type { EventItem } from "@/lib/api";

type EventPreviewProps = {
  event: EventItem | null;
  onClose: () => void;
};

export function EventPreview({ event, onClose }: EventPreviewProps) {
  useEffect(() => {
    if (!event) return;

    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  const visual = getEventVisual(event.title, event.image_url);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-preview-title"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border/80 bg-card p-5 text-card-foreground shadow-2xl sm:p-6"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Close event details"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
          <img src={visual.src} alt={visual.alt} className="size-full object-cover" />
        </div>

        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center gap-4 border-b border-border/60 pb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Calendar className="size-4 text-accent" />
              <span>
                {formatDate(event.starts_at, "dd MMMM yyyy")}
                {event.ends_at && event.ends_at !== event.starts_at
                  ? ` - ${formatDate(event.ends_at, "dd MMMM yyyy")}`
                  : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-accent" />
              <span>{formatDate(event.starts_at, "hh:mm a")}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-accent" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          <h1
            id="event-preview-title"
            className="font-display text-3xl font-bold text-foreground sm:text-4xl"
          >
            {event.title}
          </h1>

          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
              Event Brief & Information
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
              {event.description || "No description provided for this event."}
            </p>
          </div>

          <div className="flex items-center justify-end border-t border-border/60 pt-5">
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button asChild>
                <Link to="/get-involved">
                  Get Involved
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
