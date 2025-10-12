import { expect, Page, test } from "@playwright/test";
import { User } from "../../src/domain/entities/user.entity";
import { AuthUseCase } from "../../src/application/use-cases/auth.usecase";
import { AuthPage } from "../../src/infrastructure/pages/auth/auth.page";
import {
    AuthContent,
    AuthErrorCode,
    AuthInput,
} from "../../src/infrastructure/pages/auth/auth.content";
import { config } from "../../src/infrastructure/config/env.config";
import { AuthValidation } from "../../src/infrastructure/pages/auth/auth.validation";

test.describe("Authentication - Functional", () => {
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

    test.describe("Positive @functional-positive", () => {
        test("TC-AUTH-01 - Valid Credentials Login @critical", async () => {
            const user = User.standard();
            await authUseCase.executeLogin(user);

            await authValidation.verifySuccessfulLogin();
        });

        test("TC-AUTH-08 - Problem User Login @critical", async () => {
            const user = User.problem();
            await authUseCase.executeLogin(user);

            await authValidation.verifySuccessfulLogin();
            // TODO: Implement validation for problem user login test
        });
    });

    test.describe("Negative @functional-negative", () => {
        test("TC-AUTH-02 - Invalid Username @high", async () => {
            const user = User.custom("invalid_user", User.getDefaultPassword());

            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.InvalidCredentials,
                authPage
            );
        });

        test("TC-AUTH-03 - Invalid Password @high", async () => {
            const user = User.custom(
                User.getDefaultUsername(),
                "wrong_password"
            );

            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.InvalidCredentials,
                authPage
            );
        });

        test("TC-AUTH-04 - Empty Credentials @high", async () => {
            const user = User.custom("", "");
            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.EmptyFields,
                authPage
            );
        });

        test("TC-AUTH-05 - Empty Username @high", async () => {
            const user = User.custom("", User.getDefaultPassword());
            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.EmptyUsername,
                authPage
            );
        });

        test("TC-AUTH-06 - Empty Password @high", async () => {
            const user = User.custom(User.getDefaultUsername(), "");
            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.EmptyPassword,
                authPage
            );
        });

        test("TC-AUTH-07 - Locked User Login @critical", async () => {
            const user = User.lockedOut();
            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.LockedAccount,
                authPage
            );
        });

        test("TC-AUTH-10 - Error User Login @medium", async () => {
            const user = User.error();
            await authUseCase.executeLogin(user);

            //TODO: Implement validation for error user login test
        });

        test("TC-AUTH-17 - Case-Sensitivity @low", async () => {
            let user = User.custom(
                User.getDefaultUsername().toUpperCase(),
                User.getDefaultPassword()
            );
            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.InvalidCredentials,
                authPage
            );

            await authPage.clearUsername();
            await authPage.clearPassword();

            user = User.custom(
                User.getDefaultUsername(),
                User.getDefaultPassword().toUpperCase()
            );
            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.InvalidCredentials,
                authPage
            );
        });
    });

    test.describe("Input/Data Validation @functional-validation", () => {
        test("TC-AUTH-12 - SQL Injection Attempt @critical", async () => {
            const user = User.custom("' OR 1=1--", User.getDefaultPassword());
            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.InvalidCredentials,
                authPage
            );

            //TODO: To add on network traffic validation for SQL injection
        });

        test("TC-AUTH-13 - XSS Script Input @critical", async () => {
            const user = User.custom(
                "<script>alert('xss')</script>",
                User.getDefaultPassword()
            );
            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.InvalidCredentials,
                authPage
            );

            //TODO: To add on validation for XSS script input
        });
    });

    test.describe("Edge Case @functional-edge", () => {
        test("TC-AUTH-15 - Extreme Long Input @medium", async () => {
            const longInput = "a".repeat(1000); // 1000 characters
            const user = User.custom(longInput, longInput);
            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.InvalidCredentials,
                authPage
            );

            // TODO: To add on UI validation
        });

        test("TC-AUTH-16 - Special Characters Input @medium", async () => {
            const user = User.custom("!@#$%^&*()_+", `{}[]|;:'"<>?,./`);
            await authUseCase.executeLogin(user);

            await authValidation.verifyFailedLogin(
                user,
                AuthErrorCode.InvalidCredentials,
                authPage
            );
        });
    });
});
