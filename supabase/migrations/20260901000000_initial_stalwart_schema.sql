-- Stalwart Realtors initial production schema.
-- This migration intentionally seeds no projects, statistics, testimonials,
-- contact details, team members, or achievements.

create extension if not exists pgcrypto with schema extensions;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 160),
  slug text not null unique check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    and slug not in ('about','admin','api','construction','contact','development','login','new','preview','privacy','projects','real-estate','settings','terms')
  ),
  location text check (location is null or char_length(location) <= 180),
  category text not null check (category in ('real-estate','construction','development')),
  status text not null default 'upcoming' check (status in ('upcoming','ongoing','completed')),
  short_description text not null check (char_length(short_description) between 20 and 320),
  overview text not null check (char_length(overview) between 40 and 12000),
  cover_image_path text,
  cover_image_alt text check (cover_image_alt is null or char_length(cover_image_alt) <= 220),
  featured boolean not null default false,
  published boolean not null default false,
  information_complete boolean not null default false,
  features text[] not null default '{}',
  amenities text[] not null default '{}',
  development_timeline jsonb not null default '[]'::jsonb check (jsonb_typeof(development_timeline) = 'array'),
  completion_date date,
  map_url text,
  map_embed_url text,
  brochure_path text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint published_information_is_complete check (not published or information_complete)
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null unique,
  alt_text text not null check (char_length(alt_text) between 2 and 220),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  division text not null check (division in ('real-estate','construction','development')),
  icon text not null default 'building' check (icon in ('building','compass','hammer','home','key','land','location','paint','ruler','shield','sparkles','trees')),
  short_description text not null check (char_length(short_description) between 10 and 300),
  detailed_description text check (detailed_description is null or char_length(detailed_description) <= 4000),
  is_active boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 32),
  email text check (email is null or char_length(email) <= 254),
  inquiry_type text not null check (inquiry_type in ('real-estate','construction','development','investment','general')),
  project_id uuid references public.projects(id) on delete set null,
  message text not null check (char_length(message) between 10 and 3000),
  consent_given boolean not null default false,
  status text not null default 'new' check (status in ('new','contacted','qualified','closed','spam')),
  private_notes text check (private_notes is null or char_length(private_notes) <= 4000),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.site_visits (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 32),
  email text check (email is null or char_length(email) <= 254),
  project_id uuid not null references public.projects(id) on delete restrict,
  preferred_date date not null,
  preferred_time text not null check (char_length(preferred_time) between 2 and 60),
  visitor_count integer check (visitor_count is null or visitor_count between 1 and 30),
  message text check (message is null or char_length(message) <= 2000),
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  private_notes text check (private_notes is null or char_length(private_notes) <= 4000),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null check (char_length(client_name) between 2 and 120),
  client_context text check (client_context is null or char_length(client_context) <= 180),
  quote text not null check (char_length(quote) between 20 and 1200),
  approved boolean not null default false,
  verified_at timestamptz not null,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.site_settings (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid check (id = '00000000-0000-0000-0000-000000000001'::uuid),
  company_name text not null,
  business_descriptor text not null,
  primary_tagline text not null,
  supporting_statement text not null,
  company_introduction text not null,
  mission text not null,
  vision text not null,
  phone text,
  whatsapp text,
  email text,
  office_address text,
  business_hours text,
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  map_url text,
  announcement text check (announcement is null or char_length(announcement) <= 240),
  default_seo_title text not null,
  default_seo_description text not null,
  statistics jsonb not null default '[]'::jsonb check (jsonb_typeof(statistics) = 'array'),
  show_statistics boolean not null default false,
  footer_description text not null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint visible_statistics_are_present check (not show_statistics or jsonb_array_length(statistics) > 0)
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 2 and 80),
  entity_type text not null check (char_length(entity_type) between 2 and 80),
  entity_id uuid,
  entity_label text not null check (char_length(entity_label) between 1 and 220),
  created_at timestamptz not null default timezone('utc', now())
);

