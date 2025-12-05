import React, { useState } from 'react';
import { supabase } from '../../supabase/client';

const CategorySetup = () => {
    const [status, setStatus] = useState('idle');
    const [logs, setLogs] = useState([]);

    const categoriesToAdd = [
        { name: 'Boxer', slug: 'boxer' },
        { name: 'Accesorios', slug: 'accesorios' },
        { name: 'Sudaderas', slug: 'sudaderas' },
        { name: 'Musculosas', slug: 'musculosas' }
    ];

    const addLog = (msg) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    const handleSetup = async () => {
        setStatus('loading');
        setLogs([]);
        addLog('Iniciando carga de categorías...');

        try {
            for (const cat of categoriesToAdd) {
                // Check if exists
                const { data: existing } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('name', cat.name)
                    .single();

                if (existing) {
                    addLog(`Categoría "${cat.name}" ya existe. Saltando.`);
                } else {
                    const { error } = await supabase
                        .from('categories')
                        .insert([cat]);

                    if (error) {
                        addLog(`Error al crear "${cat.name}": ${error.message}`);
                    } else {
                        addLog(`Categoría "${cat.name}" creada exitosamente.`);
                    }
                }
            }
            setStatus('success');
            addLog('Proceso finalizado.');
        } catch (error) {
            console.error(error);
            setStatus('error');
            addLog(`Error general: ${error.message}`);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Configuración de Categorías</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="font-semibold mb-4">Categorías a agregar:</h2>
                <ul className="list-disc pl-5 mb-6">
                    {categoriesToAdd.map(c => (
                        <li key={c.slug}>{c.name}</li>
                    ))}
                </ul>

                <button
                    onClick={handleSetup}
                    disabled={status === 'loading'}
                    className="bg-brand-gold text-brand-dark px-6 py-2 font-bold rounded hover:bg-opacity-90 disabled:opacity-50"
                >
                    {status === 'loading' ? 'Procesando...' : 'Agregar Categorías'}
                </button>
            </div>

            <div className="bg-gray-100 p-4 rounded border font-mono text-sm h-64 overflow-y-auto">
                {logs.length === 0 ? <span className="text-gray-400">Esperando inicio...</span> : logs.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
            </div>
        </div>
    );
};

export default CategorySetup;
