const EZ = "https://ezboost.org/assets/images";

const CATEGORIES = {
  "boost-1m": [
    {
      id: "b1",
      name: "1 Server Boost",
      price: 1.1,
      currency: "EUR",
      image: "assets/products/boost-1.webp",
      stripePriceId: "price_1UY33uE3W2ZkfW0P7LWwJ2Xe",
    },
    {
      id: "b5",
      name: "5 Server Boosts",
      price: 5.5,
      currency: "EUR",
      image: "assets/products/boost-5.webp",
      stripePriceId: "price_1UY34aE3W2ZkfW0Pe2gZlpRp",
    },
    {
      id: "b10",
      name: "10 Server Boosts",
      price: 11,
      currency: "EUR",
      image: "assets/products/boost-10.webp",
      featured: true,
      stripePriceId: "price_1UY35ME3W2ZkfW0Pz4UzGJZT",
    },
    {
      id: "b15",
      name: "15 Server Boosts",
      price: 17.5,
      currency: "EUR",
      image: "assets/products/boost-15.webp",
      stripePriceId: "price_1UY366E3W2ZkfW0PWOy0Uc0X",
    },
  ],
  members: [
    {
      id: "m-on",
      name: "Online Members",
      price: 3.0,
      priceLabel: "From",
      currency: "USD",
      image: "assets/products/members-online.webp",
      unavailable: true,
    },
    {
      id: "m-off",
      name: "Offline Members",
      price: 2.0,
      priceLabel: "From",
      currency: "USD",
      image: "assets/products/members-offline.webp",
      unavailable: true,
    },
  ],
  panel: [
    {
      id: "panel-m",
      name: "Boost Panel (Monthly)",
      price: 10,
      currency: "EUR",
      unavailable: true,
    },
    {
      id: "panel-l",
      name: "Boost Panel (Lifetime)",
      price: 20,
      currency: "EUR",
      featured: true,
      unavailable: true,
    },
  ],
};

const REVIEWS = [
  {
    username: "IamHalloDoom",
    title: "Great service and easy to use",
    text: "I had no trouble at all when I bought my Boosts, they came through almost immediately. Great Service. Thank you Boostdock.",
    avatar: "assets/reviews/iamhallodoom-avatar.png",
    stars: 5,
  },
];

const FAQ = [
  {
    q: "Are your Discord boosts cheap and safe?",
    a: "Our 15-boost pack is €17.50 for a month vs about €70 through Discord retail. We only need your invite link, never your login. If boosts drop before your paid period ends, we replace them.",
  },
  {
    q: "How fast is delivery?",
    a: "Most products are delivered instantly. Some orders may take up to 1 to 2 hours during maintenance. We guarantee delivery within 24 hours maximum.",
  },
  {
    q: "Can my server get banned?",
    a: "Boosts are applied through invites using boosting accounts. We never ask for your Discord password.",
  },
  {
    q: "How many boosts for Level 1, 2, and 3?",
    a: "Level 1 needs 2 boosts, Level 2 needs 7, and Level 3 needs 14. Our 10-boost pack hits Level 2 and 15-boost pack hits Level 3.",
  },
  {
    q: "Do I need to give you my Discord login?",
    a: "No. We only need a valid server invite link entered at checkout.",
  },
];

function money(n, currency = "EUR") {
  if (currency === "EUR") return `${n.toFixed(2)} EUR`;
  return `$${n.toFixed(2)}`;
}

function renderProducts(category) {
  const grid = document.querySelector("[data-product-grid]");
  const items = CATEGORIES[category] || [];
  grid.innerHTML = items
    .map(
      (p) => `
    <article class="product-card${p.featured ? " is-popular" : ""}${p.image ? "" : " product-card--no-banner"}${p.unavailable ? " product-card--unavailable" : ""}">
      ${
        p.image
          ? `<div class="product-banner">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>`
          : ""
      }
      <div class="product-body">
        <div class="product-head">
          <h3>${p.name}</h3>
          <div class="product-price">
            ${p.priceLabel ? `<small>${p.priceLabel}</small>` : ""}
            ${money(p.price, p.currency ?? "USD")}
          </div>
        </div>
        ${
          p.unavailable
            ? `<p class="product-unavailable">Temporarily unavailable</p>
        <button type="button" class="product-buy" disabled aria-disabled="true">Buy Now</button>`
            : `<button type="button" class="product-buy" data-purchase data-name="${p.name}"${
                p.stripePriceId ? ` data-price-id="${p.stripePriceId}"` : ""
              }>Buy Now</button>`
        }
      </div>
    </article>
  `
    )
    .join("");
}

function renderReviews() {
  const track = document.querySelector("[data-reviews-track]");
  if (!track) return;
  const cards = REVIEWS.map(
    (r) => `
    <article class="review-card">
      <div class="review-user">
        <img src="${r.avatar}" alt="${r.username}" width="40" height="40" />
        <div class="review-meta">
          <span class="review-username">${r.username}</span>
          <span class="review-stars" aria-label="${r.stars} out of 5 stars">${"★".repeat(r.stars)}</span>
        </div>
      </div>
      <p class="review-text">${r.title}. ${r.text}</p>
    </article>
  `
  );
  track.innerHTML = cards.join("");
}

function renderFaq() {
  const list = document.querySelector("[data-faq-list]");
  list.innerHTML = FAQ.map(
    (item, i) => `
    <div class="faq-item${i === 0 ? " is-open" : ""}">
      <button type="button" class="faq-q" aria-expanded="${i === 0}">${item.q}</button>
      <div class="faq-a">${item.a}</div>
    </div>
  `
  ).join("");

  list.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item.classList.contains("is-open");
      list.querySelectorAll(".faq-item").forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function showToast(msg) {
  const toast = document.querySelector("[data-toast]");
  toast.textContent = msg;
  toast.hidden = false;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.classList.remove("show");
    toast.hidden = true;
  }, 2800);
}

function initTabs() {
  document.querySelectorAll(".shop-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".shop-tab").forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      renderProducts(tab.dataset.category);
    });
  });

  document.querySelectorAll("[data-tab-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const cat = link.dataset.tabLink;
      if (!cat) return;
      e.preventDefault();
      document.querySelector(`.shop-tab[data-category="${cat}"]`)?.click();
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-mobile-nav]");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });
}

function initPromo() {
  document.querySelector("[data-copy-code]")?.addEventListener("click", () => {
    const code = document.querySelector("[data-copy-code]").dataset.code || "DOCK10";
    navigator.clipboard?.writeText(code);
    showToast(`Copied code ${code}`);
  });
  document.querySelector("[data-dismiss-promo]")?.addEventListener("click", () => {
    document.querySelector(".promo-bar")?.remove();
    document.documentElement.style.setProperty("--promo-h", "0px");
  });
}

document.body.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-purchase]");
  if (!btn || btn.disabled) return;

  const priceId = btn.dataset.priceId;
  if (!priceId) {
    showToast(`${btn.dataset.name} — checkout not available yet.`);
    return;
  }

  btn.disabled = true;
  const label = btn.textContent;
  btn.textContent = "Loading…";

  try {
    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) throw new Error("checkout failed");
    window.location.href = data.url;
  } catch {
    showToast("Could not start checkout. Try again.");
    btn.disabled = false;
    btn.textContent = label;
  }
});

document.querySelector("[data-year]").textContent = String(new Date().getFullYear());

renderProducts("boost-1m");
renderReviews();
renderFaq();
initTabs();
initNav();
initPromo();
