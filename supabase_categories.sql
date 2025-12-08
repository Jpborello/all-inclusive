-- Insert new categories
insert into public.categories (name, slug) values
('Camperas', 'camperas'),
('Remeras', 'remeras'),
('Bermudas', 'bermudas'),
('Calzado', 'calzado'),
('Chombas', 'chombas'),
('Conjuntos', 'conjuntos')
on conflict (slug) do nothing;
