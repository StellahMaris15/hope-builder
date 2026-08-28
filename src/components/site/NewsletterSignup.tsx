import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/lib/api";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      await subscribeNewsletter(email.trim().toLowerCase());
      toast.success("You're subscribed. Watch your inbox!");
      setEmail("");
    } catch (err) {
      const message =
        (err as { code?: string })?.code === "23505"
          ? "You're already subscribed."
          : "Could not subscribe right now.";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="border-y border-white/10 bg-primary">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary-foreground">Stay Connected</h2>
          <p className="mt-1 text-sm text-primary-foreground/70">
            Subscribe to our newsletter for updates on programs, events and impact stories.
          </p>
        </div>
        <form onSubmit={submit} className="flex w-full max-w-md gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            maxLength={255}
            className="border-white/20 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/50"
          />
          <Button type="submit" variant="accent" disabled={busy}>
            {busy ? "…" : "SUBSCRIBE"}
          </Button>
        </form>
      </div>
    </section>
  );
}
