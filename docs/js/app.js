(function(){
  const CART_KEY = "nike_cart_v1";

  function formatEUR(amount){
    return amount.toLocaleString("fr-FR", { style:"currency", currency:"EUR" });
  }

  function readCart(){
    try{
      const raw = localStorage.getItem(CART_KEY);
      const cart = raw ? JSON.parse(raw) : [];
      return Array.isArray(cart) ? cart : [];
    }catch{
      return [];
    }
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
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
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

  function toast(message){
    const old = document.querySelector(".toast");
    if(old) old.remove();

    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    document.body.appendChild(el);

    window.setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .25s ease"; }, 1400);
    window.setTimeout(() => { el.remove(); }, 1750);
  }

  function pillHTML(p){
    if(!p.badge) return "";
    return `<span class="pill ${p.badge === "Best-seller" ? "dark" : ""}">${p.badge}</span>`;
  }

  function productCardHTML(p){
    const meta = `${p.gender} • ${p.category}`;
    const sizes = (p.sizes || ["Unique"]).map(s => `<option value="${s}">${s}</option>`).join("");

    return `
      <article class="card">
        <div class="card-media">
          <img src="${p.img}" alt="${p.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${p.imgBackup || p.img}'" />
        </div>
        <div class="card-body">
          <div class="card-top">
            <div>
              <h3 class="card-title"><a class="product-link" href="./product.html?id=${encodeURIComponent(p.id)}">${p.name}</a></h3>
              <div class="card-meta">${meta}</div>
            </div>
            <div style="text-align:right">
              ${pillHTML(p)}
              <div class="price">${formatEUR(p.price)}</div>
            </div>
          </div>

          <div class="card-actions">
            <select class="select size-select" data-size>
              ${sizes}
            </select>
            <button class="btn btn-primary" data-add="${p.id}" type="button">Ajouter</button>
            <a class="btn btn-ghost" href="./product.html?id=${encodeURIComponent(p.id)}">Voir détail</a>
          </div>
        </div>
      </article>
    `;
  }

  // HOME
  function initHome(){
    const root = document.getElementById("home-best");
    if(!root) return;

    const best = window.PRODUCTS.filter(p => p.badge === "Best-seller").slice(0, 8);
    root.innerHTML = best.map(productCardHTML).join("");
  }

  // PRODUCTS
  const state = {
    q: "",
    sort: "featured",
    filters: { gender: new Set(), category: new Set(), badge: new Set() }
  };

  function matchesQuery(p, q){
    if(!q) return true;
    const hay = (p.name + " " + p.gender + " " + p.category + " " + (p.badge||"") + " " + (p.color||"")).toLowerCase();
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
    const copy = list.slice();
    if(state.sort === "price-asc") copy.sort((a,b) => a.price - b.price);
    else if(state.sort === "price-desc") copy.sort((a,b) => b.price - a.price);
    else if(state.sort === "name-asc") copy.sort((a,b) => a.name.localeCompare(b.name, "fr"));
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
    if(state.q) chips.push({ group:"q", val:"Recherche: " + state.q });

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
      cb.checked = state.filters[group].has(cb.value);
    });
  }

  function initProducts(){
    const q = document.getElementById("q");
    const sort = document.getElementById("sort");
    const clear = document.getElementById("clear");
    const reset = document.getElementById("reset");
    const chips = document.getElementById("chips");

    if(!q || !sort || !clear || !reset || !chips) return;

    readParams();
    renderProducts();

    q.addEventListener("input", () => { state.q = q.value.trim(); renderProducts(); });
    sort.addEventListener("change", () => { state.sort = sort.value; renderProducts(); });

    document.querySelectorAll("input[type=checkbox][data-filter]").forEach(cb => {
      cb.addEventListener("change", () => {
        const group = cb.getAttribute("data-filter");
        if(cb.checked) state.filters[group].add(cb.value);
        else state.filters[group].delete(cb.value);
        renderProducts();
      });
    });

    clear.addEventListener("click", () => {
      Object.values(state.filters).forEach(set => set.clear());
      state.q = "";
      q.value = "";
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
    if(toggle && panel){
      toggle.addEventListener("click", () => {
        const isOpen = panel.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }
  }

  // PDP
  function updateProductSEO(product){
    document.title = `NIKE — ${product.name}`;

    const desc = `${product.name} (${product.gender}, ${product.category}) à ${formatEUR(product.price)}. Démonstration e-commerce front-end.`;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if(descriptionMeta) descriptionMeta.setAttribute("content", desc);

    const canonical = document.querySelector('link[rel="canonical"]');
    if(canonical) canonical.setAttribute("href", `./product.html?id=${encodeURIComponent(product.id)}`);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    if(ogTitle) ogTitle.setAttribute("content", `NIKE — ${product.name}`);
    if(ogDesc) ogDesc.setAttribute("content", desc);
    if(ogImage) ogImage.setAttribute("content", product.img);

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": [product.img],
      "description": desc,
      "brand": { "@type": "Brand", "name": "NIKE (démo)" },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "price": String(product.price),
        "availability": "https://schema.org/InStock",
        "url": `./product.html?id=${encodeURIComponent(product.id)}`
      }
    };

    const existing = document.getElementById("product-jsonld");
    if(existing) existing.remove();

    const script = document.createElement("script");
    script.id = "product-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  function initProductDetail(){
    const title = document.getElementById("productTitle");
    const meta = document.getElementById("productMeta");
    const price = document.getElementById("productPrice");
    const badge = document.getElementById("productBadge");
    const img = document.getElementById("productImage");
    const desc = document.getElementById("productDescription");
    const size = document.getElementById("productSize");
    const addBtn = document.getElementById("productAdd");
    const nikeBtn = document.getElementById("productNike");
    const related = document.getElementById("relatedGrid");

    if(!title || !meta || !price || !badge || !img || !desc || !size || !addBtn || !nikeBtn || !related) return;

    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    const product = window.getProductById(id);

    if(!product){
      title.textContent = "Produit introuvable";
      desc.textContent = "Ce produit n'existe pas (ou plus) dans cette démo.";
      addBtn.disabled = true;
      return;
    }

    title.textContent = product.name;
    meta.textContent = `${product.gender} • ${product.category} • Couleur: ${product.color || "N/A"}`;
    price.textContent = formatEUR(product.price);
    badge.innerHTML = pillHTML(product);
    img.src = product.img;
    img.alt = product.name;
    img.onerror = () => { img.src = product.imgBackup || product.img; };
    desc.textContent = product.description || `${product.name} est présenté dans cette boutique e-commerce de démonstration inspirée Nike.`;
    size.innerHTML = (product.sizes || ["Unique"]).map(s => `<option value="${s}">${s}</option>`).join("");
    nikeBtn.href = product.nikeUrl;

    addBtn.addEventListener("click", () => {
      addToCart(product.id, size.value, 1);
      toast("Ajouté au panier");
    });

    const relatedProducts = window.PRODUCTS
      .filter(p => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
      .slice(0, 4);

    related.innerHTML = relatedProducts.map(productCardHTML).join("");

    updateProductSEO(product);
  }

  // CART
  function computeShipping(subtotal){
    if(subtotal === 0) return 0;
    if(subtotal >= 100) return 0;
    return 4.99;
  }

  /**
   * Centralise le calcul financier pour le panier et le paiement.
   * @returns {{subtotal:number, shipping:number, total:number}}
   */
  function computeCartTotals(){
    const cart = readCart();
    const subtotal = cart.reduce((sum, item) => {
      const product = window.getProductById(item.productId);
      if(!product) return sum;
      return sum + (product.price * item.qty);
    }, 0);

    const shipping = computeShipping(subtotal);
    return { subtotal, shipping, total: subtotal + shipping };
  }

  function cartItemHTML(item, product){
    const lineTotal = product.price * item.qty;
    return `
      <article class="cart-item" data-key="${item.key}">
        <img src="${product.img}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${product.imgBackup || product.img}'" />
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
    const totalEl = document.getElementById("total");

    if(!list || !empty || !subtotalEl || !shippingEl || !totalEl) return;

    const cart = readCart();

    if(cart.length === 0){
      list.innerHTML = "";
      empty.classList.remove("hidden");
      subtotalEl.textContent = formatEUR(0);
      shippingEl.textContent = "—";
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

    const shipping = computeShipping(subtotal);
    const total = subtotal + shipping;

    subtotalEl.textContent = formatEUR(subtotal);
    shippingEl.textContent = shipping === 0 ? "Gratuite" : formatEUR(shipping);
    totalEl.textContent = formatEUR(total);
  }

  function initCart(){
    const list = document.getElementById("cartList");
    const clearBtn = document.getElementById("clearCart");
    const checkout = document.getElementById("checkout");

    if(!list || !clearBtn || !checkout) return;

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
        return;
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

    checkout.addEventListener("click", () => {
      if(readCart().length === 0){
        toast("Ton panier est vide");
        return;
      }
      window.location.href = "./payment.html";
    });
  }

  // PAYMENT
  function initPayment(){
    const summarySubtotal = document.getElementById("paymentSubtotal");
    const summaryShipping = document.getElementById("paymentShipping");
    const summaryTotal = document.getElementById("paymentTotal");
    const payBtn = document.getElementById("payNow");
    const alertBox = document.getElementById("paymentDemoAlert");
    const form = document.getElementById("paymentForm");

    if(!summarySubtotal || !summaryShipping || !summaryTotal || !payBtn || !alertBox || !form) return;

    const cart = readCart();
    if(cart.length === 0){
      window.location.href = "./cart.html";
      return;
    }

    const totals = computeCartTotals();
    summarySubtotal.textContent = formatEUR(totals.subtotal);
    summaryShipping.textContent = totals.shipping === 0 ? "Gratuite" : formatEUR(totals.shipping);
    summaryTotal.textContent = formatEUR(totals.total);

    payBtn.addEventListener("click", () => {
      if(!form.reportValidity()) return;

      alertBox.classList.remove("hidden");
      alertBox.scrollIntoView({ behavior:"smooth", block:"center" });
    });
  }

  // GLOBAL handler Add to cart
  function bindAddToCart(){
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
    bindAddToCart();

    const page = document.body.getAttribute("data-page");
    if(page === "home") initHome();
    if(page === "products") initProducts();
    if(page === "product") initProductDetail();
    if(page === "cart") initCart();
    if(page === "payment") initPayment();
  }

  init();
})();
