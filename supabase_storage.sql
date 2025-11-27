-- Create a new storage bucket for products
insert into storage.buckets (id, name, public)
values ('products', 'products', true);

-- Policy: Allow public read access to product images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'products' );

-- Policy: Allow authenticated users (admin) to upload images
create policy "Admin Upload Access"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'products' );

-- Policy: Allow authenticated users (admin) to update/delete images
create policy "Admin Update Access"
on storage.objects for update
to authenticated
using ( bucket_id = 'products' );

create policy "Admin Delete Access"
on storage.objects for delete
to authenticated
using ( bucket_id = 'products' );
