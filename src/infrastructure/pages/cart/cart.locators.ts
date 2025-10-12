import { ProductLocators } from "../product/product.locators";

export const CartLocators = {
    table: {
        quantityHeader: "[data-test='cart-quantity-label']",
        descHeader: "[data-test='cart-desc-label']",
        itemQuantity: "[data-test='item-quantity']",
        itemName: ProductLocators.products.name,
        itemDesc: ProductLocators.products.description,
        itemPrice: ProductLocators.products.price,
        actionButton: ProductLocators.products.actionButton,
        addToCartButton: ProductLocators.products.addToCartButton,
        removeButton: ProductLocators.products.removeButton,
    },
    button: {
        continueShopping: '[data-test="continue-shopping"]',
        checkout: '[data-test="checkout"]',
    },
} as const;
