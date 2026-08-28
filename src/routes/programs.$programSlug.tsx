import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { fetchProgramBySlug, fetchPrograms } from "@/lib/api";
import { SiteShell, PageHero } from "@/components/site/SiteShell";
import { getProgramVisual } from "@/components/site/program-visuals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

async function loadProgramPageData(programSlug: string) {
  const program = await fetchProgramBySlug(programSlug);
  const allPrograms = await fetchPrograms();
  return { program, allPrograms };
}

type ProgramPageData = Awaited<ReturnType<typeof loadProgramPageData>>;

export const Route = createFileRoute("/programs/$programSlug")({
  loader: ({ params }) => loadProgramPageData(params.programSlug),
  head: (info) => {
    const { program } = info.loaderData as ProgramPageData;
    return {
      meta: [
        {
          title: program
            ? `${program.title} | Hope Alliance Programs`
            : "Program not found | Hope Alliance",
        },
        {
          name: "description",
          content: program?.summary ?? "Learn more about Hope Alliance programs.",
        },
        { property: "og:title", content: program?.title ?? "Hope Alliance Programs" },
        {
          property: "og:description",
          content: program?.summary ?? "Hope Alliance program details.",
        },
      ],
    };
  },
  component: ProgramDetailPage,
  errorComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Program not found</h1>
        <p className="mt-2 text-muted-foreground">
          The program you&apos;re looking for could not be found. Please return to the programs
          list.
        </p>
        <Button asChild className="mt-6">
          <Link to="/programs">Back to programs</Link>
        </Button>
      </div>
    </SiteShell>
  ),
});

function ProgramDetailPage() {
  const { program, allPrograms } = useLoaderData({ from: "/programs/$programSlug" });

  if (!program) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-2xl font-bold">Program not found</h1>
          <Button asChild className="mt-6">
            <Link to="/programs">Back to programs</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  const visual = getProgramVisual(program.title, program.icon);
  const relatedPrograms = allPrograms.filter((item) => item.id !== program.id).slice(0, 3);

  return (
    <SiteShell>
      <PageHero
        title={program.title}
        description={program.summary}
        image={visual.src}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/donate">SUPPORT THIS PROGRAM</Link>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <Link to="/get-involved">JOIN THE MISSION</Link>
            </Button>
          </div>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.45fr_0.85fr]">
        <article className="space-y-8">
          <div className="grid gap-6 rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">Program Overview</Badge>
              <Badge variant="outline">Live on the site</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold sm:text-3xl">
                  What this program does
                </h2>
                <p className="leading-7 text-muted-foreground">{program.description}</p>
                <p className="leading-7 text-muted-foreground">
                  This program is part of Hope Alliance&apos;s wider mission to create practical,
                  faith-driven impact in Ugandan communities through education, mentorship, outreach
                  and empowerment.
                </p>
              </div>

              <Card className="overflow-hidden border-border/70">
                <div className="aspect-[4/5] overflow-hidden bg-primary/5">
                  <img
                    src={visual.src}
                    alt={visual.alt}
                    className="size-full object-cover transition-transform duration-500 hover:scale-105"
                    style={visual.position ? { objectPosition: visual.position } : undefined}
                  />
                </div>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="serves" className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <TabsList className="flex w-full flex-wrap justify-start gap-2">
              <TabsTrigger value="serves">Who it serves</TabsTrigger>
              <TabsTrigger value="helps">How it helps</TabsTrigger>
              <TabsTrigger value="matters">Why it matters</TabsTrigger>
              <TabsTrigger value="join">How to take part</TabsTrigger>
            </TabsList>
            <TabsContent value="serves" className="pt-6 text-sm leading-7 text-muted-foreground">
              Children, youth and families who benefit from practical support and long-term growth
              through {program.title.toLowerCase()}.
            </TabsContent>
            <TabsContent value="helps" className="pt-6 text-sm leading-7 text-muted-foreground">
              It delivers guidance, tools and community-led support that create measurable change
              for every participant we walk with.
            </TabsContent>
            <TabsContent value="matters" className="pt-6 text-sm leading-7 text-muted-foreground">
              Each program turns compassion into sustained action with visible outcomes reported
              back to our partners and supporters.
            </TabsContent>
            <TabsContent value="join" className="space-y-4 pt-6 text-sm leading-7 text-muted-foreground">
              <p>Join as a volunteer or mentor, refer a beneficiary, or fund a place in this program.</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="accent">
                  <Link to="/get-involved">GET INVOLVED</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/donate">FUND A PLACE</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <Accordion type="single" collapsible className="rounded-3xl border border-border/70 bg-card px-6 shadow-card">
            <AccordionItem value="q1">
              <AccordionTrigger>Who can apply for this program?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Applications are open to community members who meet the program criteria. Contact
                our team and we will guide you through the next steps.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How is the program funded?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Through donations, partner organisations and community fundraising. Every
                contribution is directed to program delivery.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Can I volunteer with this program?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes. Volunteers and mentors are the backbone of our work — apply on the Get
                Involved page and we will match you to a need.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </article>

        <aside className="space-y-6">
          <Card className="p-6 shadow-card">
            <h3 className="font-display text-lg font-bold">Program highlights</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                "Community-centered support and follow-up",
                "Clear outcomes for children, youth and families",
                "Designed to scale with partners and volunteers",
              ].map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 size-2 rounded-full bg-accent" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full" variant="accent">
              <Link to="/contact">ASK ABOUT THIS PROGRAM</Link>
            </Button>
          </Card>

          <Card className="p-6 shadow-card">
            <h3 className="font-display text-lg font-bold">More programs</h3>
            <div className="mt-4 space-y-3">
              {relatedPrograms.map((item) => {
                const relatedVisual = getProgramVisual(item.title, item.icon);
                return (
                  <Link
                    key={item.id}
                    to="/programs/$programSlug"
                    params={{ programSlug: item.slug }}
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
                      <p className="max-h-10 overflow-hidden text-sm text-muted-foreground">
                        {item.summary}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </aside>
      </section>
    </SiteShell>
  );
}
