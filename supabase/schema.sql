-- 越金燕 YUA JIN YAN：訂單資料庫
-- 使用方式：Supabase 後台 → SQL Editor → 貼上整份 → Run。可重複執行。

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  created_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  email text not null,
  line_id text not null default '',
  address text not null,
  product_name text not null,
  category text not null default '',
  quantity integer not null check (quantity between 1 and 999),
  option text not null default '',
  preferred_delivery_date date,
  note text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'completed', 'cancelled')),
  admin_note text not null default ''
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- 可以登入後台的帳號
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- 只有後台管理員能看、能改訂單；一般訪客完全讀不到。
drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders" on public.orders
  for select to authenticated using (public.is_admin());

drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- 訂單編號流水號
create sequence if not exists public.order_serial;

-- 客人送出訂單只能透過這個函式：會檢查欄位、產生訂單編號，且無法自訂狀態。
create or replace function public.submit_order(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id text;
  serial bigint;
  qty integer;
begin
  if length(payload::text) > 8000 then
    raise exception 'payload too large';
  end if;

  if coalesce(trim(payload->>'customerName'), '') = ''
    or coalesce(trim(payload->>'phone'), '') = ''
    or coalesce(trim(payload->>'email'), '') = ''
    or coalesce(trim(payload->>'address'), '') = ''
    or coalesce(trim(payload->>'productName'), '') = '' then
    raise exception 'missing required fields';
  end if;

  qty := (payload->>'quantity')::integer;
  if qty is null or qty < 1 or qty > 999 then
    raise exception 'invalid quantity';
  end if;

  serial := nextval('public.order_serial');
  new_id := 'YJY-' || to_char(now() at time zone 'Asia/Taipei', 'YYYYMMDD') || '-'
    || lpad(serial::text, greatest(4, length(serial::text)), '0');

  insert into public.orders (
    order_id, customer_name, phone, email, line_id, address,
    product_name, category, quantity, option, preferred_delivery_date, note
  ) values (
    new_id,
    left(trim(payload->>'customerName'), 100),
    left(trim(payload->>'phone'), 40),
    left(trim(payload->>'email'), 200),
    left(coalesce(trim(payload->>'lineId'), ''), 100),
    left(trim(payload->>'address'), 300),
    left(trim(payload->>'productName'), 200),
    left(coalesce(payload->>'category', ''), 50),
    qty,
    left(coalesce(payload->>'option', ''), 200),
    nullif(payload->>'preferredDeliveryDate', '')::date,
    left(coalesce(payload->>'note', ''), 1000)
  );

  return new_id;
end;
$$;

revoke all on function public.submit_order(jsonb) from public;
grant execute on function public.submit_order(jsonb) to anon, authenticated;

-- 權限：訪客（anon）不能直接碰訂單表，只能呼叫 submit_order。
revoke all on public.orders from anon;
revoke all on public.admins from anon;
grant select, update on public.orders to authenticated;
grant select on public.admins to authenticated;

-- ────────────────────────────────────────────────
-- 設定後台管理員（在 Authentication → Users 建好帳號後執行，Email 換成該帳號）：
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'yuejinyan.official@gmail.com'
-- on conflict do nothing;
-- ────────────────────────────────────────────────
