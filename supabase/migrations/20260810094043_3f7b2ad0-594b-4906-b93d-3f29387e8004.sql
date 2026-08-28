-- ============ helpers ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TYPE public.app_role AS ENUM ('admin','editor','viewer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- auto profile + first-user admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ content tables ============
CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'graduation-cap',
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.programs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published programs" ON public.programs FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "admins manage programs" ON public.programs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER programs_updated BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  image_url text,
  capacity int,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published events" ON public.events FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "admins manage events" ON public.events FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Community',
  cover_image_url text,
  author_name text NOT NULL DEFAULT 'Hope Alliance',
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "admins manage posts" ON public.blog_posts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER blog_posts_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  donor_email text,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'UGX',
  purpose text NOT NULL DEFAULT 'General Fund',
  method text NOT NULL DEFAULT 'Mobile Money',
  status text NOT NULL DEFAULT 'completed',
  donated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.donations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can donate" ON public.donations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage donations" ON public.donations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.event_registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can register" ON public.event_registrations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage registrations" ON public.event_registrations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  area_of_interest text NOT NULL DEFAULT 'General',
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.volunteers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteers TO authenticated;
GRANT ALL ON public.volunteers TO service_role;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can apply volunteer" ON public.volunteers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage volunteers" ON public.volunteers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  expertise text NOT NULL DEFAULT 'General',
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.mentors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentors TO authenticated;
GRANT ALL ON public.mentors TO service_role;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can apply mentor" ON public.mentors FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage mentors" ON public.mentors FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.prayer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  request text NOT NULL,
  is_private boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.prayer_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prayer_requests TO authenticated;
GRANT ALL ON public.prayer_requests TO service_role;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit prayer" ON public.prayer_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage prayers" ON public.prayer_requests FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL DEFAULT 'General Inquiry',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send message" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage messages" ON public.messages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage subscribers" ON public.newsletter_subscribers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  url text NOT NULL,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read media" ON public.media FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage media" ON public.media FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  is_public boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read public settings" ON public.settings FOR SELECT TO anon, authenticated USING (is_public);
CREATE POLICY "admins manage settings" ON public.settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ seed ============
INSERT INTO public.programs (title, slug, summary, description, icon, sort_order) VALUES
('Education & Scholarships','education','We support children and young people with access to quality education and learning resources.','Scholarships, school materials and mentorship for vulnerable learners across Uganda.','graduation-cap',1),
('Mentorship Program','mentorship','Connecting young people with mentors for personal, academic, and career growth.','A structured mentorship pipeline pairing youth with vetted mentors.','users',2),
('Youth Conference','youth-conference','Annual conferences that inspire, equip, and empower the next generation of leaders.','Regional and national gatherings for leadership development.','megaphone',3),
('Charity & Outreach','charity','Reaching out to vulnerable communities with food, clothing, and essential support.','Community drives providing relief and dignity to families in need.','heart-handshake',4),
('Ministry & Evangelism','ministry','Sharing the love of Christ in our communities through faith-centred service.','Faith outreach, discipleship and community prayer initiatives.','church',5),
('Skills & Empowerment','skills','Equipping people with practical skills for a better, self-reliant future.','Vocational training, entrepreneurship and financial literacy.','wrench',6);

INSERT INTO public.events (title, slug, description, location, starts_at, ends_at) VALUES
('Hope Youth Conference 2026','hope-youth-conference-2026','Three days of worship, leadership training and community.','Kampala, Uganda','2026-12-15 09:00+03','2026-12-17 17:00+03'),
('Community Outreach Food Drive','community-outreach-food-drive','Distributing food and essentials to families in Wakiso.','Wakiso, Uganda','2026-11-22 08:00+03','2026-11-22 16:00+03'),
('Leadership Training Workshop','leadership-training-workshop','Practical leadership skills for youth leaders and mentors.','Kampala, Uganda','2026-12-05 09:00+03','2026-12-05 16:00+03');

INSERT INTO public.blog_posts (title, slug, excerpt, content, category, published_at) VALUES
('5 Ways to Make a Difference in Your Community','make-a-difference','Small, consistent acts of service can transform a neighbourhood.','Small, consistent acts of service can transform a neighbourhood. Here are five practical places to begin.','Community','2026-10-10'),
('The Power of Mentorship in Youth Development','power-of-mentorship','Why every young person needs someone in their corner.','Mentorship changes trajectories. Here is what we have learned from 200+ mentored youth.','Youth','2026-10-05'),
('Education: The Key to Breaking Poverty','education-breaking-poverty','Education remains the most reliable path out of generational poverty.','Education remains the most reliable path out of generational poverty.','Education','2026-09-28');

INSERT INTO public.donations (donor_name, donor_email, amount, purpose, donated_at) VALUES
('Sarah Namutebi','sarah@example.com',100000,'Education','2026-10-25'),
('David Isabirye','david@example.com',50000,'Youth Program','2026-10-24'),
('Grace Nakanwagi','grace@example.com',200000,'Charity','2026-10-24'),
('Peter Mugisha','peter@example.com',50000,'General Fund','2026-10-23'),
('Joyce Atim','joyce@example.com',100000,'Community Project','2026-10-23'),
('Anonymous',NULL,1500000,'Education','2026-08-14'),
('Hope Partners Ltd','partners@example.com',2000000,'Youth Program','2026-09-11'),
('Mary Akello','mary@example.com',750000,'Charity','2026-07-19'),
('John Ssempa','john@example.com',450000,'Education','2026-06-08'),
('Ruth Nabwire','ruth@example.com',300000,'Community Project','2026-05-21');

INSERT INTO public.volunteers (full_name, email, area_of_interest, status) VALUES
('John Kato','john.kato@example.com','Outreach','pending'),
('Mercy Auma','mercy.auma@example.com','Education','pending'),
('Samuel Okello','samuel.okello@example.com','Youth Program','pending');

INSERT INTO public.mentors (full_name, email, expertise, status) VALUES
('Daniel Wasswa','daniel@example.com','Career Coaching','pending'),
('Esther Nabirye','esther@example.com','Entrepreneurship','pending');

INSERT INTO public.messages (full_name, email, subject, message, is_read) VALUES
('Esther Namaganda','esther.n@example.com','Partnership Inquiry','We would love to partner with Hope Alliance on education projects.',false),
('Brian Lubega','brian@example.com','Program Question','How do I enrol my nephew in the mentorship program?',false),
('Ruth Nabbosa','ruth.n@example.com','Volunteer Inquiry','I am interested in volunteering on weekends.',true);

INSERT INTO public.settings (key, value) VALUES
('org_name','Hope Alliance'),
('contact_email','info@hopealliance.org'),
('contact_phone','+256 700 123 456'),
('address','133 Hope Avenue, Kampala, Uganda');
