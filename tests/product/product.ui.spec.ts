import test, { expect, Page } from "@playwright/test";
import { AuthUseCase } from "../../src/application/use-cases/auth.usecase";
import { AuthPage } from "../../src/infrastructure/pages/auth/auth.page";
import { config } from "../../src/infrastructure/config/env.config";
import { ProductPage } from "../../src/infrastructure/pages/product/product.page";
import { ProductContent } from "../../src/infrastructure/pages/product/product.content";
import { ProductValidation } from "../../src/infrastructure/pages/product/product.validation";
import { ProductData } from "../../src/data/product.data";

test.describe("Products - UI @ui", async () => {
    let page: Page;
    let authPage: AuthPage;
    let authUseCase: AuthUseCase;
    let productPage: ProductPage;
    let productValidation: ProductValidation;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        authPage = new AuthPage(page);
        authUseCase = new AuthUseCase(authPage);
        productPage = new ProductPage(page);
        productValidation = new ProductValidation(productPage);

        await page.goto(config.baseURL);
        await authUseCase.performStandardLogin();
    });

    test("TC-PRODS-01 - Verify page layout and static elements @high", async () => {
        // TODO: to add component validation - header and footer

        expect(await productPage.isPageTitleVisible()).toBe(true);
        expect(await productPage.isSortingDropdownVisible()).toBe(true);

        const actualProductCount = await productPage.getProductCount();
        const expectedProductCount = Object.keys(ProductData).length;
        expect(actualProductCount).toBe(expectedProductCount);
    });

    test("TC-PRODS-02 - Verify page title content is correct @low", async () => {
        const titleText = await productPage.getPageTitleText();
        expect(titleText).toBe(ProductContent.text.pageTitle);
    });

    test("TC-PRODS-03 - Validate product card components @medium", async () => {
        const validationResults =
            await productValidation.verifyAllProductsAttributes();

        const allProductsAreValid = validationResults.every(
            (result) => result.isValid
        );
        const failedProducts = validationResults.filter(
            (result) => !result.isValid
        );
        const errorMessage = failedProducts
            .map(
                (result) =>
                    `Product '${result.productName}' failed with errors:\n- ${result.errors.join("\n- ")}`
            )
            .join("\n\n");

        expect(
            allProductsAreValid,
            `The following products have validation errors:\n${errorMessage}`
        ).toBe(true);
    });
});
