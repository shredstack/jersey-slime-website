# Context for Claude

## Project Overview

Jersey Slime is a public-facing website for a slime experience studio in Utah. It handles online booking, party reservations, slime inventory browsing, a blog, and an admin dashboard for the business owner.

## Tech Stack

- **Next.js 14** (App Router) — all pages use the `app/` directory
- **Supabase** — PostgreSQL database, authentication, Row Level Security, and image storage
- **Tailwind CSS** — utility-first styling
- **React Hook Form + Zod** — form handling and validation
- **next-sitemap** — automatic sitemap/robots.txt generation on build
- **Resend** — transactional email (booking confirmations, contact form)

## Key Architecture Decisions

- **Server components by default** — only add `"use client"` when client-side interactivity is needed
- **Reusable UI components** — shared primitives live in `components/ui/` (Button, Card, etc.). Always check there before creating new ones. Extract reusable patterns from page-specific components into `components/ui/`.
- **API routes** — server-side logic (booking, contact) goes in `app/api/`. Validate all inputs with Zod schemas.
- **Auth middleware** — `middleware.ts` calls Supabase's `updateSession` on every request. Protected routes (account, admin) are gated by session checks.
- **Supabase clients** — use `lib/supabase/server.ts` in server components/API routes, `lib/supabase/client.ts` in client components. Never expose the service role key client-side.
- **Images** — use `next/image` with Supabase Storage remote patterns configured in `next.config.js`.

## Database & Migrations

- Migration files live in `supabase/migrations/`
- **Always apply migrations locally** using `npx supabase db push` or `npx supabase migration up` during development
- **Never apply migrations directly to production** — a GitHub Actions workflow automatically applies migrations when a PR is approved and merged to `main`
- When creating new migrations, use `npx supabase migration new <name>` to generate a timestamped file
- All tables with user data must have Row Level Security (RLS) policies

## SEO

SEO is critical — the site needs to rank for slime experience searches in Utah.

- Every public page needs appropriate `title` and `description` metadata (use Next.js `metadata` export)
- Use semantic HTML: proper heading hierarchy, landmark elements, alt text on all images
- The sitemap auto-generates on build; admin/account/API routes are excluded in `next-sitemap.config.js`
- Production domain: `jerseyslimestudio.com`

## Mobile-First Design

This is a consumer-facing website — most visitors will be on phones.

- Design mobile-first, then enhance for larger screens using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- Touch targets must be at least 44px
- Use proper input types on forms (`type="email"`, `type="tel"`) and autocomplete attributes
- No horizontal overflow on any screen size

## Environment Variables

Required env vars are documented in `.env.local.example`:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase client config
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only, for admin operations
- `NEXT_PUBLIC_SITE_URL` — used for sitemap generation and absolute URLs
- `RESEND_API_KEY` — email sending
- `GOOGLE_ANALYTICS_ID` — analytics tracking

## PR Reviews

PR review guidelines are in `claude_pr_instructions.md` at the project root.

## Production Info

Website domain: jerseyslimestudio.com

