-- Enable write access for authenticated users (Admin) on Products
create policy "Admin Insert Products"
on public.products for insert
to authenticated
with check (true);

create policy "Admin Update Products"
on public.products for update
to authenticated
using (true)
with check (true);

create policy "Admin Delete Products"
on public.products for delete
to authenticated
using (true);

-- Enable write access for authenticated users (Admin) on Categories
create policy "Admin Insert Categories"
on public.categories for insert
to authenticated
with check (true);

create policy "Admin Update Categories"
on public.categories for update
to authenticated
using (true)
with check (true);

create policy "Admin Delete Categories"
on public.categories for delete
to authenticated
using (true);
