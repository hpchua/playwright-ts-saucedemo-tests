import { Page } from "@playwright/test";
import { AuthLocators } from "./auth.locators";
import { AuthInput } from "./auth.content";
import { IAuthService } from "../../../domain/interfaces/auth.interface";
import { User } from "../../../domain/entities/user.entity";

// TODO: to implement BasePage
export class AuthPage implements IAuthService {
    constructor(private readonly page: Page) {}

    async login(userCredentials: User): Promise<void> {
        await this.enterUsername(userCredentials.username);
        await this.enterPassword(userCredentials.password);
        await this.clickLoginButton();
    }

    async enterUsername(username: string) {
        await this.page.locator(AuthLocators.inputs.username).fill(username);
    }

    async enterPassword(password: string) {
        await this.page.locator(AuthLocators.inputs.password).fill(password);
    }

    async clickLoginButton() {
        await this.page.locator(AuthLocators.buttons.login).click();
    }

    async getErrorMessage(): Promise<string> {
        return this.page.locator(AuthLocators.error.container).innerText();
    }

    async isErrorMessageVisible(): Promise<boolean> {
        return this.page.locator(AuthLocators.error.container).isVisible();
    }

    async clearUsername() {
        await this.page.locator(AuthLocators.inputs.username).clear();
    }

    async clearPassword() {
        await this.page.locator(AuthLocators.inputs.password).clear();
    }

    async isFieldErrorVisible(field: AuthInput): Promise<boolean> {
        return this.page
            .locator(AuthLocators.error.fieldErrorIcon(field))
            .isVisible();
    }

    async getFieldValue(field: AuthInput): Promise<string> {
        const locator =
            field === AuthInput.Username
                ? AuthLocators.inputs.username
                : AuthLocators.inputs.password;
        return this.page.locator(locator).inputValue();
    }
}
