import { getLocalStorage, setLocalStorage, updateCartCount, alertMessage, loadHeaderFooter, updateWishlistCount } from "./utils.mjs";

function wishlistItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Images?.PrimarySmall}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">Color: ${item.selectedColor || item.Colors?.[0]?.ColorName || ""}</p>
      <div class="cart-card__quantity">
        <label for="wishlist-qty-${item.Id}-${item.selectedColor}">Qty:</label>
        <input id="wishlist-qty-${item.Id}-${item.selectedColor}" type="number" min="1" value="${item.quantity || 1}" data-id="${item.Id}" data-color="${item.selectedColor}" class="cart-card__qty"/>
      </div>

      <p class="cart-card__price">
        <span>Each: $${item.FinalPrice}</span>
        <span>Subtotal: $${(item.FinalPrice * (item.quantity || 1)).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
      </p>

      <button class="cart-card__move" data-id="${item.Id}" data-color="${item.selectedColor}">Move to Cart</button>
      <button class="cart-card__remove" data-id="${item.Id}" data-color="${item.selectedColor}">&times;</button>
    </li>`;
}

export default class Wishlist {
    constructor(key, parentElement) {
        this.key = key;
        this.parentElement = parentElement;
    }
    
    async init() {
        await loadHeaderFooter();
        this.renderWishlistContents();
        updateWishlistCount();
    }

    renderWishlistContents() {
        const updatedWishlist = getLocalStorage(this.key) || [];

        if (updatedWishlist.length === 0) {
            this.parentElement.innerHTML = "<p>Your wishlist is empty</p>";
            return;
        }

        const htmlItems = updatedWishlist.map(wishlistItemTemplate);
        this.parentElement.innerHTML = htmlItems.join("");

        this.parentElement.querySelectorAll(".cart-card__move").forEach((button) => {
            button.addEventListener("click", (e) => {
                const productId = e.target.dataset.id;
                const color = e.target.dataset.color;
                this.moveToCart(productId, color);
            });
        });

        this.parentElement.querySelectorAll(".cart-card__remove").forEach((button) => {
            button.addEventListener("click", (e) => { 
                const productId = e.target.dataset.id;
                const color = e.target.dataset.color;
                this.removeFromWishlist(productId, color);
            });
        });

        this.parentElement.querySelectorAll(".cart-card__qty").forEach((input) => {
            input.addEventListener("change", (e) => {
                const productId = e.target.dataset.id;
                const color = e.target.dataset.color;
                const newQty = parseInt(e.target.value);

                const wishlistData = getLocalStorage(this.key) || [];
                const foundItem = wishlistData.find(p => p.Id === productId && p.selectedColor === color);

                if (foundItem) {
                    foundItem.quantity = newQty > 0 ? newQty : 1;
                    setLocalStorage(this.key, wishlistData);
                    updateWishlistCount();
                    this.renderWishlistContents();
                }
            });
        });
    }

    moveToCart(productId, color) {
        let wishlistItems = getLocalStorage(this.key) || [];
        const cartItems = getLocalStorage("so-cart") || [];

        const item = wishlistItems.find(p => p.Id === productId && p.selectedColor === color);
        if (item) {
            const existing = cartItems.find(p => p.Id === item.Id && p.selectedColor === color) 
            if (existing) {
                existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
            }
            else {
                cartItems.push({ ...item, quantity: item.quantity || 1 });
            }
            wishlistItems = wishlistItems.filter(p => !(p.Id === productId && p.selectedColor === color));
            setLocalStorage("so-cart", cartItems);
            setLocalStorage(this.key, wishlistItems);
            updateCartCount();
            updateWishlistCount();
            alertMessage(`${item.Name} moved to cart!`, "success");
            this.renderWishlistContents();
        }
    }

    removeFromWishlist(productId, color) {
        let wishlistItems = getLocalStorage(this.key) || [];
        wishlistItems = wishlistItems.filter(item => !(item.Id === productId && item.selectedColor === color));
        setLocalStorage(this.key, wishlistItems);
        updateWishlistCount();
        this.renderWishlistContents();
        alertMessage(`Item removed from wishlist!`, "success");
        
    }
}