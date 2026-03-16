-- ============================================================================
-- Jersey Slime Studio - Initial Database Schema
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Tables
-- ============================================================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name   text        NOT NULL,
  email       text        NOT NULL,
  phone       text,
  role        text        NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_role ON profiles (role);

-- Experiences
CREATE TABLE experiences (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text        NOT NULL,
  description       text        NOT NULL,
  price_per_person  numeric     NOT NULL CHECK (price_per_person >= 0),
  duration_minutes  int         NOT NULL CHECK (duration_minutes > 0),
  max_capacity      int         NOT NULL CHECK (max_capacity > 0),
  images            text[]      NOT NULL DEFAULT '{}',
  is_active         boolean     NOT NULL DEFAULT true,
  sort_order        int         NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_experiences_active_sort ON experiences (is_active, sort_order);

-- Availability Slots
CREATE TABLE availability_slots (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id    uuid        NOT NULL REFERENCES experiences ON DELETE CASCADE,
  date             date        NOT NULL,
  start_time       time        NOT NULL,
  end_time         time        NOT NULL,
  spots_remaining  int         NOT NULL CHECK (spots_remaining >= 0),
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX idx_slots_experience_date ON availability_slots (experience_id, date);
CREATE INDEX idx_slots_date ON availability_slots (date);

-- Bookings
CREATE TABLE bookings (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES profiles ON DELETE CASCADE,
  slot_id     uuid        NOT NULL REFERENCES availability_slots ON DELETE CASCADE,
  guest_count int         NOT NULL CHECK (guest_count >= 1),
  status      text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_price numeric     NOT NULL CHECK (total_price >= 0),
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_user ON bookings (user_id);
CREATE INDEX idx_bookings_slot ON bookings (slot_id);
CREATE INDEX idx_bookings_status ON bookings (status);

-- Party Packages
CREATE TABLE party_packages (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text        NOT NULL,
  description      text        NOT NULL,
  price            numeric     NOT NULL CHECK (price >= 0),
  max_guests       int         NOT NULL CHECK (max_guests > 0),
  duration_minutes int         NOT NULL CHECK (duration_minutes > 0),
  includes         text[]      NOT NULL DEFAULT '{}',
  images           text[]      NOT NULL DEFAULT '{}',
  is_active        boolean     NOT NULL DEFAULT true,
  sort_order       int         NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_party_packages_active_sort ON party_packages (is_active, sort_order);

-- Party Inquiries
CREATE TABLE party_inquiries (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        REFERENCES profiles ON DELETE SET NULL,
  package_id     uuid        REFERENCES party_packages ON DELETE SET NULL,
  contact_name   text        NOT NULL,
  contact_email  text        NOT NULL,
  contact_phone  text,
  preferred_date date        NOT NULL,
  guest_count    int         NOT NULL CHECK (guest_count >= 1),
  age_range      text        NOT NULL,
  message        text        NOT NULL,
  status         text        NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'completed')),
  admin_notes    text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_party_inquiries_status ON party_inquiries (status);

-- Slime Inventory
CREATE TABLE slime_inventory (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  description  text        NOT NULL,
  texture_type text        NOT NULL,
  color        text        NOT NULL,
  image_url    text        NOT NULL,
  is_available boolean     NOT NULL DEFAULT true,
  sort_order   int         NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_slime_inventory_available_sort ON slime_inventory (is_available, sort_order);

-- Blog Posts
CREATE TABLE blog_posts (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text        NOT NULL,
  slug            text        NOT NULL UNIQUE,
  content         text        NOT NULL,
  excerpt         text        NOT NULL,
  cover_image_url text        NOT NULL,
  published_at    timestamptz,
  author_id       uuid        NOT NULL REFERENCES profiles ON DELETE CASCADE,
  is_published    boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX idx_blog_posts_published ON blog_posts (is_published, published_at DESC);

-- Site Settings (key-value store)
CREATE TABLE site_settings (
  key        text        PRIMARY KEY,
  value      jsonb       NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- Trigger Functions
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_party_inquiries_updated_at
  BEFORE UPDATE ON party_inquiries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_slime_inventory_updated_at
  BEFORE UPDATE ON slime_inventory
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create profile when a new auth user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences       ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_packages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_inquiries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE slime_inventory   ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings     ENABLE ROW LEVEL SECURITY;

-- Helper: check if the current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- profiles ----
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ---- experiences ----
CREATE POLICY "Public can read active experiences"
  ON experiences FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins have full access to experiences"
  ON experiences FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ---- availability_slots ----
CREATE POLICY "Public can read availability slots"
  ON availability_slots FOR SELECT
  USING (true);

CREATE POLICY "Admins have full access to availability slots"
  ON availability_slots FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ---- bookings ----
CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all bookings"
  ON bookings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ---- party_packages ----
CREATE POLICY "Public can read active party packages"
  ON party_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins have full access to party packages"
  ON party_packages FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ---- party_inquiries ----
CREATE POLICY "Users can read own inquiries"
  ON party_inquiries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit an inquiry"
  ON party_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins have full access to party inquiries"
  ON party_inquiries FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ---- slime_inventory ----
CREATE POLICY "Public can read available slime inventory"
  ON slime_inventory FOR SELECT
  USING (is_available = true);

CREATE POLICY "Admins have full access to slime inventory"
  ON slime_inventory FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ---- blog_posts ----
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins have full access to blog posts"
  ON blog_posts FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ---- site_settings ----
CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins have full access to site settings"
  ON site_settings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
