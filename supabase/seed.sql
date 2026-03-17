-- ============================================================================
-- Jersey Slime Studio - Seed Data
-- ============================================================================

-- ============================================================================
-- Experiences
-- ============================================================================

INSERT INTO experiences (id, title, description, price_per_person, duration_minutes, max_capacity, images, is_active, sort_order)
VALUES
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Classic Slime Making',
    'Dive into the wonderful world of slime! In this hands-on session you will learn to make three different slime varieties — fluffy, butter, and classic stretchy. Each guest takes home all three creations in custom containers. Perfect for first-time slimers and seasoned pros alike.',
    35.00,
    60,
    12,
    ARRAY['/images/experiences/classic-slime-1.jpg', '/images/experiences/classic-slime-2.jpg'],
    true,
    1
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'Advanced Slime Art',
    'Take your slime skills to the next level! This premium workshop covers cloud slime, avalanche slime, and glitter galaxy slime with advanced mixing techniques. You will learn about the science behind each texture and leave with four stunning creations plus a slime care guide.',
    50.00,
    90,
    10,
    ARRAY['/images/experiences/advanced-slime-1.jpg', '/images/experiences/advanced-slime-2.jpg'],
    true,
    2
  ),
  (
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Mini Slimers',
    'Designed especially for our littlest slime fans (ages 4-7)! This gentle, guided session uses kid-safe ingredients and focuses on sensory play. Each mini slimer creates two colorful slimes to bring home. Parents are welcome to join in the fun!',
    25.00,
    45,
    8,
    ARRAY['/images/experiences/mini-slimers-1.jpg', '/images/experiences/mini-slimers-2.jpg'],
    true,
    3
  );

-- ============================================================================
-- Availability Slots (next 2 weeks, various times)
-- ============================================================================

INSERT INTO availability_slots (experience_id, date, start_time, end_time, spots_remaining)
VALUES
  -- Classic Slime Making slots
  ('a1b2c3d4-0001-4000-8000-000000000001', CURRENT_DATE + INTERVAL '1 day',  '10:00', '11:00', 12),
  ('a1b2c3d4-0001-4000-8000-000000000001', CURRENT_DATE + INTERVAL '1 day',  '13:00', '14:00', 12),
  ('a1b2c3d4-0001-4000-8000-000000000001', CURRENT_DATE + INTERVAL '3 days', '10:00', '11:00', 12),
  ('a1b2c3d4-0001-4000-8000-000000000001', CURRENT_DATE + INTERVAL '5 days', '14:00', '15:00', 12),
  ('a1b2c3d4-0001-4000-8000-000000000001', CURRENT_DATE + INTERVAL '8 days', '10:00', '11:00', 12),
  ('a1b2c3d4-0001-4000-8000-000000000001', CURRENT_DATE + INTERVAL '10 days','13:00', '14:00', 12),
  ('a1b2c3d4-0001-4000-8000-000000000001', CURRENT_DATE + INTERVAL '12 days','10:00', '11:00', 12),

  -- Advanced Slime Art slots
  ('a1b2c3d4-0002-4000-8000-000000000002', CURRENT_DATE + INTERVAL '2 days', '11:00', '12:30', 10),
  ('a1b2c3d4-0002-4000-8000-000000000002', CURRENT_DATE + INTERVAL '4 days', '14:00', '15:30', 10),
  ('a1b2c3d4-0002-4000-8000-000000000002', CURRENT_DATE + INTERVAL '7 days', '11:00', '12:30', 10),
  ('a1b2c3d4-0002-4000-8000-000000000002', CURRENT_DATE + INTERVAL '9 days', '14:00', '15:30', 10),
  ('a1b2c3d4-0002-4000-8000-000000000002', CURRENT_DATE + INTERVAL '13 days','11:00', '12:30', 10),

  -- Mini Slimers slots
  ('a1b2c3d4-0003-4000-8000-000000000003', CURRENT_DATE + INTERVAL '1 day',  '11:30', '12:15', 8),
  ('a1b2c3d4-0003-4000-8000-000000000003', CURRENT_DATE + INTERVAL '3 days', '11:30', '12:15', 8),
  ('a1b2c3d4-0003-4000-8000-000000000003', CURRENT_DATE + INTERVAL '6 days', '10:00', '10:45', 8),
  ('a1b2c3d4-0003-4000-8000-000000000003', CURRENT_DATE + INTERVAL '8 days', '11:30', '12:15', 8),
  ('a1b2c3d4-0003-4000-8000-000000000003', CURRENT_DATE + INTERVAL '11 days','10:00', '10:45', 8),
  ('a1b2c3d4-0003-4000-8000-000000000003', CURRENT_DATE + INTERVAL '14 days','11:30', '12:15', 8);

