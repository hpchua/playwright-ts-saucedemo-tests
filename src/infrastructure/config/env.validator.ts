/**
 * Validate required environment variables
 * @throws Error if any variable is missing
 */
export const validateEnv = () => {
    const requiredEnvVars = [
        "BASE_URL",
        "LOGIN_USERNAME",
        "LOGIN_PASSWORD",
        "COMPANY_NAME",
    ] as const;

    requiredEnvVars.forEach((key) => {
        const value = process.env[key];
        if (!value) {
            const errorMessage = `
            🚨 Missing Environment Variable: ${key}

            1. Create .env file from template:
               "cp .env.example .env"
            2. Update with valid credentials
            `;

            throw new Error(errorMessage);
        }
    });
};
