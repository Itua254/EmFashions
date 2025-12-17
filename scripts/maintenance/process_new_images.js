const fs = require('fs');
const path = require('path');

const mockPath = '/Users/m-techcomputerske/Desktop/em-fashions/lib/mock-products.ts';
const sourceDir = '/Users/m-techcomputerske/Desktop/em-fashions/public/products';
const outputDir = '/Users/m-techcomputerske/Desktop/em-fashions/public/products/organized';

// 1. Read existing MOCK_PRODUCTS
let content = fs.readFileSync(mockPath, 'utf8');
const match = content.match(/export const MOCK_PRODUCTS: Product\[\] = (\[[\s\S]*\]);/);
if (!match) { console.error("Could not find MOCK_PRODUCTS array"); process.exit(1); }
let products = JSON.parse(match[1]);

// 2. Determine Max ID
let maxId = 0;
products.forEach(p => {
    const num = parseInt(p.id.replace('prod-', ''));
    if (num > maxId) maxId = num;
});
console.log(`Current max ID: ${maxId}`);

// 3. Scan for NEW files
// Filter out directories and hidden files
const files = fs.readdirSync(sourceDir).filter(f => {
    return fs.statSync(path.join(sourceDir, f)).isFile() && !f.startsWith('.');
});

// Group by timestamp regex
const regex = /at (\d{2}\.\d{2}\.\d{2})/;
const groups = {};

files.forEach(file => {
    const match = file.match(regex);
    if (match) {
        const key = match[1];
        if (!groups[key]) groups[key] = [];
        groups[key].push(file);
    } else {
        // Handle non-timestamped files (names like cotton-shirt-white.png)
        // Group them individually or by name base?
        // Let's group individually for safety unless they share a base
        const key = file;
        if (!groups[key]) groups[key] = [];
        groups[key].push(file);
    }
});

// Sort groups keys to be deterministic
const sortedKeys = Object.keys(groups).sort();

const colors = ['Black', 'Navy', 'Maroon', 'Beige', 'White', 'Olive', 'Pink', 'Gold'];

sortedKeys.forEach(key => {
    const groupFiles = groups[key];
    maxId++;
    const productId = `prod-${maxId}`;
    const basePrice = Math.floor(Math.random() * (6000 - 2000) + 2000);

    const product = {
        id: productId,
        name: `Fashion Item ${maxId}`,
        price: basePrice,
        category: 'Women', // Default
        description: `Experience the perfect blend of style and comfort with our Fashion Item ${maxId}. Designed for the modern wardrobe.`,
        image_url: '',
        created_at: new Date().toISOString(),
        variants: []
    };

    groupFiles.forEach((file, index) => {
        const ext = path.extname(file);
        const newName = `${productId}-variant-${index + 1}${ext}`;
        const oldPath = path.join(sourceDir, file);
        const newPath = path.join(outputDir, newName);

        fs.copyFileSync(oldPath, newPath);

        const colorName = colors[index % colors.length];

        if (index === 0) {
            product.image_url = `/products/organized/${newName}`;
        }

        product.variants.push({
            color: colorName,
            image: `/products/organized/${newName}`
        });
    });

    products.push(product);
});

// 4. Write back
const newContent = `import { Product } from './supabase';

export const MOCK_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync(mockPath, newContent);
console.log(`Added ${sortedKeys.length} new products. Total: ${products.length}`);
