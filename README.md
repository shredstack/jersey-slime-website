# Jersey Slime Website

The official website for **Jersey Slime**, a slime experience studio in Utah where kids (and adults!) can make their own slime creations. The site handles online booking, party reservations, slime inventory browsing, blog content, and an admin dashboard for the business owner.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Forms**: React Hook Form + Zod validation
- **SEO**: next-sitemap for automatic sitemap generation
- **Deployment**: Vercel (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project ([create one here](https://supabase.com/dashboard))

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/shredstack/jersey-slime-website.git
   cd jersey-slime-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and fill in your Supabase credentials:
   ```bash
   cp .env.local.example .env.local
   ```

4. Run database migrations:
   ```bash
   npx supabase db push
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                    # Next.js App Router pages
  about/                # About page
  account/              # User account & booking history
  admin/                # Admin dashboard (availability, blog, bookings, experiences, inventory, parties, settings)
  api/                  # API routes (booking, contact)
  blog/                 # Blog with dynamic [slug] routes
  book/                 # Booking flow
  contact/              # Contact page
  experiences/          # Slime experience listings
  faq/                  # FAQ page
  login/                # Authentication
  parties/              # Party packages
  shop/                 # Slime shop / inventory browsing
  slime/                # Slime detail pages
components/             # Reusable UI components
  admin/                # Admin-specific components
  booking/              # Booking flow components
  layout/               # Header, footer, navigation
  slime/                # Slime display components
  ui/                   # Shared UI primitives (buttons, inputs, cards, etc.)
lib/                    # Utilities and configuration
  supabase/             # Supabase client helpers
  types.ts              # Shared TypeScript types
  utils.ts              # General utility functions
supabase/               # Supabase project config
  migrations/           # Database migration files
  seed.sql              # Seed data
middleware.ts           # Auth middleware for protected routes
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (+ sitemap generation) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Key Features (v1)

- **SEO-optimized** — discoverable when searching for slime experiences in Utah
- **Online booking** — users can book time slots or party packages
- **User accounts** — login, view booking history
- **Slime inventory** — browse available slime types with photos
- **Blog** — owner-managed content for engagement and SEO
- **Admin dashboard** — manage availability, bookings, inventory, blog posts, party packages, and site settings
- **Contact form** — customer inquiries via API route

## Future Plans

- Shopify integration for e-commerce
- Custom domain setup optimized for search visibility
