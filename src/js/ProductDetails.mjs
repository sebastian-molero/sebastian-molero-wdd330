import { getLocalStorage, setLocalStorage, discountPercentage, updateCartCount } from "./utils.mjs";

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
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
    updateCartCount();
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  // Nombre y marca
  document.querySelector(".product-detail h2").textContent = product.Brand?.Name || "";
  document.querySelector(".product-detail h3").textContent = product.Name;

  // Imagen grande
  const productImage = document.querySelector("img.divider");
  if (productImage) {
    productImage.src = product.Images?.PrimaryLarge;
    productImage.alt = product.Name;
  }

  // Precio
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

  // Color y descripción
  const colorEl = document.querySelector(".product__color");
  if (colorEl) colorEl.textContent = product.Colors?.[0]?.ColorName || "";

  const descEl = document.querySelector(".product__description");
  if (descEl) descEl.innerHTML = product.DescriptionHtmlSimple || "";

  // Botón Add to Cart
  const addBtn = document.getElementById("addToCart");
  if (addBtn) addBtn.dataset.id = product.Id;
}
