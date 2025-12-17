'use client';

import { useCartStore } from '@/lib/store';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag, MessageCircle, MapPin, Phone, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatPrice } from '@/lib/currency';
import { useState } from 'react';

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
    const total = getTotalPrice();

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [shippingLocation, setShippingLocation] = useState('');

    const handleCheckout = (method: string) => {
        alert(`${method} checkout coming soon! Total: ${formatPrice(total)}`);
    };

    const handleWhatsAppCheckout = () => {
        if (!customerName || !customerPhone || !shippingLocation) {
            alert('Please fill in your shipping details before placing the order.');
            return;
        }

        const phoneNumber = "254115545855";

        const itemDetails = items.map(item => `- ${item.quantity}x ${item.name} (${formatPrice(item.price)})`).join('\n');

        const fullMessage = `*New Order Request*\n\n*Customer Details:*\nName: ${customerName}\nPhone: ${customerPhone}\nLocation: ${shippingLocation}\n\n*Order Items:*\n${itemDetails}\n\n*Total: ${formatPrice(total)}*`;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
        window.open(url, '_blank');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAF9F6]">
                <Navbar />
                <div className="container mx-auto px-4 py-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="w-24 h-24 bg-[#EBE5DF] rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag className="w-10 h-10 text-[#4A3B32]" />
                        </div>
                        <h1 className="font-['Cormorant_Garamond'] text-3xl text-[#4A3B32] mb-4">Your cart is empty</h1>
                        <p className="text-[#8C8C8C] mb-8 font-light">Looks like you haven&apos;t added any elegant pieces to your collection yet.</p>
                        <Link href="/shop">
                            <Button className="bg-[#4A3B32] text-white hover:bg-[#3E3129] px-8 py-6 rounded-full uppercase tracking-widest text-xs">
                                Continue Shopping
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6] pb-20">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-['Cormorant_Garamond'] text-4xl text-[#4A3B32] mb-12 text-center">
                        Shopping Cart
                    </h1>

                    <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-[#EBE5DF] flex gap-6 items-center"
                                >
                                    <div className="w-24 h-32 bg-[#F5F5F0] rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-['Cormorant_Garamond'] text-xl text-[#4A3B32]">{item.name}</h3>
                                            <p className="font-medium text-[#4A3B32]">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                        <p className="text-sm text-[#8C8C8C] mb-4">{formatPrice(item.price)} each</p>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-3 bg-[#F5F5F0] rounded-full px-3 py-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-6 h-6 flex items-center justify-center text-[#4A3B32] hover:bg-white rounded-full transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-6 h-6 flex items-center justify-center text-[#4A3B32] hover:bg-white rounded-full transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-xs uppercase tracking-wider text-[#8C8C8C] hover:text-[#D14D4D] transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Order Summary & Details */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#EBE5DF] sticky top-24 space-y-8">

                                {/* Customer Details Section */}
                                <div>
                                    <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#4A3B32] mb-6">Shipping Details</h2>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-widest text-[#8C8C8C] font-medium">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8C8C]" size={16} />
                                                <input
                                                    type="text"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    placeholder="Enter your full name"
                                                    className="w-full pl-12 pr-4 py-3 bg-[#FBFBF9] border border-[#EBE5DF] rounded-lg focus:outline-none focus:border-[#4A3B32] text-sm transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-widest text-[#8C8C8C] font-medium">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8C8C]" size={16} />
                                                <input
                                                    type="tel"
                                                    value={customerPhone}
                                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                                    placeholder="Enter your phone number"
                                                    className="w-full pl-12 pr-4 py-3 bg-[#FBFBF9] border border-[#EBE5DF] rounded-lg focus:outline-none focus:border-[#4A3B32] text-sm transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-widest text-[#8C8C8C] font-medium">Delivery Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8C8C]" size={16} />
                                                <input
                                                    type="text"
                                                    value={shippingLocation}
                                                    onChange={(e) => setShippingLocation(e.target.value)}
                                                    placeholder="City, Street, Building..."
                                                    className="w-full pl-12 pr-4 py-3 bg-[#FBFBF9] border border-[#EBE5DF] rounded-lg focus:outline-none focus:border-[#4A3B32] text-sm transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-[#EBE5DF]" />

                                {/* Order Totals */}
                                <div>
                                    <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#4A3B32] mb-6">Order Summary</h2>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#8C8C8C]">Subtotal</span>
                                            <span className="text-[#4A3B32]">{formatPrice(total)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#8C8C8C]">Shipping</span>
                                            <span className="text-[#4A3B32]">Calculated on delivery</span>
                                        </div>
                                        <div className="border-t border-[#EBE5DF] pt-3 mt-3">
                                            <div className="flex justify-between font-medium text-lg">
                                                <span className="font-['Cormorant_Garamond'] text-[#4A3B32]">Total</span>
                                                <span className="text-[#4A3B32]">{formatPrice(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={handleWhatsAppCheckout}
                                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-6 rounded-xl uppercase tracking-widest text-xs font-medium shadow-sm hover:shadow-md transition-all"
                                        >
                                            <MessageCircle className="w-5 h-5 mr-3" />
                                            Complete Order via WhatsApp
                                        </Button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                onClick={() => handleCheckout('Stripe')}
                                                variant="outline"
                                                className="w-full border-[#EBE5DF] text-[#4A3B32] hover:bg-[#4A3B32] hover:text-white py-6 rounded-xl uppercase tracking-widest text-[10px]"
                                            >
                                                Pay with Card
                                            </Button>
                                            <Button
                                                onClick={() => handleCheckout('M-Pesa')}
                                                variant="outline"
                                                className="w-full border-[#EBE5DF] text-[#4A3B32] hover:bg-[#4A3B32] hover:text-white py-6 rounded-xl uppercase tracking-widest text-[10px]"
                                            >
                                                M-Pesa
                                            </Button>
                                        </div>

                                        <Button
                                            onClick={clearCart}
                                            variant="ghost"
                                            className="w-full text-[#8C8C8C] hover:text-[#D14D4D] hover:bg-transparent text-[10px] uppercase tracking-widest mt-2"
                                        >
                                            Clear Cart
                                        </Button>

                                        <p className="text-[10px] text-center text-[#8C8C8C] pt-2">
                                            Secure checkout powered by WhatsApp
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
