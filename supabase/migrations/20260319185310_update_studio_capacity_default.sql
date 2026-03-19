-- Update studio capacity from 30 to 10 (actual studio max)
UPDATE site_settings
SET value = '{"max_guests": 10}',
    updated_at = now()
WHERE key = 'studio_capacity';
