import { expect, Page, test } from "@playwright/test";
import { AuthUseCase } from "../../src/application/use-cases/auth.usecase";
import { AuthPage } from "../../src/infrastructure/pages/auth/auth.page";
import { config } from "../../src/infrastructure/config/env.config";
import { User } from "../../src/domain/entities/user.entity";
import { AuthValidation } from "../../src/infrastructure/pages/auth/auth.validation";

test.describe("Authentication - Performance", () => {
    let authValidation: AuthValidation;
    let authUseCase: AuthUseCase;
    let authPage: AuthPage;
    let page: Page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage; // Store Playwright page instance
        authPage = new AuthPage(page);
        authUseCase = new AuthUseCase(authPage);
        authValidation = new AuthValidation(page);

        await page.goto(config.baseURL);
    });

    test("TC-AUTH-09 - Performance Glitch User Login @performance @high", async () => {
        const user = User.performanceGlitch();
        await authUseCase.executeLogin(user);

        await authValidation.verifySuccessfulLogin();
        //TODO: Implement validation for performance glitch user login test
    });
});
