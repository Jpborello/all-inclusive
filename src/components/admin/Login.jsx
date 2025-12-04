import React, { useState } from 'react';
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log("🔵 Intentando login con:", email);

        try {
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            console.log("🟢 Respuesta login:", loginData, loginError);

            if (loginError) throw loginError;

            const user = loginData.user;
            console.log("👤 Usuario:", user.id);

            const { data: roleData, error: roleError } = await supabase
                .from("users_roles")
                .select("role")
                .eq("user_id", user.id)
                .single();

            console.log("📄 Role encontrado:", roleData);

            if (roleError) {
                console.error("❌ Error roles:", roleError);
                throw new Error("No tienes un rol asignado. Contactar al administrador.");
            }

            if (roleData.role !== "admin") {
                console.warn("⚠ Usuario no es admin");
                throw new Error("No tienes permisos para acceder al panel.");
            }

            console.log("🚀 Acceso permitido, redirigiendo...");
            navigate('/admin');

        } catch (error) {
            console.error("❗ ERROR LOGIN:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif text-brand-dark uppercase tracking-widest">Admin Panel</h2>
                    <p className="text-gray-500 text-sm mt-2 tracking-wider">All Inclusive For Men</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-gold"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-gold"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-dark text-brand-gold font-bold py-3 px-4 rounded hover:bg-black transition-colors uppercase tracking-wider disabled:opacity-50"
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
