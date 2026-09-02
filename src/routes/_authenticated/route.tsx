import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "alliance123@gmail.com";

function hasAdminAccess(email: string | null | undefined) {
  return String(email ?? "").trim().toLowerCase() === ADMIN_EMAIL;
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session || !hasAdminAccess(data.session.user?.email)) {
      throw redirect({
        to: "/auth",
        replace: true,
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}