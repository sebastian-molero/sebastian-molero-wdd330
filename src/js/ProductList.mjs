import { renderListWithTemplate, isDiscounted, discountPercentage } from "./utils.mjs";

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData(this.category);
        this.renderList(list);
    }

    renderList(list) {
      if (!list || list.length === 0) {
        this.listElement.innerHTML = "<p>No products found</p>";
        return;
      }
      
      renderListWithTemplate(productCardTemplate, this.listElement, list);
      
    }
}

function productCardTemplate(product) {
    return `
      <li class="product-card ${isDiscounted(product) ? "discounted" : ""}">
        <a href="../product_pages/index.html?id=${product.Id}">
          <img src="${product.Images?.PrimaryMedium}" alt="${product.Name}" />
          <h2 class="card__brand">${product.Brand?.Name || ""}</h2>
          <h3 class="card__name">${product.Name}</h3>
          <div class="price-row">
            ${
              isDiscounted(product)
                ? `
                  <span class="price price__final">$${product.FinalPrice.toFixed(2)}</span>
                  <span class="price price__srp">$${product.SuggestedRetailPrice.toFixed(2)}</span>
                  <span class="badge badge__discount">-${discountPercentage(product)}%</span>
                `
                : `
                  <span class="product-card__price">$${product.FinalPrice.toFixed(2)}</span>
                `
            }
          </div>
        </a>
      </li>
    `;
  }
  