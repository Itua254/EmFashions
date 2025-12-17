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

const shoeSub = ['Heels', 'Sandals', 'Sneakers', 'Boots'];
const clothesSub = ['Dresses', 'Tops', 'Pants', 'Outerwear'];

products.forEach((p, index) => {
    const idNum = parseInt(p.id.replace('prod-', ''));

    // Logic: Shoes 13-26 and 1
    const isShoe = (idNum === 1) || (idNum >= 13 && idNum <= 26);

    if (isShoe) {
        p.category = 'Shoes';
        p.subcategory = shoeSub[index % shoeSub.length];
        p.description = `Stylish ${p.subcategory.toLowerCase()} designed for comfort and elegance.`;
    } else {
        p.category = 'Clothes';
        p.subcategory = clothesSub[index % clothesSub.length];
        p.description = `A fashionable ${p.subcategory.toLowerCase().slice(0, -1)} to elevate your wardrobe.`;
    }
});

// Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync(mockPath, newContent);
console.log('Fixed categories: 13-26 & 1 are Shoes, rest are Clothes.');
