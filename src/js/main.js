import Alert from "./Alert.js";
import {
  cartLoading,
  searchProducts,
  getLocalStorage,
  setLocalStorage,
} from "./utils.mjs";

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

  const form = document.getElementById("newsletterForm");
  const email = document.getElementById("newsletterEmail");
  const consent = document.getElementById("newsletterConsent");
  const feedback = document.querySelector(".form-feedback");

  let subscribedList = getLocalStorage("subscribedList") || [];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newEmail = email.value.trim().toLowerCase();
    if (!newEmail) {
      feedback.textContent = "Please enter your email address.";
      email.focus();
      return;
    }

    if (!email.checkValidity()) {
      feedback.textContent = "Please enter a valid email address.";
      email.focus();
      return;
    }

    if (!consent.checked) {
      feedback.textContent = "Please accept the terms and conditions.";
      consent.focus();
      return;
    }

    if (subscribedList.includes(newEmail)) {
      feedback.textContent = `You are already subscribed with ${newEmail}. Thanks for being here!`;
      return;
    }

    subscribedList.push(newEmail);
    setLocalStorage("subscribedList", subscribedList);

    feedback.textContent = "Thank you for subscribing to our newsletter!";
    form.reset();
  });
});
