import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount } from "./utils.mjs";
import Alert from "./Alert.js";

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("tents", dataSource, element);

productList.init();
updateCartCount();

const alert = new Alert();
alert.init();
