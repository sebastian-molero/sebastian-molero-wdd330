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

document
  .getElementById("zip")
  .addEventListener("blur", checkout.calculateOrderTotal.bind(checkout));

document
  .querySelector("#checkoutForm button")
  .addEventListener("click", (e) => {
    e.preventDefault();
    checkout.checkout();
  });
