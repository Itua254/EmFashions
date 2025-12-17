const fs = require('fs');

const outputPath = '/Users/m-techcomputerske/Desktop/em-fashions/lib/mock-products.ts';

// We'll read the file content I just saw, but since I can't require .ts files easily in node without setup, 
// I'll copy the JSON part from the file I just read.
// Actually, it's safer to read the file, strip the TS parts, parse JSON, modify, and write back.

// Read file
let content = fs.readFileSync(outputPath, 'utf8');

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
    // console.log("Str:", jsonStr.substring(0, 100));
    process.exit(1);
}

// Helper to remove product by ID
const removeProduct = (id) => {
    products = products.filter(p => p.id !== id);
};

// Helper to find product
const findProduct = (id) => products.find(p => p.id === id);

// Merge 2 & 3 (Front/Back)
const p2 = findProduct('prod-2');
const p3 = findProduct('prod-3');
if (p2 && p3) {
    p2.name = "Fashion Item 2 (Front & Back)";
    // clear existing variants and setup explicit front/back
    p2.variants = [
        { color: "Front View", image: p2.image_url },
        { color: "Back View", image: p3.image_url } // Use main image of p3
    ];
    removeProduct('prod-3');
}

// Merge 7 & 8
const p7 = findProduct('prod-7');
const p8 = findProduct('prod-8');
if (p7 && p8) {
    p7.variants.push({ color: "Alternate View", image: p8.image_url });
    removeProduct('prod-8');
}

// Merge 4 & 6
const p4 = findProduct('prod-4');
const p6 = findProduct('prod-6');
if (p4 && p6) {
    // Append all of p6 variants to p4
    p6.variants.forEach((v, i) => {
        p4.variants.push({ color: `Variation ${i + 1} (from Item 6)`, image: v.image });
    });
    removeProduct('prod-6');
}

const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync(outputPath, newContent);
console.log('Updated mock products');
