import React, { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import { supabase } from '../../supabase/client';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState(300000);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    categories (
                        name
                    )
                `);

            if (error) throw error;

            // Map Supabase data to match ProductCard props
            const formattedProducts = data.map(product => ({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image_url,
                category: product.categories?.name,
                isNew: false // You could add a logic for this later
            }));

            setProducts(formattedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (categoryName) => {
        if (categoryName === 'Todas') {
            setSelectedCategories([]);
            return;
        }

        setSelectedCategories(prev => {
            if (prev.includes(categoryName)) {
                return prev.filter(c => c !== categoryName);
            } else {
                return [...prev, categoryName];
            }
        });
    };

    const filteredProducts = products.filter(product => {
        // Category Filter
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);

        // Price Filter
        const priceMatch = product.price <= priceRange;

        return categoryMatch && priceMatch;
    });

    const categoriesList = [
        'Remeras', 'Camisas', 'Bermudas', 'Camperas', 'Pantalon Gabardina', 'Short Baño'
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-serif text-xl mb-6 pb-2 border-b border-gray-100">Filtros</h3>

                        {/* Categories */}
                        <div className="mb-8">
                            <h4 className="font-medium mb-3 uppercase text-sm tracking-wider">Categorías</h4>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li>
                                    <label className="flex items-center cursor-pointer hover:text-brand-gold transition-colors">
                                        <input
                                            type="checkbox"
                                            className="mr-2 accent-brand-gold"
                                            checked={selectedCategories.length === 0}
                                            onChange={() => toggleCategory('Todas')}
                                        />
                                        Todas
                                    </label>
                                </li>
                                {categoriesList.map(cat => (
                                    <li key={cat}>
                                        <label className="flex items-center cursor-pointer hover:text-brand-gold transition-colors">
                                            <input
                                                type="checkbox"
                                                className="mr-2 accent-brand-gold"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleCategory(cat)}
                                            />
                                            {cat}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            <h4 className="font-medium mb-3 uppercase text-sm tracking-wider">Precio</h4>
                            <input
                                type="range"
                                min="0"
                                max="300000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full accent-brand-gold"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>$0</span>
                                <span>${parseInt(priceRange).toLocaleString('es-AR')}</span>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <h4 className="font-medium mb-3 uppercase text-sm tracking-wider">Talle</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <button key={size} className="border border-gray-200 py-1 text-sm hover:border-brand-gold hover:text-brand-gold transition-colors">
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="flex-grow">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-serif text-brand-dark">
                            {selectedCategories.length === 0 ? 'Todos los Productos' : selectedCategories.join(', ')}
                        </h2>
                        <select className="border-none bg-transparent text-sm font-medium focus:ring-0 cursor-pointer">
                            <option>Más Recientes</option>
                            <option>Menor Precio</option>
                            <option>Mayor Precio</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    No se encontraron productos en esta categoría.
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductList;
