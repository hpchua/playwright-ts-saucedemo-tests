import { expect, Page, test } from "@playwright/test";
import { AuthUseCase } from "../../src/application/use-cases/auth.usecase";
import { AuthPage } from "../../src/infrastructure/pages/auth/auth.page";
import { config } from "../../src/infrastructure/config/env.config";
import { AuthValidation } from "../../src/infrastructure/pages/auth/auth.validation";
import { SidebarComponent } from "../../src/infrastructure/pages/components/sidebar/sidebar.component";

test.describe("Authentication - UI", () => {
    let authValidation: AuthValidation;
    let authUseCase: AuthUseCase;
    let authPage: AuthPage;
    let sidebar: SidebarComponent;
    let page: Page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage; // Store Playwright page instance
        authPage = new AuthPage(page);
        authUseCase = new AuthUseCase(authPage);
        authValidation = new AuthValidation(page);
        sidebar = new SidebarComponent(page);

        await page.goto(config.baseURL);
    });

    test("TC-AUTH-21 - Login → Logout Cycle @critical", async () => {
        await authUseCase.performStandardLogin();
        await authValidation.verifySuccessfulLogin();

        await sidebar.openMenu();
        await sidebar.logout();

        await authValidation.verifyLogoutSuccess();
        // TODO: To check session and cookie deleted successfully
    });

    test("TC-AUTH-22 - Session Persistence After Error @medium", async () => {
        await authUseCase.performInvalidLogin();

        await page.reload();
        await authValidation.verifyFieldEmptyAfterReloadPage();

        // TODO: To check session and cookie still exist after error and reload
    });

    test("TC-AUTH-23 - Login → Browser Back Navigation @high", async () => {
        await authUseCase.performStandardLogin();
        await authValidation.verifySuccessfulLogin();

        await page.goBack();
        await authValidation.verifyLogoutSuccess();

        await page.goForward();
        await authValidation.verifySuccessfulLogin();

        // TODO: Implement Login → Browser Back Navigation test cases
    });
});
