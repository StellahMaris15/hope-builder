import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import z from "zod";

import { PageHero, SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { getProgramVisual } from "@/components/site/program-visuals";
import { Card } from "@/components/ui/card";
import heroChildrenImage from "@/assets/hero-children.jpg";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPrograms, type Program } from "@/lib/api";

// 1. Search Schema & Route Definition goes here at the top level
const programsSearchSchema = z.object({
  program: z.string().optional(),
});

export const Route = createFileRoute("/programs")({
  validateSearch: (search) => programsSearchSchema.parse(search),
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

// 2. The component implementation goes right below the Route definition
function ProgramsPage() {
  const { program: activeSlug } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data, isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
  });

  const selectedProgram = (data ?? []).find((p) => p.slug === activeSlug) || null;

  const handleOpenProgram = (slug: string) => {
    navigate({ search: { program: slug } });
  };

  const handleCloseOverlay = useCallback(() => {
    navigate({ search: { program: undefined } });
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseOverlay();
    };

    if (selectedProgram) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProgram, handleCloseOverlay]);

  return (
    <SiteShell>
      <PageHero
        title="Programs"
        image={heroChildrenImage}
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
            : (data ?? []).map((p: Program) => {
                const visual = getProgramVisual(p.title, p.icon);

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleOpenProgram(p.slug)}
                    aria-label={`Read more about ${p.title}`}
                    className="group block w-full text-left focus:outline-none rounded-xl"
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
                          Read details
                          <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </Card>
                  </button>
                );
              })}
        </div>
      </section>

      {/* Overlay Drawer View */}
      {selectedProgram && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-background text-foreground animate-in fade-in duration-200">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseOverlay}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Back to all programs
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseOverlay}
                className="rounded-full"
                aria-label="Close details"
              >
                <X className="size-5" />
              </Button>
            </div>

            {(() => {
              const visual = getProgramVisual(selectedProgram.title, selectedProgram.icon);
              return (
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted shadow-md">
                  <img
                    src={visual.src}
                    alt={visual.alt}
                    className="size-full object-cover"
                    style={visual.position ? { objectPosition: visual.position } : undefined}
                  />
                </div>
              );
            })()}

            <div className="mt-8 space-y-6">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                {selectedProgram.title}
              </h1>

              <div className="space-y-3 pt-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Program Overview
                </h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                  {selectedProgram.description || selectedProgram.summary || "No description provided for this program."}
                </p>
              </div>

              <div className="mt-12 pt-6 border-t border-border/60 flex justify-between items-center">
                <Button variant="outline" onClick={handleCloseOverlay}>
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Programs
                </Button>
                <Button asChild variant="default">
                  <Link to="/donate">Support This Program</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteShell>
  );
}