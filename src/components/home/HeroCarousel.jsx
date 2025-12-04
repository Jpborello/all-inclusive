import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase/client';

const HeroCarousel = () => {
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('show_on_home', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                setSlides(data);
            } else {
                // Fallback if no featured products
                setSlides([
                    {
                        id: 'fallback-1',
                        name: 'Nueva Colección 2025',
                        description: 'Descubrí lo último en moda masculina.',
                        image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
                        price: null
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // 5 seconds auto-slide
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    if (loading) return <div className="h-[500px] bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Cargando destacados...</div>;

    return (
        <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img
                        src={slide.image_url || 'https://placehold.co/1200x600?text=No+Image'}
                        alt={slide.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Content */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                        <div className="max-w-3xl transform transition-all duration-700 translate-y-0 opacity-100">
                            <h2 className="text-4xl md:text-6xl font-serif text-white mb-4 drop-shadow-lg tracking-wide">
                                {slide.name}
                            </h2>
                            <p className="text-lg md:text-xl text-gray-200 mb-8 font-light tracking-wider">
                                {slide.description ? slide.description.substring(0, 100) + (slide.description.length > 100 ? '...' : '') : 'Calidad y estilo premium.'}
                            </p>

                            {slide.price ? (
                                <Link
                                    to={`/producto/${slide.id}`}
                                    className="inline-block bg-brand-gold text-brand-dark px-8 py-3 rounded-none hover:bg-white transition-colors uppercase tracking-widest font-medium text-sm"
                                >
                                    Ver Producto
                                </Link>
                            ) : (
                                <Link
                                    to="/productos"
                                    className="inline-block bg-brand-gold text-brand-dark px-8 py-3 rounded-none hover:bg-white transition-colors uppercase tracking-widest font-medium text-sm"
                                >
                                    Ver Catálogo
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white hover:bg-black/20 rounded-full transition-all"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white hover:bg-black/20 rounded-full transition-all"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-brand-gold w-8' : 'bg-white/50 hover:bg-white'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroCarousel;
