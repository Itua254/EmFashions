const fs = require('fs');
const path = require('path');

const dir = '/Users/m-techcomputerske/Desktop/em-fashions/public/products';
const outputDir = '/Users/m-techcomputerske/Desktop/em-fashions/public/products/organized';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read files
const files = fs.readdirSync(dir).filter(f => f.startsWith('WhatsApp'));

// Group by timestamp regex
// Example: WhatsApp Image 2025-12-16 at 00.48.47 (1).jpeg
const regex = /at (\d{2}\.\d{2}\.\d{2})/;
const groups = {};

files.forEach(file => {
    const match = file.match(regex);
    if (match) {
        const key = match[1];
        if (!groups[key]) groups[key] = [];
        groups[key].push(file);
    } else {
        // Fallback for unique files
        if (!groups['misc']) groups['misc'] = [];
        groups['misc'].push(file);
    }
});

const products = [];
let productCounter = 1;
const colors = ['Black', 'Navy', 'Maroon', 'Beige', 'White', 'Olive'];

Object.keys(groups).forEach(key => {
    const groupFiles = groups[key];
    const productId = `prod-${productCounter}`;
    const basePrice = Math.floor(Math.random() * (5000 - 1500) + 1500); // 1500-5000

    const product = {
        id: productId,
        name: `Fashion Item ${productCounter}`,
        price: basePrice,
        category: 'Women', // Assuming majority
        description: `Experience the perfect blend of style and comfort with our Fashion Item ${productCounter}. Designed for the modern wardrobe.`,
        image_url: '', // Main image
        created_at: new Date().toISOString(),
        variants: []
    };

    groupFiles.forEach((file, index) => {
        const ext = path.extname(file);
        const newName = `${productId}-variant-${index + 1}${ext}`;
        const oldPath = path.join(dir, file);
        const newPath = path.join(outputDir, newName);

        fs.copyFileSync(oldPath, newPath);

        const colorName = colors[index % colors.length];

        // If first item, set as main image
        if (index === 0) {
            product.image_url = `/products/organized/${newName}`;
        }

        product.variants.push({
            color: colorName,
            image: `/products/organized/${newName}`
        });
    });

    products.push(product);
    productCounter++;
});

const content = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync('/Users/m-techcomputerske/Desktop/em-fashions/lib/mock-products.ts', content);
console.log('Generated lib/mock-products.ts');
