export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false });
  }

  const sessionId = req.query.session_id;
  if (!sessionId || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return res.status(400).json({ ok: false });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(503).json({ ok: false, error: "not_configured" });
  }

  try {
    const r = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: `Bearer ${key}` } }
    );
    if (!r.ok) return res.status(403).json({ ok: false });
    const session = await r.json();
    if (session.payment_status === "paid") return res.status(200).json({ ok: true });
    return res.status(403).json({ ok: false });
  } catch {
    return res.status(500).json({ ok: false });
  }
}
