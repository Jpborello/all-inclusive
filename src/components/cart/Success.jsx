import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Success = () => {
    const { clearCart } = useCart();
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');

    useEffect(() => {
        // Clear cart immediately upon landing on this page
        clearCart();
    }, []);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-serif text-brand-dark mb-4">¡Gracias por tu compra!</h1>
                    <p className="text-gray-600 mb-2">
                        Tu pago ha sido procesado correctamente.
                    </p>
                    {paymentId && (
                        <p className="text-sm text-gray-500 mb-6">
                            ID de pago: <span className="font-mono">{paymentId}</span>
                        </p>
                    )}
                    <p className="text-sm text-gray-500">
                        Te enviamos un email con los detalles de tu pedido.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/"
                        className="block w-full bg-brand-dark text-brand-gold py-3 rounded font-medium hover:bg-black transition-colors uppercase tracking-wider"
                    >
                        Volver al Inicio
                    </Link>
                    <Link
                        to="/productos"
                        className="block w-full border border-gray-300 text-gray-700 py-3 rounded font-medium hover:bg-gray-50 transition-colors"
                    >
                        Seguir Comprando
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Success;
