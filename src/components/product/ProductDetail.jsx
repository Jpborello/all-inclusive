import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../../data/mockData';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Mock finding product (in real app use id)
    const product = products.find(p => p.id == id) || products[0];
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedSize);
        // Optional: Show feedback or navigate to cart
        navigate('/carrito');
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                                <img src={product.image} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div>
                    <span className="text-brand-gold uppercase tracking-widest text-sm font-bold mb-2 block">
                        {product.category}
                    </span>
                    <h1 className="text-4xl font-serif text-brand-dark mb-4">{product.name}</h1>
                    <p className="text-3xl font-light text-gray-900 mb-8">
                        ${product.price.toLocaleString('es-AR')}
                    </p>

                    <p className="text-gray-600 leading-relaxed mb-8">
                        Confeccionada con los mejores materiales, esta prenda combina elegancia y comodidad.
                        Ideal para el hombre moderno que busca destacar en cualquier ocasión.
                        Corte perfecto y acabados de alta calidad.
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
                        <div className="flex border border-gray-200 w-32">
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
                            className="flex-grow bg-brand-gold text-brand-dark font-bold uppercase tracking-wider hover:bg-yellow-600 transition-colors py-3"
                        >
                            Agregar al Carrito
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="border-t border-gray-100 pt-6 space-y-3 text-sm text-gray-500">
                        <p>🚚 Envío gratis a todo el país</p>
                        <p>↩️ Devolución sin cargo dentro de los 30 días</p>
                        <p>🔒 Compra protegida y segura</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
