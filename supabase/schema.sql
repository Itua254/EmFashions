-- EM FASHIONS ULTRA-ROBUST DATABASE SETUP (FIXED)
-- This script will clear and recreate EVERYTHING.
-- Run this in your Supabase SQL Editor.
-- STEP 0: Clean up everything safely using a loop
DO $$
DECLARE pol RECORD;
BEGIN -- Drop Policies for the relevant tables
FOR pol IN
SELECT policyname,
    tablename,
    schemaname
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN (
        'profiles',
        'products',
        'categories',
        'orders',
        'order_items'
    ) LOOP EXECUTE format(
        'DROP POLICY IF EXISTS %I ON %I.%I',
        pol.policyname,
        pol.schemaname,
        pol.tablename
    );
END LOOP;
-- Drop Tables
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
END $$;
-- STEP 1: Profiles Table
CREATE TABLE public.profiles (
    id uuid references auth.users not null primary key,
    updated_at timestamp with time zone,
    full_name text,
    avatar_url text
);
-- STEP 2: Categories Table
CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- STEP 3: Products Table
CREATE TABLE public.products (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric NOT NULL CHECK (price >= 0),
    original_price numeric CHECK (original_price >= 0),
    category text,
    subcategory text,
    image_url text,
    rating numeric DEFAULT 0,
    reviews_count integer DEFAULT 0,
    variants jsonb,
    stock integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- STEP 4: Orders Table
CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid references auth.users,
    status text DEFAULT 'pending',
    total numeric NOT NULL,
    shipping_address jsonb,
    payment_intent_id text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- STEP 5: Order Items Table
CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid references public.orders(id) ON DELETE CASCADE,
    product_id text references public.products(id),
    quantity integer NOT NULL CHECK (quantity > 0),
    price_at_purchase numeric NOT NULL,
    variant_color text
);
-- STEP 6: Storage Buckets (Public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true),
    ('avatars', 'avatars', true) ON CONFLICT (id) DO
UPDATE
SET public = true;
-- STEP 7: RLS Setup
-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR
SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR
INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR
UPDATE USING (auth.uid() = id);
-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR
SELECT USING (true);
-- Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR
SELECT USING (true);
-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Storage (Simple public read policies)
-- The Seeding script uses Service Role Key, so it doesn't need upload policies here.
CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR
SELECT USING (bucket_id = 'products');
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR
SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated can upload avatars" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );