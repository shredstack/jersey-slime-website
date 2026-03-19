-- Seed site settings with default contact info
insert into site_settings (key, value) values
  ('address_street', '"123 Slime Street, Suite 38"'),
  ('address_city', '"Salt Lake City"'),
  ('address_state', '"UT"'),
  ('address_zip', '"84101"'),
  ('phone', '"(801) 555-0138"'),
  ('email', '"hello@jerseyslimestudio.com"'),
  ('instagram_url', '"https://instagram.com/jerseyslimestudio38"'),
  ('tiktok_url', '"https://tiktok.com/@jerseyslimestudio38"'),
  ('facebook_url', '"https://facebook.com/jerseyslimestudio38"')
on conflict (key) do nothing;
