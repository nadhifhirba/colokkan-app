const { getConfig } = require('./_lib/config');
const { getSupabaseAdmin } = require('./_lib/supabase');
const { json, getAdminToken } = require('./_lib/http');
const { buildSignedScreenshotMap } = require('./_lib/cafes');

exports.handler = async function handler(event) {
    if (event.httpMethod !== 'GET') {
        return json(405, { error: 'Method not allowed' });
    }

    try {
        const config = getConfig();
        const providedToken = getAdminToken(event);
        if (!config.adminReviewToken || providedToken !== config.adminReviewToken) {
            return json(401, { error: 'Admin token invalid' });
        }

        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('cafe_reports')
            .select(`
                id,
                cafe_id,
                reporter_name,
                wifi_mbps,
                plugs,
                noise,
                notes,
                screenshot_path,
                status,
                submitted_at,
                cafes (
                    id,
                    name,
                    neighborhood
                )
            `)
            .eq('status', 'pending')
            .order('submitted_at', { ascending: true });

        if (error) {
            throw error;
        }

        const signedMap = await buildSignedScreenshotMap(supabase, config.screenshotBucket, data || []);
        const queue = (data || []).map((item) => ({
            id: item.id,
            cafeId: item.cafe_id,
            cafeName: item.cafes?.name || 'Spot tidak dikenal',
            neighborhood: item.cafes?.neighborhood || '',
            reporterName: item.reporter_name,
            wifiMbps: item.wifi_mbps,
            plugs: item.plugs,
            noise: item.noise,
            notes: item.notes,
            submittedAt: item.submitted_at,
            screenshotUrl: item.screenshot_path ? signedMap[item.screenshot_path] || null : null
        }));

        return json(200, { queue });
    } catch (error) {
        return json(500, {
            error: 'Gagal memuat antrean review',
            details: error.message
        });
    }
};
