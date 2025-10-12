import { config } from "../../../config/env.config";

export const FooterContent = {
    socialMediaLinks: {
        twitter: "https://x.com/saucelabs",
        facebook: "https://www.facebook.com/saucelabs",
        linkedin: "https://www.linkedin.com/company/sauce-labs/",
    },
    copyright: `© ${new Date().getFullYear()} ${config.companyName}. All Rights Reserved. Terms of Service | Privacy Policy`,
};
