export const ProductItemLocator = {
    name: '[data-test*="inventory-item-name"]',
    description: '[data-test*="inventory-item-desc"]',
    price: '[data-test*="inventory-item-price"]',
    actionButton: '[data-test^="add-to-cart"], [data-test^="remove"]',
    addToCartButton: `button:has-text("Add to cart")`,
    removeButton: `button:has-text("Remove")`,
} as const;
