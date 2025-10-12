import { ProductContent } from "./product.content";

export const ProductLocators = {
    text: {
        pageTitle: "[data-test='title']",
    },
    dropdown: {
        sorting: "[data-test='product-sort-container']",
    },
    products: {
        container: ".inventory_list",
        item: ".inventory_item",
        itemByName: (name: string) =>
            `//div[@class='inventory_item' and .//div[text()='${name}']]`,
        name: '[data-test="inventory-item-name"]',
        description: '[data-test="inventory-item-desc"]',
        price: '[data-test="inventory-item-price"]',
        actionButton: '[data-test^="add-to-cart"], [data-test^="remove"]',
        addToCartButton: `button:has-text("${ProductContent.button.addToCart}")`,
        removeButton: `button:has-text("${ProductContent.button.remove}")`,
        image: "img.inventory_item_img",
    },
    productDetailsLink: (name: string) => `//div[text()='${name}']/ancestor::a`,
} as const;
