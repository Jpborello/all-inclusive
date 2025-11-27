import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-serif text-brand-dark mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-600 mb-8">Parece que aún no has agregado productos.</p>
                <Link to="/productos" className="bg-brand-gold text-brand-dark px-8 py-3 font-medium uppercase tracking-wider hover:bg-yellow-600 transition-colors">
                    Ver Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-serif text-brand-dark mb-8">Carrito de Compras</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="flex-grow space-y-6">
                    {cart.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex flex-col sm:flex-row items-center bg-white p-4 shadow-sm border border-gray-100 gap-4">
                            <img src={item.image} alt={item.name} className="w-24 h-32 object-cover" />

                            <div className="flex-grow text-center sm:text-left">
                                <h3 className="font-serif text-lg text-brand-dark">{item.name}</h3>
                                <p className="text-sm text-gray-500 uppercase">Talle: {item.size}</p>
                                <p className="text-brand-gold font-bold mt-1">${item.price.toLocaleString('es-AR')}</p>
                            </div>

                            <div className="flex items-center border border-gray-200">
                                <button
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <span className="w-10 text-center text-sm">{item.quantity}</span>
                                <button
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id, item.size)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-gray-50 p-6 sticky top-4">
                        <h3 className="font-serif text-xl mb-6 pb-2 border-b border-gray-200">Resumen</h3>

                        <div className="flex justify-between mb-4 text-gray-600">
                            <span>Subtotal</span>
                            <span>${cartTotal.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-600">
                            <span>Envío</span>
                            <span className="text-green-600 font-medium">Gratis</span>
                        </div>

                        <div className="flex justify-between mb-8 text-xl font-bold text-brand-dark border-t border-gray-200 pt-4">
                            <span>Total</span>
                            <span>${cartTotal.toLocaleString('es-AR')}</span>
                        </div>

                        <Link to="/checkout" className="block w-full bg-brand-gold text-brand-dark text-center px-6 py-3 font-bold uppercase tracking-wider hover:bg-yellow-600 transition-colors">
                            Iniciar Compra
                        </Link>

                        <Link to="/productos" className="block w-full text-center mt-4 text-sm text-gray-500 hover:text-brand-dark underline">
                            Seguir comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
