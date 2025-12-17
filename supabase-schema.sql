-- Em Fashions Database Schema
-- Run this in your Supabase SQL Editor
-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
-- Set up storage policies for product images
CREATE POLICY "Public Access" ON storage.objects FOR
SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'product-images'
        AND auth.role() = 'authenticated'
    );
CREATE POLICY "Authenticated users can update" ON storage.objects FOR
UPDATE USING (
        bucket_id = 'product-images'
        AND auth.role() = 'authenticated'
    );
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
);
-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- Create policies for products table
CREATE POLICY "Public can view products" ON products FOR
SELECT USING (true);
CREATE POLICY "Authenticated users can insert products" ON products FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update products" ON products FOR
UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');