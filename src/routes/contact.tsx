import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHero, SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitMessage } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Hope Alliance — Get in Touch" },
      {
        name: "description",
        content:
          "Reach the Hope Alliance team in Kampala, Uganda. Send a message about partnerships, programs, volunteering or donations.",
      },
      { property: "og:title", content: "Contact Hope Alliance" },
      {
        property: "og:description",
        content: "Questions, partnerships or support — we'd love to hear from you.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(2, "Please add a subject").max(160),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(2000),
});

function ContactPage() {
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setBusy(true);
    try {
      await submitMessage(parsed.data);
      toast.success("Message sent. We'll get back to you soon!");
      form.reset();
    } catch {
      toast.error("Could not send your message. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteShell>
      <PageHero
        title="Contact Us"
        description="We would love to hear from you. Reach out about partnerships, volunteering, prayer requests or support."
        actions={
          <Button asChild variant="hero" size="lg">
            <Link to="/donate">SUPPORT THE WORK</Link>
          </Button>
        }
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <Card className="h-fit p-6 shadow-card">
            <h2 className="font-display text-lg font-bold">Get in Touch</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We would love to hear from you. Reach out with any questions or partnership inquiries.
            </p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>+256 700 123 456</span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>info@hopealliance.org</span>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>133 Hope Avenue, Kampala, Uganda</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 shadow-card">
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" name="full_name" maxLength={120} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" name="email" type="email" maxLength={255} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" name="phone" maxLength={40} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" maxLength={160} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="message">Your message</Label>
                <Textarea id="message" name="message" rows={6} maxLength={2000} required />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Sending…" : "SEND MESSAGE"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
