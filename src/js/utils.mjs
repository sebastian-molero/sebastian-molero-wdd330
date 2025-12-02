// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  
  return product;
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);

  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function isDiscounted(item) {
  return item.FinalPrice < item.SuggestedRetailPrice;
}

export function discountPercentage(item) {
  const discount = ((item.SuggestedRetailPrice - item.FinalPrice) / item.SuggestedRetailPrice) * 100;
  return Math.round(discount);
}

export function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");

  if (!cartCount) return;
  
  const cartItems = getLocalStorage("so-cart") || [];
  const totalQty = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  cartCount.textContent = totalQty;
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();

  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  renderWithTemplate(headerTemplate, header);
  renderWithTemplate(footerTemplate, footer);
}

export async function cartLoading() {
  await loadHeaderFooter();
  updateCartCount();
}

export function searchProducts() {
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = document.getElementById("searchInput").value.trim();
      if (query) {
        window.location.href = `/product_listing/index.html?search=${encodeURIComponent(query.toLowerCase())}`;
      }
    }
  );
  }
}

export function alertMessage(message, type, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert", type);
  alert.innerHTML = `
  <p>${message}</p>
  <span class="close">&times;</span>
  `;

  alert.querySelector(".close").addEventListener("click", () => {
    alert.remove();
  });

  const main = document.querySelector("main");
  main.prepend(alert);

  if (scroll) window.scrollTo(0, 0);
}

export function removeAllAlerts() {
  document.querySelectorAll(".alert").forEach((alert) => {
    alert.remove();
  });
}

export function updateWishlistCount() {
  const wishlist = getLocalStorage("so-wishlist") || [];
  const countEl = document.querySelector(".wishlist-count");
  if (countEl) {
    countEl.textContent = wishlist.length;
  }
}
