-- Publish the verified Stalwart Realtors contact channels supplied by the business.
update public.site_settings
set
  phone = '0319 7713784',
  whatsapp = '+92 319 7713784',
  email = 'info@stalwartrealtors.com'
where id = '00000000-0000-0000-0000-000000000001'::uuid;
