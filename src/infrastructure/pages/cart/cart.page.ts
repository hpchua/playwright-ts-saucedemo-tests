import { Locator, Page } from "@playwright/test";
import { CartLocators } from "./cart.locators";

export class CartPage {
    constructor(private readonly page: Page) {}

    private get quantityHeader(): Locator {
        return this.page.locator(CartLocators.table.quantityHeader);
    }

    private get descHeader(): Locator {
        return this.page.locator(CartLocators.table.descHeader);
    }

    private get itemQuantity(): Locator {
        return this.page.locator(CartLocators.table.itemQuantity);
    }
}
