import test, { Page } from "@playwright/test";
import { HeaderValidation } from "../../../src/infrastructure/pages/components/header/header.validation";
import { HeaderComponent } from "../../../src/infrastructure/pages/components/header/header.component";
import { config } from "../../../src/infrastructure/config/env.config";
import { AuthPage } from "../../../src/infrastructure/pages/auth/auth.page";
import { AuthUseCase } from "../../../src/application/use-cases/auth.usecase";
import { ProductPage } from "../../../src/infrastructure/pages/product/product.page";

test.describe("Header - Functional", async () => {
    let page: Page;
    let headerComponent: HeaderComponent;
    let headerValidation: HeaderValidation;
    let authPage: AuthPage;
    let productPage: ProductPage;
    let authUseCase: AuthUseCase;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage; // Store Playwright page instance
        headerComponent = new HeaderComponent(page);
        headerValidation = new HeaderValidation(page);
        authPage = new AuthPage(page);
        productPage = new ProductPage(page);
        authUseCase = new AuthUseCase(authPage);

        await page.goto(config.baseURL);
        await authUseCase.performStandardLogin();
    });

    test.describe("Positive @functional-positive", () => {
        test("TC-HDR-02 - Shopping Cart Badge Update @critical", async () => {
            // TODO: urgent to update await productPage.addToCart();
            await headerValidation.verifyCartCountNumber(1);

            // TODO: urgent to update await productPage.removeFromCart();
            await headerValidation.verifyCartIsEmpty();

            //TODO: Implement validation for shopping cart badge update for multiple items
        });
    });
});
