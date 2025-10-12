import test, { Page } from "@playwright/test";
import { AuthUseCase } from "../../src/application/use-cases/auth.usecase";
import { AuthPage } from "../../src/infrastructure/pages/auth/auth.page";
import { config } from "../../src/infrastructure/config/env.config";

test.describe("Cart", () => {
    let page: Page;
    let authPage: AuthPage;
    let authUseCase: AuthUseCase;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        authPage = new AuthPage(page);
        authUseCase = new AuthUseCase(authPage);

        await page.goto(config.baseURL);
        await authUseCase.performStandardLogin();
    });

    test.describe("UI @ui", () => {
        test("TC-CART-01 - Verify cart page layout", () => {
            // TODO: to add component validation - header and footer
        });
    });
});