-- ============================================================================
-- Party Packages
-- ============================================================================

INSERT INTO party_packages (id, name, description, price, max_guests, duration_minutes, includes, images, is_active, sort_order)
VALUES
  (
    'b2c3d4e5-0001-4000-8000-000000000001',
    'Basic Slime Party',
    'A fun and affordable slime party! Each guest makes two custom slimes to take home. Includes table setup, aprons, and all slime-making supplies.',
    250.00,
    10,
    90,
    ARRAY['2 slime creations per guest', 'Custom containers and labels', 'Aprons for all guests', 'Table setup and cleanup', 'Party host for the duration'],
    ARRAY['/images/parties/basic-party-1.jpg'],
    true,
    1
  ),
  (
    'b2c3d4e5-0002-4000-8000-000000000002',
    'Deluxe Slime Party',
    'Our most popular package! Guests make three slimes with premium add-ins like foam beads, glitter, and charms. Includes a special slime creation for the birthday kid plus party favors for everyone.',
    400.00,
    15,
    120,
    ARRAY['3 slime creations per guest', 'Premium mix-ins (glitter, beads, charms)', 'Special birthday kid mega-slime', 'Party favor bags', 'Custom containers and labels', 'Aprons for all guests', 'Table setup and cleanup', 'Dedicated party host'],
    ARRAY['/images/parties/deluxe-party-1.jpg', '/images/parties/deluxe-party-2.jpg'],
    true,
    2
  ),
  (
    'b2c3d4e5-0003-4000-8000-000000000003',
    'Ultimate Slime Bash',
    'The ultimate slime experience! Everything in the Deluxe package plus a slime science demo, custom slime bar with 20+ toppings, tie-dye slime station, and a take-home slime kit for continued fun at home.',
    600.00,
    25,
    150,
    ARRAY['4 slime creations per guest', 'Custom slime bar with 20+ toppings', 'Tie-dye slime station', 'Slime science demo show', 'Take-home slime kit for every guest', 'Special birthday kid mega-slime', 'Party favor bags', 'Custom containers and labels', 'Aprons for all guests', 'Full setup and cleanup', 'Dedicated party host + assistant'],
    ARRAY['/images/parties/ultimate-party-1.jpg', '/images/parties/ultimate-party-2.jpg'],
    true,
    3
  );

-- ============================================================================
-- Slime Inventory
-- ============================================================================

INSERT INTO slime_inventory (name, description, texture_type, color, image_url, is_available, sort_order)
VALUES
  ('Cotton Candy Cloud',  'Super soft and fluffy like a cloud! This dreamy slime stretches for days and smells like fresh cotton candy.',            'cloud',   'Pink',        '/images/slime/cotton-candy-cloud.jpg',  true, 1),
  ('Ocean Breeze',        'A mesmerizing blue butter slime that spreads like a dream. Swirl in the white clay for a wave effect.',                   'butter',  'Blue',        '/images/slime/ocean-breeze.jpg',        true, 2),
  ('Galactic Glitter',    'Packed with holographic glitter, this clear slime sparkles like a galaxy far, far away.',                                 'clear',   'Purple',      '/images/slime/galactic-glitter.jpg',    true, 3),
  ('Mint Chip Crunch',    'Crunchy foam beads meet refreshing mint green in this satisfying textured slime. ASMR in your hands!',                   'crunchy', 'Green',       '/images/slime/mint-chip-crunch.jpg',    true, 4),
  ('Sunset Swirl',        'A gorgeous gradient of orange, pink, and yellow that looks just like a summer sunset. Thick and glossy.',                 'glossy',  'Orange/Pink', '/images/slime/sunset-swirl.jpg',        true, 5),
  ('Lemon Drop Jelly',    'Bright yellow jelly slime that jiggles and pops! Add the included foam beads for extra crunch.',                         'jelly',   'Yellow',      '/images/slime/lemon-drop-jelly.jpg',    true, 6),
  ('Midnight Avalanche',  'Watch the white snow slowly fall through this deep black slime for a hypnotic avalanche effect.',                        'avalanche','Black/White', '/images/slime/midnight-avalanche.jpg',  true, 7),
  ('Strawberry Fluff',    'Fluffy, stretchy, and scented like fresh strawberries. This classic fluffy slime is a fan favorite.',                     'fluffy',  'Red',         '/images/slime/strawberry-fluff.jpg',    true, 8);

-- ============================================================================
-- Blog Posts (sample - requires an admin profile to exist as author)
-- Note: These use a placeholder author_id. After creating an admin user via
-- Supabase Auth, update the author_id to match that user's profile id.
-- For local dev seeding, create a profile first:
-- ============================================================================

