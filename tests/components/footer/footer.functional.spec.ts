import test, { Page } from "@playwright/test";
import { FooterComponent } from "../../../src/infrastructure/pages/components/footer/footer.component";
import { FooterValidation } from "../../../src/infrastructure/pages/components/footer/footer.validation";
import { config } from "../../../src/infrastructure/config/env.config";
import { AuthUseCase } from "../../../src/application/use-cases/auth.usecase";
import { AuthPage } from "../../../src/infrastructure/pages/auth/auth.page";

test.describe("Footer - Functional @functional-positive", async () => {
    let page: Page;
    let authPage: AuthPage;
    let footerComponent: FooterComponent;
    let footerValidation: FooterValidation;
    let authUseCase: AuthUseCase;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        authPage = new AuthPage(page);
        authUseCase = new AuthUseCase(authPage);
        footerComponent = new FooterComponent(page);
        footerValidation = new FooterValidation(page);

        await page.goto(config.baseURL);
        await authUseCase.performStandardLogin();
    });

    test("TC-FTR-02 - Social Media Links Functionality @medium", async ({}) => {
        await footerValidation.validateSocialMediaLinks();
    });
});
