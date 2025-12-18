
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

async function checkSchema() {
    const { data: columns, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching from products:', error);
    } else {
        console.log('Successfully fetched sample row from products.');
        console.log('Columns found:', Object.keys(columns[0] || {}));
    }

    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .limit(1);

    if (catError) {
        console.error('Error fetching from categories:', catError.message);
    } else {
        console.log('Categories table exists.');
    }
}

checkSchema().catch(console.error);
