import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";
import { cartLoading, getParam } from "./utils.mjs";

async function init() {
  await cartLoading();

  const alert = new Alert();
  alert.init();

  const category = getParam("category");
  const dataSource = new ProductData();
  const element = document.querySelector(".product-list");
  const productList = new ProductList(category, dataSource, element);

  productList.init();

  const title = document.querySelector(".page-title");

  if (title && category) {
    title.textContent = `Top Products: ${category
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")}`;
  }
}

init();
