import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  HandHeart,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import aboutCommunityImage from "@/assets/about-community.jpg";
import charityImage from "@/assets/charity.jpg";
import mentorshipImage from "@/assets/program-mentorship.jpg";
import studentsImage from "@/assets/students.jpg";
import { PageHero, SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Our Impact - 1,500+ Lives Reached | Hope Alliance" },
      {
        name: "description",
        content:
          "Explore how Hope Alliance is transforming lives through education, mentorship, charity and community-led outreach across Uganda.",
      },
      { property: "og:title", content: "Our Impact | Hope Alliance" },
      {
        property: "og:description",
        content: "Numbers, stories and values behind Hope Alliance's work across Uganda.",
      },
    ],
  }),
  component: ImpactPage,
});

const STATS = [
  { icon: Users, value: "1,500+", label: "People Reached" },
  { icon: GraduationCap, value: "500+", label: "Students Supported" },
  { icon: Heart, value: "200+", label: "Youth Mentored" },
  { icon: Building2, value: "30+", label: "Community Projects" },
];

const IMPACT_PILLARS = [
  {
    title: "Education that opens doors",
    body: "We help vulnerable learners stay in school with scholarships, school materials and consistent follow-up that supports both learning and confidence.",
    icon: GraduationCap,
    image: studentsImage,
    alt: "Hope Alliance students and community members gathered together",
  },
  {
    title: "Mentorship with purpose",
    body: "Our mentors walk alongside young people through school, career planning and character formation so they can grow with guidance and hope.",
    icon: HandHeart,
    image: mentorshipImage,
    alt: "A mentor encouraging and supporting a young person",
  },
  {
    title: "Relief delivered with dignity",
    body: "Through food drives, clothing and essential support, we work with local churches and community leaders to meet urgent needs respectfully.",
    icon: ShieldCheck,
    image: charityImage,
    alt: "Community members receiving support through a charity outreach effort",
  },
];

const APPROACH = [
  {
    title: "Local leadership",
    body: "Our work is shaped by people who know the communities we serve, especially in Kampala, Wakiso and surrounding districts.",
  },
  {
    title: "Faith-driven service",
    body: "We anchor our mission in Christ-centred compassion, integrity and practical care for every person we meet.",
  },
  {
    title: "Long-term change",
    body: "We focus on sustainable outcomes, not quick fixes, so that families and young people can thrive over time.",
  },
];

function ImpactPage() {
  return (
    <SiteShell>
      <PageHero
        title="Our Impact"
        image={aboutCommunityImage}
        description="Hope Alliance serves Ugandan families through education, mentorship, charity and outreach. We measure progress by lives reached, young people supported and communities strengthened."
        actions={
          <>
            <Button asChild variant="hero" size="lg">
              <Link to="/donate">SUPPORT THIS WORK</Link>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <Link to="/programs">VIEW OUR PROGRAMS</Link>
            </Button>
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card
              key={stat.label}
              className="group flex min-h-[220px] flex-col items-center justify-center gap-3 border-border/70 bg-card p-8 text-center shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-none"
            >
              <stat.icon className="size-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <p className="font-display text-4xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6">
          <Card className="overflow-hidden border-border/70 shadow-card">
            <div className="h-full bg-gradient-to-br from-primary/5 via-background to-secondary/50 p-6 sm:p-8">
              <h2 className="mt-6 font-display text-2xl font-bold sm:text-3xl">
                Building hope through practical, faith-driven community support
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Hope Alliance is a nonprofit committed to transforming lives and building stronger
                communities through education, mentorship, outreach and sustainable care. We work
                with families, churches, volunteers and donors to create measurable change that
                lasts.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {APPROACH.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border/70 bg-card p-4">
                    <div className="flex items-center gap-2">
                      <Target className="size-4 text-accent" />
                      <h3 className="font-display text-sm font-bold">{item.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Three pillars that turn compassion into real change
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              Every program is designed to support people with dignity, build confidence and create
              a pathway for long-term growth.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {IMPACT_PILLARS.map((pillar) => (
              <Card
                key={pillar.title}
                className="group overflow-hidden border-border/70 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.alt}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-3 p-6">
                  <h3 className="font-display text-lg font-bold transition-colors group-hover:text-accent">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">{pillar.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <Card className="h-full overflow-hidden border-border/70 shadow-card">
              <div className="h-full min-h-[320px] overflow-hidden bg-primary/10">
                <img
                  src={charityImage}
                  alt="Hope Alliance charity outreach and support efforts"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </Card>

            <div className="space-y-6 self-stretch">
              <div>
                <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                  A structured approach to community transformation
                </h2>
              </div>

              <div className="grid gap-4">
                {[
                  {
                    title: "Education",
                    body: "Scholarships, school support and learner follow-up that keep young people in class.",
                  },
                  {
                    title: "Mentorship",
                    body: "Personal guidance and encouragement that helps youth navigate school, work and life.",
                  },
                  {
                    title: "Outreach",
                    body: "Community-led support that responds to immediate needs without losing sight of dignity.",
                  },
                ].map((item) => (
                  <Card key={item.title} className="p-5 shadow-card">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                        <ShieldCheck className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
