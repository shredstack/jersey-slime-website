-- ============================================================================
-- Studio Hours & Availability System
-- Replaces manual per-slot availability with studio-hours-based computed slots
-- ============================================================================

-- ============================================================================
-- New Tables
-- ============================================================================

-- Studio operating hours per day of week (0 = Sunday, 6 = Saturday)
CREATE TABLE studio_hours (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week int         NOT NULL UNIQUE CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time   time        NOT NULL,
  close_time  time        NOT NULL,
  is_closed   boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_studio_hours CHECK (is_closed = true OR close_time > open_time)
);

-- Date-specific overrides (holidays, special closures, extended hours)
CREATE TABLE studio_hour_overrides (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  date       date        NOT NULL UNIQUE,
  open_time  time,
  close_time time,
  is_closed  boolean     NOT NULL DEFAULT false,
  note       text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_override_hours CHECK (is_closed = true OR (open_time IS NOT NULL AND close_time IS NOT NULL AND close_time > open_time))
);

CREATE INDEX idx_studio_hour_overrides_date ON studio_hour_overrides (date);

-- ============================================================================
-- Modify experiences: add special event support
-- ============================================================================

ALTER TABLE experiences
  ADD COLUMN is_special       boolean NOT NULL DEFAULT false,
  ADD COLUMN event_date       date,
  ADD COLUMN event_start_time time,
  ADD COLUMN event_end_time   time,
  ADD COLUMN max_bookings     int;

ALTER TABLE experiences
  ADD CONSTRAINT special_requires_event_details
  CHECK (
    is_special = false
    OR (event_date IS NOT NULL AND event_start_time IS NOT NULL AND event_end_time IS NOT NULL)
  );

CREATE INDEX idx_experiences_special ON experiences (is_special, event_date);

-- ============================================================================
-- Modify bookings: store time directly instead of referencing availability_slots
-- ============================================================================

ALTER TABLE bookings
  ADD COLUMN experience_id uuid REFERENCES experiences ON DELETE SET NULL,
  ADD COLUMN booking_date  date,
  ADD COLUMN start_time    time,
  ADD COLUMN end_time      time;

-- Migrate existing booking data from availability_slots
UPDATE bookings b SET
  experience_id = s.experience_id,
  booking_date  = s.date,
  start_time    = s.start_time,
  end_time      = s.end_time
FROM availability_slots s WHERE b.slot_id = s.id;

-- Make slot_id nullable (keep for historical data)
ALTER TABLE bookings ALTER COLUMN slot_id DROP NOT NULL;

CREATE INDEX idx_bookings_date ON bookings (booking_date);
CREATE INDEX idx_bookings_date_status ON bookings (booking_date, status);

-- ============================================================================
-- Modify party_inquiries: add duration and preferred time
-- ============================================================================

ALTER TABLE party_inquiries
  ADD COLUMN duration_minutes int CHECK (duration_minutes IN (60, 90, 120)),
  ADD COLUMN preferred_time   time;

-- ============================================================================
-- Studio capacity setting
-- ============================================================================

INSERT INTO site_settings (key, value)
VALUES ('studio_capacity', '{"max_guests": 30}')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- Row Level Security for new tables
-- ============================================================================

ALTER TABLE studio_hours          ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_hour_overrides ENABLE ROW LEVEL SECURITY;

-- Studio hours: public read, admin full access
CREATE POLICY "Public can read studio hours"
  ON studio_hours FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage studio hours"
  ON studio_hours FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Studio hour overrides: public read, admin full access
CREATE POLICY "Public can read studio hour overrides"
  ON studio_hour_overrides FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage studio hour overrides"
  ON studio_hour_overrides FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- Triggers
-- ============================================================================

CREATE TRIGGER trg_studio_hours_updated_at
  BEFORE UPDATE ON studio_hours
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- Seed default studio hours (Mon-Sat 10am-6pm, Sun closed)
-- ============================================================================

INSERT INTO studio_hours (day_of_week, open_time, close_time, is_closed) VALUES
  (0, '10:00', '18:00', true),   -- Sunday (closed)
  (1, '10:00', '18:00', false),  -- Monday
  (2, '10:00', '18:00', false),  -- Tuesday
  (3, '10:00', '18:00', false),  -- Wednesday
  (4, '10:00', '18:00', false),  -- Thursday
  (5, '10:00', '18:00', false),  -- Friday
  (6, '10:00', '18:00', false);  -- Saturday
