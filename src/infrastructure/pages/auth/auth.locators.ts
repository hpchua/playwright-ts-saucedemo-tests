export const AuthLocators = {
    inputs: {
        username: '[data-test="username"]',
        password: '[data-test="password"]',
    },
    buttons: {
        login: '[data-test="login-button"]',
    },
    error: {
        container: '[data-test="error"]',
        dismissButton: '[data-test="error-button"]',
        fieldErrorIcon: (field: "username" | "password") =>
            `input[data-test="${field}"] + svg.error_icon`,
    },
} as const;
