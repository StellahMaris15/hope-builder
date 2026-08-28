import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock3, MapPin, Share2 } from "lucide-react";

import { PageHero, SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchEventBySlug, fetchUpcomingEvents } from "@/lib/api";
import { getEventVisual } from "@/components/site/event-visuals";
import { formatDate } from "@/lib/date";

async function loadEventPageData(eventSlug: string) {
  const event = await fetchEventBySlug(eventSlug);
  const relatedEvents = await fetchUpcomingEvents(6);
  return { event, relatedEvents };
}

type EventPageData = Awaited<ReturnType<typeof loadEventPageData>>;

export const Route = createFileRoute("/events/$eventSlug")({
  loader: ({ params }) => loadEventPageData(params.eventSlug),
  head: (info) => {
    const { event } = info.loaderData as EventPageData;
    const description =
      event?.description?.slice(0, 160) ?? "Learn more about our upcoming Hope Alliance event.";

    return {
      meta: [
        {
          title: event
            ? `${event.title} | Hope Alliance Events`
            : "Event not found | Hope Alliance",
        },
        { name: "description", content: description },
        { property: "og:title", content: event?.title ?? "Hope Alliance Events" },
        { property: "og:description", content: description },
      ],
    };
  },
  component: EventDetailPage,
  errorComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="mt-2 text-muted-foreground">
          The event you&apos;re looking for could not be found. Please return to the events list.
        </p>
        <Button asChild className="mt-6">
          <Link to="/events">Back to events</Link>
        </Button>
      </div>
    </SiteShell>
  ),
});

function EventDetailPage() {
  const { event, relatedEvents } = useLoaderData({ from: "/events/$eventSlug" });

  if (!event) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <p className="mt-2 text-muted-foreground">
            The event you&apos;re looking for could not be found. Please return to the events list.
          </p>
          <Button asChild className="mt-6">
            <Link to="/events">Back to events</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  const visual = getEventVisual(event.title, event.image_url);
  const upcoming = (relatedEvents ?? []).filter((item) => item.id !== event.id).slice(0, 3);

  return (
    <SiteShell>
      <PageHero
        title={event.title}
        description={event.description}
        image={visual.src}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/events">
                <ArrowLeft className="size-4" />
                BACK TO EVENTS
              </Link>
            </Button>
            <Button
              variant="outlineLight"
              size="lg"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                } catch {
                  // ignore clipboard failures
                }
              }}
            >
              <Share2 className="size-4" />
              SHARE EVENT
            </Button>
          </div>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.45fr_0.85fr]">
        <article className="space-y-8">
          <Card className="overflow-hidden border-border/70 shadow-card">
            <div className="aspect-[16/9] overflow-hidden bg-primary/10">
              <img
                src={visual.src}
                alt={visual.alt}
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </Card>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">Event spotlight</Badge>
              <Badge variant="outline" className="gap-1">
                <Clock3 className="size-3.5" />
                {formatDate(event.starts_at, "dd MMM yyyy")}
              </Badge>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4 text-accent" />
                {event.location}
              </span>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
              <div className="max-w-3xl space-y-5">
                <p className="text-xl leading-9 text-muted-foreground sm:text-[1.15rem]">
                  {event.description}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-secondary/60 p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      Start date
                    </p>
                    <p className="mt-2 text-base font-semibold">
                    {formatDate(event.starts_at, "EEEE, dd MMMM yyyy")}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-secondary/60 p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      Location
                    </p>
                    <p className="mt-2 text-base font-semibold">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6 shadow-card">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
                Event details
              </p>
              <div className="space-y-3 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-accent" />
                  <span>
                    {formatDate(event.starts_at, "dd MMM yyyy")}
                    {event.ends_at ? ` - ${formatDate(event.ends_at, "dd MMM yyyy")}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-accent" />
                  <span>{event.location}</span>
                </div>
                {event.capacity !== null ? (
                  <div className="text-sm text-muted-foreground">
                    Capacity: {event.capacity} people
                  </div>
                ) : null}
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h3 className="font-display text-lg font-bold">Why attend</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                "Connect with the Hope Alliance community",
                "Grow through practical training and encouragement",
                "Be part of a visible local impact story",
              ].map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 size-2 rounded-full bg-accent" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full" variant="accent">
              <Link to="/get-involved">GET INVOLVED</Link>
            </Button>
          </Card>

          <Card className="p-6 shadow-card">
            <h3 className="font-display text-lg font-bold">More events</h3>
            <div className="mt-4 space-y-3">
              {upcoming.length > 0 ? (
                upcoming.map((item) => {
                  const relatedVisual = getEventVisual(item.title, item.image_url);
                  return (
                    <Link
                      key={item.id}
                      to="/events/$eventSlug"
                      params={{ eventSlug: item.slug }}
                      className="group flex gap-3 rounded-2xl border border-border/70 p-3 transition-all hover:border-accent/50 hover:bg-accent/5"
                    >
                      <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-primary/5">
                        <img
                          src={relatedVisual.src}
                          alt={relatedVisual.alt}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium group-hover:text-accent">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                              {formatDate(item.starts_at, "dd MMM yyyy")}
                        </p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No related events available yet.</p>
              )}
            </div>
          </Card>
        </aside>
      </section>
    </SiteShell>
  );
}
