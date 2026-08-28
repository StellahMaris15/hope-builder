import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Coins,
  GraduationCap,
  Heart,
  HeartHandshake,
  Stethoscope,
  Users,
} from "lucide-react";

import aboutImage from "@/assets/about-community.jpg";
import charityImage from "@/assets/charity.jpg";
import mentorshipImage from "@/assets/program-mentorship.jpg";
import { PageHero, SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Hope Alliance — Our Story, Mission & Vision" },
      {
        name: "description",
        content:
          "Learn who we are: a faith-driven Ugandan non-profit committed to transforming lives through education, mentorship, charity and outreach.",
      },
      { property: "og:title", content: "About Hope Alliance" },
      {
        property: "og:description",
        content: "Our story, mission, vision and the values that guide our work in Uganda.",
      },
    ],
  }),
  component: AboutPage,
});

const HIGHLIGHTS = [
  "Education Support",
  "Youth Mentorship",
  "Community Outreach",
  "Faith & Ministry",
  "Charity & Relief",
  "1,500+ Lives Reached",
];

const SERVICES = [
  {
    title: "Education & Scholarships",
    description:
      "Providing children with school fees, essential learning supplies, and after-school tutoring to ensure uninterrupted education.",
    icon: GraduationCap,
  },
  {
    title: "Youth Mentorship",
    description:
      "Vetted mentors walk with young people through career planning, life skills workshops, and positive character development.",
    icon: Users,
  },
  {
    title: "Community Outreach",
    description:
      "Food drives, family welfare support, and community initiatives delivered directly to vulnerable households with dignity.",
    icon: HeartHandshake,
  },
  {
    title: "Healthcare & Wellness",
    description:
      "Facilitating community medical camps, sanitation drives, and health education to promote physical well-being and hygiene.",
    icon: Stethoscope,
  },
  {
    title: "Financial & Emergency Aid",
    description:
      "Delivering immediate relief, medical support assistance, and emergency care to families facing critical circumstances.",
    icon: Coins,
  },
  {
    title: "Livelihood & Empowerment",
    description:
      "Equipping youth and guardians with practical vocational training and small business tools for sustainable self-reliance.",
    icon: Briefcase,
  },
  {
    title: "Faith & Spiritual Care",
    description:
      "Anchoring our service in Christ-centered love, offering spiritual guidance, prayer support, and community encouragement.",
    icon: Heart,
  },
];

function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        title="About Hope Alliance"
        image={aboutImage}
        description="We are a faith-driven nonprofit serving Ugandan families through education, mentorship, outreach and community-led care."
        actions={
          <>
            <Button asChild variant="hero" size="lg">
              <Link to="/programs">EXPLORE OUR PROGRAMS</Link>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <Link to="/get-involved">JOIN OUR MISSION</Link>
            </Button>
          </>
        }
      />

      {/* Main Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {/* Who We Are */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Framed Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative p-6 bg-primary w-full max-w-md">
              <div className="relative bg-background p-2 overflow-hidden shadow-lg">
                <img
                  src={aboutImage}
                  alt="Hope Alliance Outreach"
                  className="w-full h-[380px] object-cover"
                />
              </div>

              {/* Angle frame clip accents */}
              <div className="absolute inset-y-0 left-0 w-6 bg-primary [clip-path:polygon(0_0,100%_8%,100%_92%,0_100%)]" />
              <div className="absolute inset-y-0 right-0 w-6 bg-primary [clip-path:polygon(0_8%,100%_0,100%_100%,0_92%)]" />
            </div>
          </div>

          {/* Right Column: Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  ABOUT US
                </p>
                <span className="h-[2px] w-12 bg-primary/40" />
              </div>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Who We Are
              </h2>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Hope Alliance is a non-profit organization committed to transforming lives and
                building stronger communities through faith, education, mentorship and outreach.
              </p>
              <p>
                Since our founding we have walked alongside families in Kampala, Wakiso and
                surrounding districts — reaching over 1,500 people, supporting 500+ students and
                delivering more than 30 community projects.
              </p>
              <p>
                Our work is carried by volunteers, mentors, partners and donors who believe that
                every person deserves the opportunity to thrive in purpose.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {HIGHLIGHTS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ArrowRight className="size-4 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Donate Action Button */}
            <div className="pt-4">
              <Button asChild size="lg" className="rounded-full px-8 font-bold">
                <Link to="/donate">Donate</Link>
              </Button>
            </div>
          </div>
        </div>
        

        {/* Our Services Section (Light Theme, Flowbite Icon Grid Layout) */}
        <div className="mt-20 border-t border-border/60 pt-16">
          {/* Centered Header */}
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
             We focus on community-driven initiatives that empower individuals, unlock opportunities, and drive sustainable growth.
            </p>
          </div>

          {/* Services Grid */}
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <div key={service.title} className="flex flex-col items-start space-y-3">
                {/* Icon Badge */}
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <service.icon className="size-6" />
                </div>

                {/* Service Title */}
                <h3 className="font-display text-lg font-bold text-foreground">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="mt-20">
          <h2 className="section-title text-2xl">Our Values</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-3xl">
            Our work is guided by these core values that shape how we serve communities.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 shadow-card">
              <h3 className="font-display text-base font-bold">Faith</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We anchor our service in Christ-centred love and prayer.
              </p>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="font-display text-base font-bold">Integrity</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We steward every shilling and every story with honesty.
              </p>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="font-display text-base font-bold">Compassion</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We meet people where they are, with dignity.
              </p>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="font-display text-base font-bold">Service</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We lead by serving communities, not from above them.
              </p>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="font-display text-base font-bold">Excellence</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We deliver programs that are measurable and lasting.
              </p>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="font-display text-base font-bold">Community</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We build together — families, churches and partners.
              </p>
            </Card>
          </div>
        </div>

        {/* Meet Our Team */}
        <section className="mt-20 border-t border-border pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-title text-2xl">Meet Our Team</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hope Alliance is powered by a committed team of community leaders, programme
              coordinators, mentors and volunteers who work alongside families every day.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "John William",
                body: "Founder of Hope Alliance and a guiding voice for the organization’s mission.",
                image: aboutImage,
                alt: "Hope Alliance community leaders gathered with residents",
              },
              {
                title: "Nancy Achieng",
                body: "A caring mentor who supports young people with encouragement and guidance.",
                image: mentorshipImage,
                alt: "A mentor supporting a young person",
              },
              {
                title: "Mary Atim",
                body: "A compassionate volunteer helping families with practical care and support.",
                image: charityImage,
                alt: "Volunteers preparing support for community outreach",
              },
            ].map((member) => (
              <Card
                key={member.title}
                className="grid aspect-[4/5] grid-rows-[4fr_1fr] overflow-hidden border-border/70 shadow-card"
              >
                <div className="min-h-0 overflow-hidden bg-primary/5">
                  <img src={member.image} alt={member.alt} className="size-full object-cover" />
                </div>
                <div className="min-h-0 overflow-hidden p-4">
                  <h3 className="truncate font-display text-base font-bold">{member.title}</h3>
                  <p className="mt-1 max-h-10 overflow-hidden text-sm leading-5 text-muted-foreground">
                    {member.body}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </section>
    </SiteShell>
  );
}