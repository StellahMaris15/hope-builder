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

  useEffect(() => {
    const redirectToDashboard = async (session: Session | null) => {
      if (!hasAdminAccess(session?.user?.email)) {
        if (session?.user) {
          await supabase.auth.signOut();
          toast.error("This account does not have dashboard access.");
        }
        return;
      }

      navigate({ to: "/admin", replace: true });
    };

    supabase.auth.getSession().then(({ data }) => {
      void redirectToDashboard(data.session);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      void redirectToDashboard(session);
    });

    return () => subscription.subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "")
      .trim()
      .toLowerCase();

    if (email !== ADMIN_EMAIL) {
      toast.error("Only the demo admin email can access the dashboard.");
      return;
    }

    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: String(fd.get("password") ?? ""),
    });
    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (!data.session || !hasAdminAccess(data.session.user.email)) {
      await supabase.auth.signOut();
      toast.error("This account does not have dashboard access.");
      return;
    }

    navigate({ to: "/admin", replace: true });
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
                defaultValue={ADMIN_EMAIL}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="si-password">Password</Label>
              <Input
                id="si-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
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
