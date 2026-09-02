import { useCallback, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Calendar, CalendarDays, MapPin, X } from "lucide-react";

import { PageHero, SiteShell } from "@/components/site/SiteShell";
import { getEventVisual } from "@/components/site/event-visuals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date";
import { fetchUpcomingEvents, type EventItem } from "@/lib/api";

// 1. Define search parameter shape
type EventsSearch = {
  event?: string | undefined;
  eventId?: string | undefined;
};

export const Route = createFileRoute("/events")({
  // 2. Add search validation so TanStack Router preserves search parameters on navigation
  validateSearch: (search: Record<string, unknown>): EventsSearch => ({
    event: (search["event"] as string) || undefined,
    eventId: (search["eventId"] as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Upcoming Events & Conferences | Hope Alliance" },
      {
        name: "description",
        content:
          "Join Hope Alliance events: youth conferences, outreach food drives and leadership training workshops across Uganda.",
      },
      { property: "og:title", content: "Upcoming Events | Hope Alliance" },
      {
        property: "og:description",
        content: "Conferences, outreach drives and workshops you can be part of.",
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const navigate = useNavigate({ from: "/events" });
  
  // 3. Read active query params from TanStack Router
  const search = Route.useSearch();
  const activeParam = search.event || search.eventId;

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["events", "all"],
    queryFn: () => fetchUpcomingEvents(24),
  });

  // 4. Derive selected event directly from fetched data matching slug or id
  const selectedEvent = (data ?? []).find(
    (e: EventItem) => e.slug === activeParam || e.id === activeParam
  ) ?? null;

  // Function to open overlay by updating search params
  const handleOpenEvent = (e: EventItem) => {
    void navigate({
      search: (prev) => ({ ...prev, event: e.slug || e.id }),
    });
  };

  // Function to close overlay by clearing search params
  const handleCloseEvent = useCallback(() => {
    void navigate({
      search: (prev) => {
        const { event: _event, eventId: _eventId, ...rest } = prev;
        return rest;
      },
    });
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseEvent();
    };

    if (selectedEvent) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEvent, handleCloseEvent]);

  return (
    <SiteShell>
      <PageHero
        title="Events"
        description="Join our upcoming gatherings, trainings and community outreach events across Uganda."
        actions={
          <Button asChild variant="hero" size="lg">
            <Link to="/get-involved">GET INVOLVED</Link>
          </Button>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))
          ) : isError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center md:col-span-2 lg:col-span-3">
              <h2 className="font-display text-xl font-bold">Events are unavailable</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We could not load the event schedule. Please try again in a moment.
              </p>
              <Button className="mt-5" variant="outline" onClick={() => void refetch()}>
                Try again
              </Button>
            </div>
          ) : (data ?? []).length === 0 ? (
            <div className="rounded-xl border border-border/70 bg-card p-8 text-center md:col-span-2 lg:col-span-3">
              <h2 className="font-display text-xl font-bold">No upcoming events yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Check back soon for new gatherings, trainings and outreach events.
              </p>
            </div>
          ) : (
            (data ?? []).map((e: EventItem) => {
              const visual = getEventVisual(e.title, e.image_url);

              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => handleOpenEvent(e)}
                  aria-label={`View details for ${e.title}`}
                  className="block h-full w-full text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Card className="group grid h-[34rem] grid-rows-[7fr_3fr] overflow-hidden border-border/70 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
                    <div className="relative min-h-0 overflow-hidden bg-primary/10">
                      <img
                        src={visual.src}
                        alt={visual.alt}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 py-3">
                        <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                          View event details
                        </span>
                      </div>
                    </div>

                    <div className="min-h-0 space-y-2 overflow-hidden p-4">
                      <Badge variant="secondary">{formatDate(e.starts_at, "dd MMM yyyy")}</Badge>
                      <h2 className="font-display text-lg font-bold transition-colors group-hover:text-accent">
                        {e.title}
                      </h2>
                      <p className="line-clamp-1 text-sm text-muted-foreground">{e.description}</p>
                      <p className="flex items-center gap-2 truncate text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0 text-accent" />
                        {e.location || "Location to be announced"}
                      </p>
                      <p className="flex items-center gap-2 truncate text-sm text-muted-foreground">
                        <CalendarDays className="size-4 shrink-0 text-accent" />
                        {formatDate(e.starts_at, "dd MMM yyyy")}
                        {e.ends_at ? ` - ${formatDate(e.ends_at, "dd MMM yyyy")}` : ""}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                        Read details
                        <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </Card>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* Full-Screen Virtual Detail Overlay */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-dialog-title"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-background text-foreground animate-in fade-in duration-200"
        >
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Navigation Header Actions */}
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseEvent}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Back to all events
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseEvent}
                className="rounded-full"
                aria-label="Close details"
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* Main Visual */}
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted shadow-md">
              <img
                src={getEventVisual(selectedEvent.title, selectedEvent.image_url).src}
                alt={selectedEvent.title}
                className="size-full object-cover"
              />
            </div>

            {/* Content Details */}
            <div className="mt-8 space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border/60 pb-4">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Calendar className="size-4 text-accent" />
                  <span>
                    {formatDate(selectedEvent.starts_at, "dd MMMM yyyy")}
                    {selectedEvent.ends_at && selectedEvent.ends_at !== selectedEvent.starts_at
                      ? ` - ${formatDate(selectedEvent.ends_at, "dd MMMM yyyy")}`
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-accent" />
                  <span>{formatDate(selectedEvent.starts_at, "hh:mm a")}</span>
                </div>
                {selectedEvent.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-accent" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
              </div>

              <h1
                id="event-dialog-title"
                className="font-display text-3xl sm:text-4xl font-bold text-foreground"
              >
                {selectedEvent.title}
              </h1>

              <div className="space-y-3 pt-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Event Brief & Information
                </h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                  {selectedEvent.description || "No description provided for this event."}
                </p>
              </div>

              <div className="mt-12 flex items-center justify-end border-t border-border/60 pt-6">
                <Button variant="outline" onClick={handleCloseEvent}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteShell>
  );
}