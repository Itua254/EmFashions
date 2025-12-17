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

// Logic to assign categories
// We will simply loop through and assign them in a round-robin or patterned fashion
// since we don't have image analysis.

const categories = [
    { name: 'Clothes', subs: ['Dresses', 'Tops', 'Pants', 'Outerwear'] },
    { name: 'Shoes', subs: ['Heels', 'Sandals', 'Sneakers', 'Boots'] },
    { name: 'Bags', subs: ['Handbags', 'Clutches', 'Totes'] }
];

products.forEach((p, index) => {
    // Determine category based on index to ensure even distribution
    const catIndex = index % categories.length;
    const cat = categories[catIndex];

    // Determine subcategory
    const subIndex = index % cat.subs.length;
    const sub = cat.subs[subIndex];

    p.category = cat.name;
    p.subcategory = sub;

    // Update description to reflect category
    p.description = `A premium ${sub.toLowerCase().slice(0, -1)} from our ${cat.name} collection. ${p.description.split('. ')[1] || ''}`;
});

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync(mockPath, newContent);
console.log('Categorized products');
