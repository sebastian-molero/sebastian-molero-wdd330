import { renderListWithTemplate, isDiscounted, discountPercentage } from "./utils.mjs";

export default class ProductList {
    constructor(category, dataSource, listElement) {
      this.category = category;
      this.dataSource = dataSource;
      this.listElement = listElement;
      this.list = [];
    }

    async init() {
      this.list = await this.dataSource.getData(this.category);
      this.renderList(this.list);
        
      const sortSelect = document.getElementById("sort");
      sortSelect.addEventListener("change", (e) => {
        const criteria = e.target.value;
        const sorted = this.sortProducts([...this.list], criteria);
        this.renderList(sorted);
      });
  };
  
    renderList(list) {
      if (!list || list.length === 0) {
        this.listElement.innerHTML = "<p>No products found</p>";
        return;
      }
      
      this.listElement.innerHTML = "";
      renderListWithTemplate(productCardTemplate, this.listElement, list);
      this.updateBreadcrumb(this.category, list.length);
  }

  updateBreadcrumb(category, count) {
    const breadcrumb = document.querySelector(".breadcrumb");
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        ${category
          .split("-")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ")}
        → <span class="count">(${count} items)</span>`
    }
  } 
  
  sortProducts(list, criteria) {
    switch (criteria) {
      case "name_asc":
        return list.sort((a, b) => a.Name.localeCompare(b.Name));
      case "name_desc":
        return list.sort((a, b) => b.Name.localeCompare(a.Name));
      case "price_asc":
        return list.sort((a, b) => a.FinalPrice - b.FinalPrice);
      case "price_desc":
        return list.sort((a, b) => b.FinalPrice - a.FinalPrice);
      default:
        return list;
    }
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
        <button class="quick-view" data-id="${product.Id}">Quick View</button>
      </li>
    `;
  }
  