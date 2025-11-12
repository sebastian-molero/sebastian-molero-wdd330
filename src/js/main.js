import Alert from "./Alert.js";
import { cartLoading, searchProducts } from "./utils.mjs";

async function init() {
  await cartLoading();
  const alert = new Alert();
  alert.init();
  searchProducts();
}

init();
