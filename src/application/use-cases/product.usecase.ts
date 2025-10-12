import { Product } from "../../domain/entities/product.entity";
import { HeaderComponent } from "../../infrastructure/pages/components/header/header.component";
import { HeaderValidation } from "../../infrastructure/pages/components/header/header.validation";
import {
    ProductContent,
    SortOption,
} from "../../infrastructure/pages/product/product.content";
import { ProductPage } from "../../infrastructure/pages/product/product.page";
import { ProductValidation } from "../../infrastructure/pages/product/product.validation";

export class ProductUseCase {
    constructor(
        private productPage: ProductPage,
        private productValidation: ProductValidation,
        private headerComponent: HeaderComponent,
        private headerValidation: HeaderValidation
    ) {}

    async sortProductsAndGetList(sortOption: SortOption): Promise<Product[]> {
        await this.productPage.selectSortingOption(sortOption);

        return await this.productPage.getAllProducts();
    }

    async verifyProductSorting(sortOption?: SortOption): Promise<boolean> {
        const currentSortOption = sortOption || SortOption.NAME_A_TO_Z;
        await this.productPage.selectSortingOption(currentSortOption);

        const actualProducts = await this.productPage.getAllProducts();

        let sortedProducts: Product[];

        switch (currentSortOption) {
            case SortOption.NAME_A_TO_Z:
                sortedProducts = [...actualProducts].sort((a, b) =>
                    a.name.trim().localeCompare(b.name.trim())
                );
                break;
            case SortOption.NAME_Z_TO_A:
                sortedProducts = [...actualProducts].sort((a, b) =>
                    b.name.trim().localeCompare(a.name.trim())
                );
                break;
            case SortOption.PRICE_LOW_TO_HIGH:
                sortedProducts = [...actualProducts].sort(
                    (a, b) => a.price - b.price
                );
                break;
            case SortOption.PRICE_HIGH_TO_LOW:
                sortedProducts = [...actualProducts].sort(
                    (a, b) => b.price - a.price
                );
                break;
            default:
                throw new Error(`Invalid sort option: ${currentSortOption}`);
        }

        const actualOrder = actualProducts.map((product) =>
            this.getProductOrderValue(product, currentSortOption)
        );
        const expectedOrder = sortedProducts.map((product) =>
            this.getProductOrderValue(product, currentSortOption)
        );

        // Log the arrays to see the exact content and order
        console.log("Actual Order:", actualOrder);
        console.log("Expected Order:", expectedOrder);

        const isSortedCorrectly =
            JSON.stringify(actualOrder) === JSON.stringify(expectedOrder);

        if (!isSortedCorrectly) {
            console.error(
                "Sorting validation failed. Actual and Expected orders do not match."
            );
        }

        return isSortedCorrectly;

        // Use a simple comparison to see if the arrays are in the same order
        // return JSON.stringify(actualOrder) === JSON.stringify(expectedOrder);
    }

    private getProductOrderValue(
        product: Product,
        sortOption: SortOption
    ): string | number {
        switch (sortOption) {
            case SortOption.NAME_A_TO_Z:
            case SortOption.NAME_Z_TO_A:
                return product.name;
            case SortOption.PRICE_LOW_TO_HIGH:
            case SortOption.PRICE_HIGH_TO_LOW:
                return product.price;
        }
    }

    async addAnyProductToCart(): Promise<void> {
        const products = await this.productPage.getAllProducts();
        const productToAdd = products.find(
            (p) => p.actionButtonText === ProductContent.button.addToCart
        );
        if (productToAdd) {
            await this.productPage.clickProductActionButton(productToAdd.name);
        } else {
            console.error("No product found with 'Add to cart' button.");
        }
    }

    async removeExistingItemsFromCart(): Promise<void> {
        const allProducts = await this.productPage.getAllProducts();

        for (const product of allProducts) {
            if (product.actionButtonText === ProductContent.button.remove) {
                await this.productPage.clickProductActionButton(product.name);
            }
        }
    }

