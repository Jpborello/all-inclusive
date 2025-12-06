import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';
import LocationMap from '../common/LocationMap';

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
                                <span className="mr-2">📍</span> Mendoza 6440, Rosario
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">📞</span> +54 341 284-4169
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">✉️</span> contacto@allinclusive.com.ar
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mb-8 border-t border-brand-gold/10 pt-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/3 text-center md:text-left">
                            <h4 className="text-xl font-serif text-brand-gold mb-2">Visítanos</h4>
                            <p className="text-gray-400 text-sm mb-4">
                                Vení a conocer nuestro showroom exclusivo en el corazón de Rosario.
                                Atención personalizada y el mejor asesoramiento.
                            </p>
                            <button className="text-brand-gold border border-brand-gold px-6 py-2 text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-colors">
                                Cómo llegar
                            </button>
                        </div>
                        <div className="w-full md:w-2/3 h-64">
                            <LocationMap />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} All Inclusive. Todos los derechos reservados.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="https://www.instagram.com/allinclusiveindumentaria/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors" aria-label="Instagram">
                            <Instagram size={20} />
                        </a>
                        <a href="https://wa.me/543412844169" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors" aria-label="WhatsApp">
                            <MessageCircle size={20} />
                        </a>
                    </div>
                </div>

                {/* Developer Credit */}
                <div className="text-[12px] opacity-80 mt-6 text-center text-gray-500">
                    Desarrollado por <a href="https://neo-core-sys.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-gold transition-colors no-underline">Neo Core Sys</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
