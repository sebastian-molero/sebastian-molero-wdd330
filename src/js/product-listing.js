import ExternalServices from "./ExternalServices.mjs";
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

  const dataSource = new ExternalServices();
  const element = document.querySelector(".product-list");

  if (searchQuery) {
    const results = await dataSource.searchProducts(searchQuery);
    const productList = new ProductList("search", dataSource, element);
    productList.renderList(results);

    const title = document.querySelector(".page-title");
    if (title)
      title.textContent = `Search results for "${searchQuery
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")}"`;
  } else if (category) {
    const productList = new ProductList(category, dataSource, element);
    productList.init();

    const title = document.querySelector(".page-title");
    if (title)
      title.textContent = `Top Products: ${category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}`;
  }
}

const services = new ExternalServices();
const dialog = document.getElementById("quickViewDialog");
const closeButton = document.getElementById("closeDialog");

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("quick-view")) {
    const productId = e.target.dataset.id;
    const product = await services.findProductById(productId);
    const details = document.querySelector(".dialogProductDetails");

    details.innerHTML = `
      <h2>${product.Name}</h2>
      <img src="${product.Images?.PrimaryLarge}" alt="${product.Name}" />
      <p>${product.DescriptionHtmlSimple}</p>
      <p><strong>Price:</strong> $${product.FinalPrice.toFixed(2)}</p>
    `;
    dialog.showModal();
  }
});

closeButton.addEventListener("click", () => {
  dialog.close();
});

init();
