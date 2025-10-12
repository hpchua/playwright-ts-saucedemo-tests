import { Locator, Page } from "@playwright/test";
import { ProductLocators } from "./product.locators";
import { ProductContent, SortOption } from "./product.content";
import { IProductService } from "../../../domain/interfaces/product.interface";
import { Product } from "../../../domain/entities/product.entity";

export class ProductPage implements IProductService {
    constructor(private readonly page: Page) {}

    private get pageTitle(): Locator {
        return this.page.locator(ProductLocators.text.pageTitle);
    }

    private get sortingDropdown(): Locator {
        return this.page.locator(ProductLocators.dropdown.sorting);
    }

    private get sortingOptions(): Locator {
        return this.sortingDropdown.locator("option");
    }

    private get productContainer(): Locator {
        return this.page.locator(ProductLocators.products.container);
    }

    private get productItems(): Locator {
        return this.page.locator(ProductLocators.products.item);
    }

    private get productNames(): Locator {
        return this.page.locator(ProductLocators.products.name);
    }

    private get productImages(): Locator {
        return this.page.locator(ProductLocators.products.image);
    }

    private get productDescriptions(): Locator {
        return this.page.locator(ProductLocators.products.description);
    }

    private get productPrice(): Locator {
        return this.page.locator(ProductLocators.products.price);
    }

    private get actionButton(): Locator {
        return this.page.locator(ProductLocators.products.actionButton);
    }

    private get addToCartButtons(): Locator {
        return this.page.locator(ProductLocators.products.addToCartButton);
    }

    private get removeButtons(): Locator {
        return this.page.locator(ProductLocators.products.removeButton);
    }

    async isPageTitleVisible(): Promise<boolean> {
        return await this.pageTitle.isVisible();
    }

    async getPageTitleText(): Promise<string | null> {
        return await this.pageTitle.textContent();
    }

    async isSortingDropdownVisible(): Promise<boolean> {
        return await this.sortingDropdown.isVisible();
    }

    async openSortingDropdown(): Promise<void> {
        await this.sortingDropdown.waitFor({
            state: "visible",
            timeout: 5000,
        });
        await this.sortingDropdown.click();
    }

    async getSortingOptions(): Promise<Array<{ value: string; text: string }>> {
        await this.sortingDropdown.waitFor({
            state: "visible",
            timeout: 5000,
        });

        const options = this.sortingOptions;
        const count = await options.count();
        const optionData: Array<{ value: string; text: string }> = [];

        for (let i = 0; i < count; i++) {
            const option = options.nth(i);
            optionData.push({
                value: (await option.getAttribute("value")) || "",
                text: (await option.textContent()) || "",
            });
        }

        return optionData;
    }

    async getCurrentSortOptionText(): Promise<string | null> {
        const selectedValue = await this.sortingDropdown.inputValue();
        const selectedOptionText = await this.sortingDropdown
            .locator(`option[value="${selectedValue}"]`)
            .textContent();

        return selectedOptionText ? selectedOptionText.trim() : null;
    }

    async sortProductsBy(option: SortOption): Promise<Product[]> {
        await this.selectSortingOption(option);

        await this.page.waitForTimeout(500);

        return await this.getAllProducts();
    }

    async selectSortingOption(optionValue: string): Promise<void> {
        await this.sortingDropdown.selectOption(optionValue);
    }

    async getImageLocatorByIndex(index: number): Promise<Locator> {
        return this.productItems.nth(index).locator(this.productImages);
    }

    async getProductImageLocator(productLocator: any): Promise<Locator> {
        return productLocator.locator(ProductLocators.products.image);
    }

    async getNameLocatorByIndex(index: number): Promise<Locator> {
        return this.productItems.nth(index).locator(this.productNames);
    }

    async getDescriptionLocatorByIndex(index: number): Promise<Locator> {
        return this.productItems.nth(index).locator(this.productDescriptions);
    }

