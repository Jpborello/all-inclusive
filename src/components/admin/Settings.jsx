import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        store_name: '',
        logo_url: '',
        primary_color: '#D4AF37',
        secondary_color: '#1A1A1A',
        contact_email: '',
        contact_phone: '',
        instagram_url: '',
        facebook_url: '',
        mercado_pago_public_key: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('store_settings')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Check if row exists
            const { data: existing } = await supabase.from('store_settings').select('id').single();

            let error;
            if (existing) {
                const { error: updateError } = await supabase
                    .from('store_settings')
                    .update(settings)
                    .eq('id', existing.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('store_settings')
                    .insert([settings]);
                error = insertError;
            }

            if (error) throw error;
            alert('Configuración guardada correctamente.');
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando configuración...</div>;

    return (
        <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-serif text-brand-dark mb-8">Configuración de la Tienda</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">

                {/* General Info */}
                <section>
                    <h2 className="text-xl font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">Información General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Tienda</label>
                            <input
                                type="text"
                                name="store_name"
                                value={settings.store_name}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL del Logo</label>
                            <input
                                type="text"
                                name="logo_url"
                                value={settings.logo_url || ''}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </section>

                {/* Colors */}
                <section>
                    <h2 className="text-xl font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">Apariencia</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color Principal (Gold)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    name="primary_color"
                                    value={settings.primary_color}
                                    onChange={handleChange}
                                    className="h-10 w-10 border-none rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    name="primary_color"
                                    value={settings.primary_color}
                                    onChange={handleChange}
                                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold uppercase"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color Secundario (Dark)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    name="secondary_color"
                                    value={settings.secondary_color}
                                    onChange={handleChange}
                                    className="h-10 w-10 border-none rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    name="secondary_color"
                                    value={settings.secondary_color}
                                    onChange={handleChange}
                                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold uppercase"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="text-xl font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">Contacto y Redes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto</label>
                            <input
                                type="email"
                                name="contact_email"
                                value={settings.contact_email || ''}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp</label>
                            <input
                                type="text"
                                name="contact_phone"
                                value={settings.contact_phone || ''}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                            <input
                                type="text"
                                name="instagram_url"
                                value={settings.instagram_url || ''}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                            <input
                                type="text"
                                name="facebook_url"
                                value={settings.facebook_url || ''}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold"
                            />
                        </div>
                    </div>
                </section>

                {/* Payments */}
                <section>
                    <h2 className="text-xl font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">Pagos (Mercado Pago)</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Public Key</label>
                        <input
                            type="text"
                            name="mercado_pago_public_key"
                            value={settings.mercado_pago_public_key || ''}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold"
                            placeholder="TEST-..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Esta clave se usará en el frontend para el checkout.</p>
                    </div>
                </section>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-brand-dark text-brand-gold px-8 py-3 rounded hover:bg-black transition-colors uppercase tracking-wider font-medium disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
