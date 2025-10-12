import { Page } from "@playwright/test";
import { FooterLocators } from "./footer.locators";

export class FooterComponent {
    constructor(private page: Page) {}

    async areSocialMediaIconsVisible(): Promise<boolean> {
        const socialMediaIcons = [
            FooterLocators.socialMediaIcons.twitter,
            FooterLocators.socialMediaIcons.facebook,
            FooterLocators.socialMediaIcons.linkedin,
        ];

        for (const icon of socialMediaIcons) {
            const isVisible = await this.page.isVisible(icon);
            if (!isVisible) {
                return false;
            }
        }

        return true;
    }

    async clickFacebookIcon(): Promise<void> {
        await this.page.click(FooterLocators.socialMediaIcons.facebook);
    }

    async clickTwitterIcon(): Promise<void> {
        await this.page.click(FooterLocators.socialMediaIcons.twitter);
    }

    async clickLinkedInIcon(): Promise<void> {
        await this.page.click(FooterLocators.socialMediaIcons.linkedin);
    }

    async isCopyrightTextVisible(): Promise<boolean> {
        return await this.page.isVisible(FooterLocators.copyrightText);
    }

    async getCopyrightText(): Promise<string | null> {
        return await this.page.textContent(FooterLocators.copyrightText);
    }
}
