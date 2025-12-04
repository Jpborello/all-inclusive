import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';

const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            console.log("🚀 Cargando ProtectedRoute...");

            const sessionResp = await supabase.auth.getSession();
            console.log("🔐 Respuesta getSession:", sessionResp);

            const session = sessionResp?.data?.session;
            setSession(session);

            if (!session) {
                console.log("❗ No hay sesión activa, redirigiendo...");
                setLoading(false);
                return;
            }

            console.log("🟡 Usuario logueado:", session.user.id);

            const { data: roleData, error: roleError } = await supabase
                .from("users_roles")
                .select("role")
                .eq("user_id", session.user.id)
                .single();

            console.log("📌 Rol consultado:", roleData, " error:", roleError);

            setRole(roleData?.role || null);
            setLoading(false);
        };

        load();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            console.log("🔄 Cambio de auth detectado, recargando...");
            load();
        });

        return () => subscription.unsubscribe();
    }, []);


    // ⏳ Mientras consulta supabase
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    // ❌ No logueado
    if (!session) return <Navigate to="/admin/login" replace />;

    // ❌ Logueado pero sin rol admin
    if (role !== "admin") {
        console.log("🚫 Rol denegado:", role);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
