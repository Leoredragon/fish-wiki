-- Batch: sazan varyeteleri + Anadolu endemik alabalıkları (image_url = null)
-- Safe insert: skips if name_tr or scientific_name already exists
-- Munzur Benekli Alabalığı = Salmo munzuricus (Munzur Alabalığı ile aynı; tek kayıt)

with to_insert as (
  select * from (values
    ('Deri Sazan','Leather Carp','Cyprinus carpio var. nudus','Tatlı Su'),
    ('Koi Sazanı','Koi Carp','Cyprinus carpio koi','Tatlı Su'),
    ('Ot Sazanı','Grass Carp','Ctenopharyngodon idella','Tatlı Su'),
    ('Gümüş Sazan','Silver Carp','Hypophthalmichthys molitrix','Tatlı Su'),
    ('İri Baş Sazan','Bighead Carp','Hypophthalmichthys nobilis','Tatlı Su'),
    ('Siyah Sazan','Black Carp','Mylopharyngodon piceus','Tatlı Su'),
    ('Anadolu Alabalığı','Anatolian Flathead Trout','Salmo platycephalus','Tatlı Su'),
    ('Kaspi Alabalığı','Caspian Trout','Salmo caspius','Tatlı Su'),
    ('Dicle Alabalığı','Tigris Trout','Salmo tigridis','Tatlı Su'),
    ('Fırat Alabalığı','Euphrates Trout','Salmo euphrataeus','Tatlı Su'),
    ('Munzur Alabalığı','Munzur Trout','Salmo munzuricus','Tatlı Su'),
    ('Rize Alabalığı','Rize Trout','Salmo rizeensis','Tatlı Su')
  ) as v(name_tr, name_en, scientific_name, water_type)
)
select name_tr, scientific_name from to_insert;

-- Full content already applied via MCP insert on 2026-07-29.
-- Verify:
-- select name_tr, scientific_name, image_url from public.fishes
-- where scientific_name in (
--   'Cyprinus carpio var. nudus','Cyprinus carpio koi','Ctenopharyngodon idella',
--   'Hypophthalmichthys molitrix','Hypophthalmichthys nobilis','Mylopharyngodon piceus',
--   'Salmo platycephalus','Salmo caspius','Salmo tigridis','Salmo euphrataeus',
--   'Salmo munzuricus','Salmo rizeensis'
-- );
