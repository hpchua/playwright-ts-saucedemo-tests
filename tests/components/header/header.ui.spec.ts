import test, { Page } from "@playwright/test";
import { HeaderValidation } from "../../../src/infrastructure/pages/components/header/header.validation";
import { HeaderComponent } from "../../../src/infrastructure/pages/components/header/header.component";
import { config } from "../../../src/infrastructure/config/env.config";
import { AuthPage } from "../../../src/infrastructure/pages/auth/auth.page";
import { AuthUseCase } from "../../../src/application/use-cases/auth.usecase";

test.describe("Header - UI", async () => {
    let page: Page;
    let headerComponent: HeaderComponent;
    let headerValidation: HeaderValidation;
    let authPage: AuthPage;
    let authUseCase: AuthUseCase;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage; // Store Playwright page instance
        headerComponent = new HeaderComponent(page);
        headerValidation = new HeaderValidation(page);
        authPage = new AuthPage(page);
        authUseCase = new AuthUseCase(authPage);

        await page.goto(config.baseURL);
        await authUseCase.performStandardLogin();
    });

    test("TC-HDR-01 - Header Elements Presence @high", async () => {
        await headerValidation.verifyHeaderElements();
    });

    test("TC-HDR-03 - Responsive Header Behavior @medium", async () => {
        //TODO: Implement responsive header behavior test cases
    });
});
