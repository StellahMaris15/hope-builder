import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin } from "lucide-react";

import { PageHero, SiteShell } from "@/components/site/SiteShell";
import { getEventVisual } from "@/components/site/event-visuals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date";
import { fetchUpcomingEvents } from "@/lib/api";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Upcoming Events & Conferences | Hope Alliance" },
      {
        name: "description",
        content:
          "Join Hope Alliance events: youth conferences, outreach food drives and leadership training workshops across Uganda. Register free.",
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
  const { data, isLoading } = useQuery({
    queryKey: ["events", "all"],
    queryFn: () => fetchUpcomingEvents(24),
  });

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
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))
            : (data ?? []).map((e) => {
                const visual = getEventVisual(e.title, e.image_url);

                return (
                  <Link
                    key={e.id}
                    to="/events/$eventSlug"
                    params={{ eventSlug: e.slug }}
                    aria-label={`View details for ${e.title}`}
                    className="group block"
                  >
                    <Card className="grid h-full overflow-hidden border-border/70 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
                      <div className="relative aspect-[4/3] overflow-hidden bg-primary/10">
                        <img
                          src={visual.src}
                          alt={visual.alt}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 py-3">
                          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                            View event
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3 p-5">
                        <Badge variant="secondary">
                          {formatDate(e.starts_at, "dd MMM yyyy")}
                        </Badge>
                        <h2 className="font-display text-lg font-bold transition-colors group-hover:text-accent">
                          {e.title}
                        </h2>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {e.description}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4 shrink-0 text-accent" />
                          {e.location}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="size-4 shrink-0 text-accent" />
                          {formatDate(e.starts_at, "dd MMM yyyy")}
                          {e.ends_at ? ` - ${formatDate(e.ends_at, "dd MMM yyyy")}` : ""}
                        </p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
        </div>
      </section>
    </SiteShell>
  );
}
