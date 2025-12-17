import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { Product } from '@/lib/supabase';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="bg-[#F0EFED] rounded-xl overflow-hidden aspect-[4/5] relative mb-4">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                    onClick={handleAddToCart}
                    className={`absolute bottom-4 right-4 p-3 rounded-full shadow-sm transition-all duration-300 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 ${isAdded
                        ? "bg-[#25D366] text-white"
                        : "bg-white hover:bg-[var(--color-coffee-dark)] hover:text-white"
                        }`}
                >
                    {isAdded ? <Check size={20} /> : <ShoppingBag size={20} />}
                </button>
            </div>
            <h3 className="font-['Cormorant_Garamond'] text-xl text-[var(--color-coffee-dark)] mb-1 leading-tight">{product.name}</h3>
            <p className="text-[var(--color-text-muted)] text-sm mb-2">{product.category}</p>
            <div className="flex items-center gap-2">
                <p className="font-medium text-[var(--color-coffee-dark)]">{formatPrice(product.price)}</p>
                {product.original_price && (
                    <p className="text-sm text-[var(--color-text-muted)] line-through">{formatPrice(product.original_price)}</p>
                )}
            </div>
        </Link>
    );
}
