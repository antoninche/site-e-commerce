import { PRODUCTS } from "./data.js";
import { addToCart, setCartBadges, formatEUR, toast } from "./utils.js";

function productCardHTML(p){
  const badgeHTML = p.badge ? `<span class="pill ${p.badge === "Best-seller" ? "dark" : ""}">${p.badge}</span>` : "";
  const meta = `${p.gender} • ${p.category}`;
  const sizes = (p.sizes || []).map(s => `<option value="${s}">${s}</option>`).join("");

  return `
    <article class="card">
      <div class="card-media">
        <img src="${p.img}" alt="${p.name}" loading="lazy" referrerpolicy="no-referrer" />
      </div>
      <div class="card-body">
        <div class="card-top">
          <div>
            <h3 class="card-title">${p.name}</h3>
            <div class="card-meta">${meta}</div>
          </div>
          <div style="text-align:right">
            ${badgeHTML}
            <div class="price">${formatEUR(p.price)}</div>
          </div>
        </div>

        <div class="card-actions">
          <select class="select size-select" data-size>
            ${sizes}
          </select>
          <button class="btn btn-primary" data-add="${p.id}">Ajouter</button>
          <a class="btn btn-ghost" href="${p.nikeUrl}" target="_blank" rel="noreferrer">Voir sur Nike</a>
        </div>
      </div>
    </article>
  `;
}

function renderBestSellers(){
  const root = document.getElementById("home-best");
  const best = PRODUCTS.filter(p => p.badge === "Best-seller").slice(0, 8);
  root.innerHTML = best.map(productCardHTML).join("");
}

function wireAddToCart(){
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if(!btn) return;

    const productId = btn.getAttribute("data-add");
    const card = btn.closest(".card");
    const sizeSelect = card ? card.querySelector("[data-size]") : null;
    const size = sizeSelect ? sizeSelect.value : "Unique";

    addToCart(productId, size, 1);
    toast("Ajouté au panier");
  });
}

function init(){
  setCartBadges();
  renderBestSellers();
  wireAddToCart();
}

init();
