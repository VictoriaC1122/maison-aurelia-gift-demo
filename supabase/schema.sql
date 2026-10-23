-- 越金燕 YUA JIN YAN：訂單資料庫（v2：購物車、配送、付款、訂單查詢）
-- 使用方式：Supabase 後台 → SQL Editor → 貼上整份 → Run。可重複執行，不會刪除既有訂單。

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

-- v2 欄位
alter table public.orders add column if not exists items jsonb not null default '[]'::jsonb;
alter table public.orders add column if not exists delivery_method text not null default 'home';
alter table public.orders add column if not exists delivery jsonb not null default '{}'::jsonb;
alter table public.orders add column if not exists payment_method text not null default 'bank_transfer';
alter table public.orders add column if not exists payment_status text not null default 'unpaid';
alter table public.orders add column if not exists payment_last5 text not null default '';
alter table public.orders add column if not exists quoted_total integer;
alter table public.orders add column if not exists tracking_number text not null default '';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'orders_delivery_method_check') then
    alter table public.orders add constraint orders_delivery_method_check
      check (delivery_method in ('home', 'cvs_711', 'cvs_family'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'orders_payment_method_check') then
    alter table public.orders add constraint orders_payment_method_check
      check (payment_method in ('bank_transfer', 'cod'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'orders_payment_status_check') then
    alter table public.orders add constraint orders_payment_status_check
      check (payment_status in ('unpaid', 'reported', 'paid', 'refunded'));
  end if;
end $$;

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
  raw_items jsonb;
  clean_items jsonb;
  item_summary text;
  d_method text;
  p_method text;
  d jsonb;
  clean_delivery jsonb;
  full_address text;
begin
  if length(payload::text) > 12000 then
    raise exception 'payload too large';
  end if;

  if coalesce(trim(payload->>'customerName'), '') = ''
    or coalesce(trim(payload->>'phone'), '') = ''
    or coalesce(trim(payload->>'email'), '') = '' then
    raise exception 'missing required fields';
  end if;

  -- 商品明細
  raw_items := coalesce(payload->'items', '[]'::jsonb);
  if jsonb_typeof(raw_items) <> 'array' or jsonb_array_length(raw_items) > 30 then
    raise exception 'invalid items';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
      'slug', left(coalesce(e->>'slug', ''), 80),
      'name', left(coalesce(e->>'name', ''), 200),
      'spec', left(coalesce(e->>'spec', ''), 100),
      'quantity', greatest(1, least(999, (e->>'quantity')::integer)),
      'unitPrice', case when coalesce(e->>'unitPrice', '') ~ '^[0-9]{1,7}$' then (e->>'unitPrice')::integer else null end
    )), '[]'::jsonb)
    into clean_items
    from jsonb_array_elements(raw_items) e;

  if jsonb_array_length(clean_items) > 0 then
    select coalesce(sum((e->>'quantity')::integer), 0),
           string_agg((e->>'name') || ' x' || (e->>'quantity'), '、')
      into qty, item_summary
      from jsonb_array_elements(clean_items) e;
  else
    -- 相容舊版單一商品表單
    qty := (payload->>'quantity')::integer;
    item_summary := trim(payload->>'productName');
  end if;

  if coalesce(item_summary, '') = '' then
    raise exception 'missing items';
  end if;
  if qty is null or qty < 1 or qty > 999 then
    raise exception 'invalid quantity';
  end if;

  -- 配送
  d_method := coalesce(nullif(payload->>'deliveryMethod', ''), 'home');
  if d_method not in ('home', 'cvs_711', 'cvs_family') then
    raise exception 'invalid delivery method';
  end if;
  d := coalesce(payload->'delivery', '{}'::jsonb);

  if d_method = 'home' then
    clean_delivery := jsonb_build_object(
      'zip', left(coalesce(d->>'zip', ''), 6),
      'city', left(coalesce(d->>'city', ''), 10),
      'district', left(coalesce(d->>'district', ''), 10),
      'detail', left(coalesce(trim(d->>'detail'), ''), 200)
    );
    full_address := trim(concat_ws(' ', nullif(clean_delivery->>'zip', ''),
      (clean_delivery->>'city') || (clean_delivery->>'district') || (clean_delivery->>'detail')));
    if coalesce(clean_delivery->>'detail', '') = '' then
      full_address := left(coalesce(trim(payload->>'address'), ''), 300);
    end if;
  else
    clean_delivery := jsonb_build_object(
      'storeId', left(coalesce(trim(d->>'storeId'), ''), 12),
      'storeName', left(coalesce(trim(d->>'storeName'), ''), 60)
    );
    if clean_delivery->>'storeId' = '' or clean_delivery->>'storeName' = '' then
      raise exception 'missing store';
    end if;
    full_address := case when d_method = 'cvs_711' then '7-ELEVEN ' else '全家 ' end
      || (clean_delivery->>'storeName') || '門市（店號 ' || (clean_delivery->>'storeId') || '）';
  end if;

  if coalesce(full_address, '') = '' then
    raise exception 'missing address';
  end if;

  -- 付款
  p_method := coalesce(nullif(payload->>'paymentMethod', ''), 'bank_transfer');
  if p_method not in ('bank_transfer', 'cod') then
    raise exception 'invalid payment method';
  end if;

  serial := nextval('public.order_serial');
  new_id := 'YJY-' || to_char(now() at time zone 'Asia/Taipei', 'YYYYMMDD') || '-'
    || lpad(serial::text, greatest(4, length(serial::text)), '0');

  insert into public.orders (
    order_id, customer_name, phone, email, line_id, address,
    product_name, category, quantity, option, preferred_delivery_date, note,
    items, delivery_method, delivery, payment_method
  ) values (
    new_id,
    left(trim(payload->>'customerName'), 100),
    left(trim(payload->>'phone'), 40),
    left(trim(payload->>'email'), 200),
    left(coalesce(trim(payload->>'lineId'), ''), 100),
    left(full_address, 300),
    left(item_summary, 500),
    left(coalesce(payload->>'category', ''), 50),
    qty,
    left(coalesce(payload->>'option', ''), 200),
    nullif(payload->>'preferredDeliveryDate', '')::date,
    left(coalesce(payload->>'note', ''), 1000),
    clean_items,
    d_method,
    clean_delivery,
    p_method
  );

  return new_id;
