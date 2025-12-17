const fs = require('fs');

const mockPath = '/Users/m-techcomputerske/Desktop/em-fashions/lib/mock-products.ts';

// Read file
let content = fs.readFileSync(mockPath, 'utf8');

const match = content.match(/export const MOCK_PRODUCTS: Product\[\] = (\[[\s\S]*\]);/);
if (!match) {
    console.error("Could not find MOCK_PRODUCTS array");
    process.exit(1);
}
const jsonStr = match[1];

let products;
try {
    products = JSON.parse(jsonStr);
} catch (e) {
    console.error("Failed to parse extracted JSON:", e);
    process.exit(1);
}

// Find Item 7 (Men Gym Vest)
const p7 = products.find(p => p.id === 'prod-7');

if (p7) {
    const initialCount = p7.variants.length;
    // Filter out variants from Item 4 and Item 6
    p7.variants = p7.variants.filter(v =>
        !v.color.includes('(from Item 4)') &&
        !v.color.includes('(from Item 6)')
    );
    const finalCount = p7.variants.length;
    console.log(`Removed ${initialCount - finalCount} variants from Men Gym Vest.`);
} else {
    console.log('Men Gym Vest (prod-7) not found.');
}

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync(mockPath, newContent);
console.log('Cleanup complete.');
