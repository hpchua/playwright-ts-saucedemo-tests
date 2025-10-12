import { Page, Locator } from "@playwright/test";
import { config } from "../config/env.config";

export abstract class BasePage {
    constructor(protected readonly page: Page) {}

    /**
     * Navigates to a specified URL.
     * @param path The URL to navigate to.
     */
    async goTo(path: string): Promise<void> {
        await this.page.goto(config.baseURL + path);
    }

    /**
     * Clicks on a given locator.
     * @param locator The Locator object to click.
     */
    async click(locator: Locator): Promise<void> {
        await locator.click();
    }

    /**
     * Fills a text input field with the given text.
     * @param locator The Locator object for the input field.
     * @param text The text to fill into the field.
     */
    async fill(locator: Locator, text: string): Promise<void> {
        await locator.fill(text);
    }

    /**
     * Gets the text content of an element.
     * @param locator The Locator object for the element.
     * @returns The text content as a string.
     */
    async getInnerText(locator: Locator): Promise<string | null> {
        return await locator.innerText();
    }

    /**
     * Checks if an element is visible on the page.
     * @param locator The Locator object for the element.
     * @returns A boolean indicating if the element is visible.
     */
    async isVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }

    /*
    async waitForElement(locator: Locator, timeout = 10000) {
        await this.page.waitForSelector(locator, { timeout });
    }

    async takeScreenshot(name: String) {
        await this.page.screenshot({
            path: `screenshots/${name}-${new Date().toISOString().replace(/:/g, "-")}.png`,
            fullPage: true,
        });
    }
    */
}
