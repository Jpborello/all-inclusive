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
        const { items, user_id, origin } = await req.json();

        if (!items) {
            throw new Error("Missing items");
        }

        // Use the Access Token directly from environment variables
        const accessToken = Deno.env.get("MP_ACCESS_TOKEN");

        if (!accessToken) {
            console.error("MP_ACCESS_TOKEN not set in Edge Function secrets");
            throw new Error("Server configuration error: Missing MP_ACCESS_TOKEN");
        }

        console.log("Creating preference with provided items...");

        // FIX: Using public HTTPS URL because Mercado Pago rejects localhost for auto_return
        const baseUrl = "https://allinclusive.com.ar";

        console.log("DEBUG: Using Hardcoded Base URL:", baseUrl);

        // ----------------------------------------------
        // 2. Crear preference
        // ----------------------------------------------
        const preferenceData = {
            items,
            external_reference: user_id ? String(user_id) : "guest",

            metadata: {
                user_id: user_id || "guest",
                items_count: items.length
            },

            back_urls: {
                success: `${baseUrl}/success`,
                failure: `${baseUrl}/failure`,
                pending: `${baseUrl}/pending`,
            },

            auto_return: "approved",

            notification_url: "https://tpitmedayuzfjooxyzgm.supabase.co/functions/v1/mp_webhook",
        };

        console.log("DEBUG: Preference Data to be sent:", JSON.stringify(preferenceData));

        const mpResponse = await fetch(
            "https://api.mercadopago.com/checkout/preferences",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(preferenceData),
            }
        );

        const mpData = await mpResponse.json();

        if (!mpResponse.ok) {
            console.error("MP Error:", mpData);
            throw new Error(`Mercado Pago Error: ${JSON.stringify(mpData)}`);
        }

        console.log("Preference created successfully:", mpData.id);

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

        // Return detailed error for debugging
        return new Response(
            JSON.stringify({
                error: error.message,
                details: error.toString()
            }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
