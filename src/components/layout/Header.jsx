import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { cartCount } = useCart();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Spacer to prevent content jump when header is fixed */}
            <div className={`${isScrolled ? 'h-24' : 'h-48'} transition-all duration-500 hidden md:block`}></div>
            <div className="h-24 md:hidden"></div>

            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-white/5 ${isScrolled
                    ? 'bg-brand-dark/95 backdrop-blur-md shadow-xl py-2'
                    : 'bg-brand-dark py-6'
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center relative">

                        {/* Mobile Menu Button - Absolute Left */}
                        <button
                            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 text-brand-gold p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Navigation - Left Side (Desktop) */}
                        <nav className={`hidden md:flex items-center space-x-8 transition-all duration-500 ${isScrolled ? 'opacity-100' : 'opacity-100'}`}>
                            <Link to="/" className="text-sm uppercase tracking-widest text-gray-300 hover:text-brand-gold transition-colors font-medium">Inicio</Link>
                            <Link to="/productos" className="text-sm uppercase tracking-widest text-gray-300 hover:text-brand-gold transition-colors font-medium">Colección</Link>
                            <Link to="/productos" className="text-sm uppercase tracking-widest text-gray-300 hover:text-brand-gold transition-colors font-medium">Categorías</Link>
                        </nav>

                        {/* Logo - Center */}
                        <Link to="/" className="flex flex-col items-center group transition-all duration-500">
                            <h1 className={`font-serif text-brand-gold uppercase tracking-widest transition-all duration-500 ${isScrolled ? 'text-xl md:text-2xl' : 'text-3xl md:text-5xl'
                                }`}>
                                All Inclusive
                            </h1>
                            <span className={`text-gray-400 uppercase tracking-[0.4em] transition-all duration-500 group-hover:text-white ${isScrolled ? 'text-[0.5rem] md:text-[0.6rem] mt-0' : 'text-xs md:text-sm mt-2'
                                }`}>
                                For men
                            </span>
                        </Link>

                        {/* Icons - Right Side */}
                        <div className={`flex items-center space-x-6 ${isScrolled ? 'mt-0' : 'mt-4 md:mt-0'}`}>
                            {/* Desktop Extra Links */}
                            <div className="hidden md:flex space-x-6 mr-4 border-r border-white/10 pr-6">
                                <Link to="/contacto" className="text-sm uppercase tracking-widest text-gray-300 hover:text-brand-gold transition-colors font-medium">Contacto</Link>
                            </div>

                            <button className="text-brand-gold hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                            <Link to="/carrito" className="text-brand-gold hover:text-white transition-colors relative">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-dark text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100 mt-4 border-t border-white/10' : 'max-h-0 opacity-0'}`}>
                    <ul className="flex flex-col space-y-4 text-center py-6 text-sm uppercase tracking-widest text-gray-300 bg-brand-dark">
                        <li><Link to="/" className="block hover:text-brand-gold py-2" onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
                        <li><Link to="/productos" className="block hover:text-brand-gold py-2" onClick={() => setIsMenuOpen(false)}>Colección</Link></li>
                        <li><Link to="/productos" className="block hover:text-brand-gold py-2" onClick={() => setIsMenuOpen(false)}>Categorías</Link></li>
                        <li><Link to="/contacto" className="block hover:text-brand-gold py-2" onClick={() => setIsMenuOpen(false)}>Contacto</Link></li>
                    </ul>
                </div>
            </header>
        </>
    );
};

export default Header;
