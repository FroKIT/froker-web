-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  phone text unique not null,
  name text,
  gender text check (gender in ('male', 'female', 'other')),
  dob date,
  avatar_url text,
  is_onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- HEALTH PROFILES
-- ============================================================
create table public.health_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade unique not null,
  allergies text[] default '{}',
  health_conditions text[] default '{}',
  dietary_preference text default 'omnivore' check (
    dietary_preference in ('omnivore', 'vegetarian', 'vegan', 'keto', 'paleo', 'halal')
  ),
  disliked_ingredients text[] default '{}',
  goal text default 'maintenance' check (
    goal in ('weight_loss', 'muscle_gain', 'maintenance', 'medical')
  ),
  height_cm numeric,
  weight_kg numeric,
  activity_level text check (
    activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')
  ),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PACKAGES
-- ============================================================
create table public.packages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  meals_per_day int not null check (meals_per_day between 1 and 4),
  duration_days int not null,
  price_inr numeric not null,
  features text[] default '{}',
  is_popular boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  package_id uuid references public.packages(id) not null,
  status text default 'active' check (status in ('active', 'paused', 'cancelled')),
  start_date date not null,
  end_date date not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  paused_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ADDRESSES
-- ============================================================
create table public.addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  label text default 'Home',
  line1 text not null,
  line2 text,
  landmark text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- DELIVERY SLOTS
-- ============================================================
create table public.delivery_slots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  slot_label text not null,
  time_start time not null,
  time_end time not null,
  created_at timestamptz default now(),
  unique(user_id, meal_type)
);

-- ============================================================
-- MEALS (master menu)
-- ============================================================
create table public.meals (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  image_url text,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  cuisine text default 'Indian',
  tags text[] default '{}',
  allergens text[] default '{}',
  ingredients text[] default '{}',
  calories int not null,
  protein_g numeric not null,
  carbs_g numeric not null,
  fat_g numeric not null,
  fiber_g numeric default 0,
  is_vegetarian boolean default false,
  is_vegan boolean default false,
  is_gluten_free boolean default false,
  is_available boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- MEAL PLANS (user's scheduled meals)
-- ============================================================
create table public.meal_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  meal_id uuid references public.meals(id) not null,
  scheduled_date date not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  is_skipped boolean default false,
  portion_size text default 'regular' check (portion_size in ('half', 'regular', 'large')),
  custom_notes text,
  skip_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, scheduled_date, meal_type)
);

-- ============================================================
-- MEAL RATINGS
-- ============================================================
create table public.meal_ratings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  meal_id uuid references public.meals(id) not null,
  meal_plan_id uuid references public.meal_plans(id),
  rating int check (rating between 1 and 5) not null,
  tags text[] default '{}',
  comment text,
  never_again boolean default false,
  created_at timestamptz default now(),
  unique(user_id, meal_plan_id)
);

-- ============================================================
-- MEAL SWAP LOG
-- ============================================================
create table public.meal_swaps (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  meal_plan_id uuid references public.meal_plans(id) not null,
  original_meal_id uuid references public.meals(id) not null,
  new_meal_id uuid references public.meals(id) not null,
  swapped_at timestamptz default now()
);

-- ============================================================
-- AI CHAT HISTORY
-- ============================================================
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  audio_url text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.users enable row level security;
alter table public.health_profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.addresses enable row level security;
alter table public.delivery_slots enable row level security;
alter table public.meal_plans enable row level security;
alter table public.meal_ratings enable row level security;
alter table public.meal_swaps enable row level security;
alter table public.chat_messages enable row level security;

-- packages and meals are public read
alter table public.packages enable row level security;
alter table public.meals enable row level security;

-- Users: own row only
create policy "users_own" on public.users for all using (auth.uid() = id);

-- Health profiles: own row only
create policy "health_own" on public.health_profiles for all using (auth.uid() = user_id);

-- Subscriptions: own rows only
create policy "subscriptions_own" on public.subscriptions for all using (auth.uid() = user_id);

-- Addresses: own rows only
create policy "addresses_own" on public.addresses for all using (auth.uid() = user_id);

-- Delivery slots: own rows only
create policy "slots_own" on public.delivery_slots for all using (auth.uid() = user_id);

-- Meal plans: own rows only
create policy "meal_plans_own" on public.meal_plans for all using (auth.uid() = user_id);

-- Meal ratings: own rows only
create policy "ratings_own" on public.meal_ratings for all using (auth.uid() = user_id);

-- Meal swaps: own rows only
create policy "swaps_own" on public.meal_swaps for all using (auth.uid() = user_id);

-- Chat messages: own rows only
create policy "chat_own" on public.chat_messages for all using (auth.uid() = user_id);

-- Packages: anyone can read active packages
create policy "packages_read" on public.packages for select using (is_active = true);

-- Meals: anyone authenticated can read available meals
create policy "meals_read" on public.meals for select using (is_available = true);

-- ============================================================
-- TRIGGERS: updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users
  for each row execute function update_updated_at();

create trigger health_updated_at before update on public.health_profiles
  for each row execute function update_updated_at();

create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function update_updated_at();

create trigger meal_plans_updated_at before update on public.meal_plans
  for each row execute function update_updated_at();

-- ============================================================
-- FUNCTION: auto-create user row on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, phone)
  values (new.id, new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
