-- Publish the user-supplied NPF Cighu project and reference the bundled media.

insert into public.projects (
  id,
  name,
  slug,
  location,
  category,
  status,
  short_description,
  overview,
  cover_image_path,
  cover_image_alt,
  featured,
  published,
  information_complete,
  features,
  amenities
)
values (
  '8b736b10-633b-4ea1-9e5e-7ab0fcf2f101',
  'NPF Cighu Agro Farmhouse',
  'npf-cighu-agro-farmhouse',
  'Near Bhal Village, Rawat, Punjab, Pakistan',
  'development',
  'ongoing',
  'An agro-farmhouse community near Bhal Village, Rawat, presented around nature-led living, generous plot sizes, and flexible payment options.',
  $$NPF Cighu Agro Farmhouse is presented as a nature-focused farmhouse community near Bhal Village, Rawat. The supplied project material highlights fresh air, green surroundings, family time, wellness, and an agro lifestyle within a planned community.

The supplied route guide shows access from Islamabad through Thalian Interchange, Adyala Road Interchange, and Chountra to NPF Cighu Gate 1, with a stated total distance of 46 kilometres.

The supplied installment plan lists 5, 6, 8, and 10 kanal options at PKR 17,000,000, PKR 20,400,000, PKR 27,200,000, and PKR 34,000,000 respectively. It states a 25% down payment, the remaining 75% in equal quarterly installments, possession on 50% payment, and registry/intiqal after full payment. Promotional full-payment prices shown are PKR 15,000,000, PKR 18,000,000, PKR 24,000,000, and PKR 30,000,000 respectively.

Prices, payment terms, possession, registry/intiqal, availability, distances, affiliations, and other project claims are reproduced from supplied promotional material and must be reconfirmed with Stalwart Realtors before making any decision.$$, 
  '/images/projects/npf-cighu/npf-cighu-location-roadmap.jpeg',
  'Promotional road map from Islamabad to NPF Cighu Gate 1 near Bhal Village',
  true,
  true,
  true,
  array[
    '5, 6, 8, and 10 kanal farmhouse plot options',
    '25% down payment shown in the supplied installment plan',
    'Remaining 75% shown in equal quarterly installments',
    'Possession shown on 50% payment',
    'Registry/intiqal shown after full payment'
  ],
  array[
    'Green surroundings',
    'Fresh air and open landscapes',
    'Family-oriented farmhouse living',
    'Agro lifestyle setting',
    'Planned community environment'
  ]
)
on conflict (slug) do nothing;

insert into public.project_images (
  id,
  project_id,
  storage_path,
  alt_text,
  sort_order
)
select
  image.id,
  project.id,
  image.storage_path,
  image.alt_text,
  image.sort_order
from public.projects as project
cross join (
  values
    (
      '8b736b10-633b-4ea1-9e5e-7ab0fcf2f201'::uuid,
      '/images/projects/npf-cighu/npf-cighu-lifestyle.jpeg',
      'Promotional NPF Cighu lifestyle visual showing a farmhouse terrace at sunset',
      0
    ),
    (
      '8b736b10-633b-4ea1-9e5e-7ab0fcf2f202'::uuid,
      '/images/projects/npf-cighu/npf-cighu-project-benefits.jpeg',
      'Promotional NPF Cighu graphic describing location, community, lifestyle, and investment benefits',
      1
    ),
    (
      '8b736b10-633b-4ea1-9e5e-7ab0fcf2f203'::uuid,
      '/images/projects/npf-cighu/npf-cighu-installment-plan.jpeg',
      'Promotional NPF Cighu installment plan for 5, 6, 8, and 10 kanal plots',
      2
    )
) as image(id, storage_path, alt_text, sort_order)
where project.slug = 'npf-cighu-agro-farmhouse'
on conflict (storage_path) do nothing;
