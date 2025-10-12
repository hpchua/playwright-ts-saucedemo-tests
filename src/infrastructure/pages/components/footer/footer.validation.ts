import { expect, Page } from "@playwright/test";
import { FooterComponent } from "./footer.component";
import { FooterContent } from "./footer.content";

export class FooterValidation {
    private footerComponent: FooterComponent;

    constructor(private page: Page) {
        this.footerComponent = new FooterComponent(page);
    }

    async validateSocialMediaIconsVisibility(): Promise<void> {
        const areIconsVisible =
            await this.footerComponent.areSocialMediaIconsVisible();
        if (!areIconsVisible) {
            throw new Error("Social media icons are not visible");
        }
    }

    async validateCopyrightTextVisibility(): Promise<void> {
        expect(await this.footerComponent.isCopyrightTextVisible()).toBe(true);
    }

    async validateCopyrightText(): Promise<void> {
        expect(await this.footerComponent.getCopyrightText()).toEqual(
            FooterContent.copyright
        );
    }

    async validateSocialMediaLinks(): Promise<void> {
        const [newPageFacebook] = await Promise.all([
            this.page.waitForEvent("popup"),
            this.footerComponent.clickFacebookIcon(),
        ]);
        await expect(newPageFacebook).toHaveURL(
            FooterContent.socialMediaLinks.facebook
        );
        await newPageFacebook.close();

        const [newPageTwitter] = await Promise.all([
            this.page.waitForEvent("popup"),
            this.footerComponent.clickTwitterIcon(),
        ]);
        await expect(newPageTwitter).toHaveURL(
            FooterContent.socialMediaLinks.twitter
        );
        await newPageTwitter.close();

        const [newPageLinkedIn] = await Promise.all([
            this.page.waitForEvent("popup"),
            this.footerComponent.clickLinkedInIcon(),
        ]);
        await expect(newPageLinkedIn).toHaveURL(
            FooterContent.socialMediaLinks.linkedin
        );
        await newPageLinkedIn.close();
    }
}
