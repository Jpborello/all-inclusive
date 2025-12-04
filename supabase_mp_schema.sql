-- Enable RLS
create table if not exists public.mp_credentials (
  user_id uuid references auth.users(id) on delete cascade primary key,
  access_token text not null,
  refresh_token text not null,
  public_key text not null,
  live_mode boolean default false,
  user_mp_id text,
  date_created timestamptz default now(),
  date_expires timestamptz
);

alter table public.mp_credentials enable row level security;

create policy "Users can view their own credentials"
  on public.mp_credentials for select
  using (auth.uid() = user_id);

create policy "Users can update their own credentials"
  on public.mp_credentials for update
  using (auth.uid() = user_id);

create policy "Users can delete their own credentials"
  on public.mp_credentials for delete
  using (auth.uid() = user_id);

-- Service role has full access (implicit, but good to know)

create table if not exists public.mp_payments (
  payment_id text primary key,
  status text not null,
  status_detail text,
  payer_email text,
  amount numeric,
  order_id text,
  merchant_order_id text,
  preference_id text,
  user_id uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.mp_payments enable row level security;

create policy "Users can view their own payments"
  on public.mp_payments for select
  using (auth.uid() = user_id);

-- Only service role (webhook) should insert/update payments generally, 
-- but we might allow users to read.
