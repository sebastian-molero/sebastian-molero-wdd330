import { getLocalStorage, setLocalStorage, updateCartCount, cartLoading } from "./utils.mjs";

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="cart-card__remove" data-id="${item.Id}">&times;</button>
    </li>`;
}

export default class ShoppingCart {
  constructor(key, parentElement) {
    this.key = key;
    this.parentElement = parentElement;
  }

  async init() {
    await cartLoading();
    this.renderCartContents();
    updateCartCount();
  }

  renderCartContents() {
    const cartItems = getLocalStorage(this.key) || [];

    if (cartItems.length === 0) {
      this.parentElement.innerHTML = "<p>Your cart is empty</p>";
      const footer = document.querySelector(".cart-footer");
      if (footer) footer.classList.add("hide");
      return;
    }

    const htmlItems = cartItems.map(cartItemTemplate);
    this.parentElement.innerHTML = htmlItems.join("");

    this.parentElement.querySelectorAll(".cart-card__remove").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.dataset.id;
        this.removeFromCart(productId);
      });
    });

    this.renderCartTotal(cartItems);
  }

  renderCartTotal(cartItems) {
    const footer = document.querySelector(".cart-footer");
    const totalElement = document.querySelector(".cart-total");

    if (!footer || !totalElement) return;

    const total = cartItems.reduce((acc, item) => acc + item.FinalPrice, 0);
    totalElement.textContent = `Total: $${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    footer.classList.remove("hide");
  }

  removeFromCart(productId) {
    let cartItems = getLocalStorage(this.key) || [];
    cartItems = cartItems.filter((item) => item.Id !== productId);
    setLocalStorage(this.key, cartItems);

    this.renderCartContents();
    updateCartCount();
  }
}
