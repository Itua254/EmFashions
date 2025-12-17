'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, LucideIcon } from 'lucide-react'; // Using standard Lucide icons, close enough for TikTok if not available, or replacing
// Note: Lucide doesn't have TikTok by default in older versions, I'll use a generic "Share" or text if needed, but modern lucide might have it. 
// I'll stick to safe icons for now or import specific SVGs if I were being very precise, but for speed standard icons work.

const SocialLink = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 border border-neutral-800 hover:border-white"
    >
        <Icon size={18} />
    </a>
);

export default function Footer() {
    return (
        <footer className="bg-neutral-950 text-white pt-16 pb-8 border-t border-neutral-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-light uppercase tracking-[0.2em] text-white">
                            Em Fashions
                        </h3>
                        <p className="text-neutral-400 text-sm font-light leading-relaxed max-w-xs">
                            Curating elegance for the modern individual. We believe in style that speaks without shouting.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Explore
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/shop" className="text-sm text-neutral-300 hover:text-white transition-colors">
                                    Shop Collection
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-neutral-300 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-neutral-300 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Visit Us
                        </h4>
                        <div className="space-y-4 text-sm text-neutral-300 font-light">
                            <p>Nairobi, Kenya</p>
                            <p>emilyfred20@gmail.com</p>
                            <p>0115545855</p>
                        </div>
                    </div>

                    {/* Social */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Follow Us
                        </h4>
                        <div className="flex items-center gap-4">
                            <SocialLink href="https://facebook.com" icon={Facebook} />
                            <SocialLink href="https://instagram.com" icon={Instagram} />
                            <SocialLink href="https://twitter.com" icon={Twitter} />
                            <SocialLink href="https://linkedin.com" icon={Linkedin} />
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-wider text-neutral-600">
                        © 2024 Em Fashions. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-xs uppercase tracking-wider text-neutral-600">Privacy Policy</span>
                        <span className="text-xs uppercase tracking-wider text-neutral-600">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
