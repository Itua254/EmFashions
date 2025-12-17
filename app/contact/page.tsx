'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        const phoneNumber = "254115545855";
        const text = `*New Contact Inquiry*\n\n*From:* ${name} (${email})\n\n*Message:*\n${message}`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
            <Navbar />

            <main className="flex-grow">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-16">
                            {/* Contact Info */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h1 className="font-['Cormorant_Garamond'] text-4xl text-[#4A3B32] mb-6">Contact Us</h1>
                                    <p className="text-[#8C8C8C] font-light leading-relaxed">
                                        We&apos;d love to hear from you. Whether you have a question about our collections, pricing, or need assistance with your order.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white border border-[#EBE5DF] flex items-center justify-center rounded-full text-[#4A3B32]">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A3B32] mb-1">Email</h3>
                                            <p className="text-sm text-[#8C8C8C]">emilyfred20@gmail.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white border border-[#EBE5DF] flex items-center justify-center rounded-full text-[#4A3B32]">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A3B32] mb-1">Phone / WhatsApp</h3>
                                            <a
                                                href="https://wa.me/254115545855"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-[#8C8C8C] hover:text-[#4A3B32] transition-colors hover:underline decoration-1 underline-offset-4"
                                            >
                                                0115545855
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white border border-[#EBE5DF] flex items-center justify-center rounded-full text-[#4A3B32]">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A3B32] mb-1">Location</h3>
                                            <p className="text-sm text-[#8C8C8C]">Nairobi, Kenya</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Contact Form */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-[#EBE5DF]"
                            >
                                <form onSubmit={handleSendMessage} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider font-medium text-[#8C8C8C]">Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 bg-[#FBFBF9] border border-[#EBE5DF] rounded-lg focus:outline-none focus:border-[#4A3B32] transition-colors"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider font-medium text-[#8C8C8C]">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-[#FBFBF9] border border-[#EBE5DF] rounded-lg focus:outline-none focus:border-[#4A3B32] transition-colors"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider font-medium text-[#8C8C8C]">Message</label>
                                        <textarea
                                            rows={4}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full px-4 py-3 bg-[#FBFBF9] border border-[#EBE5DF] rounded-lg focus:outline-none focus:border-[#4A3B32] transition-colors"
                                            placeholder="How can we help?"
                                        ></textarea>
                                    </div>
                                    <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl h-12 uppercase tracking-widest text-xs font-medium shadow-sm hover:shadow-md transition-all">
                                        <Send size={16} className="mr-2" />
                                        Send via WhatsApp
                                    </Button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
