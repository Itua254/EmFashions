'use client';

import { useEffect, useState } from 'react';
import { supabase, Product } from '@/lib/supabase';
import Navbar from '@/components/navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/currency';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { Check, FilterX, Heart, Star, ShoppingBag } from 'lucide-react';

const CATEGORIES = {
    'Clothes': ['Dresses', 'Tops', 'Pants', 'Outerwear'],
    'Shoes': ['Heels', 'Sandals', 'Sneakers', 'Boots'],
    'Accessories': ['Handbags', 'Clutches', 'Totes']
};

const CATEGORY_PRIORITY = ['Clothes', 'Shoes', 'Accessories'];

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let result = [...products];

        if (selectedCategory) {
            result = result.filter(p => p.category === selectedCategory);

            // Only apply subcategory filter if a category is selected (to avoid confusion)
            if (selectedSubcategories.length > 0) {
                result = result.filter(p => p.subcategory && selectedSubcategories.includes(p.subcategory));
            }
        }

        setFilteredProducts(result);
    }, [products, selectedCategory, selectedSubcategories]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            let allProducts = [];
            if (error || !data || data.length === 0) {
                allProducts = MOCK_PRODUCTS;
            } else {
                // simplistic merge for demo
                allProducts = data.length < 4 ? [...data, ...MOCK_PRODUCTS] : data;
            }

            // Custom Sort: Clothes > Shoes > Bags > Others
            allProducts.sort((a, b) => {
                const catA = CATEGORY_PRIORITY.indexOf(a.category) === -1 ? 999 : CATEGORY_PRIORITY.indexOf(a.category);
                const catB = CATEGORY_PRIORITY.indexOf(b.category) === -1 ? 999 : CATEGORY_PRIORITY.indexOf(b.category);
                return catA - catB;
            });

            setProducts(allProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts(MOCK_PRODUCTS);
        } finally {
            setLoading(false);
        }
    };

    const toggleSubcategory = (sub: string) => {
        setSelectedSubcategories(prev =>
            prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
        );
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategories([]);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-warm-white)' }}>
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 border-b border-neutral-200/50">
                <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ backgroundImage: "url('/shop-hero.jpg')" }}>
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(74, 59, 50, 0.3)' }} /> {/* Coffee overlay */}
                </div>
                <div className="relative container mx-auto px-4 text-center text-white">
                    <h1 className="text-5xl md:text-6xl font-normal tracking-widest uppercase mb-4 font-serif">The Collection</h1>
                    <p className="max-w-xl mx-auto font-light tracking-wide text-lg text-neutral-100">
                        Curated pieces for the modern individual. Elevate your style today.
                    </p>
                </div>
            </div>

            <section className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* Sidebar Filters */}
                    <div className="w-full md:w-64 flex-shrink-0 space-y-8">
                        <div className="flex items-center justify-between md:hidden mb-4">
                            <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="uppercase text-xs font-bold tracking-widest" style={{ color: 'var(--color-coffee-dark)' }}>
                                {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                            </button>
                            {(selectedCategory || selectedSubcategories.length > 0) && (
                                <button onClick={clearFilters} className="text-xs uppercase tracking-widest flex items-center gap-1 text-red-400">
                                    <FilterX size={14} /> Clear
                                </button>
                            )}
                        </div>

                        <div className={`space-y-8 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
                            {/* Clear All Desktop */}
                            <div className="hidden md:flex justify-between items-center">
                                <span className="uppercase text-xs font-bold tracking-widest" style={{ color: 'var(--color-coffee-dark)' }}>Filters</span>
                                {(selectedCategory || selectedSubcategories.length > 0) && (
                                    <button onClick={clearFilters} className="text-xs uppercase tracking-widest hover:underline text-red-500">
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 pb-2 border-b border-neutral-200" style={{ color: 'var(--color-coffee-dark)' }}>Category</h3>
                                <ul className="space-y-3">
                                    {Object.keys(CATEGORIES).map(cat => (
                                        <li key={cat}>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(selectedCategory === cat ? null : cat);
                                                    setSelectedSubcategories([]); // reset subs when changing cat
                                                }}
                                                className={`text-sm tracking-wide transition-colors ${selectedCategory === cat ? 'font-medium pl-2 border-l-2' : ''}`}
                                                style={{
                                                    color: selectedCategory === cat ? 'var(--color-coffee-dark)' : '#8C8C8C',
                                                    borderColor: 'var(--color-latte)'
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Subcategories (Dynamic) */}
                            {selectedCategory && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                    <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 pb-2 border-b border-neutral-200" style={{ color: 'var(--color-coffee-dark)' }}>{selectedCategory} Type</h3>
                                    <ul className="space-y-3">
                                        {CATEGORIES[selectedCategory as keyof typeof CATEGORIES].map(sub => (
                                            <li key={sub} className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleSubcategory(sub)}
                                                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedSubcategories.includes(sub) ? 'bg-[#4A3B32] border-[#4A3B32]' : 'bg-transparent border-neutral-300'}`}
                                                >
                                                    {selectedSubcategories.includes(sub) && <Check size={10} className="text-white" />}
                                                </button>
                                                <button
                                                    onClick={() => toggleSubcategory(sub)}
                                                    className={`text-sm tracking-wide ${selectedSubcategories.includes(sub) ? 'text-[#4A3B32]' : 'text-[#8C8C8C]'}`}
                                                >
                                                    {sub}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-[#4A3B32] border-r-transparent"></div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20">
                                {selectedCategory === 'Accessories' ? (
                                    <div>
                                        <p className="text-xl font-light uppercase tracking-widest mb-2" style={{ color: 'var(--color-coffee-dark)' }}>Coming Soon</p>
                                        <p className="text-neutral-500">Our exclusive accessories collection is launching shortly.</p>
                                    </div>
                                ) : (
                                    <p className="text-neutral-500">No products found matching your criteria.</p>
                                )}
                                <button onClick={clearFilters} className="mt-4 text-sm underline text-[#4A3B32]">Clear all filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group"
                                    >
                                        <Link href={`/products/${product.id}`}>
                                            <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-[#F0EFED] rounded-sm">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-neutral-300">No Image</div>
                                                )}

                                                {/* Discount Badge */}
                                                {product.original_price && product.original_price > product.price && (
                                                    <div className="absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-sm" style={{ backgroundColor: 'white', color: '#C8A27C' }}>
                                                        -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                                                    </div>
                                                )}

                                                {/* Action Overlay (Desktop) */}
                                                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                                                    <button className="w-full bg-white/90 backdrop-blur-sm text-[#4A3B32] py-3 text-xs uppercase tracking-widest hover:bg-[#4A3B32] hover:text-white transition-colors">
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-center">
                                                <h3 className="text-sm font-medium tracking-wide line-clamp-1" style={{ color: 'var(--color-coffee-dark)' }}>
                                                    {product.name}
                                                </h3>

                                                <div className="flex items-center justify-center gap-2">
                                                    {product.original_price && (
                                                        <span className="text-xs text-neutral-400 line-through">
                                                            {formatPrice(product.original_price)}
                                                        </span>
                                                    )}
                                                    <span className="text-sm font-semibold" style={{ color: '#C8A27C' }}>{formatPrice(product.price)}</span>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center justify-center gap-1">
                                                    <div className="flex text-[#C8A27C]">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                size={10}
                                                                fill={product.rating && star <= Math.round(product.rating) ? "currentColor" : "none"}
                                                                className={product.rating && star <= Math.round(product.rating) ? "" : "text-neutral-300"}
                                                            />
                                                        ))}
                                                    </div>
                                                    {product.reviews_count ? (
                                                        <span className="text-[10px] text-neutral-400">({product.reviews_count})</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section >
        </div >
    );
}
