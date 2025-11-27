import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-brand-dark text-white pt-12 pb-6 border-t border-brand-gold/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="mb-4">
                            <h3 className="text-2xl font-serif text-brand-gold tracking-widest uppercase">All Inclusive</h3>
                            <span className="text-xs text-gray-500 tracking-[0.3em] uppercase">for men</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Estilo, elegancia y calidad para el hombre moderno.
                            Tu destino definitivo para la moda masculina.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-lg font-serif text-white mb-4">Navegación</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-brand-gold transition-colors">Inicio</Link></li>
                            <li><Link to="/productos" className="hover:text-brand-gold transition-colors">Productos</Link></li>
                            <li><Link to="/productos" className="hover:text-brand-gold transition-colors">Ofertas</Link></li>
                            <li><Link to="/contacto" className="hover:text-brand-gold transition-colors">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-serif text-white mb-4">Ayuda</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/envios" className="hover:text-brand-gold transition-colors">Envíos y Devoluciones</Link></li>
                            <li><Link to="/faq" className="hover:text-brand-gold transition-colors">Preguntas Frecuentes</Link></li>
                            <li><Link to="/talles" className="hover:text-brand-gold transition-colors">Guía de Talles</Link></li>
                            <li><Link to="/privacidad" className="hover:text-brand-gold transition-colors">Políticas de Privacidad</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-serif text-white mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center">
                                <span className="mr-2">📍</span> Calle Falsa 123, Buenos Aires
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">📞</span> +54 11 1234-5678
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">✉️</span> contacto@formen.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} All Inclusive. Todos los derechos reservados.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        {/* Social Icons Placeholders */}
                        <a href="#" className="hover:text-brand-gold">Instagram</a>
                        <a href="#" className="hover:text-brand-gold">Facebook</a>
                        <a href="#" className="hover:text-brand-gold">Twitter</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
