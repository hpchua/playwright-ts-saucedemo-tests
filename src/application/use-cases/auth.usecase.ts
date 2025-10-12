import { User } from "../../domain/entities/user.entity";
import { AuthPage } from "../../infrastructure/pages/auth/auth.page";

export class AuthUseCase {
    constructor(private authPage: AuthPage) {}

    async executeLogin(user: User): Promise<void> {
        await this.authPage.login(user);
    }

    async performStandardLogin(): Promise<void> {
        const user = User.standard();
        await this.executeLogin(user);
    }

    async performInvalidLogin(): Promise<void> {
        const user = User.custom("invalid_user", User.getDefaultPassword());
        await this.executeLogin(user);
    }
}
