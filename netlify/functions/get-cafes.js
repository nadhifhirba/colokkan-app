const { getSupabaseAdmin } = require('./_lib/supabase');
const { json } = require('./_lib/http');
const { syncSeedCafes, toClientCafe } = require('./_lib/cafes');
const seedCafes = require('../../shared/seed-cafes');

function seedFallback() {
    return seedCafes.map((cafe) => ({
        id: cafe.id,
        externalSeedId: cafe.id,
        name: cafe.name,
        address: cafe.address,
        neighborhood: cafe.neighborhood,
        lat: cafe.lat,
        lng: cafe.lng,
        rating: cafe.rating,
        wifi: cafe.wifi,
        plugs: cafe.plugs,
        noise: cafe.noise,
        confidenceScore: 18,
        reportCount: 0,
        lastVerifiedAt: null,
        source: 'seed'
    }));
}

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
        return json(200, {
            cafes: seedFallback(),
            source: 'seed-fallback',
            warning: error.message
        });
    }
};
