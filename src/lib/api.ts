import { supabase } from "@/integrations/supabase/client";

export type Program = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  icon: string;
  image_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  starts_at: string;
  ends_at: string | null;
  image_url: string | null;
  capacity: number | null;
  published: boolean;
};

export type Partner = {
  id: string;
  name: string;
  website?: string | null;
  logo_url?: string | null;
  type?: string | null;
  sort_order?: number | null;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image_url: string | null;
  author_name: string;
  published: boolean;
  published_at: string;
};

export type Donation = {
  id: string;
  donor_name: string;
  donor_email: string | null;
  amount: number;
  currency: string;
  purpose: string;
  method: string;
  status: string;
  donated_at: string;
};

export type MessageItem = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Applicant = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
  area_of_interest?: string;
  expertise?: string;
  message?: string | null;
};

const table = (name: string) => supabase.from(name as never);

async function unwrap<T>(promise: PromiseLike<{ data: unknown; error: unknown }>): Promise<T> {
  const { data, error } = await promise;
  if (error) throw error;
  return (data ?? []) as T;
}

/* ---------------- Public reads ---------------- */

export const fetchPrograms = () =>
  unwrap<Program[]>(table("programs").select("*").eq("published", true).order("sort_order"));

export const fetchProgramBySlug = (slug: string) =>
  unwrap<Program[]>(table("programs").select("*").eq("published", true).eq("slug", slug)).then(
    (programs) => programs[0],
  );

export const fetchUpcomingEvents = (limit = 6) =>
  unwrap<EventItem[]>(
    table("events").select("*").eq("published", true).order("starts_at").limit(limit),
  );

export const fetchPartners = (limit = 50) =>
  unwrap<Partner[]>(
    table("partners").select("*").order("sort_order", { ascending: true }).limit(limit),
  );

export const fetchEventBySlug = (slug: string) =>
  unwrap<EventItem[]>(table("events").select("*").eq("published", true).eq("slug", slug)).then(
    (events) => events[0],
  );

export const fetchPosts = (limit = 12) =>
  unwrap<BlogPost[]>(
    table("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(limit),
  );

export const fetchPost = (id: string) =>
  unwrap<BlogPost[]>(table("blog_posts").select("*").eq("published", true).eq("id", id)).then(
    (posts) => posts[0],
  );

export const fetchPostBySlug = (slug: string) =>
  unwrap<BlogPost[]>(table("blog_posts").select("*").eq("published", true).eq("slug", slug)).then(
    (posts) => posts[0],
  );

export const fetchSettings = async () => {
  const rows = await unwrap<{ key: string; value: string }[]>(
    table("settings").select("key,value"),
  );
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
};

/* ---------------- Public writes ---------------- */

export const submitMessage = (payload: {
  full_name: string;
  email: string;
  phone?: string | undefined;
  subject: string;
  message: string;
}) => unwrap<unknown>(table("messages").insert(payload as never));

export const subscribeNewsletter = (email: string) =>
  unwrap<unknown>(table("newsletter_subscribers").insert({ email } as never));

export const applyVolunteer = (payload: Record<string, unknown>) =>
  unwrap<unknown>(table("volunteers").insert(payload as never));

export const applyMentor = (payload: Record<string, unknown>) =>
  unwrap<unknown>(table("mentors").insert(payload as never));

export const submitPrayer = (payload: Record<string, unknown>) =>
  unwrap<unknown>(table("prayer_requests").insert(payload as never));

export const registerForEvent = (payload: Record<string, unknown>) =>
  unwrap<unknown>(table("event_registrations").insert(payload as never));

export const recordDonation = (payload: Record<string, unknown>) =>
  unwrap<unknown>(table("donations").insert(payload as never));

/* ---------------- Admin reads ---------------- */

export const adminList = <T>(name: string, orderColumn = "created_at") =>
  unwrap<T[]>(table(name).select("*").order(orderColumn, { ascending: false }));

export const adminCount = async (name: string, filter?: (q: never) => never) => {
  let q = supabase.from(name as never).select("*", { count: "exact", head: true }) as never;
  if (filter) q = filter(q);
  const { count, error } = (await q) as unknown as { count: number | null; error: unknown };
  if (error) throw error;
  return count ?? 0;
};

export const adminUpdate = (name: string, id: string, patch: Record<string, unknown>) =>
  unwrap<unknown>(
    table(name)
      .update(patch as never)
      .eq("id", id),
  );

export const adminDelete = (name: string, id: string) =>
  unwrap<unknown>(table(name).delete().eq("id", id));

export const adminInsert = (name: string, payload: Record<string, unknown>) =>
  unwrap<unknown>(table(name).insert(payload as never));

/* ---------------- Formatting ---------------- */

export const formatUGX = (value: number) =>
  new Intl.NumberFormat("en-UG", { maximumFractionDigits: 0 }).format(value);

export const compactUGX = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
};
