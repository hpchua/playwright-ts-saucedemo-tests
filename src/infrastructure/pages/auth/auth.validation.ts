import { AuthContent, AuthErrorCode, AuthInput } from "./auth.content";
import { AuthPage } from "./auth.page";
import { AuthLocators } from "./auth.locators";
import { expect, Page } from "@playwright/test";
import { config } from "../../config/env.config";
import { User } from "../../../domain/entities/user.entity";
import { HeaderValidation } from "../components/header/header.validation";

export class AuthValidation {
    constructor(private readonly page: Page) {}

    async verifySuccessfulLogin() {
        await expect(this.page).toHaveURL(`${config.baseURL}/inventory.html`);

        // TODO: Add additional common login assertions
        await new HeaderValidation(this.page).verifyHeaderElements();
    }

    async verifyFailedLogin(
        user: User,
        expectedError: AuthErrorCode,
        authPage: AuthPage
    ) {
        // Verify error message
        const expectedErrorMessage = AuthContent.getErrorMessage(expectedError);
        expect(await authPage.isErrorMessageVisible()).toBe(true);
        expect(await authPage.getErrorMessage()).toBe(expectedErrorMessage);

        expect(await authPage.isFieldErrorVisible(AuthInput.Username)).toBe(
            true
        );
        expect(await authPage.isFieldErrorVisible(AuthInput.Password)).toBe(
            true
        );

        // Verify input fields retain data
        expect(await authPage.getFieldValue(AuthInput.Username)).toBe(
            user.username
        );
        expect(await authPage.getFieldValue(AuthInput.Password)).toBe(
            user.password
        );

        // Verify URL remains on the login page
        await expect(this.page).toHaveURL(config.baseURL);
    }

    async verifyLogoutSuccess() {
        await expect(this.page).toHaveURL(config.baseURL);

        await expect(
            this.page.locator(AuthLocators.buttons.login)
        ).toBeVisible();
    }

    async verifyFieldEmptyAfterReloadPage() {
        await expect(
            this.page.locator(AuthLocators.inputs.username)
        ).toBeEmpty();
        await expect(
            this.page.locator(AuthLocators.inputs.password)
        ).toBeEmpty();
    }
}
