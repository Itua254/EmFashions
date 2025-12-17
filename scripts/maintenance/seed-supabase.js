const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually since we don't have dotenv
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '..', '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const envVars = {};
            envContent.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                    envVars[key] = value;
                }
            });
            return envVars;
        }
    } catch (e) {
        console.error("Error loading .env.local:", e);
    }
    return {};
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Error: Missing Supabase URL or Key in .env.local");
    process.exit(1);
}

// Warn if using anon key
if (!env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY not found. Using Anon key. This operation will likely fail if RLS is enabled and policies don't allow public inserts.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("Reading mock products...");
    const mockPath = path.join(__dirname, '..', 'lib', 'mock-products.ts');

    try {
        const content = fs.readFileSync(mockPath, 'utf8');
        const match = content.match(/export const MOCK_PRODUCTS: Product\[\] = (\[[\s\S]*\]);/);

        if (!match) {
            console.error("Could not find MOCK_PRODUCTS array in file.");
            process.exit(1);
        }

        // Parse JSON - need to be careful about trailing commas if JSON.parse is strict, 
        // but the previous writes seemed to use JSON.stringify so it should be valid JSON.
        // However, typescript file might have comments or other things. 
        // The regex captures the array part.
        const productsParams = JSON.parse(match[1]);

        console.log(`Found ${productsParams.length} products to seed.`);

        // Prepare data for insertion - mapping fields to match DB schema if needed
        // DB Schema: id, name, price, image_url, created_at, category? 
        // The schema in supabase-schema.sql shows: id, name, price, image_url, created_at.
        // It does NOT show 'variants', 'subcategory', 'original_price', 'rating', 'reviews_count' in the CREATE TABLE statement in the sql file I read.
        // Wait, I should check if the table has those columns. The SQL I read was:
        /*
         CREATE TABLE IF NOT EXISTS products (
             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
             name TEXT NOT NULL,
             price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
             image_url TEXT,
             created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
         );
        */
        // If the table doesn't have the other columns, insertion might fail or those fields will be ignored depending on how Supabase handles it (usually standard SQL errors for unknown columns).
        // However, the user might have added them in the dashboard.
        // I'll try to insert everything. If it fails, I might need to filter fields.

        const { data, error } = await supabase
            .from('products')
            .upsert(productsParams, { onConflict: 'id' });

        if (error) {
            console.error("Error seeding products:", error);
            process.exit(1);
        }

        console.log("Successfully seeded products to Supabase!");

    } catch (e) {
        console.error("Unexpected error:", e);
        process.exit(1);
    }
}

seed();
