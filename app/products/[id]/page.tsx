'use client';

import { useEffect, useState } from 'react';
import { supabase, Product } from '@/lib/supabase';
import { useCartStore } from '@/lib/store';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/currency';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS } from '@/lib/mock-products';

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        if (id) {
            fetchProduct(id as string);
        }
    }, [id]);

    const fetchProduct = async (productId: string) => {
        try {
            // First check mock data
            const mockProduct = MOCK_PRODUCTS.find(p => p.id === productId);

            if (mockProduct) {
                setProduct(mockProduct as Product);
                setSelectedImage(mockProduct.image_url);
            } else {
                // Try DB
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .single();

                if (error) throw error;
                setProduct(data);
                setSelectedImage(data.image_url);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            // Add variant info if needed in future
            addItem(product);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-r-transparent"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <p className="text-xl text-neutral-500">Product not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative aspect-[3/4] bg-neutral-50 overflow-hidden"
                    >
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300">No Image</div>
                        )}
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col justify-center space-y-8"
                    >
                        <div className="space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                                {product.subcategory ? `${product.category} / ${product.subcategory}` : (product.category || 'Collection')}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-light text-neutral-900 uppercase tracking-wide">
                                {product.name}
                            </h1>
                            <p className="text-2xl text-neutral-900 font-normal">
                                {formatPrice(product.price)}
                            </p>
                        </div>

                        <div className="prose prose-neutral max-w-none">
                            <p className="text-neutral-600 leading-relaxed">
                                {product.description || 'No description available for this item.'}
                            </p>
                        </div>

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Select Color</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(variant.image)}
                                            className={`w-12 h-12 rounded-full border-2 transition-all p-1 ${selectedImage === variant.image ? 'border-black' : 'border-transparent'}`}
                                            title={variant.color}
                                        >
                                            <div className="w-full h-full rounded-full overflow-hidden relative border border-neutral-200">
                                                <img src={variant.image} alt={variant.color} className="w-full h-full object-cover" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-8 border-t border-neutral-100">
                            <Button
                                onClick={handleAddToCart}
                                size="lg"
                                className="w-full md:w-auto min-w-[200px] h-14 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 rounded-none transition-all"
                            >
                                Add to Cart
                            </Button>
                        </div>

                        <div className="space-y-4 pt-8 text-xs text-neutral-500 uppercase tracking-wider">
                            <div className="flex items-center gap-4">
                                <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-700 flex items-center justify-center">✓</span>
                                In Stock
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-4 h-4 rounded-full bg-neutral-200 flex items-center justify-center">🚚</span>
                                Free Delivery in Nairobi
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
