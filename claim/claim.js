(function () {
  const HOME = "https://boostdock.eu/";
  const DISCORD = "https://discord.gg/boostdock";
  const params = new URLSearchParams(window.location.search);
  const sessionId = (params.get("session_id") || "").trim();
  const card = document.querySelector(".claim-card");
  const gate = document.querySelector(".claim-gate");
  const errEl = document.querySelector(".claim-error");

  function showError(msg) {
    if (gate) gate.hidden = true;
    if (errEl) {
      errEl.hidden = false;
      errEl.innerHTML = msg;
    }
  }

  if (!sessionId || !sessionId.startsWith("cs_")) {
    window.location.replace(HOME);
    return;
  }

  const apiBases = [
    window.location.origin,
    "https://www.boostdock.eu",
    "https://boostdock.eu",
  ];

  async function verify() {
    let lastStatus = 0;
    for (const base of apiBases) {
      const url = `${base}/api/verify-session?session_id=${encodeURIComponent(sessionId)}`;
      try {
        const r = await fetch(url);
        lastStatus = r.status;
        const data = await r.json().catch(() => ({}));
        if (r.ok && data.ok) return true;
        if (data.error === "not_configured") {
          showError(
            `Payment verification is not configured on the server yet. You still paid — join <a href="${DISCORD}">Discord</a> and staff will confirm your order.`
          );
          return false;
        }
      } catch {
        /* try next base */
      }
    }
    if (lastStatus === 403) {
      showError(
        `We could not confirm this session yet. If you were charged, join <a href="${DISCORD}">Discord</a> with your receipt and we will help.`
      );
      return false;
    }
    showError(
      `Could not verify payment automatically. If checkout succeeded, join <a href="${DISCORD}">Discord</a> to claim your order.`
    );
    return false;
  }

  verify().then((ok) => {
    if (!ok) return;
    if (gate) gate.hidden = true;
    if (errEl) errEl.hidden = true;
    if (card) card.hidden = false;
  });
})();
