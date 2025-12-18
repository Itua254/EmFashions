import { supabase, Product } from './supabase';

/**
 * Fetch all products from the database
 */
export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data || [];
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }

    return data || [];
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data;
}

/**
 * Fetch featured products (highest rated)
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }

    return data || [];
}

/**
 * Fetch latest products
 */
export async function getLatestProducts(limit: number = 6): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching latest products:', error);
        return [];
    }

    return data || [];
}

/**
 * Search products by name
 */
export async function searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(20);

    if (error) {
        console.error('Error searching products:', error);
        return [];
    }

    return data || [];
}
