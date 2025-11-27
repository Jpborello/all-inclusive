import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="group bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="relative overflow-hidden aspect-[3/4]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {product.isNew && (
                    <span className="absolute top-2 left-2 bg-brand-dark text-white text-xs px-2 py-1 uppercase tracking-wider">
                        Nuevo
                    </span>
                )}
                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link to={`/producto/${product.id}`} className="bg-white text-brand-dark px-6 py-2 font-medium uppercase text-sm hover:bg-brand-gold transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                        Ver Detalle
                    </Link>
                </div>
            </div>

            <div className="p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-lg font-serif text-brand-dark mb-2 group-hover:text-brand-gold transition-colors">
                    {product.name}
                </h3>
                <p className="font-bold text-gray-900">
                    ${Number(product.price).toLocaleString('es-AR')}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
