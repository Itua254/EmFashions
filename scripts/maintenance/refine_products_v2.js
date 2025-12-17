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

// Helper
const findProduct = (id) => products.find(p => p.id === id);
const removeProduct = (id) => {
    products = products.filter(p => p.id !== id);
};

// 1. Move 4 into 7
const p4 = findProduct('prod-4');
const p7 = findProduct('prod-7');

if (p4 && p7) {
    console.log(`Merging ${p4.variants.length} variants from prod-4 to prod-7`);

    // Check if variants are already there to avoid dupes (simple check)
    p4.variants.forEach(v => {
        // Create a descriptive color name if coming from merge
        const newColor = v.color.includes('Variation') ? v.color : `${v.color} (from Item 4)`;
        p7.variants.push({
            color: newColor,
            image: v.image
        });
    });

    // Remove p4
    removeProduct('prod-4');
} else {
    console.log("Prod-4 or Prod-7 not found, skipping merge.");
}

// 2. Rename 28
const p28 = findProduct('prod-28');
if (p28) {
    console.log("Updating prod-28");
    p28.name = "Men's 2-in-1 Athletic Shorts";
    p28.price = 200;
    p28.category = "Clothes"; // Ensure Correct Category
    p28.subcategory = "Pants"; // Closest match
    p28.description = "High-performance athletic shorts with built-in compression liner.";
} else {
    console.log("Prod-28 not found.");
}

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync(mockPath, newContent);
console.log('Refined product data.');
