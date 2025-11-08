import { renderListWithTemplate } from "./utils.mjs";
import { isDiscounted, discountPercentage } from "./utils.mjs";

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData();
        this.renderList(list);
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}

function productCardTemplate(product) {
    return `
        <li class="product-card ${isDiscounted(product) ? "discounted" : ""}">
            <a href="product_pages/?product=${product.Id}">
                <img src="${product.Image}" alt="${product.Name}">
                <h2>${product.Brand.Name}</h2>
                <h3>${product.Name}</h3>
                <div class="price-row">
                ${isDiscounted(product)
                    ? `
                        <span class="price price__final">$${product.FinalPrice.toFixed(2)}</span>
                        <span class="price price__srp">$${product.SuggestedRetailPrice.toFixed(2)}</span>
                        <span class="badge badge__discount">-${discountPercentage(product)}%</span> `
                    : `
                        <span class="product-card__price">$${product.FinalPrice.toFixed(2)}</span>`
                }
                </div>
            </a>
        </li>
        `;
}