import {
  getLocalStorage,
  setLocalStorage,
  discountPercentage,
  updateCartCount,
  alertMessage
} from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const qtyInput = document.getElementById("quantity");
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

    let cartItems = getLocalStorage("so-cart") || [];
    
    const existing = cartItems.find(item => item.Id === this.product.Id);
    
    if (existing) {
      existing.quantity = (existing.quantity || 1) + quantity;
    }
    else {
      const productToAdd = { ...this.product, quantity };
      cartItems.push(productToAdd);
    }
    
    setLocalStorage("so-cart", cartItems);
    updateCartCount();
    alertMessage(`🛒 ${quantity} × ${this.product.Name} added to cart!`, "success");
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
    this.updateBreadcrumb(this.product.Category?.Name || "", "Products");
  }

  updateBreadcrumb(category) {
    const breadcrumb = document.querySelector(".breadcrumb");
    if (breadcrumb) {
      breadcrumb.textContent = category;
    }
  }
}

function productDetailsTemplate(product) {
  document.querySelector(".product-detail h2").textContent = product.Brand?.Name || "";
  document.querySelector(".product-detail h3").textContent = product.Name;

  const imgContainer = document.querySelector(".img-container");
  if (imgContainer) {
    imgContainer.innerHTML = `
<picture>
  <source media="(max-width: 480px)" srcset="${product.Images?.PrimarySmall}">
  <source media="(max-width: 768px)" srcset="${product.Images?.PrimaryMedium}">
  <img src="${product.Images?.PrimaryLarge}" alt="${product.Brand?.Name || ""} ${product.Name}" class="divider" />
</picture>
    `;
  }

  const priceContainer = document.querySelector(".product-card__price");
  if (priceContainer) {
    if (product.FinalPrice < product.SuggestedRetailPrice) {
      priceContainer.innerHTML = `
        <span class="price price__final">$${product.FinalPrice.toFixed(2)}</span>
        <span class="price price__srp">$${product.SuggestedRetailPrice.toFixed(2)}</span>
        <span class="badge badge__discount">-${discountPercentage(product)}%</span>
      `;
    } else {
      priceContainer.innerHTML = `$${product.FinalPrice.toFixed(2)}`;
    }
  }

  const colorEl = document.querySelector(".product__color");
  if (colorEl) colorEl.textContent = product.Colors?.[0]?.ColorName || "";

  const descEl = document.querySelector(".product__description");
  if (descEl) descEl.innerHTML = product.DescriptionHtmlSimple || "";

  const addBtn = document.getElementById("addToCart");
  if (addBtn) addBtn.dataset.id = product.Id;
}
