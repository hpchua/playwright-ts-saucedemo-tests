import { AuthErrorCode } from "../../infrastructure/pages/auth/auth.content";
import { User } from "../entities/user.entity";

export interface IAuthService {
    login(user: User): Promise<void>;

    getErrorMessage(): Promise<string>;

    isErrorMessageVisible(): Promise<boolean>;

    clearUsername(): Promise<void>;

    clearPassword(): Promise<void>;
}

export interface IAuthValidation {
    verifySuccessfulLogin(): Promise<void>;

    verifyFailedLogin(user: User, expectedError: AuthErrorCode): Promise<void>;

    verifyLogoutSuccess(): Promise<void>;
}
