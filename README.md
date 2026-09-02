# Stalwart Realtors

Production-oriented corporate website and secure content dashboard for **Stalwart Realtors** across Real Estate, Construction, and Development.

## What is included

- Complete responsive public site: home, about, three division pages, project catalogue, project details, contact, privacy, and terms
- Published-content rules that hide drafts, inactive services, unapproved testimonials, unverified contact details, and empty statistics
- Accessible mobile navigation, focus states, reduced-motion support, semantic landmarks, and useful empty/loading/error states
- Supabase migration with normalized tables, constraints, indexes, RLS, private storage buckets, and storage policies
- Supabase email/password authentication with no public registration UI
- Explicit `admin_users` authorization in addition to authentication
- Server-side protection for every admin page and mutation
- Project, gallery, brochure, service, inquiry, site-visit, testimonial, and site-settings management
- Validated inquiry and site-visit forms with a honeypot field
- Dynamic project metadata, sitemap, robots rules, and secure response headers
- Graceful pre-configuration mode: the public brand site builds without secrets, while database-dependent actions remain unavailable

## Requirements

- Node.js 20 or newer
- npm
- A Supabase project
- A GitHub repository and Vercel account for deployment

The repository currently uses Next.js 16.3.3, React 19.2.8, Tailwind CSS 4.3.3, TypeScript 5.9.3, Supabase JS 2.112.4, and Supabase SSR 0.12.5.

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and add the public Supabase project URL and publishable key. A legacy anon key is accepted as a fallback. Do not add a secret or service-role key to this application.
3. Apply `supabase/migrations/20260901000000_initial_stalwart_schema.sql` to a new Supabase project with the Supabase CLI or SQL Editor.
4. In Supabase Authentication settings, disable public user sign-up. The site intentionally has no registration route.
5. Create the first administrator manually in Supabase Authentication. Copy that user’s UUID—not their password—and run:

   ```sql
   insert into public.admin_users (user_id, display_name)
   values ('AUTH-USER-UUID', 'Administrator');
   ```

6. Start the site with `npm run dev`.
7. Open `http://localhost:3000/admin/login` and sign in with the manually created administrator.

## Environment variables

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser-safe | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe | Supabase publishable key; RLS remains the authorization boundary |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe, legacy fallback | Legacy anon key for older Supabase projects |
| `NEXT_PUBLIC_SITE_URL` | Browser-safe | Canonical production origin, such as `https://example.com` |

Never commit `.env.local`. Never expose a Supabase service-role key in a `NEXT_PUBLIC_` variable or in this application.

## Security model

- `proxy.ts` refreshes Supabase sessions and redirects unauthenticated admin traffic.
- The admin layout performs a server-side administrator check.
- Every server action calls `requireAdmin()` independently; UI visibility is never treated as authorization.
- `public.is_admin()` is a minimal `security definer` function with a fixed empty `search_path`, preventing search-path substitution and recursive RLS policies.
- RLS is enabled on every application table.
- Draft projects, inactive services, unapproved testimonials, inquiries, private notes, and activity logs are blocked by RLS.
- Storage buckets are private. Public signed URLs can be created only for media belonging to published projects; administrators manage all project media.
- Publishing a project is blocked until `information_complete` is explicitly checked.
- No privileged database key is required at runtime.

## Content rules before launch

The seed contains only the confirmed company name, descriptor, taglines, and neutral company copy. Before launch, an authorized representative should verify and enter:

- Phone and WhatsApp numbers
- Email, office address, business hours, and map URL
- Official Facebook, Instagram, and LinkedIn URLs
- Production domain
- Active services
- Project location, approval, pricing, payment, ownership, amenity, and delivery information
- Any statistic or testimonial
- Final jurisdiction-specific privacy policy and terms

`NPF Cighu Agro Farmhouse` is included from user-supplied promotional material. Its project page identifies pricing, payment, possession, registry/intiqal, distance, affiliation, availability, and investment statements as supplied claims that must be reconfirmed before any decision.

## Quality checks

Run `npm run check`, or run `npm run lint`, `npm run typecheck`, and `npm run build` separately.

## GitHub and Vercel deployment

1. Push the repository to GitHub. The included workflow checks lint, TypeScript, and the production build on pull requests and pushes.
2. Import the GitHub repository into Vercel as a Next.js project.
3. Add all variables from `.env.example` in Vercel Project Settings → Environment Variables. Use the verified production origin for `NEXT_PUBLIC_SITE_URL` in Production.
4. Deploy a preview first and verify public routes, admin sign-in, project publication, form submissions, media uploads, and mobile layout.
5. Promote the verified preview to production.

Apply and verify database migrations before promoting a deployment that depends on them.

## Operational notes

- Public project images use one-hour signed URLs; brochures use 15-minute download URLs.
- Removing a project through the dashboard also removes its managed storage objects before deleting database records.
- Inquiry deletion is limited to records already marked Spam.
- Site-visit requests are never described as automatically confirmed.
- The architectural hero image is a generated conceptual visual and is explicitly labelled as such; it is not presented as a real Stalwart project.
