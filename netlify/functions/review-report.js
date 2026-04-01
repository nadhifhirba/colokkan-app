const { getConfig } = require('./_lib/config');
const { getSupabaseAdmin } = require('./_lib/supabase');
const { json, parseJsonBody, getAdminToken } = require('./_lib/http');
const { recomputeCafeMetrics } = require('./_lib/cafes');

exports.handler = async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return json(405, { error: 'Method not allowed' });
    }

    try {
        const config = getConfig();
        const providedToken = getAdminToken(event);
        if (!config.adminReviewToken || providedToken !== config.adminReviewToken) {
            return json(401, { error: 'Admin token invalid' });
        }

        const payload = parseJsonBody(event);
        const reportId = String(payload.reportId || '').trim();
        const action = String(payload.action || '').trim();
        const rejectionReason = String(payload.rejectionReason || '').trim().slice(0, 300);

        if (!reportId) {
            return json(400, { error: 'reportId wajib diisi' });
        }
        if (!['approve', 'reject'].includes(action)) {
            return json(400, { error: 'action harus approve atau reject' });
        }

        const supabase = getSupabaseAdmin();
        const nextStatus = action === 'approve' ? 'approved' : 'rejected';

        const { data: updated, error: updateError } = await supabase
            .from('cafe_reports')
            .update({
                status: nextStatus,
                reviewed_at: new Date().toISOString(),
                reviewed_by: 'admin-token',
                rejection_reason: action === 'reject' ? rejectionReason || 'Ditolak reviewer' : null
            })
            .eq('id', reportId)
            .select('id, cafe_id, status')
            .single();

        if (updateError) {
            throw updateError;
        }

        const cafeMetrics = await recomputeCafeMetrics(supabase, updated.cafe_id);

        const { error: eventError } = await supabase
            .from('cafe_review_events')
            .insert({
                report_id: updated.id,
                cafe_id: updated.cafe_id,
                action: nextStatus,
                actor: 'admin-token',
                notes: action === 'reject' ? rejectionReason || 'Ditolak reviewer' : 'Approved reviewer'
            });

        if (eventError) {
            throw eventError;
        }

        return json(200, {
            report: updated,
            cafeMetrics
        });
    } catch (error) {
        return json(500, {
            error: 'Gagal mereview laporan',
            details: error.message
        });
    }
};
