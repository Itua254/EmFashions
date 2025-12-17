import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    created_at: string;
    category?: string;
    description?: string;
    variants: { color: string; image: string }[];
    subcategory?: string;
    original_price?: number;
    rating?: number;
    reviews_count?: number;
}
