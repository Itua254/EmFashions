const fs = require('fs');
const mockPath = '/Users/m-techcomputerske/Desktop/em-fashions/lib/mock-products.ts';

// Read file
let content = fs.readFileSync(mockPath, 'utf8');
const match = content.match(/export const MOCK_PRODUCTS: Product\[\] = (\[[\s\S]*\]);/);
if (!match) { console.error("Could not find MOCK_PRODUCTS array"); process.exit(1); }
let products = JSON.parse(match[1]);

// REORDER LOGIC
// 1. Filter out Clothes and Shoes
const clothes = products.filter(p => p.category === 'Clothes');
const shoes = products.filter(p => p.category === 'Shoes');
const others = products.filter(p => p.category !== 'Clothes' && p.category !== 'Shoes');

// 2. Concatenate: Clothes -> Shoes -> Others
// Tip: We can also sort shoes by ID if desired, but user just asked for "Clothes to Shows"
const newOrder = [...clothes, ...shoes, ...others];

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(newOrder, null, 2)};`;

fs.writeFileSync(mockPath, newContent);
console.log(`Reordered products: ${clothes.length} Clothes first, then ${shoes.length} Shoes.`);
