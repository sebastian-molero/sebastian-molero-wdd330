import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";
import { cartLoading, getParam, searchProducts } from "./utils.mjs";

async function init() {
  await cartLoading();
  searchProducts();

  const alert = new Alert();
  alert.init();

  const category = getParam("category");
  const searchQuery = getParam("search");

  const dataSource = new ProductData();
  const element = document.querySelector(".product-list");

  if (searchQuery) {
    const results = await dataSource.searchProducts(searchQuery);
    const productList = new ProductList("search", dataSource, element);
    productList.renderList(results);

    const title = document.querySelector(".page-title");
    if (title) title.textContent = `Search results for "${searchQuery}"`;
  } else if (category) {
    const productList = new ProductList(category, dataSource, element);
    productList.init();

    const title = document.querySelector(".page-title");
    if (title)
      title.textContent = `Top Products: ${category.replace("-", " ")}`;
  }
}

init();
