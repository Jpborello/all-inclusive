-- 1. Asegurar que las tablas existen y tienen RLS habilitado
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- 2. GRANT explícito de permisos (A veces necesario si el rol anon no tiene permisos base)
grant usage on schema public to anon, authenticated;
grant all on public.orders to anon, authenticated;
grant all on public.order_items to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- 3. Re-crear políticas permisivas (Borrar y crear de nuevo para asegurar)
drop policy if exists "Enable insert for all users" on public.orders;
drop policy if exists "Anyone can create orders" on public.orders;
drop policy if exists "Users can view own orders" on public.orders;

create policy "Anyone can create orders" 
on public.orders 
for insert 
with check (true);

create policy "Users can view own orders" 
on public.orders 
for select 
using (true); -- Temporalmente permitir ver todo para debug, luego restringir

-- 4. Políticas para order_items
drop policy if exists "Enable insert for all users" on public.order_items;
drop policy if exists "Anyone can create order items" on public.order_items;

create policy "Anyone can create order items" 
on public.order_items 
for insert 
with check (true);

create policy "Anyone can view order items" 
on public.order_items 
for select 
using (true);
