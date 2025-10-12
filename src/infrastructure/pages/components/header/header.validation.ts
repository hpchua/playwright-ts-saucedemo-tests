import { expect, Page } from "@playwright/test";
import { HeaderComponent } from "./header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

export class HeaderValidation {
    private headerComponent: HeaderComponent;
    private sidebarComponent: SidebarComponent;

    constructor(private page: Page) {
        this.headerComponent = new HeaderComponent(page);
        this.sidebarComponent = new SidebarComponent(page);
    }

    async verifyHeaderElements() {
        expect(await this.sidebarComponent.isMenuButtonVisible()).toBe(true);
        expect(await this.headerComponent.isTitleVisible()).toBe(true);
        expect(await this.headerComponent.isCartButtonVisible()).toBe(true);
    }

    async verifyCartIsEmpty() {
        expect(await this.headerComponent.verifyCartIsEmpty()).toBe(true);
    }

    async validateCartCount(expectedCount: number): Promise<boolean> {
        const cartBadgeCount = await this.headerComponent?.getCartCount();
        return this.isCartCountCorrect(cartBadgeCount, expectedCount);
    }

    async isCartCountCorrect(
        actualCount: string | null,
        expectedCount: number
    ): Promise<boolean> {
        if (actualCount === null) {
            return expectedCount === 0;
        }
        return parseInt(actualCount) === expectedCount;
    }
}
