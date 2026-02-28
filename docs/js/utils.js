const CART_KEY = "nike_demo_cart_v1";

export function formatEUR(amount){
  return amount.toLocaleString("fr-FR", { style:"currency", currency:"EUR" });
}

export function readCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    return Array.isArray(cart) ? cart : [];
  }catch{
    return [];
  }
}

export function writeCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  setCartBadges(cartCount(cart));
}

export function cartCount(cart = readCart()){
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

export function setCartBadges(count = cartCount()){
  const nodes = document.querySelectorAll("[data-cart-count]");
  nodes.forEach(n => n.textContent = String(count));
}

export function addToCart(productId, size, qty){
  const safeQty = Math.max(1, Number(qty || 1));
  const safeSize = size || "Unique";
  const key = `${productId}__${safeSize}`;

  const cart = readCart();
  const existing = cart.find(i => i.key === key);

  if(existing){
    existing.qty += safeQty;
  }else{
    cart.push({
      key,
      productId,
      size: safeSize,
      qty: safeQty,
      addedAt: Date.now()
    });
  }

  writeCart(cart);
}

export function removeFromCart(key){
  const cart = readCart().filter(i => i.key !== key);
  writeCart(cart);
}

export function setQty(key, qty){
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

export function clearCart(){
  writeCart([]);
}

export function toast(message){
  const old = document.querySelector(".toast");
  if(old) old.remove();

  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;

  document.body.appendChild(el);

  window.setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity .25s ease";
  }, 1400);

  window.setTimeout(() => {
    el.remove();
  }, 1750);
}