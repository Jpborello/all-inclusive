import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from './HeroCarousel';
import ProductCard from '../product/ProductCard';
import { supabase } from '../../supabase/client';
import SEO from '../common/SEO';

const Home = () => {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const init = async () => {
            await ensureCategoriesExist();
            fetchFeaturedProducts();
            fetchCategoriesWithImages();
        };
        init();
    }, []);

    const ensureCategoriesExist = async () => {
        const requiredCats = [
            { name: 'Chombas', slug: 'chombas' },
            { name: 'Conjuntos', slug: 'conjuntos' }
        ];

        for (const cat of requiredCats) {
            const { data } = await supabase.from('categories').select('id').eq('slug', cat.slug).maybeSingle();
            if (!data) {
                console.log(`Auto-creating category: ${cat.name}`);
                await supabase.from('categories').insert(cat);
            }
        }
    };

    const fetchFeaturedProducts = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('show_on_home', true)
            .limit(4);
        setFeaturedProducts(data || []);
    };

    const fetchCategoriesWithImages = async () => {
        // Fetch categories
        const { data: cats } = await supabase.from('categories').select('*').order('name');

        if (!cats) return;

        // For each category, fetch one product image
        const catsWithImages = await Promise.all(cats.map(async (cat) => {
            const { data: products } = await supabase
                .from('products')
                .select('image_url, images')
                .eq('category_id', cat.id)
                .limit(1);

            let image = 'https://placehold.co/600x800/051626/D4AF37?text=' + cat.name;
            if (products && products.length > 0) {
                const p = products[0];
                if (p.images && p.images.length > 0) image = p.images[0];
                else if (p.image_url) image = p.image_url;
            }

            return { ...cat, image };
        }));

        setCategories(catsWithImages);
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/productos?category=${categoryId}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            // Simulated webhook call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStatus('success');
            setEmail('');
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow">
            <SEO
                title="Inicio"
                description="Bienvenido a All Inclusive. La mejor indumentaria masculina en Rosario. Encontrá pantalones, camisas, remeras y más."
                keywords="ropa hombre rosario, indumentaria masculina santa fe, moda hombre, all inclusive rosario"
            />
            <HeroCarousel />

            {/* Categories Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-serif text-center text-brand-dark mb-12">
                        Categorías
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className="relative group cursor-pointer overflow-hidden h-64 md:h-80"
                            >
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
                        <button
                            onClick={() => navigate('/productos')}
                            className="border-2 border-brand-dark text-brand-dark px-8 py-3 font-medium uppercase tracking-wider hover:bg-brand-dark hover:text-white transition-colors"
                        >
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
