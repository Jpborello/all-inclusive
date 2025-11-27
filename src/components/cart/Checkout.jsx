import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../supabase/client';

const Checkout = () => {
    const { cart, cartTotal } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. Create Order (Simplified for now)
            // In a real app, you would create the order in the 'orders' table first.

            // 2. Decrease Stock for each item
            for (const item of cart) {
                const { error } = await supabase.rpc('decrease_stock', {
                    product_id: item.id,
                    quantity_sold: item.quantity
                });

                if (error) throw error;
            }

            alert('¡Compra realizada con éxito! El stock ha sido actualizado.');
            // Clear cart or redirect would go here

        } catch (error) {
            console.error('Error processing order:', error);
            alert('Hubo un error al procesar la compra: ' + error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-serif text-brand-dark mb-8 text-center">Finalizar Compra</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Shipping Form */}
                <div>
                    <h2 className="text-xl font-serif text-brand-dark mb-6 pb-2 border-b border-gray-200">Datos de Envío</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-brand-gold"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-brand-gold"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-brand-gold"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-brand-gold"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Ciudad</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-brand-gold"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Código Postal</label>
                                <input
                                    type="text"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-brand-gold"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Order Summary & Payment */}
                <div>
                    <div className="bg-gray-50 p-8 sticky top-4">
                        <h2 className="text-xl font-serif text-brand-dark mb-6 pb-2 border-b border-gray-200">Tu Pedido</h2>

                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <span className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full text-xs mr-3 font-bold text-gray-600">
                                            {item.quantity}
                                        </span>
                                        <div>
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-gray-500 text-xs">Talle: {item.size}</p>
                                        </div>
                                    </div>
                                    <span className="font-medium text-gray-800">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-2 mb-8">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${cartTotal.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Envío</span>
                                <span className="text-green-600 font-medium">Gratis</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-brand-dark pt-2">
                                <span>Total</span>
                                <span>${cartTotal.toLocaleString('es-AR')}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-brand-gold text-brand-dark py-4 font-bold uppercase tracking-wider hover:bg-yellow-600 transition-colors shadow-lg"
                        >
                            Pagar con Mercado Pago
                        </button>

                        <div className="mt-4 flex justify-center space-x-2 opacity-60">
                            {/* Payment Icons Placeholders */}
                            <div className="w-8 h-5 bg-gray-300 rounded"></div>
                            <div className="w-8 h-5 bg-gray-300 rounded"></div>
                            <div className="w-8 h-5 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
