import Wishlist from "./Wishlist.mjs";
import { cartLoading, updateWishlistCount } from "./utils.mjs";

const list = document.querySelector(".wishlist-items");

const wishlist = new Wishlist("so-wishlist", list);

async function initWishlist() {
  await wishlist.init();
  cartLoading();
  updateWishlistCount();
}

initWishlist();
