import { useState } from "react";
import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import studentsImage from "@/assets/students.jpg";
import heroChildrenImage from "@/assets/hero-children.jpg";
import { PageHero, SiteShell } from "@/components/site/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date";
import { fetchPosts } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog - Stories of Hope & Community | Hope Alliance" },
      {
        name: "description",
        content:
          "Read stories, insights and updates on education, youth mentorship, faith and community development from Hope Alliance.",
      },
      { property: "og:title", content: "Hope Alliance Blog" },
      {
        property: "og:description",
        content: "Stories and insights on education, mentorship, faith and community.",
      },
    ],
  }),
  component: BlogPage,
});

const BLOG_CATEGORIES = ["All", "Community", "Youth", "Education", "Community Development"];

const normalizeCategory = (value: string) => value.trim().toLowerCase();

function BlogPage() {
  const postRoute = useMatch({ from: "/blog/$postSlug", shouldThrow: false });
  const { data, isLoading } = useQuery({
    queryKey: ["posts", "all"],
    queryFn: () => fetchPosts(50),
  });
  const [filter, setFilter] = useState<(typeof BLOG_CATEGORIES)[number]>("All");
  const posts = (data ?? []).filter(
    (p) => filter === "All" || normalizeCategory(p.category) === normalizeCategory(filter),
  );

  function getBlogCardImage(category: string) {
    return category.toLowerCase().includes("student") ? studentsImage : heroChildrenImage;
  }

  if (postRoute) {
    return (
      <SiteShell>
        <Outlet />
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageHero
        title="Blog"
        description="Read stories, updates and reflections from the communities we serve and the people behind the work."
        actions={
          <Button asChild variant="hero" size="lg">
            <Link to="/impact">SEE OUR IMPACT</Link>
          </Button>
        }
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2 sm:w-full sm:flex-wrap">
            {BLOG_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                aria-pressed={filter === c}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  filter === c
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))
            : posts.length > 0
              ? posts.map((p) => (
                  <Link
                    key={p.id}
                    to="/blog/$postSlug"
                    params={{ postSlug: p.slug }}
                    aria-label={`Read the full story: ${p.title}`}
                    className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-xl"
                  >
                    <Card className="group h-full overflow-hidden border-border/70 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
                      <div className="relative h-44 overflow-hidden bg-primary/10">
                        <img
                          src={p.cover_image_url ?? getBlogCardImage(p.category)}
                          alt={`Blog cover for ${p.title}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 py-3">
                          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                            Read story
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3 p-6">
                        <Badge variant="secondary">{p.category}</Badge>
                        <h2 className="font-display text-lg font-bold transition-colors group-hover:text-accent">
                          {p.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">{p.excerpt}</p>
                        <p className="text-xs text-muted-foreground/70">
                          {formatDate(p.published_at, "dd MMM yyyy")} - {p.author_name}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                          Read more
                          <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))
              : !isLoading && (
                  <div className="col-span-full rounded-3xl border border-dashed border-border/70 bg-card p-10 text-center text-muted-foreground">
                    No blog posts match this category yet.
                  </div>
                )}
        </div>
      </section>

      <Outlet />
    </SiteShell>
  );
}