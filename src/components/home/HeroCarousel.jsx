import React, { useState, useEffect } from 'react';

const slides = [
    {
        id: 1,
        title: "Elegancia Moderna",
        subtitle: "Descubre nuestra nueva colección de invierno.",
        image: "https://placehold.co/1920x800/051626/D4AF37?text=Nueva+Coleccion",
        cta: "Ver Colección"
    },
    {
        id: 2,
        title: "Oferta del Día",
        subtitle: "20% OFF en Camisas Oxford. Solo por hoy.",
        image: "https://placehold.co/1920x800/051626/D4AF37?text=Oferta+del+Dia",
        cta: "Comprar Ahora"
    },
    {
        id: 3,
        title: "Estilo Urbano",
        subtitle: "Comodidad y diseño para tu día a día.",
        image: "https://placehold.co/1920x800/051626/D4AF37?text=Estilo+Urbano",
        cta: "Ver Más"
    }
];

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center text-white">
                        <h2 className="text-4xl md:text-6xl font-serif mb-4 animate-fade-in-up">
                            {slide.title}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl animate-fade-in-up delay-100">
                            {slide.subtitle}
                        </p>
                        <button className="bg-brand-gold text-brand-dark px-8 py-3 font-medium uppercase tracking-wider hover:bg-white hover:text-brand-dark transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-200">
                            {slide.cta}
                        </button>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-brand-gold' : 'bg-white/30 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
