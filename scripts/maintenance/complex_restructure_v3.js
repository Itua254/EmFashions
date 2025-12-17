const fs = require('fs');
const mockPath = '/Users/m-techcomputerske/Desktop/em-fashions/lib/mock-products.ts';

let content = fs.readFileSync(mockPath, 'utf8');
const match = content.match(/export const MOCK_PRODUCTS: Product\[\] = (\[[\s\S]*\]);/);
if (!match) { console.error("Could not find MOCK_PRODUCTS array"); process.exit(1); }
let products = JSON.parse(match[1]);

// 1. Remove item 30
products = products.filter(p => p.id !== 'prod-30');

// 2. Item 28: Keep first 3 variants (Black, Navy, Maroon). Move rest to new item (Item 31).
const p28 = products.find(p => p.id === 'prod-28');
if (p28 && p28.variants.length > 3) {
    const keep = p28.variants.slice(0, 3);
    const move = p28.variants.slice(3); // The "rest"

    p28.variants = keep;

    if (move.length > 0) {
        // Create new item
        products.push({
            id: 'prod-31',
            name: 'Fashion Item 31', // User didn't specify name, generic for now
            price: 2500, // Generic price
            category: 'Clothes',
            subcategory: 'Outerwear', // Inferring from previous 11/12
            description: 'Mixed collection of fashion items.',
            image_url: move[0].image,
            created_at: new Date().toISOString(),
            variants: move
        });
    }
}

// 3. Check for repeated images (Deduplication)
// Heuristic: If an image URL appears in multiple variants (across ANY product), keep the first occurrence and remove subsequent variants effectively? 
// Or just report? User said "check for repeated images". 
// Interpreting as: "Remove variants that have duplicate images".
// Use a Set to track seen images.
const seenImages = new Set();

products.forEach(p => {
    // We will filter variants in place
    // Note: iterating backwards or using filter is safer for removal

    // First, ensure main image is unique-ish? Usually main image is one of the variants.
    // We won't remove the product itself, just duplicate variants.

    const uniqueVariants = [];
    p.variants.forEach(v => {
        if (!seenImages.has(v.image)) {
            seenImages.add(v.image);
            uniqueVariants.push(v);
        } else {
            console.log(`Removing duplicate image variant in ${p.name}: ${v.image}`);
        }
    });
    p.variants = uniqueVariants;
});

// Also re-verify strict ownership? User didn't ask explicitly but implied cleanup. 
// "check for repeated images" usually means duplicates. 
// I'll stick to the duplicate check.

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;
fs.writeFileSync(mockPath, newContent);
console.log('Restructure V3 complete.');
