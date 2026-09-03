-- Services confirmed in the Stalwart Realtors brand material supplied by the
-- business. Existing administrator-managed records always take precedence.

insert into public.services (
  title,
  slug,
  division,
  icon,
  short_description,
  is_active,
  sort_order
) values
  (
    'Development',
    'development',
    'development',
    'land',
    'Purpose-driven real estate development.',
    true,
    10
  ),
  (
    'Real Estate',
    'real-estate',
    'real-estate',
    'home',
    'Premium residential and commercial opportunities.',
    true,
    10
  ),
  (
    'Construction',
    'construction',
    'construction',
    'hammer',
    'Quality construction with considered execution.',
    true,
    10
  ),
  (
    'Sales',
    'sales',
    'real-estate',
    'key',
    'Strategic sales and commercial management.',
    true,
    20
  ),
  (
    'Investment',
    'investment',
    'real-estate',
    'compass',
    'Carefully selected opportunities for long-term value.',
    true,
    30
  ),
  (
    'Advisory',
    'advisory',
    'real-estate',
    'sparkles',
    'Informed real estate guidance and consultancy.',
    true,
    40
  )
on conflict (slug) do nothing;
