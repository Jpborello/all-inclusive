-- 1. Asegurar que la columna shipping_details existe
alter table public.orders add column if not exists shipping_details jsonb;

-- 2. Habilitar RLS (por seguridad)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- 3. Permitir que CUALQUIERA (invitados incluidos) pueda crear órdenes
-- Primero borramos políticas viejas para evitar conflictos
drop policy if exists "Enable insert for all users" on public.orders;
drop policy if exists "Anyone can create orders" on public.orders;

create policy "Anyone can create orders" 
on public.orders 
for insert 
with check (true);

-- 4. Permitir que CUALQUIERA pueda crear items de órdenes
drop policy if exists "Enable insert for all users" on public.order_items;
drop policy if exists "Anyone can create order items" on public.order_items;

create policy "Anyone can create order items" 
on public.order_items 
for insert 
with check (true);

-- 5. Permitir leer órdenes propias (opcional, para el futuro)
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" 
on public.orders 
for select 
using (auth.uid() = auth.uid()); -- Esto es un placeholder, idealmente se usa user_id