create index projects_public_listing_idx on public.projects (published, featured desc, updated_at desc);
create index projects_category_status_idx on public.projects (category, status) where published;
create index project_images_order_idx on public.project_images (project_id, sort_order);
create index services_public_idx on public.services (division, is_active, sort_order);
create index inquiries_status_created_idx on public.inquiries (status, created_at desc);
create index inquiries_project_idx on public.inquiries (project_id) where project_id is not null;
create index site_visits_status_date_idx on public.site_visits (status, preferred_date);
create index site_visits_project_idx on public.site_visits (project_id);
create index testimonials_public_idx on public.testimonials (approved, sort_order);
create index activity_logs_created_idx on public.activity_logs (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.timezone('utc', pg_catalog.now());
  return new;
end;
$$;

create trigger admin_users_set_updated_at before update on public.admin_users for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger services_set_updated_at before update on public.services for each row execute function public.set_updated_at();
create trigger inquiries_set_updated_at before update on public.inquiries for each row execute function public.set_updated_at();
create trigger site_visits_set_updated_at before update on public.site_visits for each row execute function public.set_updated_at();
create trigger testimonials_set_updated_at before update on public.testimonials for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid()) and is_active = true
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

insert into public.site_settings (
  id, company_name, business_descriptor, primary_tagline, supporting_statement,
  company_introduction, mission, vision, default_seo_title,
  default_seo_description, footer_description
) values (
  '00000000-0000-0000-0000-000000000001',
  'Stalwart Realtors',
  'Real Estate Solutions',
  'Building Better Tomorrow, Together.',
  'Your Trust. Our Commitment.',
  'Stalwart Realtors brings real estate, construction, and development together with an emphasis on trust, transparency, considered decisions, and long-term value.',
  '',
  '',
  'Stalwart Realtors | Real Estate, Construction & Development',
  'Stalwart Realtors brings real estate, construction, and development together under one considered brand.',
  'Real estate, construction, and development brought together under one considered brand.'
);

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.services enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_visits enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.activity_logs enable row level security;

create policy "administrators read memberships" on public.admin_users for select to authenticated using (public.is_admin());
create policy "administrators manage memberships" on public.admin_users for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public reads published projects" on public.projects for select to anon using (published = true);
create policy "administrators manage projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public reads published project images" on public.project_images for select to anon using (
  exists (select 1 from public.projects where projects.id = project_images.project_id and projects.published = true)
);
create policy "administrators manage project images" on public.project_images for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public reads active services" on public.services for select to anon using (is_active = true);
create policy "administrators manage services" on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public submits inquiries" on public.inquiries for insert to anon, authenticated with check (
  status = 'new' and private_notes is null and consent_given = true
  and (project_id is null or exists (select 1 from public.projects where projects.id = inquiries.project_id and projects.published = true))
);
create policy "administrators read inquiries" on public.inquiries for select to authenticated using (public.is_admin());
create policy "administrators update inquiries" on public.inquiries for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "administrators delete inquiries" on public.inquiries for delete to authenticated using (public.is_admin());

create policy "public submits site visits" on public.site_visits for insert to anon, authenticated with check (
  status = 'pending' and private_notes is null
  and exists (select 1 from public.projects where projects.id = site_visits.project_id and projects.published = true)
);
create policy "administrators read site visits" on public.site_visits for select to authenticated using (public.is_admin());
create policy "administrators update site visits" on public.site_visits for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public reads approved testimonials" on public.testimonials for select to anon using (approved = true);
create policy "administrators manage testimonials" on public.testimonials for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public reads site settings" on public.site_settings for select to anon using (true);
create policy "administrators read site settings" on public.site_settings for select to authenticated using (public.is_admin());
create policy "administrators update site settings" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "administrators read activity" on public.activity_logs for select to authenticated using (public.is_admin());
create policy "administrators add activity" on public.activity_logs for insert to authenticated with check (public.is_admin() and actor_id = (select auth.uid()));

revoke all on all tables in schema public from anon, authenticated;
grant select (
  id, name, slug, location, category, status, short_description, overview,
  cover_image_path, cover_image_alt, featured, published,
  information_complete, features, amenities, development_timeline,
  completion_date, map_url, map_embed_url, brochure_path, created_at, updated_at
) on public.projects to anon;
grant select (id, project_id, storage_path, alt_text, sort_order, created_at)
  on public.project_images to anon;
