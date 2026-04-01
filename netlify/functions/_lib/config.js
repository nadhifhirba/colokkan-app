const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

function getConfig() {
    const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        adminReviewToken: process.env.ADMIN_REVIEW_TOKEN || '',
        screenshotBucket: process.env.SUPABASE_SCREENSHOT_BUCKET || 'report-screenshots'
    };
}

module.exports = {
    getConfig
};
