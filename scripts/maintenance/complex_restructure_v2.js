const fs = require('fs');
const mockPath = '/Users/m-techcomputerske/Desktop/em-fashions/lib/mock-products.ts';

let content = fs.readFileSync(mockPath, 'utf8');
const match = content.match(/export const MOCK_PRODUCTS: Product\[\] = (\[[\s\S]*\]);/);
if (!match) { console.error("Could not find MOCK_PRODUCTS array"); process.exit(1); }
let products = JSON.parse(match[1]);

// 1. Merge 12 and 11, also 11 to MEN'S 2-IN-1 ATHLETIC SHORTS (Item 28)
const p11 = products.find(p => p.id === 'prod-11');
const p12 = products.find(p => p.id === 'prod-12');
const p28 = products.find(p => p.id === 'prod-28');

if (p28) {
    if (p11) {
        // Add all variants from 11 to 28
        p28.variants.push(...p11.variants);
    }
    if (p12) {
        // Add all variants from 12 to 28
        p28.variants.push(...p12.variants);
    }
    // Remove 11 and 12
    products = products.filter(p => p.id !== 'prod-11' && p.id !== 'prod-12');
}

// 2. In 14 remove navy and merge it to 24 and put it as separate item I.e item 30
const p14 = products.find(p => p.id === 'prod-14');
const p24 = products.find(p => p.id === 'prod-24');

// Create Item 30
// Logic: Item 30 gets 14-Navy + All of 24.
// 14 loses Navy. 24 is removed (merged into 30).
let item30Variants = [];

if (p14) {
    const navyIdx = p14.variants.findIndex(v => v.color.toLowerCase() === 'navy');
    if (navyIdx !== -1) {
        item30Variants.push(p14.variants[navyIdx]);
        p14.variants.splice(navyIdx, 1); // Remove from 14
    }
}

if (p24) {
    item30Variants.push(...p24.variants);
    // Remove 24 from main list
    products = products.filter(p => p.id !== 'prod-24');
}

if (item30Variants.length > 0) {
    // Determine base props (use 24's name/price or generic)
    const base = p24 || { name: "Fashion Item 30", price: 3500, category: 'Shoes', subcategory: 'Heels', description: 'New combined item' };

    products.push({
        ...base,
        id: 'prod-30',
        name: "Fashion Item 30",
        image_url: item30Variants[0].image,
        variants: item30Variants
    });
}

// 3. In 18 remove navy
const p18 = products.find(p => p.id === 'prod-18');
if (p18) {
    p18.variants = p18.variants.filter(v => v.color.toLowerCase() !== 'navy');
}

// 4. Merge 20 and 22
// Assuming Merge 20 INTO 22.
const p20 = products.find(p => p.id === 'prod-20');
const p22 = products.find(p => p.id === 'prod-22');

if (p20 && p22) {
    p22.variants.push(...p20.variants);
    products = products.filter(p => p.id !== 'prod-20');
}

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;
fs.writeFileSync(mockPath, newContent);
console.log('Restructure V2 complete.');
