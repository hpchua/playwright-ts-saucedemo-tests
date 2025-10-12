import test, { expect, Page } from "@playwright/test";
import { AuthUseCase } from "../../src/application/use-cases/auth.usecase";
import { AuthPage } from "../../src/infrastructure/pages/auth/auth.page";
import { config } from "../../src/infrastructure/config/env.config";
import { ProductPage } from "../../src/infrastructure/pages/product/product.page";
import {
    ProductContent,
    SortOption,
} from "../../src/infrastructure/pages/product/product.content";
import { ProductValidation } from "../../src/infrastructure/pages/product/product.validation";
import { ProductUseCase } from "../../src/application/use-cases/product.usecase";
import { HeaderValidation } from "../../src/infrastructure/pages/components/header/header.validation";
import { HeaderComponent } from "../../src/infrastructure/pages/components/header/header.component";
import { SidebarComponent } from "../../src/infrastructure/pages/components/sidebar/sidebar.component";

test.describe("Products - Functional", async () => {
    let page: Page;
    let authPage: AuthPage;
    let authUseCase: AuthUseCase;
    let productPage: ProductPage;
    let productValidation: ProductValidation;
    let productUseCase: ProductUseCase;
    let headerValidation: HeaderValidation;
    let headerComponent: HeaderComponent;
    let sidebarComponent: SidebarComponent;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        authPage = new AuthPage(page);
        authUseCase = new AuthUseCase(authPage);
        productPage = new ProductPage(page);
        headerComponent = new HeaderComponent(page);
        sidebarComponent = new SidebarComponent(page);
        headerValidation = new HeaderValidation(page);
        productValidation = new ProductValidation(productPage);
        productUseCase = new ProductUseCase(
            productPage,
            productValidation,
            headerComponent,
            headerValidation
        );

        await page.goto(config.baseURL);
        await authUseCase.performStandardLogin();
    });

    test.describe("Positive @functional-positive", async () => {
        test("TC-PRODS-04 - Validate default sorting (A→Z) @critical", async () => {
            const defaultSortOption = SortOption.NAME_A_TO_Z;

            const products = await productPage.getAllProducts();
            const isDefaultSortingCorrect =
                await productValidation.isProductListSorted(
                    products,
                    defaultSortOption
                );

            expect(isDefaultSortingCorrect).toBe(true);
        });

        test("TC-PRODS-05 - Sort products by price @high", async () => {
            const productsHighToLow =
                await productUseCase.sortProductsAndGetList(
                    SortOption.PRICE_HIGH_TO_LOW
                );
            expect(
                await productValidation.isProductListSorted(
                    productsHighToLow,
                    SortOption.PRICE_HIGH_TO_LOW
                )
            ).toBe(true);

            const productsLowToHigh =
                await productUseCase.sortProductsAndGetList(
                    SortOption.PRICE_LOW_TO_HIGH
                );
            expect(
                await productValidation.isProductListSorted(
                    productsLowToHigh,
                    SortOption.PRICE_LOW_TO_HIGH
                )
            ).toBe(true);
        });

        test("TC-PRODS-06 - Sort products by name @high", async () => {
            const productsZToA = await productUseCase.sortProductsAndGetList(
                SortOption.NAME_Z_TO_A
            );
            expect(
                await productValidation.isProductListSorted(
                    productsZToA,
                    SortOption.NAME_Z_TO_A
                )
            ).toBe(true);

            const productsAToZ = await productUseCase.sortProductsAndGetList(
                SortOption.NAME_A_TO_Z
            );
            expect(
                await productValidation.isProductListSorted(
                    productsAToZ,
                    SortOption.NAME_A_TO_Z
                )
            ).toBe(true);
        });

        test("TC-PRODS-07 - Add item to cart @critical", async () => {
            //Precondition:
            await productUseCase.removeExistingItemsFromCart();

            const allProducts = await productPage.getAllProducts();
            const productToAdd = await allProducts.find(
                (p) => p.actionButtonText === ProductContent.button.addToCart
            );

            if (productToAdd) {
                const isValid =
                    await productUseCase.addProductToCartAndValidate(
                        productToAdd.name
                    );
                expect(isValid).toBe(true);
            } else {
                expect(productToAdd).not.toBeUndefined();
            }
        });

        test("TC-PRODS-08 - Remove any item from cart @high", async () => {
            await productUseCase.addAnyProductToCart();

            const isRemovalSuccessful =
                await productUseCase.removeProductFromCartAndValidate();

            expect(isRemovalSuccessful).toBe(true);
        });
    });

    test.describe("Negative @functional-negative", async () => {
        test("TC-PRODS-12 - Inject invalid sort option @medium", async () => {
            const INVALID_QUERY = "?sort=invalid";

            const defaultSortOption =
                ProductContent.dropdown.sortOptions[0].text.toString();

            const isResetSuccessful =
                await productUseCase.validateInvalidSortErrorHandling(
                    INVALID_QUERY,
                    defaultSortOption
                );

            console.log("isResetSuccessful: " + isResetSuccessful);

            console.log("defaultSortOption: " + defaultSortOption);

            expect(isResetSuccessful).toBe(true);
        });
    });

    test.describe("Edge Cases @functional-edge-case", async () => {
        test("TC-PRODS-09 - Add all products to cart @high", async () => {
            // Precondition
            await productUseCase.removeAllProductsFromCartAndValidate();

            const success =
                await productUseCase.addAllProductsToCartAndValidate();
            expect(success).toBe(true);
        });

        test("TC-PRODS-10 - Remove all products from cart @high", async () => {
            // Precondition
            await productUseCase.addAllProductsToCartAndValidate();

            const success =
                await productUseCase.removeAllProductsFromCartAndValidate();
            expect(success).toBe(true);
        });

        test("TC-PRODS-11 - Verify cart persistence on refresh @medium", async () => {
            // Precondition
            await productUseCase.removeAllProductsFromCartAndValidate();

            await productUseCase.addAnyProductToCart();

            const initialCartCountString = await headerComponent.getCartCount();
            const initialCartCount = parseInt(initialCartCountString || "0");

            const isStateRetained =
                await productUseCase.validateCartStateAfterReload(
                    initialCartCount
                );

            expect(isStateRetained).toBe(true);
        });

        test("TC-PRODS-13 - Reset sorting after logout/login @low", async () => {
            // Precondition
            const productsZToA = await productUseCase.sortProductsAndGetList(
                SortOption.NAME_Z_TO_A
            );
            expect(
                await productValidation.isProductListSorted(
                    productsZToA,
                    SortOption.NAME_Z_TO_A
                )
            ).toBe(true);

            await sidebarComponent.performLogout();
            await authUseCase.performStandardLogin();

            const defaultSortOption = SortOption.NAME_A_TO_Z;

            const products = await productPage.getAllProducts();
            const isDefaultSortingCorrect =
                await productValidation.isProductListSorted(
                    products,
                    defaultSortOption
                );

            expect(isDefaultSortingCorrect).toBe(true);
        });
    });
});
