create table if not exists merchant (
  id integer primary key,
  business_name text not null default 'Harbor Kape',
  tagline text not null default 'A demo café checkout on PayLink PH',
  city text not null default '',
  gcash_qr text not null default '',
  maya_qr text not null default '',
  qrph_qr text not null default '',
  primary_rail text not null default 'qrph',
  sandbox boolean not null default true,
  publishable_key text not null default '',
  operator_hash text not null default '',
  updated_at timestamptz not null default now(),
  constraint merchant_singleton check (id = 1),
  constraint merchant_rail_chk check (primary_rail in ('gcash', 'maya', 'qrph'))
);

insert into merchant (id) values (1) on conflict (id) do nothing;

create table if not exists charges (
  id text primary key,
  amount_centavos integer not null,
  description text not null,
  reference text not null unique,
  status text not null default 'pending',
  source text not null default 'api',
  return_url text not null default '',
  created_at timestamptz not null default now(),
  claimed_at timestamptz,
  paid_at timestamptz,
  expires_at timestamptz not null,
  constraint charges_amount_chk check (amount_centavos >= 100 and amount_centavos <= 5000000),
  constraint charges_status_chk check (status in ('pending', 'claimed', 'paid', 'expired', 'cancelled'))
);

create index if not exists charges_created_idx on charges (created_at desc);