    async addProductToCartAndValidate(productName: string): Promise<boolean> {
        const initialProducts = await this.productPage.getAllProducts();
        const initialProduct = initialProducts.find(
            (p) => p.name === productName
        );

        const initialCartCount = parseInt(
            (await this.headerComponent?.getCartCount()) || "0"
        );

        console.log("initialCartCount: " + initialCartCount);

        await this.productPage.clickProductActionButton(productName);

        const updatedProducts = await this.productPage.getAllProducts();
        const updatedProduct = updatedProducts.find(
            (p) => p.name === productName
        );

        if (updatedProduct) {
            const isButtonCorrect =
                await this.productValidation.isActionButtonTextCorrect(
                    updatedProduct,
                    ProductContent.button.remove
                );

            const isCountCorrect =
                await this.headerValidation?.validateCartCount(
                    initialCartCount + 1
                );

            console.log(
                "isButtonCorrect: " +
                    isButtonCorrect +
                    " | isCountCorrect: " +
                    isCountCorrect
            );

            return (isButtonCorrect && isCountCorrect) || false;
        }

        return false;
    }

    async removeProductFromCartAndValidate(): Promise<boolean> {
        const allProducts = await this.productPage.getAllProducts();

        const productToRemove = allProducts.find(
            (p) => p.actionButtonText === ProductContent.button.remove
        );

        if (!productToRemove) {
            console.error("No product found in cart to remove.");
            return false;
        }

        const initialCartCount = parseInt(
            (await this.headerComponent?.getCartCount()) || "0"
        );

        await this.productPage.clickProductActionButton(productToRemove.name);

        const updatedProducts = await this.productPage.getAllProducts();
        const updatedProduct = updatedProducts.find(
            (p) => p.name === productToRemove.name
        );

        if (updatedProduct) {
            const isButtonCorrect =
                await this.productValidation.isActionButtonTextCorrect(
                    updatedProduct,
                    ProductContent.button.addToCart
                );

            const isCountCorrect =
                await this.headerValidation?.validateCartCount(
                    initialCartCount - 1
                );

            return (isButtonCorrect && isCountCorrect) || false;
        }

        return false;
    }

    async addAllProductsToCartAndValidate(): Promise<boolean> {
        let addedCount = 0;
        const allProducts = await this.productPage.getAllProducts();

        for (const product of allProducts) {
            if (product.actionButtonText === ProductContent.button.addToCart) {
                await this.productPage.clickProductActionButton(product.name);
                addedCount++;
            }
        }

        const updatedProducts = await this.productPage.getAllProducts();
        const allButtonsAreRemove = updatedProducts.every((p) =>
            this.productValidation.isActionButtonTextCorrect(
                p,
                ProductContent.button.remove
            )
        );

        const cartBadgeCount = await this.headerComponent?.getCartCount();
        const isCartCountCorrect = this.headerValidation?.isCartCountCorrect(
            cartBadgeCount ?? null,
            updatedProducts.length
        );

        return (allButtonsAreRemove && isCartCountCorrect) || false;
    }

    async removeAllProductsFromCartAndValidate(): Promise<boolean> {
        let removedCount = 0;
        const allProducts = await this.productPage.getAllProducts();

        for (const product of allProducts) {
            if (product.actionButtonText === ProductContent.button.remove) {
                await this.productPage.clickProductActionButton(product.name);
                removedCount++;
            }
        }

        const updatedProducts = await this.productPage.getAllProducts();
        const allButtonsAreAddToCart = updatedProducts.every((p) =>
            this.productValidation.isActionButtonTextCorrect(
                p,
                ProductContent.button.addToCart
            )
        );

        const cartBadgeCount = await this.headerComponent?.getCartCount();
        const isCartCountCorrect = this.headerValidation?.isCartCountCorrect(
            cartBadgeCount ?? null,
            0
        );

        return (allButtonsAreAddToCart && isCartCountCorrect) || false;
    }

    async validateCartStateAfterReload(
        initialCartItemCount: number
    ): Promise<boolean> {
        await this.productPage.reloadPage();

        const productsAfterReload = await this.productPage.getAllProducts();

        const allAddedItemsAreRemove =
            productsAfterReload.filter(
                (p) => p.actionButtonText === ProductContent.button.remove
            ).length === initialCartItemCount; // Filter for 'Remove' buttons // Check if the count matches the initial count

        const isCountCorrect =
            await this.headerValidation.validateCartCount(initialCartItemCount);

        return allAddedItemsAreRemove && isCountCorrect;
    }

    public async validateInvalidSortErrorHandling(
        invalidQuery: string,
        defaultSortText: string
    ): Promise<boolean> {
        await this.productPage.navigateWithQuery(invalidQuery);

        const actualSelectedText =
            await this.productPage.getCurrentSortOptionText();

        console.log("actualSelectedText: " + actualSelectedText);

        return this.productValidation.isSelectedSortOptionDefault(
            actualSelectedText,
            defaultSortText
        );
    }
}
