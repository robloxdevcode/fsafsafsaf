const ALLOW_ORIGINS = [
  "https://claim.boostdock.eu",
  "https://www.boostdock.eu",
  "https://boostdock.eu",
];

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOW_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
}

function sessionIsPaid(session) {
  if (session.status !== "complete") return false;
  return session.payment_status === "paid" || session.payment_status === "no_payment_required";
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ ok: false });
  }

  const sessionId = typeof req.query.session_id === "string" ? req.query.session_id.trim() : "";
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return res.status(400).json({ ok: false, error: "bad_session" });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith("sk_")) {
    return res.status(503).json({ ok: false, error: "not_configured" });
  }

  try {
    const r = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: `Bearer ${key}` } }
    );
    if (!r.ok) {
      return res.status(403).json({ ok: false, error: "stripe_reject" });
    }
    const session = await r.json();
    if (sessionIsPaid(session)) return res.status(200).json({ ok: true });
    return res.status(403).json({ ok: false, error: "not_paid", status: session.status, payment_status: session.payment_status });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
}
