import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get("code");

        // siempre guardamos en nombre de la dueña
        const user_id = "cliente_1";

        if (!code) {
            return new Response("Missing code", { status: 400 });
        }

        const clientId = Deno.env.get("MP_CLIENT_ID")!;
        const clientSecret = Deno.env.get("MP_CLIENT_SECRET")!;
        const redirectUri = "https://tpitmedayuzfjooxyzgm.supabase.co/functions/v1/mp_oauth_callback";

        // ---- IMPORTANTE: usar URLSearchParams ----
        const params = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri
        });

        const tokenResponse = await fetch("https://api.mercadopago.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params
        });

        const data = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("OAuth Error:", data);
            return new Response("OAuth Error: " + JSON.stringify(data), { status: 500 });
        }

        // guardar tokens
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        await supabase.from("mp_credentials").upsert({
            user_id,
            mp_user_id: data.user_id,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            token_type: data.token_type,
            scope: data.scope,
            updated_at: new Date().toISOString()
        });

        return new Response(`
            <h2>Cuenta vinculada con éxito ❤️</h2>
            <p>Ya podés recibir pagos en tu propia cuenta.</p>
        `, {
            headers: { "Content-Type": "text/html" }
        });

    } catch (e) {
        console.error(e);
        return new Response("Error interno: " + e.message, { status: 500 });
    }
});
