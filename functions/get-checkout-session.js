import Stripe from "stripe";
import { captureError } from "./telemetry";

/**
 * GET /get-checkout-session?session_id=cs_test_...
 * Returns a sanitized summary of the Checkout Session for the thank-you page.
 */
export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return new Response("Missing session_id", { status: 400 });
  }

  const secretKey = env?.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response("Missing Stripe env", { status: 500 });
  }

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "subscription", "customer_details"],
    });

    // Extract payment method details (card brand/last4) if available
    let paymentMethod = null;
    if (session.payment_intent) {
      const paymentIntent =
        typeof session.payment_intent === "string"
          ? await stripe.paymentIntents.retrieve(session.payment_intent, {
              expand: ["latest_charge.payment_method_details.card"],
            })
          : session.payment_intent;

      const charge = paymentIntent.latest_charge;
      const chargeObj =
        typeof charge === "string"
          ? await stripe.charges.retrieve(charge)
          : charge;

      const card = chargeObj?.payment_method_details?.card;
      if (card) {
        paymentMethod = `${card.brand ?? "card"} **** ${card.last4 ?? ""}`.trim();
      }
    }

    const amount = session.amount_total;
    const currency = session.currency;
    const created = session.created ? new Date(session.created * 1000).toISOString() : null;

    const priceType = session.metadata?.price_type ?? null;
    const transactionId =
      (session.payment_intent &&
        (typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent.id)) ||
      (session.subscription &&
        (typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id)) ||
      null;

    const customerName =
      session.customer_details?.name ||
      session.metadata?.customer_name ||
      null;

    const responseBody = {
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      mode: session.mode,
      amount_total: amount,
      currency,
      created,
      price_type: priceType,
      payment_method: paymentMethod,
      transaction_id: transactionId,
      customer_name: customerName,
    };

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    captureError(err, { stage: "get_checkout_session", sessionId }, env);
    return new Response("Stripe session lookup failed", { status: 500 });
  }
}
