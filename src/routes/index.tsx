import { useState, useEffect, useRef, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
  MessageSquare,
  Quote,
  ThumbsUp,
  Users,
} from "lucide-react";

import heroImage from "@/assets/hero-children.jpg";
import heroEducation from "@/assets/HA4.jpg"; // HA4.jpg
import heroCommunity from "@/assets/communtiy outreach.jpg";
import blogImage3 from "@/assets/HA3.jpg"; // HA3.jpg
import blogImage2 from "@/assets/HA2.jpg"; // HA2.jpg

import { SiteShell } from "@/components/site/SiteShell";
import { getEventVisual } from "@/components/site/event-visuals";
import { getProgramVisual } from "@/components/site/program-visuals";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/date";
import { fetchPrograms, fetchUpcomingEvents } from "@/lib/api";

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

const BLOG_POSTS = [
  {
    id: 1,
    title: "Transforming Rural Communities Through Education",
    excerpt: "How quality schooling, school supplies, and dedicated mentors are building bright futures for youth across Uganda.",
    author: "Hope Alliance Team",
    date: "12 May 2026",
    likes: "1.7K",
    comments: "1K",
    slug: "transforming-rural-communities-education",
    image: heroEducation, // HA4.jpg
  },
  {
    id: 2,
    title: "Youth Mentorship & Leadership Development",
    excerpt: "Empowering the next generation with practical life skills, career guidance, and spiritual growth opportunities.",
    author: "Hope Alliance Team",
    date: "28 Apr 2026",
    likes: "1.7K",
    comments: "1K",
    slug: "youth-mentorship-leadership",
    image: blogImage3, // HA3.jpg
  },
  {
    id: 3,
    title: "Community Outreach & Sustainable Relief Programs",
    excerpt: "Working alongside local leaders to deliver essential healthcare support, relief aid, and community development.",
    author: "Hope Alliance Team",
    date: "15 Mar 2026",
    likes: "1.7K",
    comments: "1K",
    slug: "community-outreach-sustainable-relief",
    image: blogImage2, // HA2.jpg
  },
];

function AnimatedNumber({ value, active, className }: { value: string; active?: boolean; className?: string }) {
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

  const start = () => {
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
  };

  useEffect(() => {
    start();
    intervalRef.current = window.setInterval(() => start(), 4000);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [target]);

  useEffect(() => {
    if (active) start();
  }, [active]);

  return <p className={className}>{fmt(display)}</p>;
}

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeImpact, setActiveImpact] = useState<number>(0);

  const programs = useQuery({ queryKey: ["programs"], queryFn: fetchPrograms });
  const events = useQuery({ queryKey: ["events", 3], queryFn: () => fetchUpcomingEvents(3) });

  // Auto-advance slide every 3 seconds
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
            {(programs.data ?? []).slice(0, 4).map((p) => {
              const visual = getProgramVisual(p.title, p.icon);

              return (
                <Link
                  key={p.id}
                  to="/programs/$programSlug"
                  params={{ programSlug: p.slug }}
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
          {(events.data ?? []).map((e) => {
            const visual = getEventVisual(e.title, e.image_url);

            return (
              <Card
                key={e.id}
                className="grid aspect-[4/5] grid-rows-[4fr_1fr] overflow-hidden border-border/70 shadow-card"
              >
                <div className="min-h-0 overflow-hidden bg-primary/10">
                  <img
                    src={visual.src}
                    alt={visual.alt}
                    className="size-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="min-h-0 overflow-hidden p-4">
                  <h3 className="truncate font-display text-base font-bold">{e.title}</h3>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {formatDate(e.starts_at, "dd MMM yyyy")}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{e.location}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Blog Section (Styled like reference image) */}
      {/* Blog Section */}
<section className="bg-secondary/60 py-16">
  <div className="mx-auto max-w-7xl px-4 sm:px-6">
    <div className="text-center max-w-2xl mx-auto mb-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">
        OUR BLOG
      </p>
      <SectionHeading title="Popular Hope Alliance Blogs" align="center" />
      <p className="mt-3 text-base text-muted-foreground">
        Discover stories of empowerment, youth mentorship, and community transformations directly from our team and partners in Uganda.
      </p>
    </div>

    <div className="grid gap-8 md:grid-cols-3">
      {BLOG_POSTS.map((post) => (
        <Card
          key={post.id}
          className="flex flex-col overflow-hidden border-border/70 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          {/* Image linked directly to article detail */}
          <Link
            to="/blog/$postSlug"
            params={{ postSlug: post.slug }}
            className="relative aspect-[4/3] w-full overflow-hidden bg-muted block group cursor-pointer"
          >
            <img
              src={post.image}
              alt={post.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Stat Overlay Bar */}
            <div className="absolute bottom-0 inset-x-0 grid grid-cols-3 bg-black/60 px-3 py-2.5 text-xs text-white backdrop-blur-sm divide-x divide-white/20">
              <div className="flex items-center justify-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <ThumbsUp className="size-3.5" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <MessageSquare className="size-3.5" />
                <span>{post.comments}</span>
              </div>
            </div>
          </Link>

          {/* Card Content */}
          <div className="flex flex-1 flex-col p-6">
            <p className="text-xs font-medium text-muted-foreground">
              Posted By: <span className="font-semibold text-foreground">{post.author}</span>
            </p>

            <h3 className="mt-2 font-display text-lg font-bold text-foreground leading-snug line-clamp-2">
              <Link 
                to="/blog/$postSlug" 
                params={{ postSlug: post.slug }}
                className="hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </h3>

            <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>

            <div className="mt-6 pt-2">
              <Button asChild className="rounded-full px-6 font-semibold">
                <Link to="/blog/$postSlug" params={{ postSlug: post.slug }}>
                  Read More
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
            Hear directly from the community members, students, and partners whose lives have been impacted by Hope Alliance.
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
                <p className="font-display text-sm font-bold text-foreground">
                  {item.author}
                </p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
