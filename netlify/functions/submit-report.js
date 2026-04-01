const crypto = require('crypto');
const { getConfig } = require('./_lib/config');
const { getSupabaseAdmin } = require('./_lib/supabase');
const { json, parseJsonBody } = require('./_lib/http');
const { uploadScreenshot } = require('./_lib/cafes');

function clampWifi(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return null;
    if (parsed < 1 || parsed > 2000) return null;
    return Math.round(parsed);
}

exports.handler = async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return json(405, { error: 'Method not allowed' });
    }

    try {
        const payload = parseJsonBody(event);
        const wifiMbps = clampWifi(payload.wifiMbps);
        const cafeId = String(payload.cafeId || '').trim();
        const plugs = String(payload.plugs || '').trim();
        const noise = String(payload.noise || '').trim();
        const notes = String(payload.notes || '').trim().slice(0, 500);
        const reporterName = String(payload.reporterName || 'Anon').trim().slice(0, 80) || 'Anon';

        if (!cafeId) {
            return json(400, { error: 'Spot wajib dipilih' });
        }
        if (!wifiMbps) {
            return json(400, { error: 'Speedtest wajib diisi dengan angka Mbps yang valid' });
        }
        if (!plugs) {
            return json(400, { error: 'Status colokan wajib dipilih' });
        }
        if (!noise) {
            return json(400, { error: 'Tingkat noise wajib dipilih' });
        }

        const supabase = getSupabaseAdmin();
        const reportId = crypto.randomUUID();
        let screenshotMeta = null;

        if (payload.screenshotDataUrl) {
            screenshotMeta = await uploadScreenshot(
                supabase,
                getConfig().screenshotBucket,
                reportId,
                payload.screenshotDataUrl
            );
        }

        const { data, error } = await supabase
            .from('cafe_reports')
            .insert({
                id: reportId,
                cafe_id: cafeId,
                reporter_name: reporterName,
                wifi_mbps: wifiMbps,
                plugs,
                noise,
                notes,
                screenshot_path: screenshotMeta?.path || null,
                screenshot_content_type: screenshotMeta?.contentType || null,
                status: 'pending'
            })
            .select('id, status, submitted_at')
            .single();

        if (error) {
            throw error;
        }

        const { error: eventError } = await supabase
            .from('cafe_review_events')
            .insert({
                report_id: data.id,
                cafe_id: cafeId,
                action: 'submitted',
                actor: reporterName,
                notes
            });

        if (eventError) {
            throw eventError;
        }

        return json(200, {
            report: data,
            message: 'Laporan masuk antrean review. Begitu lolos, skor spot akan ikut update.'
        });
    } catch (error) {
        return json(500, {
            error: 'Gagal mengirim laporan',
            details: error.message
        });
    }
};
