import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { PageHero, SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applyMentor, applyVolunteer, submitPrayer } from "@/lib/api";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Volunteer, Mentor or Request Prayer | Hope Alliance" },
      {
        name: "description",
        content:
          "Join the mission: apply to volunteer, become a mentor to Ugandan youth, or submit a prayer request to the Hope Alliance team.",
      },
      { property: "og:title", content: "Get Involved | Hope Alliance" },
      {
        property: "og:description",
        content: "Volunteer, mentor or share a prayer request with us.",
      },
    ],
  }),
  component: GetInvolvedPage,
});

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

function GetInvolvedPage() {
  return (
    <SiteShell>
      <PageHero
        title="Get Involved"
        description="Volunteer, mentor or share a prayer request and help us strengthen communities in Uganda."
        actions={
          <Button asChild variant="hero" size="lg">
            <Link to="/contact">CONTACT US</Link>
          </Button>
        }
      />
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-center mb-6">JOIN THE TEAM</h2>
          <div className="space-y-4 text-center text-foreground">
            <p>
              Hope Alliance is a growing movement and we'd like to welcome you on board as we
              together bring healing to the cities and the nations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-left">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-accent mb-2">Make Real Impact</h3>
                <p className="text-sm">
                  Be part of tangible change in communities across Uganda and beyond.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-accent mb-2">Mission-Driven Work</h3>
                <p className="text-sm">
                  Join a passionate team united by a shared vision of community healing and
                  empowerment.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-accent mb-2">Grow Your Skills</h3>
                <p className="text-sm">
                  Develop professionally while contributing to meaningful work that matters.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-accent mb-2">Build Community</h3>
                <p className="text-sm">
                  Connect with like-minded individuals committed to social transformation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Tabs defaultValue="volunteer">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
            <TabsTrigger value="mentor">Mentor</TabsTrigger>
            <TabsTrigger value="prayer">Prayer Request</TabsTrigger>
          </TabsList>

          <TabsContent value="volunteer">
            <ApplicationForm
              title="Volunteer with us"
              fieldLabel="Area of interest"
              fieldName="area_of_interest"
              onSubmit={applyVolunteer}
            />
          </TabsContent>
          <TabsContent value="mentor">
            <ApplicationForm
              title="Become a mentor"
              fieldLabel="Your expertise"
              fieldName="expertise"
              onSubmit={applyMentor}
            />
          </TabsContent>
          <TabsContent value="prayer">
            <PrayerForm />
          </TabsContent>
        </Tabs>
      </section>
    </SiteShell>
  );
}

function ApplicationForm({
  title,
  fieldLabel,
  fieldName,
  onSubmit,
}: {
  title: string;
  fieldLabel: string;
  fieldName: string;
  onSubmit: (payload: Record<string, unknown>) => Promise<unknown>;
}) {
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const g = (k: string) => String(fd.get(k) ?? "").trim();
    if (!g("full_name") || !isEmail(g("email"))) {
      toast.error("Please enter your name and a valid email.");
      return;
    }
    setBusy(true);
    try {
      await onSubmit({
        full_name: g("full_name").slice(0, 120),
        email: g("email").slice(0, 255),
        phone: g("phone").slice(0, 40) || null,
        [fieldName]: g(fieldName).slice(0, 120) || "General",
        message: g("message").slice(0, 2000) || null,
      });
      toast.success("Application received. Thank you!");
      form.reset();
    } catch {
      toast.error("Could not submit right now. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mt-6 p-6 shadow-card">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <form onSubmit={handle} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${fieldName}-name`}>Full name</Label>
          <Input id={`${fieldName}-name`} name="full_name" maxLength={120} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldName}-email`}>Email</Label>
          <Input id={`${fieldName}-email`} name="email" type="email" maxLength={255} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldName}-phone`}>Phone</Label>
          <Input id={`${fieldName}-phone`} name="phone" maxLength={40} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={fieldName}>{fieldLabel}</Label>
          <Input id={fieldName} name={fieldName} maxLength={120} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${fieldName}-message`}>Tell us about yourself</Label>
          <Textarea id={`${fieldName}-message`} name="message" rows={5} maxLength={2000} />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" variant="accent" className="w-full" disabled={busy}>
            {busy ? "Submitting…" : "SUBMIT APPLICATION"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function PrayerForm() {
  const [busy, setBusy] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const g = (k: string) => String(fd.get(k) ?? "").trim();
    if (!g("full_name") || g("request").length < 10) {
      toast.error("Please add your name and a prayer request of at least 10 characters.");
      return;
    }
    setBusy(true);
    try {
      await submitPrayer({
        full_name: g("full_name").slice(0, 120),
        email: g("email").slice(0, 255) || null,
        request: g("request").slice(0, 2000),
        is_private: isPrivate,
      });
      toast.success("Your request has been shared with our prayer team.");
      form.reset();
    } catch {
      toast.error("Could not submit right now. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mt-6 p-6 shadow-card">
      <h2 className="font-display text-lg font-bold">Share a prayer request</h2>
      <form onSubmit={handle} className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prayer-name">Full name</Label>
          <Input id="prayer-name" name="full_name" maxLength={120} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prayer-email">Email (optional)</Label>
          <Input id="prayer-email" name="email" type="email" maxLength={255} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prayer-request">Your request</Label>
          <Textarea id="prayer-request" name="request" rows={6} maxLength={2000} required />
        </div>
        <div className="flex items-center gap-3">
          <Switch id="prayer-private" checked={isPrivate} onCheckedChange={setIsPrivate} />
          <Label htmlFor="prayer-private" className="text-sm font-normal text-muted-foreground">
            Keep this request private to the prayer team
          </Label>
        </div>
        <Button type="submit" variant="accent" className="w-full" disabled={busy}>
          {busy ? "Submitting…" : "SEND PRAYER REQUEST"}
        </Button>
      </form>
    </Card>
  );
}
