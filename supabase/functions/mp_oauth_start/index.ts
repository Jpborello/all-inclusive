import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { user_id } = await req.json();

        if (!user_id) {
            throw new Error('Missing user_id');
        }

        const client_id = Deno.env.get('MP_CLIENT_ID');
        const redirect_uri = Deno.env.get('MP_REDIRECT_URI');

        // Generate a secure random state (in production, store this to validate later)
        const state = crypto.randomUUID();

        // Construct Authorization URL
        // See: https://www.mercadopago.com.ar/developers/en/docs/your-integrations/credentials/oauth
        const authorization_url = `https://auth.mercadopago.com.ar/authorization?client_id=${client_id}&response_type=code&platform_id=mp&state=${state}&redirect_uri=${redirect_uri}`;

        return new Response(
            JSON.stringify({ authorization_url, state }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
