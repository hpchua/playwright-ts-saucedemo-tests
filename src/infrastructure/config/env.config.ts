import dotenv from "dotenv";
import { validateEnv } from "./env.validator";

// Load .env first
dotenv.config();

// Validate BEFORE exporting config
validateEnv();

// Safely export config (types from env.d.ts)
export const config = {
    baseURL: process.env.BASE_URL!,
    username: process.env.LOGIN_USERNAME!,
    password: process.env.LOGIN_PASSWORD!,
    companyName: process.env.COMPANY_NAME!,
};
