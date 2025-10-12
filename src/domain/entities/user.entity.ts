import { config } from "../../infrastructure/config/env.config";

export class User {
    private static readonly DEFAULT_USERNAME = "standard_user";
    private static readonly DEFAULT_PASSWORD = config.password;

    constructor(
        public readonly username: string,
        public readonly password: string = User.DEFAULT_PASSWORD
    ) {}

    static custom = (username: string, password: string) =>
        new User(username, password);
    static standard = () => new User(this.DEFAULT_USERNAME);
    static lockedOut = () => new User("locked_out_user");
    static problem = () => new User("problem_user");
    static performanceGlitch = () => new User("performance_glitch_user");
    static error = () => new User("error_user");
    static visual = () => new User("visual_user");
    static invalid = () => new User(this.DEFAULT_USERNAME, "wrong_password");

    static getDefaultUsername = () => this.DEFAULT_USERNAME;
    static getDefaultPassword = () => this.DEFAULT_PASSWORD;
}