end;
$$;

revoke all on function public.submit_order(jsonb) from public;
grant execute on function public.submit_order(jsonb) to anon, authenticated;

-- 訂單查詢：需同時輸入訂單編號與下單手機，只回傳進度，不回傳姓名與地址。
create or replace function public.normalize_phone(value text)
returns text
language sql
immutable
as $$
  select regexp_replace(coalesce(value, ''), '[^0-9]', '', 'g');
$$;

create or replace function public.track_order(p_order_id text, p_phone text)
returns table (
  order_id text,
  created_at timestamptz,
  status text,
  product_name text,
  quantity integer,
  items jsonb,
  delivery_method text,
  payment_method text,
  payment_status text,
  payment_last5 text,
  quoted_total integer,
  tracking_number text,
  preferred_delivery_date date
)
language sql
stable
security definer
set search_path = public
as $$
  select o.order_id, o.created_at, o.status, o.product_name, o.quantity, o.items,
         o.delivery_method, o.payment_method, o.payment_status, o.payment_last5,
         o.quoted_total, o.tracking_number, o.preferred_delivery_date
    from public.orders o
   where o.order_id = upper(trim(p_order_id))
     and length(public.normalize_phone(p_phone)) >= 8
     and public.normalize_phone(o.phone) = public.normalize_phone(p_phone)
   limit 1;
$$;

revoke all on function public.track_order(text, text) from public;
grant execute on function public.track_order(text, text) to anon, authenticated;

-- 匯款回報：客人輸入帳號後五碼，訂單付款狀態改為「已回報」，由後台確認入帳。
create or replace function public.report_payment(p_order_id text, p_phone text, p_last5 text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer;
begin
  if p_last5 !~ '^[0-9]{5}$' then
    raise exception 'invalid last5';
  end if;

  update public.orders o
     set payment_last5 = p_last5,
         payment_status = 'reported'
   where o.order_id = upper(trim(p_order_id))
     and length(public.normalize_phone(p_phone)) >= 8
     and public.normalize_phone(o.phone) = public.normalize_phone(p_phone)
     and o.payment_method = 'bank_transfer'
     and o.payment_status in ('unpaid', 'reported')
     and o.status <> 'cancelled';

  get diagnostics affected = row_count;
  return affected > 0;
end;
$$;

revoke all on function public.report_payment(text, text, text) from public;
grant execute on function public.report_payment(text, text, text) to anon, authenticated;

-- 權限：訪客（anon）不能直接碰訂單表，只能呼叫上面三個函式。
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
