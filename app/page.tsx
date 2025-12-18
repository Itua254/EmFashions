'use client';

import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { formatPrice } from '@/lib/currency';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Clock, RefreshCw, ShieldCheck, Star } from 'lucide-react';
import Navbar from '@/components/navbar';
import { ProductCard } from '@/components/product-card';

// Define categories for display
const CATEGORIES = [
  { name: 'Women', image: '/women.jpg', link: '/shop?category=Clothes' },
  { name: 'Men', image: '/men.jpg', link: '/shop?category=Clothes' },
  { name: 'Kids', image: '/kids.jpg', link: '/shop?category=Clothes' },
  { name: 'Accessories', image: '/accessories.jpg', link: '/shop?category=Accessories' },
];

export default function Home() {
  // Get latest products (first 3)
  const latestProducts = MOCK_PRODUCTS.slice(0, 3);

  // Get featured (random 4 for demo)
  const featuredProducts = MOCK_PRODUCTS.slice(4, 8);

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)] font-['Montserrat']">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-24 md:pt-32 pb-20 px-4 md:px-8">
        <div className="bg-[#EBE5DF] rounded-3xl overflow-hidden relative min-h-[600px] flex items-center justify-center">
          {/* Background Image Placeholder - In real app this would be a high res fashion shot */}
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />

          <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
            <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-6xl lg:text-8xl text-[var(--color-coffee-dark)] font-medium leading-tight tracking-tight">
              WEAR YOUR <br /> CONFIDENCE
            </h1>
            <p className="text-[var(--color-coffee-dark)] text-lg max-w-xl mx-auto font-light">
              Modern aesthetics meet timeless design. Discover a wardrobe that speaks before you do.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/shop" className="bg-[var(--color-coffee-dark)] text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-colors w-full sm:w-auto min-w-[160px]">
                Shop Now
              </Link>
              <Link href="/shop" className="border border-[var(--color-coffee-dark)] text-[var(--color-coffee-dark)] px-8 py-4 rounded-full font-medium hover:bg-[#D8D0C5] transition-colors w-full sm:w-auto min-w-[160px]">
                Current Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST PRODUCTS */}
      <section className="py-20 px-4 md:px-8 container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-['Cormorant_Garamond'] text-4xl text-[var(--color-coffee-dark)]">Latest Products</h2>
          <Link href="/shop" className="text-[var(--color-coffee-dark)] border-b border-[var(--color-coffee-dark)] pb-1 text-sm hover:opacity-70">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* FEATURES BAR */}
      <section className="py-12 border-y border-[#E5E5E5] bg-white">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On all orders over KSh 5000" },
            { icon: Clock, title: "24/7 Support", desc: "Dedicated support team" },
            { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
            { icon: ShieldCheck, title: "Secure Checkout", desc: "Encrypted payments" }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[var(--color-latte)]">
                <feature.icon size={24} />
              </div>
              <h4 className="font-semibold text-[var(--color-coffee-dark)] text-sm uppercase tracking-wide">{feature.title}</h4>
              <p className="text-xs text-[var(--color-text-muted)] max-w-[150px]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-4 md:px-8 container mx-auto">
        <h2 className="font-['Cormorant_Garamond'] text-4xl text-[var(--color-coffee-dark)] text-center mb-16">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link href={cat.link} key={i} className="group relative rounded-2xl overflow-hidden aspect-[3/4] block">
              {cat.name === 'Accessories' && (
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-[var(--color-latte)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    Coming Soon
                  </span>
                </div>
              )}
              {cat.image && (<img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />)}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
              <div className="absolute bottom-6 left-0 right-0 text-center z-20">
                <span className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-[var(--color-coffee-dark)] group-hover:bg-white transition-colors">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* EXCLUSIVE OFFERS SPLIT */}
      <section className="container mx-auto px-4 md:px-8 mb-20">
        <div className="bg-[#EBE5DF]/50 rounded-3xl overflow-hidden flex flex-col md:flex-row">
          <div className="flex-1 p-12 md:p-20 flex flex-col justify-center space-y-6">
            <span className="text-[var(--color-latte)] font-bold tracking-widest uppercase text-sm">Limited Time Offer</span>
            <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-[var(--color-coffee-dark)] leading-none">
              Exclusive Offers <br /> for the Season.
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg max-w-sm">
              Discover our premium selection at unbeatable prices. Style doesn&apos;t have to break the bank.
            </p>
            <div className="pt-4">
              <Link href="/shop" className="bg-[var(--color-coffee-dark)] text-white px-8 py-3 rounded-full inline-block hover:opacity-90">
                Shop Sale
              </Link>
            </div>
          </div>
          <div className="flex-1 min-h-[400px] bg-[#D8D0C5] relative">
            <img
              src="/summer-collection.jpg"
              alt="Holiday Collection"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <motion.h3
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                animate={{ scale: [1, 1.05, 1] }} // Subtle pulse
                className="text-4xl md:text-5xl font-['Cormorant_Garamond'] font-bold text-center px-4"
                style={{ color: '#8B0000', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                Usiseme Ukua Unajua
              </motion.h3>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-4 md:px-8 container mx-auto bg-white rounded-3xl border border-neutral-100 shadow-sm">
        <div className="text-center mb-16">
          <h2 className="font-['Cormorant_Garamond'] text-4xl text-[var(--color-coffee-dark)] mb-4">Featured Products</h2>
          <Link href="/shop" className="inline-block px-6 py-2 border rounded-full text-sm hover:bg-neutral-50 transition-colors">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SEASONAL COLLECTION */}
      <section className="py-20 px-4 md:px-8 container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-[var(--color-coffee-dark)]">Seasonal Collection</h2>
          <p className="text-[var(--color-text-muted)] mt-4">Curated styles for the current vibe.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-[16/9] bg-[#EBE5DF] rounded-2xl relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 flex items-end p-8">
              <div className="relative z-10 bg-white/90 backdrop-blur px-8 py-4 rounded-xl">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-1">Men&apos;s Edit</h3>
                <div className="text-xs text-[var(--color-text-muted)]">Shop Collection</div>
              </div>
            </div>
          </div>
          <div className="aspect-[16/9] bg-[#3E3E3E] rounded-2xl relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 flex items-end p-8">
              <div className="relative z-10 bg-white/90 backdrop-blur px-8 py-4 rounded-xl">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-1">Women&apos;s Edit</h3>
                <div className="text-xs text-[var(--color-text-muted)]">Shop Collection</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-[#F5F2EF]">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl">
          <h2 className="font-['Cormorant_Garamond'] text-4xl text-[var(--color-coffee-dark)] mb-12">Fashion That Speaks for Itself</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-[#EBE5DF] text-left">
                <div className="flex text-[var(--color-latte)] mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <p className="text-[var(--color-coffee-dark)] font-light italic mb-6 text-sm leading-relaxed">
                  &quot;I absolutely love the quality and fit of the clothes. It feels tailored just for me.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full" />
                  <div>
                    <div className="text-xs font-bold uppercase font-['Montserrat']">Happy Customer</div>
                    <div className="text-[10px] text-neutral-400">Verified Buyer</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
