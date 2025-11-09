import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty</p>";
    const footer = document.querySelector(".cart-footer");
    if (footer) {
      footer.classList.add("hide");
    }
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // add event listener to remove button
  document.querySelectorAll(".cart-card__remove").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      removeFromCart(productId);
    });
  });

  // render cart total
  renderCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-card__remove" data-id="${item.Id}">&times;</button>
</li>`;

  return newItem;
}

function renderCartTotal(cartItems) {
  const footer = document.querySelector(".cart-footer");
  const totalElement = document.querySelector(".cart-total");

  if (!footer || !totalElement) {
    return;
  }

  const total = cartItems.reduce((acc, item) => acc + item.FinalPrice, 0);
  totalElement.textContent = `Total: $${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  footer.classList.remove("hide");
}

function removeFromCart(productId) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems = cartItems.filter((item) => item.Id !== productId);
  setLocalStorage("so-cart", cartItems);

  renderCartContents();
  updateCartCount();
}

updateCartCount();

renderCartContents();
