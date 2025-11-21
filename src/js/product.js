import {
  getParam,
  cartLoading,
  searchProducts,
  updateWishlistCount,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ExternalServices();
const productID = getParam("id");

const product = new ProductDetails(productID, dataSource);

async function init() {
  await cartLoading();
  updateWishlistCount();
  searchProducts();
  product.init();
}

init();

// add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);
