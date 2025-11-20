import Alert from "./Alert.js";
import { cartLoading, searchProducts } from "./utils.mjs";

async function init() {
  await cartLoading();
  const alert = new Alert();
  alert.init();
  searchProducts();
}

init();

document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("welcomeDialog");
  const closeButton = document.getElementById("closeWelcome");

  if (!localStorage.getItem("welcomeShown")) {
    dialog.showModal();
    localStorage.setItem("welcomeShown", "true");
  }

  closeButton.addEventListener("click", () => {
    dialog.close();
  });
});