grant select (
  id, title, slug, division, icon, short_description,
  detailed_description, is_active, sort_order, created_at, updated_at
) on public.services to anon;
grant select (
  id, client_name, client_context, quote, approved, verified_at,
  sort_order, created_at, updated_at
) on public.testimonials to anon;
grant select (
  id, company_name, business_descriptor, primary_tagline,
  supporting_statement, company_introduction, mission, vision, phone,
  whatsapp, email, office_address, business_hours, facebook_url,
  instagram_url, linkedin_url, map_url, announcement, default_seo_title,
  default_seo_description, statistics, show_statistics,
  footer_description, created_at, updated_at
) on public.site_settings to anon;
grant insert (full_name, phone, email, inquiry_type, project_id, message, consent_given)
  on public.inquiries to anon, authenticated;
grant insert (full_name, phone, email, project_id, preferred_date, preferred_time, visitor_count, message)
  on public.site_visits to anon, authenticated;

grant select, insert, update, delete on public.admin_users to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.project_images to authenticated;
grant select, insert, update, delete on public.services to authenticated;
grant select, update, delete on public.inquiries to authenticated;
grant select, update on public.site_visits to authenticated;
grant select, insert, update, delete on public.testimonials to authenticated;
grant select, update on public.site_settings to authenticated;
grant select, insert on public.activity_logs to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-media', 'project-media', false, 10485760, array['image/jpeg','image/png','image/webp','image/avif']),
  ('project-brochures', 'project-brochures', false, 20971520, array['application/pdf'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "read media for published projects" on storage.objects for select to anon, authenticated using (
  bucket_id = 'project-media' and (
    public.is_admin() or exists (
      select 1 from public.projects
      where projects.id::text = (storage.foldername(name))[1]
        and projects.published = true
        and (
          projects.cover_image_path = storage.objects.name
          or exists (
            select 1 from public.project_images
            where project_images.project_id = projects.id
              and project_images.storage_path = storage.objects.name
          )
        )
    )
  )
);
create policy "read brochures for published projects" on storage.objects for select to anon, authenticated using (
  bucket_id = 'project-brochures' and (
    public.is_admin() or exists (
      select 1 from public.projects
      where projects.id::text = (storage.foldername(name))[1]
        and projects.published = true
        and projects.brochure_path = storage.objects.name
    )
  )
);
create policy "administrators insert project storage" on storage.objects for insert to authenticated with check (
  public.is_admin() and (
    (
      bucket_id = 'project-media'
      and array_length(storage.foldername(name), 1) = 2
      and (storage.foldername(name))[2] in ('cover', 'gallery')
      and exists (select 1 from public.projects where projects.id::text = (storage.foldername(name))[1])
    ) or (
      bucket_id = 'project-brochures'
      and array_length(storage.foldername(name), 1) = 1
      and exists (select 1 from public.projects where projects.id::text = (storage.foldername(name))[1])
    )
  )
);
create policy "administrators update project storage" on storage.objects for update to authenticated using (
  public.is_admin() and bucket_id in ('project-media','project-brochures')
) with check (
  public.is_admin() and (
    (
      bucket_id = 'project-media'
      and array_length(storage.foldername(name), 1) = 2
      and (storage.foldername(name))[2] in ('cover', 'gallery')
      and exists (select 1 from public.projects where projects.id::text = (storage.foldername(name))[1])
    ) or (
      bucket_id = 'project-brochures'
      and array_length(storage.foldername(name), 1) = 1
      and exists (select 1 from public.projects where projects.id::text = (storage.foldername(name))[1])
    )
  )
);
create policy "administrators delete project storage" on storage.objects for delete to authenticated using (
  public.is_admin() and (
    (
      bucket_id = 'project-media'
      and array_length(storage.foldername(name), 1) = 2
      and (storage.foldername(name))[2] in ('cover', 'gallery')
    ) or (
      bucket_id = 'project-brochures'
      and array_length(storage.foldername(name), 1) = 1
    )
  )
);

-- After creating the first user manually in Authentication > Users, authorize it
-- from the SQL editor using its UUID (never place credentials in this migration):
-- insert into public.admin_users (user_id, display_name) values ('AUTH-USER-UUID', 'Administrator');
