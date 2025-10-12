import { expect, Page, test } from "@playwright/test";
import { AuthUseCase } from "../../src/application/use-cases/auth.usecase";
import { AuthPage } from "../../src/infrastructure/pages/auth/auth.page";
import { config } from "../../src/infrastructure/config/env.config";

test.describe("Authentication - UI", () => {
    let authUseCase: AuthUseCase;
    let authPage: AuthPage;
    let page: Page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage; // Store Playwright page instance
        authPage = new AuthPage(page);
        authUseCase = new AuthUseCase(authPage);

        await page.goto(config.baseURL);
    });

    test("TC-AUTH-18 - UI Elements Presence @high", async () => {
        await authUseCase.performStandardLogin();

        // TODO: Implement UI elements presence test cases
    });

    test("TC-AUTH-19 - Error Message UI @medium", async () => {
        await authUseCase.performStandardLogin();
        // TODO: Implement Error Message UI test cases
    });

    test("TC-AUTH-20 - Responsive Layout @low", async () => {
        await authUseCase.performStandardLogin();
        // TODO: Implement Responsive Layout test cases
    });
});
