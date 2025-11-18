import { loadHeaderFooter, cartLoading } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();
cartLoading();
const checkout = new CheckoutProcess("so-cart", ".order-summary");

async function initCheckout() {
  await checkout.init();
  checkout.calculateOrderTotal();
}

initCheckout();

document.getElementById("zip").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.checkValidity()) {
    alert("Your order has been placed!");
  } else {
    alert("Please fill out all required fields.");
  }
});
