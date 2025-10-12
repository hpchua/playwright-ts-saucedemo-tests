import { expect, Page } from "@playwright/test";
import { SidebarLocators } from "./sidebar.locators";
import { SidebarComponent } from "./sidebar.component";

export class SidebarValidation {
    private sidebarComponent: SidebarComponent;

    constructor(private page: Page) {
        this.sidebarComponent = new SidebarComponent(page);
    }

    async verifySidebarIsOpen() {
        /*
        await expect(sidebarComponent.MenuButtonVisible()).toBe(false);
        */

        expect(await this.sidebarComponent.isCloseMenuButtonVisible()).toBe(
            true
        );
        expect(await this.sidebarComponent.areAllLinksVisible()).toBe(true);
    }

    async verifySidebarIsClose() {
        expect(
            await this.page.locator(SidebarLocators.button.menuButton)
        ).toBeVisible();

        /*
        await expect(sidebarComponent.isCloseMenuButtonVisible()).toBe(false);
        await expect(sidebarComponent.areAllLinksVisible()).toBe(false);
        */
    }
}
