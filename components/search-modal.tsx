'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, Loader2 } from 'lucide-react';
import { supabase, Product } from '@/lib/supabase';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Focus input when modal opens
            setTimeout(() => inputRef.current?.focus(), 100);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setResults([]);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 1) {
                setLoading(true);
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')
                        .ilike('name', `%${query}%`)
                        .limit(8);

                    if (data) {
                        setResults(data);
                    }
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden mx-4 max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-neutral-100 flex items-center gap-4">
                            <SearchIcon className="w-5 h-5 text-neutral-400" />
                            <Input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products..."
                                className="flex-1 border-none shadow-none focus-visible:ring-0 text-lg sm:text-lg h-auto p-0 placeholder:text-neutral-400 font-['Montserrat']"
                            />
                            {loading && <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>

                        {/* Results */}
                        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF9F6]">
                            {query.length > 1 ? (
                                results.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {results.map((product) => (
                                            <div key={product.id} onClick={onClose}>
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    !loading && (
                                        <div className="text-center py-12 text-neutral-500">
                                            No products found for &quot;{query}&quot;
                                        </div>
                                    )
                                )
                            ) : (
                                <div className="text-center py-12 text-neutral-400 text-sm uppercase tracking-widest">
                                    Start typing to search
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
