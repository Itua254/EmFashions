
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { MOCK_PRODUCTS } from '../lib/mock-products';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Environment Variables (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function uploadImage(localPath: string, fileName: string): Promise<string | null> {
    try {
        // Remove leading slash if present
        const cleanPath = localPath.startsWith('/') ? localPath.substring(1) : localPath;
        const fullLocalPath = path.join(process.cwd(), 'public', cleanPath);

        if (!fs.existsSync(fullLocalPath)) {
            console.warn(`File not found: ${fullLocalPath}`);
            return null;
        }

        const fileBuffer = fs.readFileSync(fullLocalPath);
        const { data, error } = await supabase.storage
            .from('products')
            .upload(fileName, fileBuffer, {
                contentType: 'image/jpeg',
                upsert: true
            });

        if (error) {
            throw error;
        }

        const { data: publicData } = supabase.storage.from('products').getPublicUrl(fileName);
        return publicData.publicUrl;
    } catch (err) {
        console.error(`Error uploading ${fileName}:`, err);
        return null;
    }
}

async function seedDatabase() {
    console.log('🌱 Starting Database Seed...');

    // 1. Seed Categories (Extract from products)
    const categories = new Set(MOCK_PRODUCTS.map(p => p.category));
    for (const cat of categories) {
        if (!cat) continue;
        const { error } = await supabase.from('categories').upsert({
            name: cat,
            slug: cat.toLowerCase().replace(/ /g, '-'),
        }, { onConflict: 'name' });

        if (error) console.error(`Error seeding category ${cat}:`, error);
    }
    console.log('✅ Categories seeded');

    // 2. Seed Products
    for (const product of MOCK_PRODUCTS) {
        let mainImageUrl = product.image_url;

        // Upload Main Image
        if (product.image_url) {
            const fileName = `${product.id}-main.jpg`;
            const uploadedUrl = await uploadImage(product.image_url, fileName);
            if (uploadedUrl) mainImageUrl = uploadedUrl;
        }

        // Process Variants
        const processedVariants = [];
        if (product.variants) {
            for (let i = 0; i < product.variants.length; i++) {
                const variant = product.variants[i];
                let variantUrl = variant.image;
                const variantFileName = `${product.id}-var-${i}.jpg`;

                if (variant.image) {
                    const uploaded = await uploadImage(variant.image, variantFileName);
                    if (uploaded) variantUrl = uploaded;
                }
                processedVariants.push({ ...variant, image: variantUrl });
            }
        }

        const { error } = await supabase.from('products').upsert({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            original_price: product.original_price,
            category: product.category,
            subcategory: product.subcategory,
            image_url: mainImageUrl,
            rating: product.rating,
            reviews_count: product.reviews_count,
            variants: processedVariants
        });

        if (error) {
            console.error(`❌ Failed to seed product ${product.id}:`, error.message);
        } else {
            console.log(`✅ Seeded: ${product.name}`);
        }
    }

    console.log('🎉 Seeding Complete!');
}

seedDatabase().catch(console.error);
