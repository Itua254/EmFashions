'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';

import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import SearchModal from '@/components/search-modal';
import AuthModal from '@/components/auth-modal';
import { supabase } from '@/lib/supabase';
import { User as UserType } from '@supabase/supabase-js';

export default function Navbar() {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);

        // Check auth
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            clearTimeout(timer);
            subscription.unsubscribe();
        };
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
                    {/* Left Navigation - Desktop */}
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

                    {/* Mobile Menu Button - Left */}
                    <div className="md:hidden flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" style={{ color: 'var(--color-coffee-dark)' }} />
                            ) : (
                                <Menu className="w-6 h-6" style={{ color: 'var(--color-coffee-dark)' }} />
                            )}
                        </Button>
                    </div>

                    {/* Centered Logo */}
                    <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 hover:opacity-90 transition-opacity">
                        <img src="/logo.jpg" alt="Em Fashions" className="h-10 md:h-14 w-auto mix-blend-multiply" />
                    </Link>

                    {/* Right Icons */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden md:flex hover:bg-neutral-100/50 rounded-full"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="w-5 h-5" style={{ color: 'var(--color-coffee-dark)' }} />
                        </Button>

                        <div className="hidden md:block">
                            {user ? (
                                <Link href="/account">
                                    <Button variant="ghost" size="icon" className="hover:bg-neutral-100/50 rounded-full">
                                        <User className="w-5 h-5" style={{ color: 'var(--color-coffee-dark)' }} />
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-neutral-100/50 rounded-full"
                                    onClick={() => setIsAuthOpen(true)}
                                >
                                    <User className="w-5 h-5" style={{ color: 'var(--color-coffee-dark)' }} />
                                </Button>
                            )}
                        </div>

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

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-neutral-200/50 bg-[var(--color-warm-white)]"
                    >
                        <div className="flex flex-col py-4 gap-2">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-3 text-sm uppercase tracking-widest font-medium hover:bg-neutral-100 transition-colors"
                                    style={{ color: 'var(--color-coffee-dark)' }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
            />
        </motion.nav>
    );
}
