const { createClient } = require('@supabase/supabase-js');
const { getConfig } = require('./config');

let client;

function getSupabaseAdmin() {
    if (!client) {
        const config = getConfig();
        client = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        });
    }

    return client;
}

module.exports = {
    getSupabaseAdmin
};
