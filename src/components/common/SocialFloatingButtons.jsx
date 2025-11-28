import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';

const SocialFloatingButtons = () => {
    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
            {/* WhatsApp Button */}
            <a
                href="https://wa.me/543412844169"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
                aria-label="Contactar por WhatsApp"
            >
                <MessageCircle size={24} fill="white" className="group-hover:animate-pulse" />
            </a>

            {/* Instagram Button */}
            <a
                href="https://www.instagram.com/allinclusiveindumentaria/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-tr from-[#f09433] via-[#bc1888] to-[#cc2366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
                aria-label="Seguir en Instagram"
            >
                <Instagram size={24} className="group-hover:rotate-12 transition-transform duration-300" />
            </a>
        </div>
    );
};

export default SocialFloatingButtons;
