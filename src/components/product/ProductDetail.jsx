import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import { useCart } from '../../context/CartContext';
import SEO from '../common/SEO';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    categories (name)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            navigate('/productos');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        // Check if product has sizes and none selected
        const hasSizes = product.sizes && Object.values(product.sizes).some(qty => qty > 0);

        if (hasSizes && !selectedSize) {
            setError('Por favor seleccioná un talle.');
            return;
        }

        addToCart(product, 1, selectedSize);
        // Optional: Show success message or open cart drawer
        alert('Producto agregado al carrito!');
    };

    if (loading) return <div className="container mx-auto px-4 py-12 text-center">Cargando...</div>;
    if (!product) return null;

    const hasSizes = product.sizes && Object.keys(product.sizes).length > 0;
    const sortedSizes = hasSizes ? Object.entries(product.sizes)
        .filter(([_, qty]) => qty > 0) // Filter out sizes with 0 stock
        .sort((a, b) => {
            const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXX'];
            return order.indexOf(a[0]) - order.indexOf(b[0]);
        }) : [];

    return (
        <div className="container mx-auto px-4 py-12">
            <SEO
                title={product.name}
                description={product.description}
                image={product.image_url}
                url={`/producto/${product.id}`}
                keywords={`${product.name}, ${product.categories?.name}, ropa hombre, rosario`}
                type="product"
            />
            <div className="flex flex-col md:flex-row gap-8">
                {/* Image Gallery */}
                <div className="w-full md:w-1/2">
                    <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <img
                            src={product.images && product.images.length > 0 ? (product.images[selectedImageIndex] || product.images[0]) : (product.image_url || 'https://placehold.co/600x600?text=No+Image')}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedImageIndex === index ? 'border-brand-gold opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2">
                    <div className="mb-6">
                        <h2 className="text-sm text-brand-gold uppercase tracking-wider font-semibold mb-2">
                            {product.categories?.name}
                        </h2>
                        <h1 className="text-3xl font-serif text-brand-dark mb-4">{product.name}</h1>
                        <p className="text-2xl font-medium text-gray-900">
                            ${Number(product.price).toLocaleString('es-AR')}
                        </p>
                    </div>

                    <div className="prose prose-sm text-gray-500 mb-8">
                        <p>{product.description}</p>
                    </div>

                    {/* Size Selector */}
                    {hasSizes && sortedSizes.some(([_, qty]) => qty > 0) && (
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Seleccionar Talle</h3>
                            <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                                {sortedSizes.map(([size, qty]) => {
                                    const isAvailable = qty > 0;
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => {
                                                if (isAvailable) {
                                                    setSelectedSize(size);
                                                    setError('');
                                                }
                                            }}
                                            disabled={!isAvailable}
                                            className={`
                                                group relative border rounded-md py-3 px-4 flex flex-col items-center justify-center text-sm font-medium uppercase transition-all duration-200 focus:outline-none sm:flex-1
                                                ${selectedSize === size
                                                    ? 'bg-brand-gold border-brand-gold text-brand-dark shadow-md scale-105'
                                                    : 'bg-brand-dark border-brand-dark text-white hover:bg-opacity-90 hover:shadow-lg'
                                                }
                                            `}
                                        >
                                            <span className="font-bold text-lg">{size}</span>
                                            {isAvailable && (
                                                <span className={`text-[10px] mt-1 font-semibold ${selectedSize === size ? 'text-brand-dark/80' : 'text-brand-gold'}`}>
                                                    ({qty} disp.)
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`flex-1 bg-brand-dark text-brand-gold py-4 px-8 rounded hover:bg-black transition-colors uppercase tracking-widest font-medium
                                ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                        </button>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-8">
                        <div className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Envío gratis en compras superiores a $100.000
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Devoluciones gratis dentro de los 30 días
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
