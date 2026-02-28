(function(){
  const CART_KEY = "nike_cart_v1";
  const WISHLIST_KEY = "nike_wishlist_v1";
  const PREF_KEY = "nike_pref_v1";

  function formatEUR(amount){
    return amount.toLocaleString("fr-FR", { style:"currency", currency:"EUR" });
  }

  function readJSON(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : fallback;
      return parsed ?? fallback;
    }catch{
      return fallback;
    }
  }

  function writeJSON(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  // CART
  function readCart(){
    const cart = readJSON(CART_KEY, []);
    return Array.isArray(cart) ? cart : [];
  }

  function cartCount(cart){
    const c = cart || readCart();
    return c.reduce((sum, item) => sum + item.qty, 0);
  }

  function setCartBadges(){
    const count = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach(n => n.textContent = String(count));
  }

  function writeCart(cart){
    writeJSON(CART_KEY, cart);
    setCartBadges();
  }

  function addToCart(productId, size, qty){
    const safeQty = Math.max(1, Number(qty || 1));
    const safeSize = size || "Unique";
    const key = productId + "__" + safeSize;

    const cart = readCart();
    const existing = cart.find(i => i.key === key);

    if(existing) existing.qty += safeQty;
    else cart.push({ key, productId, size: safeSize, qty: safeQty, addedAt: Date.now() });

    writeCart(cart);
  }

  function removeFromCart(key){
    writeCart(readCart().filter(i => i.key !== key));
  }

  function setQty(key, qty){
    const cart = readCart();
    const item = cart.find(i => i.key === key);
    if(!item) return;

    const v = Number(qty);
    if(Number.isNaN(v) || v <= 0){
      removeFromCart(key);
      return;
    }
    item.qty = Math.min(99, Math.floor(v));
    writeCart(cart);
  }

  function clearCart(){
    writeCart([]);
  }

  // WISHLIST
  function readWishlist(){
    const list = readJSON(WISHLIST_KEY, []);
    return Array.isArray(list) ? list : [];
  }

  function writeWishlist(list){
    writeJSON(WISHLIST_KEY, list);
    setWishlistBadges();
  }

  function toggleWishlist(productId){
    const list = readWishlist();
    const idx = list.indexOf(productId);
    if(idx >= 0) list.splice(idx, 1);
    else list.push(productId);
    writeWishlist(list);
    return list.includes(productId);
  }

  function inWishlist(productId){
    return readWishlist().includes(productId);
  }

  function setWishlistBadges(){
    const count = readWishlist().length;
    document.querySelectorAll("[data-wishlist-count]").forEach(n => n.textContent = String(count));
  }

  // PREFERENCES
  function readPrefs(){
    const pref = readJSON(PREF_KEY, { reducedMotion: false });
    return { reducedMotion: Boolean(pref.reducedMotion) };
  }

  function writePrefs(next){
    writeJSON(PREF_KEY, next);
  }

  function applyPrefs(){
    const pref = readPrefs();
    document.body.classList.toggle("reduced-motion", pref.reducedMotion);

    const toggle = document.querySelector("[data-toggle-motion]");
    if(toggle){
      toggle.setAttribute("aria-pressed", pref.reducedMotion ? "true" : "false");
      toggle.textContent = pref.reducedMotion ? "Animations: OFF" : "Animations: ON";
    }
  }

  function toast(message){
    const old = document.querySelector(".toast");
    if(old) old.remove();

    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);

    const pref = readPrefs();
    const delay = pref.reducedMotion ? 800 : 1400;
    window.setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .25s ease"; }, delay);
    window.setTimeout(() => { el.remove(); }, delay + 350);
  }

  function pillHTML(p){
    if(!p.badge) return "";
    return `<span class="pill ${p.badge === "Best-seller" ? "dark" : ""}">${p.badge}</span>`;
  }

  function productCardHTML(p){
    const meta = `${p.gender} • ${p.category}`;
    const sizes = (p.sizes || ["Unique"]).map(s => `<option value="${s}">${s}</option>`).join("");
    const isFav = inWishlist(p.id);

    return `
      <article class="card" data-product-id="${p.id}">
        <div class="card-media">
          <img src="${p.img}" alt="${p.name}" loading="lazy" referrerpolicy="no-referrer" />
          <button class="wish-btn ${isFav ? "is-active" : ""}" data-wish="${p.id}" type="button" aria-label="Ajouter ${p.name} aux favoris" title="Favoris">
            ❤
          </button>
        </div>
        <div class="card-body">
          <div class="card-top">
            <div>
              <h3 class="card-title">${p.name}</h3>
              <div class="card-meta">${meta}</div>
              <div class="rating" aria-label="Note ${p.rating || 4.6} sur 5">★ ${p.rating || 4.6} <span>(${p.reviews || 120})</span></div>
            </div>
            <div style="text-align:right">
              ${pillHTML(p)}
              <div class="price">${formatEUR(p.price)}</div>
            </div>
          </div>

          <div class="card-actions">
            <select class="select size-select" data-size aria-label="Choisir la taille ${p.name}">
              ${sizes}
            </select>
            <input class="qty-mini" type="number" min="1" max="9" value="1" data-qty-input aria-label="Quantité" />
            <button class="btn btn-primary" data-add="${p.id}" type="button">Ajouter</button>
            <a class="btn btn-ghost" href="${p.nikeUrl}" target="_blank" rel="noreferrer">Voir sur Nike</a>
          </div>
        </div>
      </article>
    `;
  }

  // HOME
  function initHome(){
    const root = document.getElementById("home-best");
    const favRoot = document.getElementById("home-favorites");
    if(root){
      const best = window.PRODUCTS.filter(p => p.badge === "Best-seller").slice(0, 8);
      root.innerHTML = best.map(productCardHTML).join("");
    }

    if(favRoot){
      const favIds = new Set(readWishlist());
      const favProducts = window.PRODUCTS.filter(p => favIds.has(p.id)).slice(0, 4);
      favRoot.innerHTML = favProducts.length
        ? favProducts.map(productCardHTML).join("")
        : `<div class="empty"><div class="empty-title">Aucun favori pour l'instant</div><div class="empty-text">Clique sur ❤ sur une fiche produit pour les retrouver ici.</div></div>`;
    }
  }

  // PRODUCTS
  const state = {
    q: "",
    sort: "featured",
    priceMax: 999,
    filters: { gender: new Set(), category: new Set(), badge: new Set(), wish: false }
  };

  function matchesQuery(p, q){
    if(!q) return true;
    const hay = (p.name + " " + p.gender + " " + p.category + " " + (p.badge||"") + " " + (p.color||"")).toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function applyFilters(list){
    const wished = new Set(readWishlist());
    return list.filter(p => {
      if(state.filters.gender.size && !state.filters.gender.has(p.gender)) return false;
      if(state.filters.category.size && !state.filters.category.has(p.category)) return false;
      if(state.filters.badge.size && !state.filters.badge.has(p.badge || "")) return false;
      if(state.filters.wish && !wished.has(p.id)) return false;
      if(p.price > state.priceMax) return false;
      if(!matchesQuery(p, state.q)) return false;
      return true;
    });
  }

  function applySort(list){
    const copy = list.slice();
    if(state.sort === "price-asc") copy.sort((a,b) => a.price - b.price);
    else if(state.sort === "price-desc") copy.sort((a,b) => b.price - a.price);
    else if(state.sort === "name-asc") copy.sort((a,b) => a.name.localeCompare(b.name, "fr"));
    else if(state.sort === "rating-desc") copy.sort((a,b) => (b.rating || 0) - (a.rating || 0));
    else{
      const score = (p) => (p.badge === "Best-seller" ? 2 : (p.badge === "Nouveau" ? 1 : 0));
      copy.sort((a,b) => score(b) - score(a) || a.name.localeCompare(b.name, "fr"));
    }
    return copy;
  }

  function renderChips(){
    const root = document.getElementById("chips");
    if(!root) return;

    const chips = [];
    ["gender","category","badge"].forEach(group => {
      state.filters[group].forEach(val => chips.push({ group, val }));
    });
    if(state.filters.wish) chips.push({ group:"wish", val:"Favoris" });
    if(state.q) chips.push({ group:"q", val:"Recherche: " + state.q });
    if(state.priceMax < 999) chips.push({ group:"price", val:`Prix max: ${formatEUR(state.priceMax)}` });

    root.innerHTML = chips.map(c => `<button class="pill" data-chip="${c.group}|${c.val}">${c.val} ✕</button>`).join("");
  }

  function renderProducts(){
    const grid = document.getElementById("grid");
    const count = document.getElementById("count");
    const empty = document.getElementById("empty");
    if(!grid || !count || !empty) return;

    const filtered = applySort(applyFilters(window.PRODUCTS));
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

  function readParams(){
    const url = new URL(window.location.href);
    const g = url.searchParams.get("gender");
    const c = url.searchParams.get("category");
    const b = url.searchParams.get("badge");
    if(g) state.filters.gender.add(g);
    if(c) state.filters.category.add(c);
    if(b) state.filters.badge.add(b);

    document.querySelectorAll("input[type=checkbox][data-filter]").forEach(cb => {
      const group = cb.getAttribute("data-filter");
      cb.checked = group === "wish" ? state.filters.wish : state.filters[group].has(cb.value);
    });
  }

  function initProducts(){
    const q = document.getElementById("q");
    const sort = document.getElementById("sort");
    const clear = document.getElementById("clear");
    const reset = document.getElementById("reset");
    const chips = document.getElementById("chips");
    const priceRange = document.getElementById("priceRange");
    const priceLabel = document.getElementById("priceLabel");

    if(!q || !sort || !clear || !reset || !chips || !priceRange || !priceLabel) return;

    readParams();
    state.priceMax = Number(priceRange.value || 999);
    priceLabel.textContent = formatEUR(state.priceMax);
    renderProducts();

    q.addEventListener("input", () => { state.q = q.value.trim(); renderProducts(); });
    sort.addEventListener("change", () => { state.sort = sort.value; renderProducts(); });

    priceRange.addEventListener("input", () => {
      state.priceMax = Number(priceRange.value);
      priceLabel.textContent = formatEUR(state.priceMax);
      renderProducts();
    });

    document.querySelectorAll("input[type=checkbox][data-filter]").forEach(cb => {
      cb.addEventListener("change", () => {
        const group = cb.getAttribute("data-filter");
        if(group === "wish") state.filters.wish = cb.checked;
        else if(cb.checked) state.filters[group].add(cb.value);
        else state.filters[group].delete(cb.value);
        renderProducts();
      });
    });

    clear.addEventListener("click", () => {
      state.filters.wish = false;
      Object.entries(state.filters).forEach(([k, set]) => {
        if(k !== "wish") set.clear();
      });
      state.q = "";
      q.value = "";
      priceRange.value = "999";
      state.priceMax = 999;
      priceLabel.textContent = formatEUR(999);
      document.querySelectorAll("input[type=checkbox][data-filter]").forEach(cb => cb.checked = false);
      renderProducts();
    });

    reset.addEventListener("click", () => clear.click());

    chips.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-chip]");
      if(!btn) return;
      const raw = btn.getAttribute("data-chip");
      const parts = raw.split("|");
      const group = parts[0];
      const val = parts.slice(1).join("|");

      if(group === "q"){
        state.q = "";
        q.value = "";
      }else if(group === "wish"){
        state.filters.wish = false;
        document.querySelector('input[data-filter="wish"]').checked = false;
      }else if(group === "price"){
        state.priceMax = 999;
        priceRange.value = "999";
        priceLabel.textContent = formatEUR(999);
      }else{
        state.filters[group].delete(val);
        document.querySelectorAll(`input[type=checkbox][data-filter="${group}"]`).forEach(cb => {
          if(cb.value === val) cb.checked = false;
        });
      }
      renderProducts();
    });

    const toggle = document.getElementById("toggleFilters");
    const panel = document.getElementById("filters");
    toggle.addEventListener("click", () => {
      const open = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.scrollIntoView({ behavior:"smooth", block:"start" });
    });
  }

  // CART
  function computeShipping(subtotal){
    if(subtotal === 0) return 0;
    if(subtotal >= 100) return 0;
    return 4.99;
  }

  function computeDiscount(subtotal, code){
    if(!code) return 0;
    if(code === "WELCOME10") return subtotal * 0.10;
    if(code === "SHIPFREE") return 0;
    return 0;
  }

  function cartItemHTML(item, product){
    const lineTotal = product.price * item.qty;
    return `
      <article class="cart-item" data-key="${item.key}">
        <img src="${product.img}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" />
        <div class="cart-item-body">
          <div class="cart-item-top">
            <div>
              <h3 class="cart-title">${product.name}</h3>
              <div class="cart-meta">${product.gender} • ${product.category} • Taille: ${item.size}</div>
            </div>
            <div class="price">${formatEUR(lineTotal)}</div>
          </div>

          <div class="cart-actions">
            <div class="qty">
              <button type="button" data-dec aria-label="Diminuer">−</button>
              <input type="number" min="1" max="99" value="${item.qty}" data-qty aria-label="Quantité" />
              <button type="button" data-inc aria-label="Augmenter">+</button>
            </div>

            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <a class="btn btn-ghost btn-sm" href="${product.nikeUrl}" target="_blank" rel="noreferrer">Voir sur Nike</a>
              <button class="btn btn-ghost btn-sm" data-remove type="button">Supprimer</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderCart(){
    const list = document.getElementById("cartList");
    const empty = document.getElementById("cartEmpty");
    const subtotalEl = document.getElementById("subtotal");
    const shippingEl = document.getElementById("shipping");
    const discountEl = document.getElementById("discount");
    const totalEl = document.getElementById("total");
    const codeInput = document.getElementById("promoCode");

    if(!list || !empty || !subtotalEl || !shippingEl || !totalEl || !discountEl || !codeInput) return;

    const cart = readCart();

    if(cart.length === 0){
      list.innerHTML = "";
      empty.classList.remove("hidden");
      subtotalEl.textContent = formatEUR(0);
      shippingEl.textContent = "—";
      discountEl.textContent = "—";
      totalEl.textContent = formatEUR(0);
      return;
    }

    empty.classList.add("hidden");

    let subtotal = 0;
    list.innerHTML = cart.map(item => {
      const product = window.getProductById(item.productId);
      if(!product) return "";
      subtotal += product.price * item.qty;
      return cartItemHTML(item, product);
    }).join("");

    const shippingRaw = computeShipping(subtotal);
    const code = codeInput.value.trim().toUpperCase();
    const discount = computeDiscount(subtotal, code);
    const shipping = code === "SHIPFREE" ? 0 : shippingRaw;
    const total = Math.max(0, subtotal + shipping - discount);

    subtotalEl.textContent = formatEUR(subtotal);
    shippingEl.textContent = shipping === 0 ? "Gratuite" : formatEUR(shipping);
    discountEl.textContent = discount > 0 ? `- ${formatEUR(discount)}` : "—";
    totalEl.textContent = formatEUR(total);
  }

  function initCart(){
    const list = document.getElementById("cartList");
    const clearBtn = document.getElementById("clearCart");
    const checkout = document.getElementById("checkout");
    const applyPromo = document.getElementById("applyPromo");

    if(!list || !clearBtn || !checkout || !applyPromo) return;

    renderCart();

    list.addEventListener("click", (e) => {
      const itemEl = e.target.closest(".cart-item");
      if(!itemEl) return;
      const key = itemEl.getAttribute("data-key");
      const cart = readCart();
      const item = cart.find(i => i.key === key);
      if(!item) return;

      if(e.target.matches("[data-remove]")){
        removeFromCart(key);
        toast("Supprimé");
        renderCart();
        return;
      }
      if(e.target.matches("[data-inc]")){
        setQty(key, item.qty + 1);
        renderCart();
        return;
      }
      if(e.target.matches("[data-dec]")){
        setQty(key, item.qty - 1);
        renderCart();
      }
    });

    list.addEventListener("change", (e) => {
      const input = e.target.closest("[data-qty]");
      if(!input) return;
      const itemEl = e.target.closest(".cart-item");
      const key = itemEl.getAttribute("data-key");
      setQty(key, input.value);
      renderCart();
    });

    clearBtn.addEventListener("click", () => {
      clearCart();
      toast("Panier vidé");
      renderCart();
    });

    applyPromo.addEventListener("click", () => {
      const code = document.getElementById("promoCode").value.trim().toUpperCase();
      if(!code){
        toast("Entre un code promo");
      }else if(code !== "WELCOME10" && code !== "SHIPFREE"){
        toast("Code promo invalide");
      }else{
        toast("Code promo appliqué");
      }
      renderCart();
    });

    checkout.addEventListener("click", () => toast("Checkout non implémenté"));
  }

  // GLOBAL handlers
  function bindGlobal(){
    document.addEventListener("click", (e) => {
      const addBtn = e.target.closest("[data-add]");
      if(addBtn){
        const productId = addBtn.getAttribute("data-add");
        const card = addBtn.closest(".card");
        const sizeSelect = card ? card.querySelector("[data-size]") : null;
        const qtyInput = card ? card.querySelector("[data-qty-input]") : null;
        const size = sizeSelect ? sizeSelect.value : "Unique";
        const qty = qtyInput ? Number(qtyInput.value || 1) : 1;

        addToCart(productId, size, qty);
        toast("Ajouté au panier");
        return;
      }

      const wishBtn = e.target.closest("[data-wish]");
      if(wishBtn){
        const productId = wishBtn.getAttribute("data-wish");
        const nowInWishlist = toggleWishlist(productId);
        wishBtn.classList.toggle("is-active", nowInWishlist);
        toast(nowInWishlist ? "Ajouté aux favoris" : "Retiré des favoris");

        if(document.body.getAttribute("data-page") === "products") renderProducts();
        if(document.body.getAttribute("data-page") === "home") initHome();
      }
    });

    const motionBtn = document.querySelector("[data-toggle-motion]");
    if(motionBtn){
      motionBtn.addEventListener("click", () => {
        const current = readPrefs();
        writePrefs({ reducedMotion: !current.reducedMotion });
        applyPrefs();
      });
    }
  }

  function init(){
    setCartBadges();
    setWishlistBadges();
    applyPrefs();
    bindGlobal();

    const page = document.body.getAttribute("data-page");
    if(page === "home") initHome();
    if(page === "products") initProducts();
    if(page === "cart") initCart();
  }

  init();
})();
