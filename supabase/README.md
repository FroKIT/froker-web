# Froker — Supabase Setup

## Steps to set up the database

1. Create a new project at https://supabase.com
2. Go to SQL Editor and run `migrations/001_initial_schema.sql`
3. Then run `seed.sql` to populate packages and meals
4. Go to Authentication → Providers → Phone and enable it
   - Use Twilio or any supported provider for OTP
5. Copy your project URL and anon key to `.env.local`

## Environment variables needed

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

## Tables

- users — extends auth.users, stores profile
- health_profiles — allergies, conditions, diet, goals
- packages — subscription tiers
- subscriptions — user's active plan
- addresses — delivery addresses
- delivery_slots — preferred delivery times
- meals — master meal catalogue
- meal_plans — scheduled meals per user per day
- meal_ratings — user feedback
- meal_swaps — audit log of swaps
- chat_messages — AI bot conversation history
