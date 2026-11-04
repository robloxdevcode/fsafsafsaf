(function () {
  const HOME = "https://boostdock.eu/";
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");
  const card = document.querySelector(".claim-card");
  const gate = document.querySelector(".claim-gate");

  if (!sessionId || !sessionId.startsWith("cs_")) {
    window.location.replace(HOME);
    return;
  }

  const verifyUrl = `${window.location.origin}/api/verify-session?session_id=${encodeURIComponent(sessionId)}`;

  fetch(verifyUrl)
    .then((r) => {
      if (!r.ok) throw new Error("verify failed");
      return r.json();
    })
    .then((data) => {
      if (!data.ok) throw new Error("not paid");
      if (gate) gate.hidden = true;
      if (card) card.hidden = false;
    })
    .catch(() => {
      window.location.replace(HOME);
    });
})();
