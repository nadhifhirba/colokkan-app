const crypto = require('crypto');
const seedCafes = require('../../../shared/seed-cafes');

function slugify(value) {
    return String(value || '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

function seedCafeRow(cafe) {
    return {
        external_seed_id: cafe.id,
        slug: slugify(cafe.name),
        name: cafe.name,
        address: cafe.address,
        neighborhood: cafe.neighborhood,
        latitude: cafe.lat,
        longitude: cafe.lng,
        rating: cafe.rating || 0,
        current_wifi_mbps: cafe.wifi,
        current_plugs: cafe.plugs,
        current_noise: cafe.noise,
        confidence_score: 18,
        report_count: 0,
        source: 'seed'
    };
}

async function syncSeedCafes(supabase) {
    const rows = seedCafes.map(seedCafeRow);
    const { error } = await supabase
        .from('cafes')
        .upsert(rows, { onConflict: 'external_seed_id' });

    if (error) {
        throw error;
    }
}

function toClientCafe(row) {
    return {
        id: row.id,
        externalSeedId: row.external_seed_id,
        name: row.name,
        address: row.address,
        neighborhood: row.neighborhood,
        lat: row.latitude,
        lng: row.longitude,
        rating: row.rating,
        wifi: row.current_wifi_mbps,
        plugs: row.current_plugs,
        noise: row.current_noise,
        confidenceScore: row.confidence_score || 0,
        reportCount: row.report_count || 0,
        forecastSummary: row.forecast_summary || {},
        lastVerifiedAt: row.last_verified_at,
        source: row.source || 'seed'
    };
}

function average(values) {
    if (!values.length) return null;
    const total = values.reduce((sum, value) => sum + value, 0);
    return Math.round(total / values.length);
}

function standardDeviation(values) {
    if (values.length <= 1) return 0;
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / values.length;
    return Math.sqrt(variance);
}

function mostCommon(values) {
    const counts = new Map();
    values.filter(Boolean).forEach((value) => {
        counts.set(value, (counts.get(value) || 0) + 1);
    });

    let winner = null;
    let winnerCount = -1;
    counts.forEach((count, value) => {
        if (count > winnerCount) {
            winner = value;
            winnerCount = count;
        }
    });
    return winner;
}

function buildConfidenceScore(reports) {
    if (!reports.length) return 0;
    const wifiValues = reports.map((report) => report.wifi_mbps).filter((value) => Number.isFinite(value));
    const spread = wifiValues.length > 1 ? standardDeviation(wifiValues) : 0;
    const latestAt = new Date(reports[0].observed_at || reports[0].submitted_at).getTime();
    const daysSinceLatest = Math.max(0, (Date.now() - latestAt) / 86400000);

    const countScore = Math.min(54, reports.length * 12);
    const consistencyScore = spread <= 8 ? 22 : spread <= 15 ? 14 : spread <= 25 ? 8 : 2;
    const freshnessScore = daysSinceLatest <= 7 ? 24 : daysSinceLatest <= 30 ? 16 : daysSinceLatest <= 60 ? 10 : 4;

    return Math.min(100, Math.round(countScore + consistencyScore + freshnessScore));
}

function scorePlugsForecast(value) {
    const plugsText = String(value || '').toLowerCase();
    if (plugsText.includes('excellent') || plugsText.includes('plentiful') || plugsText.includes('reliable') || plugsText.includes('co-working')) return 100;
    if (plugsText.includes('good') || plugsText.includes('available')) return 78;
    if (plugsText.includes('limited') || plugsText.includes('terbatas') || plugsText.includes('spaced')) return 46;
    if (plugsText.includes('no visible') || plugsText.includes('nyaris')) return 18;
    return 60;
}

function scoreNoiseForecast(value) {
    const noiseText = String(value || '').toLowerCase();
    if (noiseText.includes('quiet') || noiseText.includes('tenang') || noiseText.includes('peaceful')) return 100;
    if (noiseText.includes('chill') || noiseText.includes('moderate')) return 78;
    if (noiseText.includes('buzz') || noiseText.includes('ramai')) return 52;
    if (noiseText.includes('bustling') || noiseText.includes('hectic') || noiseText.includes('vibrant')) return 28;
    return 60;
}

function getForecastSlot(dateValue) {
    const date = new Date(dateValue);
    const hour = date.getHours();
    const weekdayType = date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : 'weekday';

    if (hour < 10) return `${weekdayType}_morning`;
    if (hour < 14) return `${weekdayType}_lunch`;
    if (hour < 17) return `${weekdayType}_afternoon`;
    return `${weekdayType}_evening`;
}

function buildForecastSummary(reports) {
    if (!reports.length) {
        return {
            slots: [],
            totalReports: 0,
            bestSlotKey: null,
            avoidSlotKey: null
        };
    }

    const slotMap = new Map();
    reports.forEach((report) => {
        const slotKey = getForecastSlot(report.observed_at || report.submitted_at);
        const quality = Math.round(
            ((Math.max(0, Math.min(100, Number(report.wifi_mbps) || 0))) * 0.45) +
            (scorePlugsForecast(report.plugs) * 0.25) +
            (scoreNoiseForecast(report.noise) * 0.30)
        );

        const slot = slotMap.get(slotKey) || { key: slotKey, sampleSize: 0, qualityTotal: 0 };
        slot.sampleSize += 1;
        slot.qualityTotal += quality;
        slotMap.set(slotKey, slot);
    });

    const slots = Array.from(slotMap.values())
        .map((slot) => ({
            key: slot.key,
            sampleSize: slot.sampleSize,
            score: Math.round(slot.qualityTotal / slot.sampleSize)
        }))
        .sort((a, b) => b.score - a.score);

    const bestSlot = slots[0] || null;
    const avoidSlot = slots.slice().sort((a, b) => a.score - b.score)[0] || null;

    return {
        slots,
        totalReports: reports.length,
        bestSlotKey: bestSlot ? bestSlot.key : null,
        avoidSlotKey: avoidSlot ? avoidSlot.key : null
    };
}

async function recomputeCafeMetrics(supabase, cafeId) {
    const { data: reports, error: reportsError } = await supabase
        .from('cafe_reports')
        .select('wifi_mbps, plugs, noise, observed_at, submitted_at')
        .eq('cafe_id', cafeId)
        .eq('status', 'approved')
        .order('observed_at', { ascending: false });

    if (reportsError) {
        throw reportsError;
    }

    const { data: cafe, error: cafeError } = await supabase
        .from('cafes')
        .select('external_seed_id')
        .eq('id', cafeId)
        .single();

    if (cafeError) {
        throw cafeError;
    }

    const fallbackSeed = seedCafes.find((seed) => seed.id === cafe.external_seed_id);
    const approvedReports = reports || [];
    const forecastSummary = buildForecastSummary(approvedReports);

    const wifi = average(approvedReports.map((report) => report.wifi_mbps).filter((value) => Number.isFinite(value)));
    const latestApproved = approvedReports[0];
    const plugs = mostCommon(approvedReports.map((report) => report.plugs)) || fallbackSeed?.plugs || null;
    const noise = mostCommon(approvedReports.map((report) => report.noise)) || fallbackSeed?.noise || null;
    const confidenceScore = buildConfidenceScore(approvedReports);

    const payload = {
        current_wifi_mbps: wifi || fallbackSeed?.wifi || null,
        current_plugs: plugs,
        current_noise: noise,
        report_count: approvedReports.length,
        confidence_score: approvedReports.length ? confidenceScore : 18,
        forecast_summary: forecastSummary,
        last_verified_at: latestApproved ? (latestApproved.observed_at || latestApproved.submitted_at) : null
    };

    const { error: updateError } = await supabase
        .from('cafes')
        .update(payload)
        .eq('id', cafeId);

    if (updateError) {
        throw updateError;
    }

    return payload;
}

async function ensureScreenshotBucket(supabase, bucketName) {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;

    const exists = buckets.some((bucket) => bucket.name === bucketName);
    if (!exists) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: false,
            fileSizeLimit: '5MB'
        });
        if (createError && !String(createError.message || '').includes('already exists')) {
            throw createError;
        }
    }
}

