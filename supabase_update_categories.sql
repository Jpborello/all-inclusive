-- Delete products in 'Sacos' category to avoid constraint violations
-- Note: This assumes products table has a foreign key to categories. 
-- If not, we might need to delete by checking the category name if it was denormalized, 
-- but based on schema it seems to use category_id.
DELETE FROM public.products WHERE category_id IN (SELECT id FROM public.categories WHERE slug = 'sacos');

-- Delete 'Sacos' category
DELETE FROM public.categories WHERE slug = 'sacos';

-- Insert new categories
INSERT INTO public.categories (name, slug) VALUES
('Remeras', 'remeras'),
('Camisas', 'camisas'),
('Bermudas', 'bermudas'),
('Camperas', 'camperas'),
('Pantalon Gabardina', 'pantalon-gabardina'),
('Short Baño', 'short-bano')
ON CONFLICT (slug) DO NOTHING;
