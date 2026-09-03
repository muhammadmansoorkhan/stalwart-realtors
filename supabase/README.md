# Supabase setup

The migration in `migrations/20260901000000_initial_stalwart_schema.sql`
creates the Stalwart Realtors database, Row Level Security policies, private
Storage buckets, indexes, constraints, update triggers, and confirmed company
seed copy.

## Apply the schema

Apply the migration to a new Supabase project with the Supabase CLI:

```sh
supabase link --project-ref your-project-ref
supabase db push
```

You can instead review and run the migration in the Supabase SQL Editor. Do
not run it on an existing production schema without first taking a backup and
reviewing name conflicts.

## Create the first administrator

1. Disable public sign-up in Supabase Authentication.
2. Create the administrator manually in **Authentication > Users**.
3. Copy that user's UUID.
4. Run the commented `admin_users` insert at the end of the migration after
   replacing the example UUID.

Authentication alone does not grant dashboard access. The user must also have
an active row in `public.admin_users`. The website has no public registration
route.

## Storage and public access

- Project media and brochures are stored in private buckets.
- Anonymous visitors can read only media linked to published projects.
- Administrators can manage project files only while their `admin_users` row
  remains active.
- Inquiry and site-visit inserts are validated by server actions and protected
  by database constraints and RLS.

Use the public Supabase URL and anon/publishable key described in the root
`.env.example`. This application does not require a service-role key, and one
must never be exposed to the browser.

The initial migration deliberately seeds no unverified project claims, contact
details, statistics, or testimonials. The follow-up confirmed-services
migration publishes only the six capabilities supplied in the business's
approved brand material.
