import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Leemos las credenciales del usuario único (allinclusive)
        const { data, error } = await supabase
            .from("mp_credentials")
            .select("*")
            .eq("user_id", "allinclusive")
            .single();

        if (error || !data) {
            console.error("No stored credentials", error);
            return new Response("No stored credentials", { status: 500 });
        }

        const clientId = Deno.env.get("MP_CLIENT_ID")!;
        const clientSecret = Deno.env.get("MP_CLIENT_SECRET")!;

        // Llamada a Mercado Pago para renovar token
        const refreshResponse = await fetch(
            "https://api.mercadopago.com/oauth/token",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: "refresh_token",
                    refresh_token: data.refresh_token,
                }),
            }
        );

        const refreshData = await refreshResponse.json();

        if (!refreshResponse.ok) {
            console.error("Error refreshing token:", refreshData);
            return new Response("Error refreshing token", { status: 500 });
        }

        // Guardamos los nuevos tokens
        await supabase.from("mp_credentials").update({
            access_token: refreshData.access_token,
            refresh_token: refreshData.refresh_token,
            expires_in: refreshData.expires_in,
            obtained_at: new Date().toISOString(),
        }).eq("user_id", "allinclusive");

        return new Response("Token refreshed OK ✔️");
    } catch (e) {
        console.error("Refresh error:", e);
        return new Response("Internal error", { status: 500 });
    }
});
