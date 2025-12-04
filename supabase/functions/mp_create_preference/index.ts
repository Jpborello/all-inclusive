import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {

    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { items, user_id, seller_id } = await req.json();

        if (!items || !user_id) {
            throw new Error("Missing items or user_id");
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // ----------------------------------------------
        // 1. Determinar vendedor al que se le acredita
        // ----------------------------------------------
        const vendedor = seller_id || user_id;

        console.log("Buscando credenciales para:", vendedor);

        const { data: creds, error: credsError } = await supabase
            .from("mp_credentials")
            .select("access_token")
            .eq("user_id", vendedor)
            .single();

        if (credsError || !creds) {
            console.error("No se encontraron tokens OAuth:", credsError);
            throw new Error("Seller account is not connected to Mercado Pago");
        }

        console.log("TOKEN ENCONTRADO OK");

        // ----------------------------------------------
        // 2. Crear preference
        // ----------------------------------------------
        const preferenceData = {
            items,
            external_reference: String(user_id),

            metadata: {
                user_id,
                seller_id: vendedor,
                items,
            },

            back_urls: {
                success: "https://allinclusive.com/success",
                failure: "https://allinclusive.com/failure",
                pending: "https://allinclusive.com/pending",
            },

            auto_return: "approved",

            notification_url:
                "https://tpitmedayuzfjooxyzgm.supabase.co/functions/v1/mp_webhook",
        };
        console.log("ACCESS TOKEN QUE ESTOY USANDO:", creds.access_token);
        const mpResponse = await fetch(
            "https://api.mercadopago.com/checkout/preferences",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${creds.access_token}`,
                },
                body: JSON.stringify(preferenceData),
            }
        );

        const mpData = await mpResponse.json();

        if (!mpResponse.ok) {
            console.error("MP Error:", mpData);
            throw new Error(`Mercado Pago Error: ${JSON.stringify(mpData)}`);
        }

        return new Response(
            JSON.stringify({
                init_point: mpData.init_point,
                preference_id: mpData.id,
                sandbox_init_point: mpData.sandbox_init_point,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    catch (error) {
        console.error("CREATE PREFERENCE ERROR:", error);

        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
