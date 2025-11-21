import ShoppingCart from "./ShoppingCart.mjs";
import { searchProducts, updateWishlistCount } from "./utils.mjs";

const parentElement = document.querySelector(".product-list");
const cart = new ShoppingCart("so-cart", parentElement);

searchProducts();
async function initCart() {
  await cart.init();
  updateWishlistCount();
  searchProducts();
}

initCart();

document.querySelector(".checkout-link").addEventListener("click", () => {
  window.location.href = "/checkout/index.html";
});
