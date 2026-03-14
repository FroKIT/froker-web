-- Migration: Remove foreign key constraint from users.id to auth.users(id)
-- This is required because we are replacing Supabase Auth with a custom JWT system.
-- Users are now created directly with crypto.randomUUID() — no corresponding auth.users row exists.
-- Run this in the Supabase SQL editor or via supabase db push before deploying the new auth system.

ALTER TABLE public.users DROP CONSTRAINT users_id_fkey;
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();
