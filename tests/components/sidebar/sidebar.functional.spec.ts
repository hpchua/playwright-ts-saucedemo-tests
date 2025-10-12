import test, { Page } from "@playwright/test";
import { SidebarComponent } from "../../../src/infrastructure/pages/components/sidebar/sidebar.component";
import { HeaderLocators } from "../../../src/infrastructure/pages/components/header/header.locators";
import { AuthUseCase } from "../../../src/application/use-cases/auth.usecase";
import { AuthPage } from "../../../src/infrastructure/pages/auth/auth.page";
import { config } from "../../../src/infrastructure/config/env.config";
import { SidebarValidation } from "../../../src/infrastructure/pages/components/sidebar/sidebar.validation";
import { AuthValidation } from "../../../src/infrastructure/pages/auth/auth.validation";
import { ProductPage } from "../../../src/infrastructure/pages/product/product.page";
import { HeaderValidation } from "../../../src/infrastructure/pages/components/header/header.validation";

test.describe("Sidebar - Functional", async () => {
    let sidebarComponent: SidebarComponent;
    let headerValidation: HeaderValidation;
    let sidebarValidation: SidebarValidation;
    let authValidation: AuthValidation;
    let authUseCase: AuthUseCase;
    let authPage: AuthPage;
    let productPage: ProductPage;
    let page: Page;

    test.beforeEach("", async ({ page: testPage }) => {
        page = testPage; // Store Playwright page instance
        sidebarComponent = new SidebarComponent(page);
        headerValidation = new HeaderValidation(page);
        sidebarValidation = new SidebarValidation(page);
        authValidation = new AuthValidation(page);
        authPage = new AuthPage(page);
        productPage = new ProductPage(page);
        authUseCase = new AuthUseCase(authPage);

        await page.goto(config.baseURL);
        await authUseCase.performStandardLogin();
    });

    test.describe("Positive @functional-positive", async () => {
        test("TC-SIDEBAR-01 - Sidebar Toggle Functionality @critical", async () => {
            await sidebarComponent.openMenu();
            await sidebarValidation.verifySidebarIsOpen();

            await sidebarComponent.closeMenu();
            await sidebarValidation.verifySidebarIsClose();

            await sidebarComponent.openMenu();
            await sidebarValidation.verifySidebarIsOpen();

            await page.locator(HeaderLocators.text.title).click();
            // TODO: Implement validation for sidebar toggle functionality
        });

        test("TC-SIDEBAR-02 - Navigation Links Functionality @high", async () => {
            await sidebarComponent.openMenu();

            await sidebarComponent.navigateToAllItems();
            await authValidation.verifySuccessfulLogin();

            // TODO: urgent to update await productPage.accessProductDetails();

            await sidebarComponent.openMenu();

            await sidebarComponent.navigateToAllItems();
            await authValidation.verifySuccessfulLogin();

            // TODO: [Enhancement] Validation for navigation links functionality
        });

        test("TC-SIDEBAR-03 - Reset App State Functionality @high", async () => {
            // TODO: urgent to update     await productPage.addToCart();
            // add validation to check item added to cart

            await sidebarComponent.openMenu();
            await sidebarComponent.resetAppState();

            await headerValidation.verifyCartIsEmpty();

            // TODO: [Addition] Validation for adding item to cart
        });
    });
});
