import { getLocalStorage, setLocalStorage, discountPercentage } from "./utils.mjs";
export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId)
        this.renderProductDetails();

        document
            .getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    document.querySelector("h2").textContent = product.Brand.Name;
    document.querySelector("h3").textContent = product.NameWithoutBrand;

    const productImage = document.querySelector("img.divider");
    productImage.src = product.Image;
    productImage.alt = product.NameWithoutBrand;
    
    const priceContainer = document.querySelector(".product-card__price");

    if (product.FinalPrice < product.SuggestedRetailPrice) {
        priceContainer.innerHTML = `
            <span class="price price__final">$${product.FinalPrice.toFixed(2)}</span>
            <span class ="price price__srp">$${product.SuggestedRetailPrice.toFixed(2)}</span>
            <span class="badge badge__discount">-${discountPercentage(product)}%</span>
        `;
    }
    else {
        priceContainer.innerHTML = `$${product.priceFinal.toFixed(2)}`;
    }
    
    document.querySelector(".product__color").textContent = product.Colors[0].ColorName;
    document.querySelector(".product__description").innerHTML = product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = product.Id; 
}