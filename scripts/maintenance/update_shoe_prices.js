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

// Update prices
let count = 0;
products.forEach(p => {
    if (p.category === 'Shoes') {
        p.price = 3500;
        count++;
    }
});

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync(mockPath, newContent);
console.log(`Updated prices for ${count} shoes to 3500.`);
