import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/date";
import { adminList, compactUGX, formatUGX } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Hope Alliance" },
      {
        name: "description",
        content: "Donations, volunteers and content overview for Hope Alliance staff.",
      },
      { property: "og:title", content: "Admin Dashboard | Hope Alliance" },
      {
        property: "og:description",
        content: "Internal overview of donations, events and content.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type Row = Record<string, unknown>;

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function Dashboard() {
  const useAdminQuery = (key: string, tableName: string, order?: string) =>
    useQuery({
      queryKey: ["admin", key],
      queryFn: () => adminList<Row>(tableName, order),
    });

  const donations = useAdminQuery("donations", "donations");
  const volunteers = useAdminQuery("volunteers", "volunteers");
  const registrations = useAdminQuery("event_registrations", "event_registrations");
  const programs = useAdminQuery("programs", "programs", "sort_order");
  const posts = useAdminQuery("blog_posts", "blog_posts");
  const messages = useAdminQuery("messages", "messages");
  const events = useAdminQuery("events", "events", "starts_at");

  const loading = donations.isLoading || volunteers.isLoading;

  const dRows = donations.data ?? [];
  const total = dRows.reduce((s, d) => s + Number(d["amount"] ?? 0), 0);

  const monthly = Object.entries(
    dRows.reduce<Record<string, number>>((acc, d) => {
      const key = formatDate(String(d["created_at"]), "MMM");
      acc[key] = (acc[key] ?? 0) + Number(d["amount"] ?? 0);
      return acc;
    }, {}),
  ).map(([month, amount]) => ({ month, amount }));

  const byPurpose = Object.entries(
    dRows.reduce<Record<string, number>>((acc, d) => {
      const key = String(d["purpose"] ?? "General Fund");
      acc[key] = (acc[key] ?? 0) + Number(d["amount"] ?? 0);
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const unread = (messages.data ?? []).filter((m) => m["status"] !== "read").length;

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <Metric
              label="Total Donations"
              value={`UGX ${formatUGX(total)}`}
              hint="All recorded gifts"
            />
            <Metric
              label="Total Volunteers"
              value={String((volunteers.data ?? []).length)}
              hint="Applications received"
            />
            <Metric
              label="Event Registrations"
              value={String((registrations.data ?? []).length)}
              hint="Across all events"
            />
            <Metric
              label="Active Programs"
              value={String((programs.data ?? []).length)}
              hint="Published programs"
            />
            <Metric
              label="Published Blog Posts"
              value={String((posts.data ?? []).filter((p) => p["published"]).length)}
              hint="Live on the site"
            />
            <Metric label="Unread Messages" value={String(unread)} hint="Awaiting a reply" />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-5 shadow-card">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide">
            Donations Overview
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v: number) => compactUGX(v)} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `UGX ${formatUGX(Number(v))}`} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 shadow-card">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide">
            Donations by Purpose
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byPurpose}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={80}
                >
                  {byPurpose.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `UGX ${formatUGX(Number(v))}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ListCard
          title="Recent Donations"
          rows={dRows.slice(0, 5).map((d) => ({
            primary: String(d["donor_name"] ?? "Anonymous"),
            secondary: String(d["purpose"] ?? ""),
            trailing: `UGX ${formatUGX(Number(d["amount"] ?? 0))}`,
          }))}
        />
        <ListCard
          title="Upcoming Events"
          rows={(events.data ?? []).slice(0, 5).map((e) => ({
            primary: String(e["title"] ?? ""),
            secondary: String(e["location"] ?? ""),
            trailing: formatDate(String(e["starts_at"]), "dd MMM"),
          }))}
        />
        <ListCard
          title="Recent Applications"
          rows={(volunteers.data ?? []).slice(0, 5).map((v) => ({
            primary: String(v["full_name"] ?? ""),
            secondary: String(v["area_of_interest"] ?? "Volunteer"),
            trailing: formatDate(String(v["created_at"] ?? ""), "dd MMM"),
          }))}
        />
        <ListCard
          title="Recent Messages"
          rows={(messages.data ?? []).slice(0, 5).map((m) => ({
            primary: String(m["full_name"] ?? ""),
            secondary: String(m["subject"] ?? ""),
            trailing: String(m["status"] ?? "unread"),
          }))}
        />
      </div>
    </AdminShell>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}

function ListCard({
  title,
  rows,
}: {
  title: string;
  rows: { primary: string; secondary: string; trailing: string }[];
}) {
  return (
    <Card className="p-5 shadow-card">
      <h2 className="font-display text-sm font-bold uppercase tracking-wide">{title}</h2>
      <ul className="mt-3 divide-y">
        {rows.length === 0 && <li className="py-3 text-sm text-muted-foreground">Nothing yet.</li>}
        {rows.map((r, i) => (
          <li key={i} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{r.primary}</p>
              <p className="truncate text-xs text-muted-foreground">{r.secondary}</p>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {r.trailing}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
