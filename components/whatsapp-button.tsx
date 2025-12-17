'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    const phoneNumber = "254115545855"; // Updated number
    const message = encodeURIComponent("Hello! I'm interested in your fashion collection.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={28} className="fill-white" />
            <span className="absolute right-full mr-4 bg-white text-black px-3 py-1 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
                Chat with us
            </span>
        </a>
    );
}
