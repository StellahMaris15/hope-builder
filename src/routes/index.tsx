import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
  Quote,
  Users,
} from "lucide-react";

import heroImage from "@/assets/hero-children.jpg";
import heroEducation from "@/assets/HA4.jpg";
import heroCommunity from "@/assets/communtiy outreach.jpg";

import { SiteShell } from "@/components/site/SiteShell";
import { EventPreview } from "@/components/site/EventPreview";
import { getEventVisual } from "@/components/site/event-visuals";
import { getProgramVisual } from "@/components/site/program-visuals";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date";
import { fetchPosts, fetchPrograms, fetchUpcomingEvents, type EventItem } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hope Alliance — Building Hope. Transforming Lives." },
      {
        name: "description",
        content:
          "Hope Alliance empowers Ugandan communities through education, mentorship, charity and spiritual ministry. 1,500+ people reached.",
      },
      { property: "og:title", content: "Hope Alliance — Building Hope. Transforming Lives." },
      {
        property: "og:description",
        content:
          "A faith-driven non-profit transforming lives through education, mentorship, charity and ministry in Uganda.",
      },
    ],
  }),
  component: HomePage,
});

const HERO_SLIDES = [
  {
    id: 1,
    image: heroImage,
    alt: "Smiling children supported by Hope Alliance programs in Uganda",
    heading: (
      <>
        Building <span className="text-accent">Hope.</span>
        <br />
        Transforming <span className="text-accent">Lives.</span>
      </>
    ),
    description:
      "Hope Alliance is a faith-driven organization empowering communities through education, mentorship and charity.",
    primaryCta: { label: "DONATE NOW", to: "/donate" },
    secondaryCta: { label: "OUR PROGRAMS", to: "/programs" },
  },
  {
    id: 2,
    image: heroEducation,
    alt: "Children learning in a classroom funded by Hope Alliance",
    heading: (
      <>
        Empowering <span className="text-accent">Youth</span>
        <br />
        Through <span className="text-accent">Education.</span>
      </>
    ),
    description:
      "Providing children with quality education, school supplies, and mentorship programs to build a brighter future.",
    primaryCta: { label: "SPONSOR A CHILD", to: "/donate" },
    secondaryCta: { label: "LEARN MORE", to: "/about" },
  },
  {
    id: 3,
    image: heroCommunity,
    alt: "Community outreach and support program in Uganda",
    heading: (
      <>
        Uniting <span className="text-accent">Faith.</span>
        <br />
        Serving <span className="text-accent">Together.</span>
      </>
    ),
    description:
      "Working hand-in-hand with local leaders to deliver sustainable community development, outreach, and relief.",
    primaryCta: { label: "GET INVOLVED", to: "/get-involved" },
    secondaryCta: { label: "OUR IMPACT", to: "/impact" },
  },
];

