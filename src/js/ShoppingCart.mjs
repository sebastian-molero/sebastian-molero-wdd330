import { getLocalStorage, setLocalStorage, updateCartCount, cartLoading } from "./utils.mjs";

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Images?.PrimarySmall}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">Color: ${item.selectedColor || item.Colors?.[0]?.ColorName || ""}</p>
      <div class="cart-card__quantity">
        <label for="quantity-${item.Id}-${item.selectedColor}">Qty:</label>
        <input id="quantity-${item.Id}-${item.selectedColor}" type="number" min="1" value="${item.quantity || 1}" data-id="${item.Id}" data-color="${item.selectedColor}" class="cart-card__qty"/>
      </div>
      <p class="cart-card__price">
        <span>Each: $${item.FinalPrice}</span> 
        <span>Subtotal: $${(item.FinalPrice * (item.quantity || 1)).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
      </p>
      <button class="cart-card__remove" data-id="${item.Id}" data-color="${item.selectedColor}">&times;</button>
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

    this.parentElement.querySelectorAll(".cart-card__qty").forEach((input) => {
      input.addEventListener("change", (e) => {
        const productId = e.target.dataset.id;
        const newQty = parseInt(e.target.value);

        let updatedCart = getLocalStorage(this.key) || [];
        const color = e.target.dataset.color;
        const foundItem = updatedCart.find(p => p.Id === productId && p.selectedColor === color);

        if (foundItem) {
          foundItem.quantity = newQty > 0 ? newQty : 1;
          setLocalStorage(this.key, updatedCart);
          updateCartCount();
          this.renderCartContents();
        }
      });
    });

    this.parentElement.querySelectorAll(".cart-card__remove").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.dataset.id;
        const color = e.target.dataset.color;
        this.removeFromCart(productId, color);
      });
    });

    this.renderCartTotal(cartItems);
  }

  renderCartTotal(cartItems) {
    const footer = document.querySelector(".cart-footer");
    const totalElement = document.querySelector(".cart-total");

    if (!footer || !totalElement) return;

    const total = cartItems.reduce((acc, item) => acc + item.FinalPrice * (item.quantity || 1), 0);
    totalElement.textContent = `Total: $${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    footer.classList.remove("hide");
  }

  removeFromCart(productId, color) {
    let cartItems = getLocalStorage(this.key) || [];
    cartItems = cartItems.filter((item) => !(item.Id === productId && item.selectedColor === color));
    setLocalStorage(this.key, cartItems);

    this.renderCartContents();
    updateCartCount();
  }
}
