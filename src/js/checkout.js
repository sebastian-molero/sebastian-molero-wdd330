import { loadHeaderFooter, cartLoading } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order-summary");

async function initCheckout() {
  await checkout.init();
  checkout.calculateOrderTotal();
  cartLoading();
}

initCheckout();

document.getElementById("zip").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

document
  .getElementById("checkoutForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    if (e.target.checkValidity()) {
      await checkout.checkout(e.target);
    } else {
      alert("Please fill out all required fields.");
    }
  });
