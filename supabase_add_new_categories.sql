-- Script para insertar nuevas categorías en la base de datos
INSERT INTO public.categories (name, slug) VALUES
('Pantalones', 'pantalones'),
('Buzos', 'buzos'),
('Sweaters', 'sweaters'),
('Camperas', 'camperas'),
('Remeras Mangas Largas', 'remeras-mangas-largas'),
('Cintos', 'cintos')
ON CONFLICT (slug) DO NOTHING;
