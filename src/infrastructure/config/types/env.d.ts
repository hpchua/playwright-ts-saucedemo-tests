declare namespace NodeJS {
    interface ProcessEnv {
        readonly BASE_URL: string;
        readonly LOGIN_USERNAME: string;
        readonly LOGIN_PASSWORD: string;
        readonly COMPANY_NAME: string;
    }
}
