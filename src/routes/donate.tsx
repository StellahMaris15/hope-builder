import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { PageHero, SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatUGX, recordDonation } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Support Hope Alliance Programs" },
      {
        name: "description",
        content:
          "Give towards education, youth programs, charity outreach and community projects in Uganda. Every shilling builds hope.",
      },
      { property: "og:title", content: "Donate to Hope Alliance" },
      {
        property: "og:description",
        content: "Support education, mentorship and outreach in Uganda.",
      },
    ],
  }),
  component: DonatePage,
});

const PRESETS = [50000, 100000, 200000, 500000];
const PURPOSES = ["Education", "Youth Program", "Charity", "Community Project", "General Fund"];

function DonatePage() {
  const [amount, setAmount] = useState(100000);
  const [purpose, setPurpose] = useState("Education");
  const [method, setMethod] = useState("Mobile Money");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const g = (k: string) => String(fd.get(k) ?? "").trim();
    if (!g("donor_name") || amount <= 0) {
      toast.error("Please enter your name and a valid amount.");
      return;
    }
    setBusy(true);
    try {
      await recordDonation({
        donor_name: g("donor_name").slice(0, 120),
        donor_email: g("donor_email").slice(0, 255) || null,
        amount,
        currency: "UGX",
        purpose,
        method,
        status: "pending",
      });
      toast.success("Thank you! Your pledge has been recorded — we'll email payment details.");
      form.reset();
    } catch {
      toast.error("Could not record your donation. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteShell>
      <PageHero
        title="Donate"
        description="Your gift helps fund education, mentorship and outreach that create lasting hope in Uganda."
        actions={
          <Button asChild variant="hero" size="lg">
            <Link to="/programs">SEE WHERE SUPPORT GOES</Link>
          </Button>
        }
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card className="p-6 shadow-card sm:p-8">
          <h2 className="font-display text-xl font-bold">Make a donation</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose an amount and a purpose. Our team will confirm your gift and send payment
            instructions.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className={cn(
                    "rounded-lg border px-3 py-3 text-sm font-semibold transition-colors",
                    amount === p
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border hover:border-accent",
                  )}
                >
                  UGX {formatUGX(p)}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (UGX)</Label>
              <Input
                id="amount"
                type="number"
                min={1000}
                step={1000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Purpose</Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PURPOSES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Mobile Money", "Bank Transfer", "Card", "Cash"].map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="donor_name">Full name</Label>
                <Input id="donor_name" name="donor_name" maxLength={120} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor_email">Email</Label>
                <Input id="donor_email" name="donor_email" type="email" maxLength={255} />
              </div>
            </div>

            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={busy}>
              {busy ? "Submitting…" : `DONATE UGX ${formatUGX(amount || 0)}`}
            </Button>
          </form>
        </Card>
      </section>
    </SiteShell>
  );
}
