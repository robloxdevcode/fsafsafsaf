const ALLOWED_PRICES = new Set([
  "price_1UY33uE3W2ZkfW0P7LWwJ2Xe",
  "price_1UY34aE3W2ZkfW0Pe2gZlpRp",
  "price_1UY35ME3W2ZkfW0Pz4UzGJZT",
  "price_1UY366E3W2ZkfW0PWOy0Uc0X",
]);

const SUCCESS_URL = "https://claim.boostdock.eu?session_id={CHECKOUT_SESSION_ID}";
const CANCEL_URL = "https://boostdock.eu/#shop";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(503).json({ error: "not_configured" });

  let priceId = req.body?.priceId;
  if (typeof req.body === "string") {
    try {
      priceId = JSON.parse(req.body).priceId;
    } catch {
      /* ignore */
    }
  }

  if (!priceId || !ALLOWED_PRICES.has(priceId)) {
    return res.status(400).json({ error: "invalid_price" });
  }

  try {
    const priceRes = await fetch(`https://api.stripe.com/v1/prices/${encodeURIComponent(priceId)}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!priceRes.ok) return res.status(400).json({ error: "price_not_found" });
    const price = await priceRes.json();
    const mode = price.type === "recurring" ? "subscription" : "payment";

    const params = new URLSearchParams();
    params.set("mode", mode);
    params.set("success_url", SUCCESS_URL);
    params.set("cancel_url", CANCEL_URL);
    params.set("line_items[0][price]", priceId);
    params.set("line_items[0][quantity]", "1");

    const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!sessionRes.ok) {
      const err = await sessionRes.text();
      console.error("Stripe checkout error:", err);
      return res.status(502).json({ error: "stripe_error" });
    }

    const session = await sessionRes.json();
    if (!session.url) return res.status(502).json({ error: "no_url" });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}