    async getPriceLocatorByIndex(index: number): Promise<Locator> {
        return this.productItems.nth(index).locator(this.productPrice);
    }

    async getProductPriceLocator(productLocator: any): Promise<Locator> {
        return productLocator.locator(ProductLocators.products.price);
    }

    async getActionButtonLocatorByIndex(index: number): Promise<Locator> {
        return this.productItems.nth(index).locator(this.actionButton);
    }

    async getProductActionButtonLocator(productLocator: any): Promise<Locator> {
        return productLocator.locator(ProductLocators.products.actionButton);
    }

    async getProductAddToCartButtonLocator(
        productLocator: any
    ): Promise<Locator> {
        return productLocator.locator(ProductLocators.products.addToCartButton);
    }

    async getProductRemoveButtonLocator(productLocator: any): Promise<Locator> {
        return productLocator.locator(ProductLocators.products.removeButton);
    }

    async getProductCount(): Promise<number> {
        return this.productItems.count();
    }

    async getProductLocatorByIndex(index: number): Promise<Locator> {
        return this.productItems.nth(index);
    }

    async getProductLocatorByName(productName: string): Promise<Locator> {
        return this.page.locator(
            ProductLocators.products.itemByName(productName)
        );
    }

    async getAllProducts(): Promise<Product[]> {
        const count = await this.getProductCount();
        const products: Product[] = [];

        for (let i = 0; i < count; i++) {
            const productLocator = await this.getProductLocatorByIndex(i);
            const product = await this.extractProductData(productLocator);
            products.push(product);
        }

        return products;
    }

    async extractProductData(productLocator: Locator): Promise<Product> {
        const name = await productLocator
            .locator(ProductLocators.products.name)
            .textContent()
            .then((text) => text?.trim() || "");

        const description = await productLocator
            .locator(ProductLocators.products.description)
            .textContent()
            .then((text) => text?.trim() || "");

        let priceValue = 0;

        const priceText = await productLocator
            .locator(ProductLocators.products.price)
            .textContent();
        if (priceText) {
            priceValue = parseFloat(priceText.replace("$", ""));
        }

        const imageUrl =
            (await productLocator
                .locator(ProductLocators.products.image)
                .getAttribute("src")) || "";

        const productActionButton =
            await this.getProductActionButtonLocator(productLocator);

        const buttonDataTest =
            await productActionButton.getAttribute("data-test");

        let isAddToCartButton: boolean;
        let buttonText = "";

        if (buttonDataTest?.startsWith("add-to-cart")) {
            isAddToCartButton = true;
            buttonText =
                (await productActionButton.textContent()) || "Add to cart";
        } else if (buttonDataTest?.startsWith("remove")) {
            isAddToCartButton = false;
            buttonText = (await productActionButton.textContent()) || "Remove";
        } else {
            throw new Error(
                "Could not determine button type based on data-test attribute."
            );
        }

        return new Product(
            name,
            description,
            priceValue,
            imageUrl,
            isAddToCartButton,
            buttonText,
            priceText || ""
        );
    }

    async isImageVisibleAndLoaded(imageLocator: Locator): Promise<boolean> {
        if (!(await imageLocator.isVisible())) return false;

        return await imageLocator.evaluate((img: HTMLImageElement) => {
            return img.complete && img.naturalWidth > 0;
        });
    }

    async clickProductActionButton(productName: string): Promise<void> {
        const productItem = this.page.locator(
            ProductLocators.products.itemByName(productName)
        );
        const actionButton = productItem.locator(
            ProductLocators.products.actionButton
        );
        await actionButton.click();
    }

    async reloadPage(): Promise<void> {
        await this.page.reload();

        await this.productContainer.waitFor({ state: "visible" });
    }

    async navigateWithQuery(queryString: string): Promise<void> {
        const inventoryUrl = this.page.url().split("?")[0];
        await this.page.goto(inventoryUrl + queryString);

        await this.productContainer.waitFor({ state: "visible" });
    }
}
