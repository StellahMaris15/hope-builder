import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { PageHero, SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { getProgramVisual } from "@/components/site/program-visuals";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPrograms } from "@/lib/api";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Our Programs — Education, Mentorship & Outreach | Hope Alliance" },
      {
        name: "description",
        content:
          "Six programs transforming lives: education & scholarships, mentorship, youth conference, charity & outreach, ministry and skills empowerment.",
      },
      { property: "og:title", content: "Our Programs | Hope Alliance" },
      {
        property: "og:description",
        content: "Explore the six Hope Alliance programs serving communities across Uganda.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["programs"], queryFn: fetchPrograms });

  return (
    <SiteShell>
      <PageHero
        title="Programs"
        description="Explore the education, mentorship, outreach and leadership initiatives that help shape brighter futures."
        actions={
          <Button asChild variant="hero" size="lg">
            <Link to="/donate">HELP FUND THESE PROGRAMS</Link>
          </Button>
        }
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-xl" />
              ))
            : (data ?? []).map((p) => {
                const visual = getProgramVisual(p.title, p.icon);

                return (
                  <Link
                    key={p.id}
                    to="/programs/$programSlug"
                    params={{ programSlug: p.slug }}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    aria-label={`Read more about ${p.title}`}
                  >
                    <Card className="grid aspect-[4/5] grid-rows-[4fr_1fr] overflow-hidden border-border/70 shadow-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                      <div className="relative min-h-0 overflow-hidden bg-primary/5">
                        <img
                          src={visual.src}
                          alt={visual.alt}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          style={visual.position ? { objectPosition: visual.position } : undefined}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 py-3">
                          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                            Explore program
                          </span>
                        </div>
                      </div>
                      <div className="flex min-h-0 items-center justify-between gap-3 overflow-hidden p-4">
                        <div className="min-w-0">
                          <h2 className="truncate font-display text-base font-bold group-hover:text-accent">
                            {p.title}
                          </h2>
                          <p className="mt-1 max-h-5 overflow-hidden text-sm leading-5 text-muted-foreground">
                            {p.summary || p.description}
                          </p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                          Read more
                          <ArrowRight className="size-4" />
                        </span>
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
