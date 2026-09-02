import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "alliance123@gmail.com";

function hasAdminAccess(email: string | null | undefined) {
  return String(email ?? "")
    .trim()
    .toLowerCase() === ADMIN_EMAIL;
}

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In | Hope Alliance Admin" },
      {
        name: "description",
        content:
          "Secure sign in for Hope Alliance staff to manage programs, donations and content.",
      },
      { property: "og:title", content: "Staff Sign In | Hope Alliance" },
      { property: "og:description", content: "Admin access for the Hope Alliance team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");

  useEffect(() => {
    let isMounted = true;

    const checkAndRedirect = async (session: Session | null) => {
      if (!session) return;

      if (!hasAdminAccess(session.user?.email)) {
        await supabase.auth.signOut();
        if (isMounted) {
          toast.error("This account does not have dashboard access.");
        }
        return;
      }

      if (isMounted) {
        // Use void to prevent floating promises during render execution
        void navigate({ to: "/admin", replace: true });
      }
    };

    // 1. Initial check for existing active session
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted && data.session) {
        void checkAndRedirect(data.session);
      }
    });

    // 2. Listen for auth changes, ignoring INITIAL_SESSION to prevent duplicate fires
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted && event === "SIGNED_IN") {
        void checkAndRedirect(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail !== ADMIN_EMAIL) {
      toast.error("Only the demo admin email can access the dashboard.");
      return;
    }

    setBusy(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        toast.error(error.message);
        setBusy(false);
        return;
      }

      if (!data.session || !hasAdminAccess(data.session.user.email)) {
        await supabase.auth.signOut();
        toast.error("This account does not have dashboard access.");
        setBusy(false);
        return;
      }

      // Allow onAuthStateChange or direct navigation to handle route replacement
      await navigate({ to: "/admin", replace: true });
    } catch (err: any) {
      toast.error(err?.message || "An error occurred while signing in.");
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-primary-deep px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>

        <Card className="p-6 shadow-none">
          <div className="space-y-2">
            <h1 className="text-center font-display text-2xl font-bold text-foreground">
              Admin Sign In
            </h1>
            <p className="text-center text-sm text-muted-foreground">
              Use the demo admin account only. Other users can browse the public site, but not the
              dashboard.
            </p>
          </div>

          <form onSubmit={signIn} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="si-email">Email</Label>
              <Input
                id="si-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="si-password">Password</Label>
              <Input
                id="si-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={busy}
              />
            </div>
            <Button type="submit" className="w-full shadow-none" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}