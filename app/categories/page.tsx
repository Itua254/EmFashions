'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
    // Group products by category
    const categories = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category).filter((c): c is string => !!c)));

    // Group products by category object
    const productsByCategory = categories.reduce((acc, category) => {
        acc[category] = MOCK_PRODUCTS.filter(p => p.category === category);
        return acc;
    }, {} as Record<string, typeof MOCK_PRODUCTS>);

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            <Navbar />

            <main className="pb-20">
                {/* Hero Headers */}
                <div className="container mx-auto px-4 py-16 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-['Cormorant_Garamond'] text-5xl text-[#4A3B32] mb-4"
                    >
                        Collections.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[#8C8C8C] max-w-lg mx-auto font-light"
                    >
                        Explore our curated selections, designed to bring elegance and comfort to your everyday life.
                    </motion.p>
                </div>

                {/* Categories */}
                <div className="space-y-20">
                    {categories.map((category) => (
                        <section key={category} className="container mx-auto px-4">
                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <h2 className="font-['Cormorant_Garamond'] text-3xl text-[#4A3B32]">{category}</h2>
                                    <p className="text-sm text-[#8C8C8C] mt-1">{productsByCategory[category].length} items</p>
                                </div>
                                <Link href={`/shop?category=${category}`} className="group flex items-center text-sm text-[#4A3B32] font-medium hover:opacity-70 transition-opacity">
                                    View All <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Horizontal Scroll / Carousel */}
                            <div className="relative">
                                <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 scrollbar-hide snap-x">
                                    {productsByCategory[category].map((product) => (
                                        <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>

                                {/* Fade gradients for scroll cues (optional polish) */}
                                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#FAF9F6] to-transparent pointer-events-none" />
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            <Footer />

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
