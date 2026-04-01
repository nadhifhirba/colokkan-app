const { getSupabaseAdmin } = require('./_lib/supabase');
const { json } = require('./_lib/http');
const { syncSeedCafes, toClientCafe } = require('./_lib/cafes');

exports.handler = async function handler() {
    try {
        const supabase = getSupabaseAdmin();
        await syncSeedCafes(supabase);

        const { data, error } = await supabase
            .from('cafes')
            .select(`
                id,
                external_seed_id,
                name,
                address,
                neighborhood,
                latitude,
                longitude,
                rating,
                current_wifi_mbps,
                current_plugs,
                current_noise,
                confidence_score,
                report_count,
                last_verified_at,
                source
            `)
            .order('confidence_score', { ascending: false })
            .order('report_count', { ascending: false })
            .order('name', { ascending: true });

        if (error) {
            throw error;
        }

        return json(200, {
            cafes: (data || []).map(toClientCafe),
            source: 'supabase'
        });
    } catch (error) {
        return json(500, {
            error: 'Gagal memuat data spot',
            details: error.message
        });
    }
};
