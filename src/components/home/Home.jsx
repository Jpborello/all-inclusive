import React, { useState } from 'react';
import HeroCarousel from './HeroCarousel';
import ProductCard from '../product/ProductCard';
import { products, categories } from '../../data/mockData';

const Home = () => {
    const featuredProducts = products.filter(p => p.isFeatured);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const response = await fetch('https://neo-core-sys.app.n8n.cloud/webhook-test/43b85194-ffea-43c6-aa66-32c16cbe1597', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, source: 'web_subscription' }),
            });

            if (response.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow">
            <HeroCarousel />

            {/* Categories Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-serif text-center text-brand-dark mb-12">
                        Categorías
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {categories.map((cat) => (
                            <div key={cat.id} className="relative group cursor-pointer overflow-hidden h-64 md:h-80">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                    <h3 className="text-white text-xl md:text-2xl font-serif tracking-wider border-b-2 border-transparent group-hover:border-brand-gold pb-1 transition-all">
                                        {cat.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-brand-light">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">Destacados</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Selección exclusiva de prendas para el hombre que sabe lo que quiere.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button className="border-2 border-brand-dark text-brand-dark px-8 py-3 font-medium uppercase tracking-wider hover:bg-brand-dark hover:text-white transition-colors">
                            Ver Todo
                        </button>
                    </div>
                </div>
            </section>

            {/* Special Event Banner */}
            <section className="py-20 bg-brand-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <span className="text-brand-gold uppercase tracking-widest text-sm font-bold mb-4 block">
                        Próximamente
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif mb-6">
                        Black Friday For Men
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Prepárate para los descuentos más exclusivos del año. Regístrate para acceso anticipado.
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Tu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="px-4 py-3 text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-brand-gold text-brand-dark px-8 py-3 font-bold uppercase hover:bg-white transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Enviando...' : 'Suscribirse'}
                        </button>
                    </form>
                    {status === 'success' && (
                        <p className="text-green-400 mt-4 font-medium">¡Gracias por suscribirte! Te contactaremos pronto.</p>
                    )}
                    {status === 'error' && (
                        <p className="text-red-400 mt-4 font-medium">Hubo un error. Por favor intenta nuevamente.</p>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Home;
