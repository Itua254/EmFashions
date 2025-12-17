'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Navbar() {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/categories', label: 'Categories' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
        { href: '/admin', label: 'Admin' },
    ];

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 border-b border-neutral-200/50 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(250, 249, 246, 0.95)' }} // Warm white with slight transparency
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Left Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-xs uppercase tracking-[0.2em] font-medium transition-opacity hover:opacity-60"
                                style={{ color: 'var(--color-coffee-dark)' }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Centered Logo */}
                    <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 hover:opacity-90 transition-opacity">
                        <img src="/logo.jpg" alt="Em Fashions" className="h-14 w-auto mix-blend-multiply" />
                    </Link>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="hover:bg-neutral-100/50 rounded-full">
                            <Search className="w-5 h-5" style={{ color: 'var(--color-coffee-dark)' }} />
                        </Button>

                        <Link href="/login">
                            <Button variant="ghost" size="icon" className="hover:bg-neutral-100/50 rounded-full">
                                <User className="w-5 h-5" style={{ color: 'var(--color-coffee-dark)' }} />
                            </Button>
                        </Link>

                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="relative hover:bg-neutral-100/50 rounded-full">
                                <ShoppingBag className="w-5 h-5" style={{ color: 'var(--color-coffee-dark)' }} />
                                {mounted && totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium"
                                        style={{ backgroundColor: 'var(--color-coffee-dark)' }}
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
