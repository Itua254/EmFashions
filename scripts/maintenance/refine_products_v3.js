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

// 1. Remove 29-34
const toRemove = ['prod-29', 'prod-30', 'prod-31', 'prod-32', 'prod-33', 'prod-34'];
products = products.filter(p => !toRemove.includes(p.id));

// 2. Rename 2
const p2 = products.find(p => p.id === 'prod-2');
if (p2) {
    p2.name = "Quality Gym Pants";
    p2.price = 2000;
    p2.subcategory = "Pants";
    p2.description = "Premium quality gym pants designed for intense workouts.";
}

// 3. Rename 7
const p7 = products.find(p => p.id === 'prod-7');
if (p7) {
    p7.name = "Men Gym Vest";
    p7.price = 1500;
    p7.subcategory = "Tops";
    p7.description = "Comfortable and breathable gym vest for men.";
}

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync(mockPath, newContent);
console.log('Updated catalog: Removed 29-34, updated 2 & 7.');
