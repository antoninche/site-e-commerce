import { PRODUCTS } from "./data.js";
import { addToCart, setCartBadges, formatEUR, toast } from "./utils.js";

const state = {
  q: "",
  sort: "featured",
  filters: {
    gender: new Set(),
    category: new Set(),
    badge: new Set(),
  }
};

function readParams(){
  const url = new URL(window.location.href);

  const g = url.searchParams.get("gender");
  const c = url.searchParams.get("category");
  const b = url.searchParams.get("badge");

  if(g) state.filters.gender.add(g);
  if(c) state.filters.category.add(c);
  if(b) state.filters.badge.add(b);

  // sync checkboxes
  document.querySelectorAll("input[type=checkbox][data-filter]").forEach(cb => {
    const group = cb.getAttribute("data-filter");
    const val = cb.value;
    cb.checked = state.filters[group].has(val);
  });
}

function productCardHTML(p){
  const badgeHTML = p.badge ? `<span class="pill ${p.badge === "Best-seller" ? "dark" : ""}">${p.badge}</span>` : "";
  const meta = `${p.gender} • ${p.category}`;
  const sizes = (p.sizes || ["Unique"]).map(s => `<option value="${s}">${s}</option>`).join("");

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

function matchesQuery(p, q){
  if(!q) return true;
  const hay = `${p.name} ${p.gender} ${p.category} ${p.badge || ""} ${p.color || ""}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

function applyFilters(list){
  return list.filter(p => {
    if(state.filters.gender.size && !state.filters.gender.has(p.gender)) return false;
    if(state.filters.category.size && !state.filters.category.has(p.category)) return false;
    if(state.filters.badge.size && !state.filters.badge.has(p.badge || "")) return false;
    if(!matchesQuery(p, state.q)) return false;
    return true;
  });
}

function applySort(list){
  const copy = [...list];

  if(state.sort === "price-asc"){
    copy.sort((a,b) => a.price - b.price);
  }else if(state.sort === "price-desc"){
    copy.sort((a,b) => b.price - a.price);
  }else if(state.sort === "name-asc"){
    copy.sort((a,b) => a.name.localeCompare(b.name, "fr"));
  }else{
    // featured: best-seller first, then new, then name
    const score = (p) => (p.badge === "Best-seller" ? 2 : (p.badge === "Nouveau" ? 1 : 0));
    copy.sort((a,b) => score(b) - score(a) || a.name.localeCompare(b.name, "fr"));
  }

  return copy;
}

function renderChips(){
  const root = document.getElementById("chips");
  const chips = [];

  ["gender","category","badge"].forEach(group => {
    state.filters[group].forEach(val => {
      chips.push({ group, val });
    });
  });

  if(state.q){
    chips.push({ group: "q", val: `Recherche: ${state.q}` });
  }

  root.innerHTML = chips.map(c => {
    return `<button class="pill" data-chip="${c.group}:${c.val}">${c.val} ✕</button>`;
  }).join("");
}

function render(){
  const grid = document.getElementById("grid");
  const count = document.getElementById("count");
  const empty = document.getElementById("empty");

  const filtered = applySort(applyFilters(PRODUCTS));
  count.textContent = `${filtered.length} produit${filtered.length > 1 ? "s" : ""}`;

  if(filtered.length === 0){
    grid.innerHTML = "";
    empty.classList.remove("hidden");
  }else{
    empty.classList.add("hidden");
    grid.innerHTML = filtered.map(productCardHTML).join("");
  }

  renderChips();
}

function bindUI(){
  const q = document.getElementById("q");
  const sort = document.getElementById("sort");
  const clear = document.getElementById("clear");
  const reset = document.getElementById("reset");

  q.addEventListener("input", () => {
    state.q = q.value.trim();
    render();
  });

  sort.addEventListener("change", () => {
    state.sort = sort.value;
    render();
  });

  document.querySelectorAll("input[type=checkbox][data-filter]").forEach(cb => {
    cb.addEventListener("change", () => {
      const group = cb.getAttribute("data-filter");
      const val = cb.value;

      if(cb.checked) state.filters[group].add(val);
      else state.filters[group].delete(val);

      render();
    });
  });

  clear.addEventListener("click", () => {
    Object.values(state.filters).forEach(set => set.clear());
    state.q = "";
    q.value = "";
    document.querySelectorAll("input[type=checkbox][data-filter]").forEach(cb => cb.checked = false);
    render();
  });

  reset.addEventListener("click", () => clear.click());

  document.getElementById("chips").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-chip]");
    if(!btn) return;

    const raw = btn.getAttribute("data-chip");
    const [group, val] = raw.split(":");

    if(group === "q"){
      state.q = "";
      q.value = "";
    }else{
      state.filters[group].delete(val);
      document.querySelectorAll(`input[type=checkbox][data-filter="${group}"]`).forEach(cb => {
        if(cb.value === val) cb.checked = false;
      });
    }

    render();
  });

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

  const toggle = document.getElementById("toggleFilters");
  const panel = document.getElementById("filters");

  toggle.addEventListener("click", () => {
    panel.classList.toggle("open");
    // mobile: juste un petit effet, le CSS sticky gère déjà
    panel.scrollIntoView({ behavior:"smooth", block:"start" });
  });
}

function init(){
  setCartBadges();
  readParams();
  bindUI();
  render();
}

init();