const IMPACT = [
  { icon: Users, value: "1,500+", label: "People Reached" },
  { icon: GraduationCap, value: "500+", label: "Students Supported" },
  { icon: Heart, value: "200+", label: "Youth Mentored" },
  { icon: Building2, value: "30+", label: "Community Projects" },
];

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Hope Alliance came into our community when we needed support the most. Through their dedication and tangible aid, over 12,000 lives have been touched—including my own family.",
    author: "Sarah Akello",
    role: "Community Member & Program Participant",
    badge: "12,000+ Lives Touched",
  },
  {
    id: 2,
    quote:
      "Joining the Hope Alliance mentorship program was a complete turning point. The resources and constant encouragement gave me the tools to build a brighter future.",
    author: "David Okello",
    role: "Youth Mentorship Graduate",
    badge: "Youth Empowerment",
  },
  {
    id: 3,
    quote:
      "Partnering with Hope Alliance has shown us what true grassroots transformation looks like. Their transparency and relentless commitment make them a model for community leadership.",
    author: "Grace Musisi",
    role: "Local Partner & Educator",
    badge: "Community Leadership",
  },
];
function AnimatedNumber({
  value,
  active,
  className,
}: {
  value: string;
  active?: boolean;
  className?: string;
}) {
  const rafRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const [display, setDisplay] = useState(0);

  const { target, suffix } = useMemo(() => {
    const m = String(value).match(/^([\d,.]+)(.*)$/);
    const raw = m ? m[1] : value;
    const s = m ? m[2] : "";
    const num = parseInt(String(raw).replace(/[,.]/g, ""), 10) || 0;
    return { target: num, suffix: s };
  }, [value]);

  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n) + suffix;

  const start = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    const duration = 1200;

    const step = (now: number) => {
      const t = startRef.current ? Math.min((now - startRef.current) / duration, 1) : 1;
      const cur = Math.floor(t * target);
      setDisplay(cur);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(target);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [target]);

  useEffect(() => {
    start();
    intervalRef.current = window.setInterval(() => start(), 4000);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [start]);

  useEffect(() => {
    if (active) start();
  }, [active, start]);

  return <p className={className}>{fmt(display)}</p>;
}

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeImpact, setActiveImpact] = useState<number>(0);

  const programs = useQuery({ queryKey: ["programs"], queryFn: fetchPrograms });
  const events = useQuery({ queryKey: ["events", 3], queryFn: () => fetchUpcomingEvents(3) });
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const posts = useQuery({ queryKey: ["posts", 3], queryFn: () => fetchPosts(3) });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <SiteShell>
      {/* Hero Carousel */}
      <section className="relative isolate overflow-hidden min-h-[62vh] sm:min-h-[70vh] lg:min-h-[82vh] bg-primary-deep">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                width={1600}
                height={1600}
                className="absolute inset-0 h-full w-full object-cover object-center sm:object-right"
              />
              <div className="hero-overlay absolute inset-0" />
              <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
                <div className="max-w-2xl pt-6 sm:pt-10 lg:pt-16">
                  <h1 className="text-4xl font-extrabold leading-[1.08] text-primary-foreground sm:text-5xl lg:text-6xl">
                    {slide.heading}
                  </h1>
                  <p className="mt-6 max-w-lg text-base text-primary-foreground/80">
                    {slide.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild variant="hero" size="lg">
                      <Link to={slide.primaryCta.to}>{slide.primaryCta.label}</Link>
                    </Button>
                    <Button asChild variant="outlineLight" size="lg">
                      <Link to={slide.secondaryCta.to}>{slide.secondaryCta.label}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 p-2 text-white/80 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white"
        >
          <ChevronLeft className="size-6 sm:size-8" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 p-2 text-white/80 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white"
        >
          <ChevronRight className="size-6 sm:size-8" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-accent" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Impact */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT.map((s, index) => {
            const isActive = index === activeImpact;

            return (
              <Card
                key={s.label}
                onMouseEnter={() => setActiveImpact(index)}
                onMouseLeave={() => setActiveImpact(0)}
                className={`flex flex-col items-center gap-2 border-border/70 p-8 text-center transition-transform duration-300 ${
                  isActive
                    ? "-translate-y-1 scale-105 shadow-lg ring-2 ring-accent/20"
                    : "shadow-card"
                }`}
              >
                <s.icon className="size-8 text-primary" />
                <AnimatedNumber
                  value={s.value}
                  active={isActive}
                  className="font-display text-3xl font-extrabold text-primary"
                />
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Programs */}
      <section className="bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <SectionHeading title="Our Programs" align="center" />
            <p className="mt-3 text-base text-muted-foreground">
              Restoring hope and building stronger futures through holistic community programs.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
           {/* Programs Section Mapping */}
{(programs.data ?? []).slice(0, 4).map((p) => {
  const visual = getProgramVisual(p.title, p.icon);

  return (
    <Link
      key={p.id}
      to="/programs"
      search={{ program: p.slug }} // 👈 Send slug as query parameter
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      aria-label={`Open ${p.title}`}
    >
      <Card className="flex flex-col overflow-hidden border-border/70 shadow-card">
        <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
          <img
            src={visual.src}
            alt={visual.alt}
            className="size-full object-cover transition-transform duration-500 hover:scale-105"
            style={visual.position ? { objectPosition: visual.position } : undefined}
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-base font-bold text-foreground">
            {p.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {p.summary}
          </p>
        </div>
      </Card>
    </Link>
  );
})}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading title="Upcoming Events" align="left" />
          <Button asChild variant="outline" size="sm">
            <Link to="/events">VIEW ALL EVENTS</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {/* Events Section Mapping */}
{(events.data ?? []).slice(0, 3).map((event) => {
  // 1. Ensure visual source is safely fallbacked using your helper or object property
  const visualSrc =
    getEventVisual(event.title, event.image_url).src;

  // 2. Fallback identifier to handle either slug or id
  const targetId = event.slug || event.id;

  return (
    <Link
      key={event.id}
      to="/events"
      search={{ eventId: targetId, event: targetId }} // 👈 Passes both common query param keys
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      aria-label={`View ${event.title}`}
    >
      <Card className="flex flex-col overflow-hidden border-border/70 shadow-card">
        <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
          <img
            src={visualSrc}
            alt={event.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm rounded">
            View Event
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="mt-2 text-xs font-medium text-amber-600">
            {formatDate(event.starts_at, "dd MMM yyyy")}
          </p>
          <p className="text-xs text-muted-foreground">
            {event.location}
          </p>
        </div>
      </Card>
    </Link>
  );
})}
        </div>
      </section>

      <EventPreview event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      {/* Blog Section */}
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">OUR BLOG</p>
            <SectionHeading title="Popular Hope Alliance Blogs" align="center" />
            <p className="mt-3 text-base text-muted-foreground">
              Discover stories of empowerment, youth mentorship, and community transformations
              directly from our team and partners in Uganda.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {posts.isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[28rem] rounded-xl" />
                ))
              : (posts.data ?? []).map((post) => (
                  <Card
                    key={post.id}
                    className="group flex flex-col overflow-hidden border-border/70 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link
                      to="/blog/$postSlug"
                      params={{ postSlug: post.slug }}
                      aria-label={`Read the full story: ${post.title}`}
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-primary/10">
                        <img
                          src={post.cover_image_url ?? heroEducation}
                          alt={`Blog cover for ${post.title}`}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 py-3">
                          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                            Read story
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col p-6">
                      <Badge variant="secondary">{post.category}</Badge>

                      <h3 className="mt-3 font-display text-lg font-bold leading-snug transition-colors group-hover:text-accent">
                        <Link
                          to="/blog/$postSlug"
                          params={{ postSlug: post.slug }}
                          className="focus-visible:outline-none"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>

                      <p className="mt-4 text-xs text-muted-foreground/70">
                        {formatDate(post.published_at, "dd MMM yyyy")} - {post.author_name}
                      </p>

                      <div className="mt-6">
                        <Button asChild className="rounded-full px-6 font-semibold">
                          <Link to="/blog/$postSlug" params={{ postSlug: post.slug }}>
                            Read More
                            <ArrowRight className="ml-2 size-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <SectionHeading title="Lives Touched & Transformed" align="center" />
          <p className="mt-3 text-base text-muted-foreground">
            Hear directly from the community members, students, and partners whose lives have been
            impacted by Hope Alliance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between border-border/70 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {item.badge}
                  </span>
                  <Quote className="size-5 text-accent/40" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-6 border-t border-border/50 pt-4">
                <p className="font-display text-sm font-bold text-foreground">{item.author}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
