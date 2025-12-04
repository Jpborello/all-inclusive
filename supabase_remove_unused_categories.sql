-- Script to remove unused categories and their products

-- 1. Get IDs of categories to remove
WITH categories_to_remove AS (
    SELECT id FROM categories WHERE name IN ('Sacos', 'Accesorios', 'Calzado')
)

-- 2. Delete products in these categories (to avoid Foreign Key constraint errors)
DELETE FROM products
WHERE category_id IN (SELECT id FROM categories_to_remove);

-- 3. Delete the categories
DELETE FROM categories
WHERE name IN ('Sacos', 'Accesorios', 'Calzado');

-- Confirmation
SELECT * FROM categories;
