import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "alliance123@gmail.com";

function hasAdminAccess(email: string | null | undefined) {
  return String(email ?? "")
    .trim()
    .toLowerCase() === ADMIN_EMAIL;
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!hasAdminAccess(data.session?.user?.email)) {
        if (active) setAllowed(false);
        return;
      }

      if (active) setAllowed(true);
    };

    void check();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (allowed === false) void navigate({ to: "/auth", replace: true });
  }, [allowed, navigate]);

  if (allowed !== true) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 py-12">
        <p className="text-sm text-muted-foreground">Checking administrator access...</p>
      </div>
    );
  }

  return <Outlet />;
}
