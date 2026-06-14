-- Items catalog
create table public.items (
  id text primary key,
  name text not null,
  tier smallint not null default 0,
  enchantment smallint not null default 0,
  category text not null default '',
  subcategory text not null default ''
);

-- Price snapshots
create table public.prices (
  id bigint generated always as identity primary key,
  item_id text not null references public.items(id) on delete cascade,
  city text not null,
  sell_price_min bigint not null default 0,
  sell_price_max bigint not null default 0,
  buy_price_min bigint not null default 0,
  buy_price_max bigint not null default 0,
  sell_order_count int not null default 0,
  buy_order_count int not null default 0,
  fetched_at timestamptz not null default now()
);

create index idx_prices_item_city on public.prices(item_id, city);
create index idx_prices_fetched_at on public.prices(fetched_at desc);
create index idx_prices_item_fetched on public.prices(item_id, fetched_at desc);

-- Flip opportunities
create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('city', 'time', 'craft')),
  buy_item_id text not null references public.items(id) on delete cascade,
  buy_city text not null,
  buy_price bigint not null,
  sell_city text not null,
  sell_price bigint not null,
  margin_raw bigint not null,
  margin_net bigint not null,
  margin_pct numeric(6,2) not null,
  volume int not null default 0,
  risk_score numeric(3,2) not null default 0,
  status text not null default 'active' check (status in ('active', 'expired')),
  detected_at timestamptz not null default now(),
  expired_at timestamptz
);

create index idx_opportunities_status on public.opportunities(status) where status = 'active';
create index idx_opportunities_detected on public.opportunities(detected_at desc);

-- Craft recipes
create table public.craft_recipes (
  item_id text primary key references public.items(id) on delete cascade,
  ingredients jsonb not null default '[]',
  focus_cost int not null default 0,
  crafting_station text not null default ''
);

-- Island configuration
create table public.island_config (
  id uuid primary key default gen_random_uuid(),
  island_tier smallint not null default 1,
  plots jsonb not null default '[]',
  buildings jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

-- Watchlist
create table public.watchlist (
  id uuid primary key default gen_random_uuid(),
  item_id text not null references public.items(id) on delete cascade,
  min_margin_threshold numeric(6,2) not null default 10,
  notify boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index idx_watchlist_item on public.watchlist(item_id);

-- User settings
create table public.settings (
  id uuid primary key default gen_random_uuid(),
  player_name text not null default '',
  notification_threshold numeric(6,2) not null default 10,
  preferred_cities text[] not null default array['Bridgewatch','Fort Sterling','Lymhurst','Martlock','Thetford','Caerleon']::text[],
  premium_expiry_date date
);

-- Financial transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  item_id text references public.items(id) on delete set null,
  type text not null check (type in ('buy', 'sell')),
  city text not null,
  price bigint not null,
  quantity int not null default 1,
  total bigint not null,
  notes text,
  created_at timestamptz not null default now()
);

create index idx_transactions_created on public.transactions(created_at desc);
create index idx_transactions_type on public.transactions(type, created_at desc);

-- Enable Realtime for opportunities
alter publication supabase_realtime add table public.opportunities;

-- RLS policies (single user app, allow all)
alter table public.items enable row level security;
alter table public.prices enable row level security;
alter table public.opportunities enable row level security;
alter table public.craft_recipes enable row level security;
alter table public.island_config enable row level security;
alter table public.watchlist enable row level security;
alter table public.settings enable row level security;
alter table public.transactions enable row level security;

create policy "Allow all" on public.items for all using (true) with check (true);
create policy "Allow all" on public.prices for all using (true) with check (true);
create policy "Allow all" on public.opportunities for all using (true) with check (true);
create policy "Allow all" on public.craft_recipes for all using (true) with check (true);
create policy "Allow all" on public.island_config for all using (true) with check (true);
create policy "Allow all" on public.watchlist for all using (true) with check (true);
create policy "Allow all" on public.settings for all using (true) with check (true);
create policy "Allow all" on public.transactions for all using (true) with check (true);
