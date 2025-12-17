const fs = require('fs');
const mockPath = '/Users/m-techcomputerske/Desktop/em-fashions/lib/mock-products.ts';

let content = fs.readFileSync(mockPath, 'utf8');
const match = content.match(/export const MOCK_PRODUCTS: Product\[\] = (\[[\s\S]*\]);/);
if (!match) { console.error("Could not find MOCK_PRODUCTS array"); process.exit(1); }
let products = JSON.parse(match[1]);

// Add fields
products = products.map(p => {
    // Generate original price (20-50% markup)
    const markup = 1.2 + (Math.random() * 0.3);
    const original = Math.round((p.price * markup) / 100) * 100; // Round to nearest 100

    // Generate rating (3.5 to 5.0)
    const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10;

    // Generate reviews (3 to 50)
    const reviews = Math.floor(3 + Math.random() * 47);

    return {
        ...p,
        original_price: original,
        rating: rating,
        reviews_count: reviews
    };
});

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;
fs.writeFileSync(mockPath, newContent);
console.log('Updated mock products with new fields.');
