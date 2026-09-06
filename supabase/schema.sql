create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  personalization_details text,
  total integer not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_name text not null,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0)
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Anyone can create orders" on public.orders;
drop policy if exists "Anyone can create order items" on public.order_items;
drop policy if exists "Admins can view orders" on public.orders;
drop policy if exists "Admins can view order items" on public.order_items;
drop policy if exists "Admins can update orders" on public.orders;

create policy "Anyone can create orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can create order items"
  on public.order_items for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view orders"
  on public.orders for select
  to authenticated
  using (true);

create policy "Admins can view order items"
  on public.order_items for select
  to authenticated
  using (true);

create policy "Admins can update orders"
  on public.orders for update
  to authenticated
  using (true)
  with check (true);

create or replace function public.create_order(
  p_order_number text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_personalization_details text,
  p_total integer,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_order_id uuid;
begin
  insert into public.orders (
    order_number,
    customer_name,
    customer_email,
    customer_phone,
    personalization_details,
    total
  ) values (
    p_order_number,
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_personalization_details,
    p_total
  ) returning id into new_order_id;

  insert into public.order_items (order_id, product_name, unit_price, quantity)
  select
    new_order_id,
    item->>'product_name',
    (item->>'unit_price')::integer,
    (item->>'quantity')::integer
  from jsonb_array_elements(p_items) as item;

  return new_order_id;
end;
$$;

grant execute on function public.create_order(text, text, text, text, text, integer, jsonb) to anon, authenticated;

notify pgrst, 'reload schema';
