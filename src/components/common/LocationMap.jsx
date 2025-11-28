import React from 'react';

const LocationMap = () => {
    return (
        <div className="w-full h-full rounded-lg overflow-hidden border border-brand-gold/20 shadow-lg grayscale hover:grayscale-0 transition-all duration-500">
            <iframe
                src="https://maps.google.com/maps?q=Mendoza+6440,+Rosario,+Santa+Fe&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '200px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación All Inclusive"
            ></iframe>
        </div>
    );
};

export default LocationMap;
