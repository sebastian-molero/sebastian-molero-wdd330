import ShoppingCart from "./ShoppingCart.mjs";
import { searchProducts } from "./utils.mjs";

const parentElement = document.querySelector(".product-list");
const cart = new ShoppingCart("so-cart", parentElement);

searchProducts();
cart.init();

document.querySelector(".checkout-link").addEventListener("click", () => {
  window.location.href = "/checkout/index.html";
});
