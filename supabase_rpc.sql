-- Function to decrease stock safely
create or replace function decrease_stock(product_id bigint, quantity_sold int)
returns void
language plpgsql
security definer
as $$
begin
  update public.products
  set stock = stock - quantity_sold
  where id = product_id
  and stock >= quantity_sold;

  if not found then
    raise exception 'Not enough stock for product %', product_id;
  end if;
end;
$$;
