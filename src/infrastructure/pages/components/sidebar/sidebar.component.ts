import { Locator, Page } from "@playwright/test";
import { SidebarLocators } from "./sidebar.locators";

export class SidebarComponent {
    constructor(private page: Page) {}

    private get openMenuButton(): Locator {
        return this.page.locator(SidebarLocators.button.menuButton);
    }

    private get closeMenuButton(): Locator {
        return this.page.locator(SidebarLocators.button.closeButton);
    }

    private get allItemsLink(): Locator {
        return this.page.locator(SidebarLocators.links.allItems);
    }

    private get aboutLink(): Locator {
        return this.page.locator(SidebarLocators.links.about);
    }

    private get logoutLink(): Locator {
        return this.page.locator(SidebarLocators.links.logout);
    }

    private get resetAppStateLink(): Locator {
        return this.page.locator(SidebarLocators.links.resetAppState);
    }

    async openMenu(): Promise<void> {
        await this.openMenuButton.click();
    }

    async isMenuButtonVisible(): Promise<boolean> {
        return await this.openMenuButton.isVisible();
    }

    async closeMenu(): Promise<void> {
        await this.closeMenuButton.click();
    }

    async isCloseMenuButtonVisible(): Promise<boolean> {
        return await this.closeMenuButton.isVisible();
    }

    async navigateToAllItems(): Promise<void> {
        await this.allItemsLink.click();
    }

    async navigateToAbout(): Promise<void> {
        await this.aboutLink.click();
    }

    async performLogout(): Promise<void> {
        await this.openMenu();

        await this.logoutLink.waitFor({ state: "visible" });
        await this.logoutLink.click();
    }

    async resetAppState(): Promise<void> {
        await this.resetAppStateLink.click();
    }

    async areAllLinksVisible(): Promise<boolean> {
        const linksToCheck = [
            this.allItemsLink,
            this.aboutLink,
            this.logoutLink,
            this.resetAppStateLink,
        ];

        for (const link of linksToCheck) {
            const isVisible = await link.isVisible();
            if (!isVisible) {
                return false;
            }
        }

        return true;
    }
}
