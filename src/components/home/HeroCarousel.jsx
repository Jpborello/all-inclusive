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
        <div className="relative h-[70vh] md:h-[90vh] overflow-hidden bg-gray-900">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Blurred Background Layer */}
                    <div
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{
                            backgroundImage: `url(${slide.image_url || 'https://placehold.co/1200x600?text=No+Image'})`,
                            filter: 'blur(20px) brightness(0.4)'
                        }}
                    ></div>

                    {/* Main Image Layer */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-4 md:p-8">
                        <img
                            src={slide.image_url || 'https://placehold.co/1200x600?text=No+Image'}
                            alt={slide.name}
                            className="w-full h-full object-contain max-h-[85vh] drop-shadow-2xl"
                        />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4 pointer-events-none">
                        <div className="max-w-lg transform transition-all duration-700 translate-y-0 opacity-100 pointer-events-auto mt-[30vh] md:mt-[45vh]">
                            <h2 className="text-3xl md:text-5xl font-serif text-white mb-2 md:mb-4 drop-shadow-lg tracking-wide px-2">
                                {slide.name}
                            </h2>
                            <p className="text-xs md:text-lg text-gray-100 mb-4 md:mb-6 font-light tracking-wider drop-shadow-md px-4 hidden sm:block">
                                {slide.description ? slide.description.substring(0, 80) + (slide.description.length > 80 ? '...' : '') : 'Calidad y estilo premium.'}
                            </p>

                            {slide.price ? (
                                <Link
                                    to={`/producto/${slide.id}`}
                                    className="inline-block bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-2 md:px-8 md:py-3 hover:bg-white hover:text-brand-dark transition-all duration-300 uppercase tracking-[0.2em] font-medium text-[10px] md:text-sm rounded-sm"
                                >
                                    Ver Producto
                                </Link>
                            ) : (
                                <Link
                                    to="/productos"
                                    className="inline-block bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-2 md:px-8 md:py-3 hover:bg-white hover:text-brand-dark transition-all duration-300 uppercase tracking-[0.2em] font-medium text-[10px] md:text-sm rounded-sm"
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 text-white/50 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full transition-all border border-white/10"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 text-white/50 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full transition-all border border-white/10"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-white w-12' : 'bg-white/30 w-6 hover:bg-white/60'
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
