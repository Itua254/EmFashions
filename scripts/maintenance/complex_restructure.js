const fs = require('fs');
const mockPath = '/Users/m-techcomputerske/Desktop/em-fashions/lib/mock-products.ts';

// Read file
let content = fs.readFileSync(mockPath, 'utf8');
const match = content.match(/export const MOCK_PRODUCTS: Product\[\] = (\[[\s\S]*\]);/);
if (!match) { console.error("Could not find MOCK_PRODUCTS array"); process.exit(1); }
let products = JSON.parse(match[1]);

// Helper to get next ID
let maxId = 34; // Manually tracking since I know the state
const getNextId = () => {
    maxId++;
    return `prod-${maxId}`;
};

// --- 1. Split Item 15 (Boots) ---
// "Item 15, 20 separate and make each its own item"
const p15 = products.find(p => p.id === 'prod-15');
if (p15) {
    // Keep first variant in p15, others move to new items
    const variantsToMove = p15.variants.slice(1);
    p15.variants = [p15.variants[0]]; // Keep Black

    variantsToMove.forEach(v => {
        const newId = getNextId();
        products.push({
            ...p15,
            id: newId,
            name: `${p15.name} (${v.color})`,
            image_url: v.image,
            variants: [v]
        });
    });
}

// --- 2. Split Item 20 (Heels) ---
const p20 = products.find(p => p.id === 'prod-20');
if (p20) {
    const variantsToMove = p20.variants.slice(1);
    p20.variants = [p20.variants[0]];

    variantsToMove.forEach(v => {
        const newId = getNextId();
        products.push({
            ...p20,
            id: newId,
            name: `${p20.name} (${v.color})`,
            image_url: v.image,
            variants: [v]
        });
    });
}

// --- 3. Merge 18 and 17 ---
// "merge 18 and 17" -> Moving 17 into 18
const p17 = products.find(p => p.id === 'prod-17');
const p18 = products.find(p => p.id === 'prod-18');
if (p17 && p18) {
    p17.variants.forEach(v => {
        p18.variants.push(v);
    });
    // Remove p17
    products = products.filter(p => p.id !== 'prod-17');
}

// --- 4. Separete Item 22 ---
// "separate item 22 the first two... remain... last two... different item"
const p22 = products.find(p => p.id === 'prod-22');
if (p22 && p22.variants.length >= 4) {
    const keep = p22.variants.slice(0, 2); // Black, Navy
    const move = p22.variants.slice(2);    // Maroon, Beige

    p22.variants = keep;

    const newId = getNextId();
    products.push({
        ...p22,
        id: newId,
        name: `${p22.name} (Maroon & Beige)`,
        image_url: move[0].image,
        variants: move
    });
}

// --- 5. Item 24 remove maroon and put as diferent item ---
const p24 = products.find(p => p.id === 'prod-24');
if (p24) {
    const maroonIndex = p24.variants.findIndex(v => v.color.toLowerCase() === 'maroon');
    if (maroonIndex !== -1) {
        const maroonVar = p24.variants[maroonIndex];
        p24.variants.splice(maroonIndex, 1); // Remove from 24

        const newId = getNextId();
        products.push({
            ...p24,
            id: newId,
            name: `${p24.name} (Maroon)`,
            image_url: maroonVar.image,
            variants: [maroonVar]
        });
    }
}

// --- 6. Item 25 remove maroon and merge it with item 19 ---
const p25 = products.find(p => p.id === 'prod-25');
const p19 = products.find(p => p.id === 'prod-19');
if (p25 && p19) {
    const maroonIndex = p25.variants.findIndex(v => v.color.toLowerCase() === 'maroon');
    if (maroonIndex !== -1) {
        const maroonVar = p25.variants[maroonIndex];
        p25.variants.splice(maroonIndex, 1); // Remove from 25
        p19.variants.push(maroonVar);      // Add to 19
    }
}

// --- 7. Item 26 delete maroon ---
const p26 = products.find(p => p.id === 'prod-26');
if (p26) {
    p26.variants = p26.variants.filter(v => v.color.toLowerCase() !== 'maroon');
}

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;
fs.writeFileSync(mockPath, newContent);
console.log('Restructure complete.');