function decodeDataUrl(dataUrl) {
    const match = /^data:(.+);base64,(.+)$/.exec(String(dataUrl || ''));
    if (!match) {
        throw new Error('Screenshot harus berupa data URL base64 yang valid');
    }

    return {
        contentType: match[1],
        buffer: Buffer.from(match[2], 'base64')
    };
}

async function uploadScreenshot(supabase, bucketName, reportId, screenshotDataUrl) {
    if (!screenshotDataUrl) return null;

    await ensureScreenshotBucket(supabase, bucketName);
    const decoded = decodeDataUrl(screenshotDataUrl);
    const extension = decoded.contentType.split('/')[1] || 'png';
    const path = `reports/${reportId}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
        .from(bucketName)
        .upload(path, decoded.buffer, {
            contentType: decoded.contentType,
            upsert: false
        });

    if (error) {
        throw error;
    }

    return {
        path,
        contentType: decoded.contentType
    };
}

async function buildSignedScreenshotMap(supabase, bucketName, reports) {
    const signedMap = {};
    const paths = reports.map((report) => report.screenshot_path).filter(Boolean);
    if (!paths.length) return signedMap;

    const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrls(paths, 3600);

    if (error) {
        throw error;
    }

    data.forEach((entry, index) => {
        signedMap[paths[index]] = entry.signedUrl;
    });

    return signedMap;
}

module.exports = {
    syncSeedCafes,
    toClientCafe,
    recomputeCafeMetrics,
    uploadScreenshot,
    buildSignedScreenshotMap
};
