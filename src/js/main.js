import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";
import { cartLoading } from "./utils.mjs";

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("tents", dataSource, element);

async function init() {
  await cartLoading();

  const alert = new Alert();
  alert.init();

  productList.init();
}

init();
