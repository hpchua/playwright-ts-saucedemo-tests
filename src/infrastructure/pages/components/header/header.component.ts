import { Page } from "@playwright/test";
import { HeaderLocators } from "./header.locators";

export class HeaderComponent {
    constructor(private page: Page) {}

    async isTitleVisible(): Promise<boolean> {
        return this.page.locator(HeaderLocators.text.title).isVisible();
    }

    async getTitleText() {
        return this.page.locator(HeaderLocators.text.title).textContent();
    }

    async isCartButtonVisible(): Promise<boolean> {
        return this.page.locator(HeaderLocators.button.cart).isVisible();
    }

    async clickCartButton() {
        await this.page.locator(HeaderLocators.button.cart).click();
    }

    async verifyCartIsEmpty(): Promise<boolean> {
        const cartCountElement = this.page.locator(
            HeaderLocators.text.cartCount
        );

        if (await cartCountElement.isHidden()) return true;

        return false;
    }

    async getCartCount(): Promise<string | null> {
        try {
            const element = this.page.locator(HeaderLocators.text.cartCount);

            await element.waitFor({ state: "attached", timeout: 5000 });

            const isVisible = await element.isVisible();

            if (isVisible) {
                const cartCount = await element.textContent();
                console.log("cartCount: " + cartCount);
                return cartCount;
            } else {
                console.log("Cart badge exists but is not visible");
                return "0"; // Assuming 0 when badge is hidden
            }
        } catch (error) {
            console.log(
                "Cart badge not found within timeout, cart is likely empty, will return 0"
            );
            return "0"; // or null
        }
    }
}
