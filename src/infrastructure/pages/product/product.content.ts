export const ProductContent = {
    text: {
        pageTitle: "Products",
    },
    dropdown: {
        sortOptions: [
            { value: "az", text: "Name (A to Z)" },
            { value: "za", text: "Name (Z to A)" },
            { value: "lohi", text: "Price (low to high)" },
            { value: "hilo", text: "Price (high to low)" },
        ],
    },
    button: {
        addToCart: "Add to cart",
        remove: "Remove",
    },
} as const;

export enum SortOption {
    NAME_A_TO_Z = "az",
    NAME_Z_TO_A = "za",
    PRICE_LOW_TO_HIGH = "lohi",
    PRICE_HIGH_TO_LOW = "hilo",
}
