import { ProductContent, SortOption } from "./product.content";
import { ProductPage } from "./product.page";
import { ProductValidationResult } from "../../../domain/entities/types/types/product.types";
import { Product } from "../../../domain/entities/product.entity";
import { Locator } from "@playwright/test";

export class ProductValidation {
    constructor(private productPage: ProductPage) {}

    async hasCorrectSortingOptions(): Promise<boolean> {
        try {
            const actualOptions = await this.productPage.getSortingOptions();
            const expectedOptions = [...ProductContent.dropdown.sortOptions];

            return this.verifySortingOptionsMatch(
                actualOptions,
                expectedOptions
            );
        } catch (error) {
            console.error("Error verifying sorting dropdown options:", error);
            return false;
        }
    }

    async verifySortingOptionsMatch(
        actualOptions: Array<{ value: string; text: string }>,
        expectedOptions: Array<{ value: string; text: string }>
    ): Promise<boolean> {
        if (actualOptions.length !== expectedOptions.length) {
            console.error(
                `Expected ${expectedOptions.length} options, but found ${actualOptions.length}.`
            );
            return false;
        }

        for (let i = 0; i < actualOptions.length; i++) {
            const actual = actualOptions[i];
            const expected = expectedOptions[i];

            if (
                actual.value !== expected.value ||
                actual.text !== expected.text
            ) {
                console.error(
                    `Option at index ${i} has incorrect value or text.`
                );
                console.error(
                    `Expected: value='${expected.value}', text='${expected.text}'`
                );
                console.error(
                    `Actual:   value='${actual.value}', text='${actual.text}'`
                );
                return false;
            }
        }

        return true;
    }

    async isProductListSorted(
        products: Product[],
        sortOption: SortOption
    ): Promise<boolean> {
        let sortedProducts: Product[];

        switch (sortOption) {
            case SortOption.NAME_A_TO_Z:
                sortedProducts = [...products].sort((a, b) =>
                    a.name.trim().localeCompare(b.name.trim())
                );
                break;
            case SortOption.NAME_Z_TO_A:
                sortedProducts = [...products].sort((a, b) =>
                    b.name.trim().localeCompare(a.name.trim())
                );
                break;
            case SortOption.PRICE_LOW_TO_HIGH:
                sortedProducts = [...products].sort(
                    (a, b) => a.price - b.price
                );
                break;
            case SortOption.PRICE_HIGH_TO_LOW:
                sortedProducts = [...products].sort(
                    (a, b) => b.price - a.price
                );
                break;
            default:
                throw new Error(`Invalid sort option: ${sortOption}`);
        }

        const actualOrder = products.map(
            (product) => product.name || product.price
        );
        const expectedOrder = sortedProducts.map(
            (product) => product.name || product.price
        );

        return JSON.stringify(actualOrder) === JSON.stringify(expectedOrder);
    }

    validateProduct(product: Product): string[] {
        const errors: string[] = [];

        if (!product.name.trim()) errors.push("Product name is empty");

        if (!product.description.trim())
            errors.push("Product description is empty");

        if (
            product.priceRawString &&
            !this.isValidPriceFormat(product.priceRawString)
        )
            errors.push(`Price format is invalid: ${product.price}`);

        if (!product.imageUrl) errors.push("Image URL is missing");

        if (
            product.actionButtonText &&
            !this.isValidButtonText(product.actionButtonText)
        )
            errors.push(`Button text is invalid: ${product.actionButtonText}`);

        return errors;
    }

    private isValidPriceFormat(price: string): boolean {
        return /^\$\d+\.\d{2}$/.test(price);
    }

    private isValidButtonText(buttonText: string): boolean {
        const validButtonTexts = Object.values(
            ProductContent.button
        ) as string[];

        return validButtonTexts.includes(buttonText);
    }

    async validateImage(imageLocator: Locator): Promise<string[]> {
        const errors: string[] = [];

        try {
            await imageLocator.waitFor({ state: "visible", timeout: 5000 });
        } catch (e) {
            errors.push("Image is not visible");
            return errors;
        }

        const isLoaded = await imageLocator.evaluate(
            (img: HTMLImageElement) => {
                return new Promise((resolve) => {
                    if (img.complete && img.naturalWidth > 0) {
                        resolve(true);
                    } else {
                        img.onload = () => resolve(true);
                        img.onerror = () => resolve(false);
                    }
                });
            }
        );

        if (!isLoaded) {
            errors.push("Image is broken or failed to load");
        }

        return errors;
    }

    async validateAllProductAttributes(
        product: Product,
        productLocator: Locator
    ): Promise<string[]> {
        const errors: string[] = [];

        const productErrors = this.validateProduct(product);
        errors.push(...productErrors);

        const imageLocator =
            await this.productPage.getProductImageLocator(productLocator);
        const imageErrors = await this.validateImage(imageLocator);
        errors.push(...imageErrors);

        return errors;
    }

    async verifyAllProductsAttributes(): Promise<ProductValidationResult[]> {
        const results: ProductValidationResult[] = [];
        const productCount = await this.productPage.getProductCount();

        for (let i = 0; i < productCount; i++) {
            const productLocator =
                await this.productPage.getProductLocatorByIndex(i);
            const product =
                await this.productPage.extractProductData(productLocator);

            const errors = await this.validateAllProductAttributes(
                product,
                productLocator
            );

            results.push({
                productName: product.name,
                isValid: errors.length === 0,
                errors,
            });
        }

        return results;
    }

    async verifyProductAttributesByIndex(
        index: number
    ): Promise<ProductValidationResult> {
        const productLocator =
            await this.productPage.getProductLocatorByIndex(index);
        const product =
            await this.productPage.extractProductData(productLocator);

        const errors = await this.validateAllProductAttributes(
            product,
            productLocator
        );

        return {
            productName: product.name,
            isValid: errors.length === 0,
            errors,
        };
    }

    async isActionButtonTextCorrect(
        product: Product,
        expectedText: string
    ): Promise<boolean> {
        return product.actionButtonText === expectedText;
    }

    public isSelectedSortOptionDefault(
        actualText: string | null,
        expectedText: string
    ): boolean {
        return actualText === expectedText;
    }
}
