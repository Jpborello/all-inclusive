-- Insert initial products
-- Note: We are using placeholder images for now. In a real app, these would be uploaded to Supabase Storage.

INSERT INTO public.products (name, description, price, category_id, image_url, stock)
SELECT 
  'Traje Italiano Slim Fit', 
  'Traje de corte italiano confeccionado en lana fría de alta calidad. Ideal para eventos formales y negocios. Color azul noche.', 
  250000.00, 
  id, 
  'https://images.unsplash.com/photo-1594938298603-c8148c472f29?q=80&w=1000&auto=format&fit=crop', 
  10
FROM public.categories WHERE slug = 'sacos';

INSERT INTO public.products (name, description, price, category_id, image_url, stock)
SELECT 
  'Camisa Blanca Premium', 
  'Camisa blanca de algodón egipcio con cuello italiano. Un básico indispensable para el guardarropa del hombre moderno.', 
  45000.00, 
  id, 
  'https://images.unsplash.com/photo-1620799140408-ed46ebc07748?q=80&w=1000&auto=format&fit=crop', 
  25
FROM public.categories WHERE slug = 'camisas';

INSERT INTO public.products (name, description, price, category_id, image_url, stock)
SELECT 
  'Pantalón de Vestir Gris', 
  'Pantalón de vestir corte recto en color gris marengo. Combina perfectamente con sacos oscuros o camisas claras.', 
  60000.00, 
  id, 
  'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop', 
  15
FROM public.categories WHERE slug = 'pantalones';

INSERT INTO public.products (name, description, price, category_id, image_url, stock)
SELECT 
  'Corbata de Seda Gold', 
  'Corbata 100% seda en tono dorado con textura sutil. El complemento perfecto para resaltar tu elegancia.', 
  25000.00, 
  id, 
  'https://images.unsplash.com/photo-1589756823695-278bc923f962?q=80&w=1000&auto=format&fit=crop', 
  50
FROM public.categories WHERE slug = 'accesorios';

INSERT INTO public.products (name, description, price, category_id, image_url, stock)
SELECT 
  'Blazer Azul Marino', 
  'Blazer versátil en azul marino, botones dorados. Perfecto para un look smart casual.', 
  180000.00, 
  id, 
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', 
  12
FROM public.categories WHERE slug = 'sacos';

INSERT INTO public.products (name, description, price, category_id, image_url, stock)
SELECT 
  'Camisa Oxford Celeste', 
  'Camisa tipo Oxford en color celeste suave. Ideal para el día a día o fines de semana relajados.', 
  42000.00, 
  id, 
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop', 
  30
FROM public.categories WHERE slug = 'camisas';
