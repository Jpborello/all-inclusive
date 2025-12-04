import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const clientSecret = Deno.env.get("MP_CLIENT_SECRET")!;

        // ------------------------------------------------------------
        // 1) VALIDAR FIRMA DE MERCADO PAGO (X-Signature)
        // ------------------------------------------------------------
        const signature = req.headers.get("x-signature");
        const requestId = req.headers.get("x-request-id");

        if (!signature || !requestId) {
            console.log("Sin firma, ignorado");
            return new Response("Missing signature", { status: 200 });
        }

        const params = Object.fromEntries(
            signature.split(",").map(part => part.split("="))
        );

        const expected = await crypto.subtle.verify(
            "HMAC",
            await crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(clientSecret),
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["verify"]
            ),
            Uint8Array.from(atob(params.v1), c => c.charCodeAt(0)),
            new TextEncoder().encode(`${requestId}${params.ts}`)
        );

        if (!expected) {
            console.log("Firma inválida, ignorado");
            return new Response("Invalid signature", { status: 200 });
        }

        // ------------------------------------------------------------
        // 2) PARSEAR EVENTO
        // ------------------------------------------------------------
        let body: any = {};
        try { body = await req.json(); } catch (_) {}

        const topic = body?.type || body?.topic;
        const eventId = body?.data?.id;

        if (!topic || !eventId) {
            console.log("Evento sin datos");
            return new Response("OK", { status: 200 });
        }

        console.log("Webhook recibido:", { topic, eventId });

        // ------------------------------------------------------------
        // 3) OBTENER ACCESS_TOKEN DE OAUTH DEL VENDEDOR
        // ------------------------------------------------------------
        const { data: creds } = await supabase
            .from("mp_credentials")
            .select("access_token, refresh_token")
            .eq("user_id", "cliente_1")
            .single();

        if (!creds) {
            console.log("No hay token OAuth del vendedor");
            return new Response("OK", { status: 200 });
        }

        let accessToken = creds.access_token;

        // helper para refresh
        async function refreshToken() {
            const params = new URLSearchParams({
                grant_type: "refresh_token",
                client_id: Deno.env.get("MP_CLIENT_ID")!,
                client_secret: Deno.env.get("MP_CLIENT_SECRET")!,
                refresh_token: creds.refresh_token,
            });

            const res = await fetch("https://api.mercadopago.com/oauth/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params
            });

            const data = await res.json();
            if (!res.ok) {
                console.error("Error refrescando token:", data);
                return accessToken;
            }

            await supabase.from("mp_credentials").upsert({
                user_id: "cliente_1",
                access_token: data.access_token,
                refresh_token: data.refresh_token
            });

            return data.access_token;
        }

        // ------------------------------------------------------------
        // 4) PROCESAR merchant_order
        // ------------------------------------------------------------
        if (topic === "merchant_order") {
            const orderRes = await fetch(
                `https://api.mercadopago.com/merchant_orders/${eventId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (orderRes.status === 401) {
                accessToken = await refreshToken();
                return await fetch(
                    `https://api.mercadopago.com/merchant_orders/${eventId}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
            }

            const order = await orderRes.json();

            console.log("merchant_order:", order);

            if (!order.payments?.length) {
                return new Response("OK", { status: 200 });
            }

            for (const p of order.payments) {
                await supabase.from("mp_payments").upsert({
                    payment_id: p.id?.toString(),
                    status: p.status,
                    status_detail: p.status_detail,
                    amount: p.total_paid_amount,
                    order_id: order.external_reference,
                    merchant_order_id: order.id?.toString(),
                });

                await supabase.from("pagos_historial").insert({
                    user_id: order.external_reference,
                    metodo: "Mercado Pago",
                    monto: p.total_paid_amount,
                    moneda: p.currency_id,
                    preference_id: p.preference_id,
                    payment_id: p.id?.toString(),
                    status: p.status,
                    fecha: new Date().toISOString(),
                    metadata: p
                });
            }

            return new Response("OK", { status: 200 });
        }

        // ------------------------------------------------------------
        // 5) PROCESAR payment
        // ------------------------------------------------------------
        if (topic === "payment") {
            const payRes = await fetch(
                `https://api.mercadopago.com/v1/payments/${eventId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (payRes.status === 401) {
                accessToken = await refreshToken();
            }

            const payment = await payRes.json();
            console.log("payment:", payment);

            await supabase.from("mp_payments").upsert({
                payment_id: payment.id.toString(),
                status: payment.status,
                status_detail: payment.status_detail,
                amount: payment.transaction_amount,
                payer_email: payment.payer?.email,
                order_id: payment.external_reference,
                merchant_order_id: payment.merchant_order_id?.toString(),
                preference_id: payment.preference_id
            });

            await supabase.from("pagos_historial").insert({
                user_id: payment.external_reference,
                metodo: "Mercado Pago",
                monto: payment.transaction_amount,
                moneda: payment.currency_id,
                preference_id: payment.preference_id,
                payment_id: payment.id.toString(),
                status: payment.status,
                fecha: new Date().toISOString(),
                metadata: payment
            });

            return new Response("OK", { status: 200 });
        }

        console.log("Evento ignorado:", topic);
        return new Response("ok", { status: 200 });

    } catch (err) {
        console.error("ERROR GENERAL WEBHOOK", err);
        return new Response("Internal Error", { status: 500 });
    }
});
