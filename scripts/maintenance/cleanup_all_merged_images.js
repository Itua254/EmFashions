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

let totalRemoved = 0;

products.forEach(p => {
    if (!p.variants) return;

    // Strict Rule: Variant image MUST contain the product ID
    // e.g. p.id = 'prod-7', keep images with 'prod-7'
    const originalCount = p.variants.length;

    p.variants = p.variants.filter(v => {
        // Construct the expected segment (e.g., "prod-7-")
        // We use include because the path is like /products/organized/prod-7-variant-1.jpeg
        return v.image.includes(`${p.id}-`);
    });

    const removed = originalCount - p.variants.length;
    if (removed > 0) {
        console.log(`[${p.name}] Removed ${removed} foreign variants.`);
        totalRemoved += removed;
    }
});

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync(mockPath, newContent);
console.log(`Global cleanup complete. Removed ${totalRemoved} variants in total.`);