-- Placeholder admin user for blog authorship (local dev only)
-- In production, this profile is created automatically by the auth trigger.
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'hello@jerseyslime.com',
  crypt('password123', gen_salt('bf')),
  now(),
  'authenticated',
  'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Jersey Slime Team"}',
  now(),
  now(),
  ''
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, full_name, email, role)
VALUES ('00000000-0000-4000-8000-000000000001', 'Jersey Slime Team', 'hello@jerseyslime.com', 'admin')
ON CONFLICT (id) DO NOTHING;

INSERT INTO blog_posts (title, slug, content, excerpt, cover_image_url, published_at, author_id, is_published)
VALUES
  (
    '5 Tips for Making the Perfect Fluffy Slime',
    '5-tips-perfect-fluffy-slime',
    E'Making fluffy slime is one of the most satisfying crafts out there, but getting the perfect consistency takes a bit of know-how. Here are our top five tips from the studio:\n\n## 1. Use Fresh Shaving Cream\nThe fluffiness comes from the shaving cream, so make sure it is fresh and foamy. Gel-based products will not work — you need the classic aerosol foam.\n\n## 2. Add Shaving Cream Gradually\nDo not dump it all in at once! Add a little at a time and fold it in gently. This keeps the air bubbles intact and gives you maximum fluff.\n\n## 3. Activator Is Key\nWhether you use contact lens solution (with boric acid) or liquid starch, add your activator slowly. Over-activating makes the slime stiff and rubbery.\n\n## 4. Knead With Care\nOnce your slime starts coming together, knead it with your hands instead of stirring. This develops the perfect stretchy texture.\n\n## 5. Store It Right\nFluffy slime deflates over time — that is normal! Store it in an airtight container and it will last for weeks. You can even re-fluff it by adding a tiny bit of shaving cream.',
    'Master the art of fluffy slime with these five essential tips straight from our studio. From choosing the right shaving cream to perfect storage techniques.',
    '/images/blog/fluffy-slime-tips.jpg',
    now(),
    '00000000-0000-4000-8000-000000000001',
    true
  ),
  (
    'What to Expect at Your First Slime Workshop',
    'what-to-expect-first-slime-workshop',
    E'Thinking about booking a slime workshop at Jersey Slime Studio? Here is everything you need to know before your first visit!\n\n## Arriving at the Studio\nWe are located in the heart of Jersey City with easy parking nearby. Plan to arrive 5-10 minutes early so we can get you set up and ready to slime.\n\n## What We Provide\nEverything! Aprons, gloves, all slime-making supplies, containers to take your creations home, and even wipes for cleanup. Just bring yourself and your sense of adventure.\n\n## The Experience\nOur workshops are guided by experienced slime artists who walk you through each step. You will learn the science behind slime, experiment with colors and textures, and create your own unique pieces.\n\n## Age Ranges\nWe have workshops for all ages! Our Mini Slimers class is perfect for ages 4-7, while Classic and Advanced sessions are great for ages 8 and up. Adults love our workshops too — it is a fantastic stress reliever.\n\n## What You Take Home\nDepending on your workshop, you will leave with 2-4 custom slime creations in labeled containers, plus care instructions so your slime lasts for weeks.',
    'Planning your first visit to Jersey Slime Studio? Here is your complete guide to what to wear, what to expect, and what you will take home.',
    '/images/blog/first-workshop.jpg',
    now(),
    '00000000-0000-4000-8000-000000000001',
    true
  );

-- ============================================================================
-- Site Settings
-- ============================================================================

INSERT INTO site_settings (key, value)
VALUES
  ('hours', '{
    "monday":    "Closed",
    "tuesday":   "10:00 AM - 6:00 PM",
    "wednesday": "10:00 AM - 6:00 PM",
    "thursday":  "10:00 AM - 6:00 PM",
    "friday":    "10:00 AM - 8:00 PM",
    "saturday":  "9:00 AM - 8:00 PM",
    "sunday":    "10:00 AM - 5:00 PM"
  }'::jsonb),
  ('address', '{
    "street": "123 Slime Street",
    "city": "Jersey City",
    "state": "NJ",
    "zip": "07302",
    "full": "123 Slime Street, Jersey City, NJ 07302"
  }'::jsonb),
  ('phone', '{"number": "(201) 555-SLME", "display": "(201) 555-7563"}'::jsonb),
  ('social_links', '{
    "instagram": "https://instagram.com/jerseyslime",
    "tiktok": "https://tiktok.com/@jerseyslime",
    "facebook": "https://facebook.com/jerseyslimestudio",
    "youtube": "https://youtube.com/@jerseyslime"
  }'::jsonb);
