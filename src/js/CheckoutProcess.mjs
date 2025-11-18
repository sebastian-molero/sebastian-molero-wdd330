import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    async init() {
        this.list = await getLocalStorage(this.key) || [];
        this.calculateItemSubtotal();
    }

    calculateItemSubtotal() {
        let subtotal = 0;
        let itemCount = 0;

        this.list.forEach((item) => {
            subtotal += item.FinalPrice * item.quantity;
            itemCount += item.quantity;
        });

        this.itemTotal = subtotal;

        const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
        const itemsElement = document.querySelector(`${this.outputSelector} #num-items`);

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (itemsElement) itemsElement.textContent = itemCount;
    }
    
    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;

        const itemCount = this.list.reduce((sum, item) => sum + item.quantity, 0);

        if (itemCount > 0) this.shipping = 10 + (itemCount - 1) * 2;
        else this.shipping = 0;
        
        this.orderTotal = this.itemTotal + this.shipping + this.tax;

        this.displayOrderTotal();
    }

    displayOrderTotal() {
        const taxElement = document.querySelector(`${this.outputSelector} #tax`);
        const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
        const totalElement = document.querySelector(`${this.outputSelector} #total`);

        if (taxElement) taxElement.textContent = `$${this.tax.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
    }

    packageItems(items) {
        return items.map(item => ({
            id: item.Id,
            name: item.Name,
            price: item.FinalPrice,
            quantity: item.quantity
        }))
    }

    formDataToJSON(formElement) {
        const formData = new FormData(formElement);
        const converted = {};

        formData.forEach((value, key) => { converted[key] = value });
        return converted;
    };

    async checkout(form) {
        const order = this.formDataToJSON(form);

        order.orderDate = new Date().toISOString();
        order.items = this.packageItems(this.list);
        order.orderTotal = this.orderTotal.toFixed(2);
        order.tax = this.tax.toFixed(2);
        order.shipping = this.shipping;

        const services = new ExternalServices();

        try {
            const result = await services.checkout(order);
            console.log(result);

            localStorage.removeItem("so-cart");
            
            alert("Order placed successfully!");

            window.location.reload();
            
        } catch (error) {
            console.error(error);
            alert("There was a problem submitting your order. Please try again later.");

        }

    }
}
