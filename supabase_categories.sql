-- Insert new categories
insert into public.categories (name, slug) values
('Camperas', 'camperas'),
('Remeras', 'remeras'),
('Bermudas', 'bermudas'),
('Calzado', 'calzado')
on conflict (slug) do nothing;
