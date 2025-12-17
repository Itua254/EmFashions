'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <section className="relative h-[50vh] flex items-center justify-center bg-neutral-100 overflow-hidden">
                    <div className="text-center z-10 px-4">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl md:text-5xl font-extralight uppercase tracking-widest mb-4"
                        >
                            Our Story
                        </motion.h1>
                        <div className="w-16 h-[1px] bg-black mx-auto" />
                    </div>
                </section>

                {/* Content */}
                <section className="container mx-auto px-4 py-20">
                    <div className="max-w-3xl mx-auto space-y-12 text-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-light uppercase tracking-wider">The Vision</h2>
                            <p className="text-neutral-600 leading-relaxed font-light text-lg">
                                Em Fashions was born from a desire to bring effortless elegance to the modern wardrobe.
                                We believe that style is a personal journey, one that should be celebrated with quality,
                                grace, and a touch of sophistication.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-12 pt-12">
                            <div className="bg-neutral-50 p-8 h-full">
                                <h3 className="text-lg font-normal uppercase tracking-wider mb-4">Quality First</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    Every piece in our collection is selected with the utmost care, ensuring premium fabrics
                                    and impeccable craftsmanship that stands the test of time.
                                </p>
                            </div>
                            <div className="bg-neutral-50 p-8 h-full">
                                <h3 className="text-lg font-normal uppercase tracking-wider mb-4">Customer Focus</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    Your satisfaction is our priority. From seamless shopping experiences to personalized
                                    style advice, we are here to support your fashion journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>


        </div>
    );
}
