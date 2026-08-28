import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  HandHeart,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Sparkles,
  Users,
  UserCheck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const ADMIN_MODULES = [
  { slug: "programs", label: "Programs", icon: BookOpen, table: "programs", order: "sort_order" },
  { slug: "events", label: "Events", icon: CalendarDays, table: "events", order: "starts_at" },
  { slug: "blog", label: "Blog Posts", icon: FileText, table: "blog_posts", order: "created_at" },
  { slug: "donations", label: "Donations", icon: Wallet, table: "donations", order: "created_at" },
  {
    slug: "registrations",
    label: "Event Registrations",
    icon: ClipboardList,
    table: "event_registrations",
    order: "created_at",
  },
  {
    slug: "volunteers",
    label: "Volunteers",
    icon: HandHeart,
    table: "volunteers",
    order: "created_at",
  },
  { slug: "mentors", label: "Mentors", icon: UserCheck, table: "mentors", order: "created_at" },
  {
    slug: "prayer-requests",
    label: "Prayer Requests",
    icon: Sparkles,
    table: "prayer_requests",
    order: "created_at",
  },
  { slug: "messages", label: "Messages", icon: Mail, table: "messages", order: "created_at" },
  {
    slug: "newsletter",
    label: "Newsletter",
    icon: Mail,
    table: "newsletter_subscribers",
    order: "created_at",
  },
  { slug: "media", label: "Media", icon: Image, table: "media", order: "created_at" },
  { slug: "users", label: "Users", icon: Users, table: "profiles", order: "created_at" },
  { slug: "settings", label: "Settings", icon: Settings, table: "settings", order: "key" },
] as const;

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-y-auto bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            HA
          </span>
          <span className="font-display text-sm font-bold tracking-wide">HOPE ALLIANCE</span>
        </div>
        <nav className="space-y-1 px-3 pb-8">
          <SideLink
            to="/admin"
            icon={LayoutDashboard}
            label="Dashboard"
            active={pathname === "/admin"}
          />
          {ADMIN_MODULES.map((m) => (
            <SideLink
              key={m.slug}
              to={`/admin/${m.slug}`}
              icon={m.icon}
              label={m.label}
              active={pathname === `/admin/${m.slug}`}
            />
          ))}
        </nav>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background px-4 py-3 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <Menu className="size-5" />
          </Button>
          <h1 className="font-display text-lg font-bold">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/">View site</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-1 size-4" /> Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

function SideLink({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  );
}
