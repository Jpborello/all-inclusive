import React from 'react';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-dark text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-serif text-brand-gold tracking-widest uppercase">Admin Panel</h2>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    <Link to="/admin" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-white/5 hover:text-brand-gold">
                        Dashboard
                    </Link>
                    <Link to="/admin/products" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-white/5 hover:text-brand-gold bg-white/10 text-brand-gold">
                        Productos
                    </Link>
                    <Link to="/admin/orders" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-white/5 hover:text-brand-gold">
                        Órdenes
                    </Link>
                    <Link to="/admin/settings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-white/5 hover:text-brand-gold">
                        Configuración
                    </Link>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <Link to="/" className="block py-2 px-4 text-sm text-gray-400 hover:text-white">
                        &larr; Volver a la Tienda
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center md:hidden">
                    <h2 className="text-lg font-serif text-brand-dark">Admin</h2>
                    <button className="text-gray-500 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
