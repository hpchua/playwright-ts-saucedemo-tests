export enum AuthErrorCode {
    LockedAccount = "LOCKED_ACCOUNT",
    InvalidCredentials = "INVALID_CREDENTIALS",
    AccountNotFound = "ACCOUNT_NOT_FOUND",
    EmptyUsername = "EMPTY_USERNAME",
    EmptyPassword = "EMPTY_PASSWORD",
    EmptyFields = "EMPTY_FIELDS",
}

export type AuthField = AuthInput | AuthButton;

export enum AuthInput {
    Username = "username",
    Password = "password",
}

export enum AuthButton {
    Login = "login",
}

export class AuthContent {
    private static readonly TextAssets = {
        labels: {
            [AuthInput.Username]: "Username",
            [AuthInput.Password]: "Password",
            [AuthButton.Login]: "Login",
        },
        placeholders: {
            [AuthInput.Username]: "Enter your username",
            [AuthInput.Password]: "Enter your password",
        },
        errors: {
            [AuthErrorCode.LockedAccount]:
                "Sorry, this user has been locked out.",
            [AuthErrorCode.InvalidCredentials]:
                "Username and password do not match any user in this service",
            [AuthErrorCode.AccountNotFound]:
                "Epic sadface: Username and password do not match any user in this service",
            [AuthErrorCode.EmptyUsername]: "Username is required",
            [AuthErrorCode.EmptyPassword]: "Password is required",
            [AuthErrorCode.EmptyFields]: "Username and password are required",
        },
    } as const;

    static getErrorMessage(error: AuthErrorCode): string {
        return `Epic sadface: ${this.TextAssets.errors[error]}`;
    }

    static getLabel(field: AuthField): string {
        return this.TextAssets.labels[field];
    }

    static getPlaceholder(field: AuthInput): string {
        return this.TextAssets.placeholders[field];
    }

    static getAllErrors(): Record<AuthErrorCode, string> {
        return Object.keys(this.TextAssets.errors).reduce(
            (acc, key) => {
                const errorCode = key as AuthErrorCode;
                acc[errorCode] = this.getErrorMessage(errorCode);
                return acc;
            },
            {} as Record<AuthErrorCode, string>
        );
    }

    static getAllLabels(): Record<AuthField, string> {
        return { ...this.TextAssets.labels };
    }

    static getAllPlaceholders(): Record<AuthInput, string> {
        return { ...this.TextAssets.placeholders };
    }
}
