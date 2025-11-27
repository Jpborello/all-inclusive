import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(name)')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            // navigate('/productos'); // Optional: redirect on error
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity, selectedSize);
        navigate('/carrito');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-serif text-brand-dark mb-4">Producto no encontrado</h2>
                <button
                    onClick={() => navigate('/productos')}
                    className="text-brand-gold hover:underline"
                >
                    Volver a la tienda
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg shadow-sm">
                        <img
                            src={product.image_url || 'https://via.placeholder.com/600x800?text=Sin+Imagen'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Info */}
                <div>
                    <span className="text-brand-gold uppercase tracking-widest text-sm font-bold mb-2 block">
                        {product.categories?.name || 'Indumentaria'}
                    </span>
                    <h1 className="text-4xl font-serif text-brand-dark mb-4">{product.name}</h1>
                    <p className="text-3xl font-light text-gray-900 mb-8">
                        ${Number(product.price).toLocaleString('es-AR')}
                    </p>

                    <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
                        {product.description || 'Sin descripción disponible.'}
                    </p>

                    {/* Size Selector */}
                    <div className="mb-8">
                        <h4 className="font-medium mb-3 uppercase text-sm tracking-wider">Seleccionar Talle</h4>
                        <div className="flex space-x-3">
                            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 flex items-center justify-center border transition-colors ${selectedSize === size
                                        ? 'bg-brand-dark text-white border-brand-dark'
                                        : 'border-gray-200 hover:border-brand-gold text-gray-600'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity & Add */}
                    <div className="flex space-x-4 mb-8">
                        <div className="flex border border-gray-200 w-32 rounded">
                            <button
                                className="w-10 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                -
                            </button>
                            <input
                                type="text"
                                value={quantity}
                                readOnly
                                className="w-full text-center border-none focus:ring-0 text-gray-900 font-medium"
                            />
                            <button
                                className="w-10 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className={`flex-grow font-bold uppercase tracking-wider transition-colors py-3 rounded shadow-lg ${product.stock > 0
                                    ? 'bg-brand-gold text-brand-dark hover:bg-yellow-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="border-t border-gray-100 pt-6 space-y-3 text-sm text-gray-500">
                        <p>🚚 Envío gratis a todo el país</p>
                        <p>↩️ Devolución sin cargo dentro de los 30 días</p>
                        <p>🔒 Compra protegida y segura</p>
                        {product.stock > 0 && <p className="text-green-600">✅ Stock disponible: {product.stock} unidades</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
