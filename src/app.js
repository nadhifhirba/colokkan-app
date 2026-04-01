const API_BASE = '/.netlify/functions';
const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-sdk';
const UPLOAD_IDLE_TEXT = 'Opsional, tapi sangat membantu reviewer';
const LANGUAGE_STORAGE_KEY = 'colokkan_language';
const TRANSLATIONS = {
    id: {
        title: 'co.lok.kan | Temukan Workspace Terbaik di Jakarta',
        description: 'co.lok.kan — temukan coworking space, kafe, dan workspace terbaik di Jakarta. Cek WiFi speed, ketersediaan colokan, dan noise level sebelum datang.',
        searchPlaceholder: 'Cari area atau nama kafe...',
        filter: 'Filter',
        mapTab: 'Kawasan',
        listTab: 'Daftar',
        modeLabel: 'Mode kerja',
        modeFocus: 'Fokus',
        modeMeeting: 'Meeting',
        modeVibe: 'Ngopi santai',
        modeAll: 'Semua',
        bestMatchLabel: 'Pilihan terbaik sekarang',
        openRecommendation: 'Buka rekomendasi',
        matchScore: 'Skor kecocokan',
        mapEyebrow: 'Map mode',
        mapTitle: 'Google Maps aktif hanya kalau browser key sudah direstrict',
        mapFallback: 'Kalau key belum dikonfigurasi, app otomatis jatuh balik ke radar lokal tanpa third-party map.',
        mapEnabled: 'Google Maps hidup dengan browser key yang harus direstrict per domain. Semua data spot tetap datang dari app, bukan dari Places API client.',
        mapDisabled: 'Google Maps belum aktif di environment ini, jadi app jatuh balik ke radar lokal tanpa expose key. Set `GOOGLE_MAPS_BROWSER_KEY` di Netlify untuk menyalakannya.',
        bestMatchEmptyTitle: 'Belum ada spot yang cocok',
        bestMatchEmptyMeta: 'Longgarkan filter atau ganti mode kerja.',
        bestMatchEmptyReason: 'Sistem belum nemu kandidat yang layak buat mode ini.',
        bestMatchReason: '{mode}: {bits}.',
        detailBack: '← Kembali ke radar',
        detailVitals: 'Tanda vital WFC',
        detailInfo: 'Info',
        detailHours: 'Cek jam operasional terbaru di Maps',
        detailOpenMaps: 'Buka di Maps',
        detailVibe: 'Vibe interior',
        detailVerification: 'Verifikasi komunitas',
        freshness: 'Freshness',
        confidence: 'Confidence',
        approvedReports: 'Approved reports',
        noApprovedReports: '• Belum ada laporan yang lolos review.',
        contributeTitle: 'Tambah laporan',
        contributeCafe: 'Pilih spot',
        contributeReporter: 'Nama pelapor',
        contributeWifi: 'Hasil speedtest (Mbps)',
        contributeScreenshot: 'Upload screenshot speedtest',
        contributePlugs: 'Ketersediaan colokan',
        contributeNoise: 'Tingkat noise',
        contributeNotes: 'Catatan reviewer',
        contributeSubmit: 'Kirim laporan',
        profileBack: '← Kembali',
        profileTitle: 'Profil kamu',
        profileAchievements: 'Pencapaian',
        profileActivity: 'Aktivitas terbaru',
        adminModeTitle: 'Mode reviewer',
        adminModeCopy: 'Masuk pakai admin token untuk approve atau reject laporan.',
        adminOpen: 'Buka review',
        emptyList: 'Tidak ada spot yang cocok. Coba longgarkan filter atau ganti mode kerja.',
        emptyRadar: 'Belum ada titik yang lolos filter untuk dirender di radar.',
        emptyArea: 'Belum ada kawasan yang lolos filter sekarang.',
        noLiveVerification: 'Belum ada verifikasi live',
        verifiedToday: 'Diverifikasi hari ini',
        verifiedYesterday: 'Diverifikasi kemarin',
        verifiedDaysAgo: 'Diverifikasi {days} hari lalu',
        staleDaysAgo: 'Stale ringan, {days} hari lalu',
        recheckDaysAgo: 'Butuh recheck, {days} hari lalu',
        noFitSpot: 'Belum ada spot yang cocok',
        fitMeta: '{neighborhood} · skor kerja {score}/100 · {reports} laporan approved',
        confidenceBits: 'confidence {score}/100',
        reportsApproved: '{count} laporan approved',
        avgConfidence: 'confidence rata-rata {score}/100',
        topScore: 'Top {score}',
        lookTopSpot: 'Lihat spot terbaik',
        bestMatchLegend: 'best match',
        otherSpotsLegend: 'spot lain',
        markerSizeLegend: 'ukuran titik = confidence',
        west: 'BARAT',
        east: 'TIMUR',
        north: 'UTARA',
        south: 'SELATAN',
        listAria: 'Daftar spot kerja',
        areaAria: 'Ringkasan kawasan',
        chooseCafeFirst: 'Pilih spot dulu. Kalau enggak, reviewer bingung mau nilai yang mana.',
        backendNeededSubmit: 'Submit live butuh `netlify dev` atau deploy Netlify. Preview Python ini pakai seed fallback dulu.',
        submitting: 'Mengirim laporan ke antrean review...',
        submitSuccess: 'Laporan masuk antrean review. Begitu lolos, skor spot akan ikut update.',
        uploadReady: 'Screenshot siap: {name}',
        uploadFailed: 'Upload gagal dibaca. Coba pilih file lain.',
        noBackendActivity: '• Belum ada aktivitas live yang ditarik dari backend.',
        topSpotActivity: '• Spot paling meyakinkan sekarang: {name} ({score}/100).',
        adminNeedLogin: 'Reviewer belum login. Buka review lalu masukkan admin token.',
        adminEmptyQueue: 'Antrean bersih. Belum ada laporan pending sekarang.',
        adminNeedBackend: 'Reviewer mode butuh `netlify dev` atau deploy Netlify aktif.',
        reviewNeedBackend: 'Review hanya jalan kalau backend Netlify Functions aktif.',
        loadingQueue: 'Mengambil antrean review...',
        queueReady: 'Antrean siap. {count} laporan pending.',
        adminPrompt: 'Masukkan admin review token',
        rejectPrompt: 'Alasan reject singkat',
        approving: 'Approve laporan...',
        rejecting: 'Reject laporan...',
        approvedDone: 'Laporan berhasil di-approve.',
        rejectedDone: 'Laporan berhasil di-reject.',
        seedMessage1: '• {count} laporan approved, terakhir {freshness}.',
        seedMessage2: '• Confidence {score}/100. Kalau mulai stale, spot ini otomatis turun ranking.',
        needFirstReport: '• Masih pakai seed awal. Spot ini butuh laporan pertama biar rankingnya makin bisa dipercaya.'
    },
    en: {
        title: 'co.lok.kan | Find The Best Workspace In Jakarta',
        description: 'co.lok.kan helps you find the best coworking spaces and cafes in Jakarta. Check WiFi speed, power outlets, and noise level before you go.',
        searchPlaceholder: 'Search by area or cafe name...',
        filter: 'Filter',
        mapTab: 'Map',
        listTab: 'List',
        modeLabel: 'Work mode',
        modeFocus: 'Focus',
        modeMeeting: 'Meeting',
        modeVibe: 'Coffee vibe',
        modeAll: 'All',
        bestMatchLabel: 'Best match right now',
        openRecommendation: 'Open recommendation',
        matchScore: 'Match score',
        mapEyebrow: 'Map mode',
        mapTitle: 'Google Maps only runs when the browser key is properly restricted',
        mapFallback: 'If the key is missing, the app automatically falls back to the local radar without a third-party map.',
        mapEnabled: 'Google Maps is active with a domain-restricted browser key. Cafe data still comes from the app, not from client-side Places calls.',
        mapDisabled: 'Google Maps is not active in this environment, so the app falls back to the built-in radar without exposing a key. Set `GOOGLE_MAPS_BROWSER_KEY` in Netlify to enable it.',
        bestMatchEmptyTitle: 'No matching spot yet',
        bestMatchEmptyMeta: 'Loosen the filters or switch work mode.',
        bestMatchEmptyReason: 'The system has not found a strong candidate for this mode.',
        bestMatchReason: '{mode}: {bits}.',
        detailBack: '← Back to radar',
        detailVitals: 'WFC vitals',
        detailInfo: 'Info',
        detailHours: 'Check the latest opening hours in Maps',
        detailOpenMaps: 'Open in Maps',
        detailVibe: 'Interior vibe',
        detailVerification: 'Community verification',
        freshness: 'Freshness',
        confidence: 'Confidence',
        approvedReports: 'Approved reports',
        noApprovedReports: '• No approved reports yet.',
        contributeTitle: 'Submit a report',
        contributeCafe: 'Pick a spot',
        contributeReporter: 'Reporter name',
        contributeWifi: 'Speedtest result (Mbps)',
        contributeScreenshot: 'Upload speedtest screenshot',
        contributePlugs: 'Outlet availability',
        contributeNoise: 'Noise level',
        contributeNotes: 'Reviewer notes',
        contributeSubmit: 'Submit report',
        profileBack: '← Back',
        profileTitle: 'Your profile',
        profileAchievements: 'Achievements',
        profileActivity: 'Recent activity',
        adminModeTitle: 'Reviewer mode',
        adminModeCopy: 'Sign in with the admin token to approve or reject reports.',
        adminOpen: 'Open review',
        emptyList: 'No spots match the current filters. Loosen the filters or switch mode.',
        emptyRadar: 'No points match the current filters on the radar.',
        emptyArea: 'No area currently passes the filters.',
        noLiveVerification: 'No live verification yet',
        verifiedToday: 'Verified today',
        verifiedYesterday: 'Verified yesterday',
        verifiedDaysAgo: 'Verified {days} days ago',
        staleDaysAgo: 'Slightly stale, {days} days ago',
        recheckDaysAgo: 'Needs recheck, {days} days ago',
        noFitSpot: 'No matching spot yet',
        fitMeta: '{neighborhood} · work score {score}/100 · {reports} approved reports',
        confidenceBits: 'confidence {score}/100',
        reportsApproved: '{count} approved reports',
        avgConfidence: 'avg confidence {score}/100',
        topScore: 'Top {score}',
        lookTopSpot: 'View top spot',
        bestMatchLegend: 'best match',
        otherSpotsLegend: 'other spots',
        markerSizeLegend: 'dot size = confidence',
        west: 'WEST',
        east: 'EAST',
        north: 'NORTH',
        south: 'SOUTH',
        listAria: 'List of work spots',
        areaAria: 'Area summary',
        chooseCafeFirst: 'Pick a spot first, otherwise the reviewer has no idea what you are reporting.',
        backendNeededSubmit: 'Live submission needs `netlify dev` or a deployed Netlify site. This Python preview stays on the seed fallback.',
        submitting: 'Sending report to the review queue...',
        submitSuccess: 'The report is now in the review queue. Once approved, the cafe score will update.',
        uploadReady: 'Screenshot ready: {name}',
        uploadFailed: 'The upload could not be read. Try another file.',
        noBackendActivity: '• No live backend activity loaded yet.',
        topSpotActivity: '• Most trustworthy spot right now: {name} ({score}/100).',
        adminNeedLogin: 'Reviewer is not signed in yet. Open review and enter the admin token.',
        adminEmptyQueue: 'Queue is clean. No pending reports right now.',
        adminNeedBackend: 'Reviewer mode needs `netlify dev` or a deployed Netlify environment.',
        reviewNeedBackend: 'Review actions only work when Netlify Functions are active.',
        loadingQueue: 'Loading review queue...',
        queueReady: 'Queue ready. {count} pending reports.',
        adminPrompt: 'Enter admin review token',
        rejectPrompt: 'Short reject reason',
        approving: 'Approving report...',
        rejecting: 'Rejecting report...',
        approvedDone: 'Report approved.',
        rejectedDone: 'Report rejected.',
        seedMessage1: '• {count} approved reports, latest {freshness}.',
        seedMessage2: '• Confidence {score}/100. If the data gets stale, this spot automatically drops in rank.',
        needFirstReport: '• Still on the seed baseline. This spot needs its first live report to become trustworthy.'
    }
};
const WORK_MODES = {
    focus: {
        description: 'Cari spot yang paling aman buat deep work.',
        weights: { wifi: 0.45, plugs: 0.35, noise: 0.2 }
    },
    meeting: {
        description: 'Butuh internet stabil dan noise yang masih ketahan.',
        weights: { wifi: 0.4, plugs: 0.25, noise: 0.35 }
    },
    vibe: {
        description: 'Sedikit kompromi demi ambience yang enak.',
        weights: { wifi: 0.25, plugs: 0.15, noise: 0.6 }
    },
    all: {
        description: 'Mix paling seimbang.',
        weights: { wifi: 0.34, plugs: 0.33, noise: 0.33 }
    }
};

const seedCafes = (window.SEED_CAFES || []).map((cafe) => ({
    id: cafe.id,
    externalSeedId: cafe.id,
    name: cafe.name,
    lat: cafe.lat,
    lng: cafe.lng,
    neighborhood: cafe.neighborhood,
    wifi: cafe.wifi,
    plugs: cafe.plugs,
    noise: cafe.noise,
    rating: cafe.rating,
    address: cafe.address,
    confidenceScore: 18,
    reportCount: 0,
    lastVerifiedAt: null,
    source: 'seed'
}));

let Cafes = [...seedCafes];
let currentTab = 'list';
let currentMode = 'focus';
let bestMatchCafe = null;
let searchQuery = '';
let selectedScreenshotDataUrl = '';
let publicConfig = null;
let publicConfigPromise = null;
let googleMap = null;
let googleMarkers = [];
let googleMapsLoadPromise = null;
let googleMapsAuthFailed = false;
let activeFilters = {
    wifi: false,
    plugs: false,
    noise: false
};
let adminToken = localStorage.getItem('colokkan_admin_token') || '';
let adminQueue = [];
let currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'id';

function t(key, vars = {}) {
    const table = TRANSLATIONS[currentLanguage] || TRANSLATIONS.id;
    const template = table[key] || TRANSLATIONS.id[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
}

function setMetaContent(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.setAttribute('content', value);
}

function applyLanguageToShell() {
    document.documentElement.lang = currentLanguage;
    document.title = t('title');
    setMetaContent('meta[name="description"]', t('description'));
    setMetaContent('meta[property="og:title"]', t('title'));
    setMetaContent('meta[property="og:description"]', t('description'));
    setMetaContent('meta[name="twitter:title"]', t('title'));
    setMetaContent('meta[name="twitter:description"]', t('description'));

    const searchInputNode = document.getElementById('search-input');
    if (searchInputNode) {
        searchInputNode.placeholder = t('searchPlaceholder');
        searchInputNode.setAttribute('aria-label', t('searchPlaceholder'));
    }

    const updates = [
        ['filter-trigger', t('filter')],
        ['map-tab-btn', t('mapTab')],
        ['list-tab-btn', t('listTab')],
        ['mode-label', t('modeLabel')],
        ['mode-focus-btn', t('modeFocus')],
        ['mode-meeting-btn', t('modeMeeting')],
        ['mode-vibe-btn', t('modeVibe')],
        ['mode-all-btn', t('modeAll')],
        ['best-match-label', t('bestMatchLabel')],
        ['best-match-action', t('openRecommendation')],
        ['best-match-score-label', t('matchScore')],
        ['map-shell-eyebrow', t('mapEyebrow')],
        ['map-shell-title', t('mapTitle')],
        ['detail-back-btn', t('detailBack')],
        ['detail-vitals-label', t('detailVitals')],
        ['detail-info-label', t('detailInfo')],
        ['detail-map-link', t('detailOpenMaps')],
        ['detail-vibe-label', t('detailVibe')],
        ['detail-verification-label', t('detailVerification')],
        ['contribute-title', t('contributeTitle')],
        ['contribute-cafe-label', t('contributeCafe')],
        ['contribute-reporter-label', t('contributeReporter')],
        ['contribute-wifi-label', t('contributeWifi')],
        ['contribute-screenshot-label', t('contributeScreenshot')],
        ['contribute-plugs-label', t('contributePlugs')],
        ['contribute-noise-label', t('contributeNoise')],
        ['contribute-notes-label', t('contributeNotes')],
        ['contribute-submit-btn', t('contributeSubmit')],
        ['profile-back-btn', t('profileBack')],
        ['profile-title', t('profileTitle')],
        ['profile-achievements-label', t('profileAchievements')],
        ['profile-activity-label', t('profileActivity')],
        ['admin-mode-title', t('adminModeTitle')],
        ['admin-open-btn', t('adminOpen')]
    ];

    updates.forEach(([id, value]) => {
        const node = document.getElementById(id);
        if (node) node.textContent = value;
    });

    const adminCopyNode = document.querySelector('#admin-mode-title + p');
    if (adminCopyNode) adminCopyNode.textContent = t('adminModeCopy');

    document.getElementById('lang-id-btn')?.classList.toggle('active', currentLanguage === 'id');
    document.getElementById('lang-en-btn')?.classList.toggle('active', currentLanguage === 'en');
}

function setLanguage(language) {
    currentLanguage = language === 'en' ? 'en' : 'id';
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    applyLanguageToShell();
    renderList();
    if (document.getElementById('detail-view').style.display !== 'none' && bestMatchCafe) {
        showDetail(bestMatchCafe.id);
    }
    renderProfileSummary();
    renderAdminQueue();
}

function normalizeText(value) {
    return String(value || '').toLowerCase();
}

function getModeLabel(modeKey) {
    if (modeKey === 'focus') return t('modeFocus');
    if (modeKey === 'meeting') return t('modeMeeting');
    if (modeKey === 'vibe') return t('modeVibe');
    return t('modeAll');
}

function scorePlugs(cafe) {
    const plugsText = normalizeText(cafe.plugs);
    if (plugsText.includes('excellent') || plugsText.includes('plentiful') || plugsText.includes('melimpah') || plugsText.includes('co-working') || plugsText.includes('reliable')) {
        return 100;
    }
    if (plugsText.includes('good') || plugsText.includes('ada') || plugsText.includes('available')) {
        return 78;
    }
    if (plugsText.includes('limited') || plugsText.includes('terbatas') || plugsText.includes('spaced')) {
        return 46;
    }
    if (plugsText.includes('no visible') || plugsText.includes('nyaris')) {
        return 18;
    }
    return 60;
}

function scoreNoise(cafe) {
    const noiseText = normalizeText(cafe.noise);
    if (noiseText.includes('quiet') || noiseText.includes('tenang') || noiseText.includes('peaceful')) {
        return 100;
    }
    if (noiseText.includes('chill') || noiseText.includes('moderate')) {
        return 78;
    }
    if (noiseText.includes('buzz') || noiseText.includes('ramai')) {
        return 52;
    }
    if (noiseText.includes('bustling') || noiseText.includes('hectic') || noiseText.includes('vibrant')) {
        return 28;
    }
    return 60;
}

function getFreshnessDays(cafe) {
    if (!cafe.lastVerifiedAt) return null;
    return Math.max(0, Math.floor((Date.now() - new Date(cafe.lastVerifiedAt).getTime()) / 86400000));
}

function getFreshnessScore(cafe) {
    const days = getFreshnessDays(cafe);
    if (days === null) return 12;
    if (days <= 3) return 100;
    if (days <= 7) return 90;
    if (days <= 14) return 76;
    if (days <= 30) return 58;
    if (days <= 60) return 38;
    return 18;
}

function getFreshnessLabel(cafe) {
    const days = getFreshnessDays(cafe);
    if (days === null) return t('noLiveVerification');
    if (days === 0) return t('verifiedToday');
    if (days === 1) return t('verifiedYesterday');
    if (days <= 7) return t('verifiedDaysAgo', { days });
    if (days <= 30) return t('staleDaysAgo', { days });
    return t('recheckDaysAgo', { days });
}

function getFitScore(cafe, modeKey = currentMode) {
    const mode = WORK_MODES[modeKey] || WORK_MODES.focus;
    const wifiScore = Math.max(0, Math.min(100, Number(cafe.wifi) || 0));
    const plugsScore = scorePlugs(cafe);
    const noiseScore = scoreNoise(cafe);
    return Math.round(
        (wifiScore * mode.weights.wifi) +
        (plugsScore * mode.weights.plugs) +
        (noiseScore * mode.weights.noise)
    );
}

function getCompositeScore(cafe) {
    const fitScore = getFitScore(cafe);
    const confidenceScore = Math.max(0, Math.min(100, Number(cafe.confidenceScore) || 0));
    const freshnessScore = getFreshnessScore(cafe);
    return Math.round((fitScore * 0.7) + (confidenceScore * 0.2) + (freshnessScore * 0.1));
}

function matchesSpotFilters(cafe) {
    const matchesSearch = normalizeText(cafe.name).includes(searchQuery) || normalizeText(cafe.neighborhood).includes(searchQuery);
    const matchesWifi = !activeFilters.wifi || Number(cafe.wifi) >= 50;
    const matchesPlugs = !activeFilters.plugs || scorePlugs(cafe) >= 78;
    const matchesNoise = !activeFilters.noise || scoreNoise(cafe) >= 78;
    return matchesSearch && matchesWifi && matchesPlugs && matchesNoise;
}

function getFilteredCafes() {
    return Cafes
        .filter(matchesSpotFilters)
        .map((cafe) => ({
            ...cafe,
            fitScore: getFitScore(cafe),
            score: getCompositeScore(cafe),
            freshnessLabel: getFreshnessLabel(cafe)
        }))
        .sort((a, b) => b.score - a.score);
}

function buildMapsSearchUrl(cafe) {
    const query = encodeURIComponent(`${cafe.name} ${cafe.address || cafe.neighborhood || 'Jakarta'}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function getMapShellCopyNode() {
    return document.getElementById('map-shell-copy');
}

function setMapShellCopy(message) {
    const node = getMapShellCopyNode();
    if (node) node.textContent = message;
}

async function getPublicConfig() {
    if (publicConfig) return publicConfig;
    if (publicConfigPromise) return publicConfigPromise;

    if (!shouldUseBackend()) {
        publicConfig = { googleMaps: { enabled: false, browserKey: '' } };
        return publicConfig;
    }

    publicConfigPromise = apiFetch('public-config')
        .then((result) => {
            publicConfig = result;
            return result;
        })
        .catch(() => {
            publicConfig = { googleMaps: { enabled: false, browserKey: '' } };
            return publicConfig;
        });

    return publicConfigPromise;
}

function clearGoogleMarkers() {
    googleMarkers.forEach((marker) => marker.setMap(null));
    googleMarkers = [];
}

function renderGoogleMarkers(cafes) {
    if (!googleMap || !window.google?.maps) return;

    clearGoogleMarkers();
    if (!cafes.length) return;

    const bounds = new window.google.maps.LatLngBounds();
    cafes.forEach((cafe) => {
        const marker = new window.google.maps.Marker({
            position: { lat: Number(cafe.lat), lng: Number(cafe.lng) },
            map: googleMap,
            title: cafe.name,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: cafe.id === bestMatchCafe?.id ? '#FAD80D' : '#6FC2FF',
                fillOpacity: 1,
                strokeColor: '#383838',
                strokeWeight: 2,
                scale: cafe.id === bestMatchCafe?.id ? 9 : 7
            }
        });

        marker.addListener('click', () => showDetail(cafe.id));
        googleMarkers.push(marker);
        bounds.extend(marker.getPosition());
    });

    googleMap.fitBounds(bounds, 48);
}

function ensureGoogleMapInstance() {
    const mapNode = document.getElementById('google-map');
    if (!mapNode || !window.google?.maps) return null;

    if (!googleMap) {
        googleMap = new window.google.maps.Map(mapNode, {
            center: { lat: -6.2088, lng: 106.8456 },
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            clickableIcons: false,
            gestureHandling: 'cooperative',
            styles: [
                { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                { featureType: 'transit', stylers: [{ visibility: 'off' }] }
            ]
        });
    }

    return googleMap;
}

async function ensureGoogleMapsReady() {
    const config = await getPublicConfig();
    if (!config.googleMaps?.enabled || !config.googleMaps.browserKey) {
        return false;
    }

    if (googleMapsAuthFailed) {
        return false;
    }

    if (window.google?.maps) {
        ensureGoogleMapInstance();
        return true;
    }

    if (googleMapsLoadPromise) {
        await googleMapsLoadPromise;
        ensureGoogleMapInstance();
        return true;
    }

    googleMapsLoadPromise = new Promise((resolve, reject) => {
        window.__colokkanGoogleMapsReady = () => resolve();
        window.gm_authFailure = () => {
            googleMapsAuthFailed = true;
            const googleMapNode = document.getElementById('google-map');
            const radarNode = document.getElementById('map-radar');
            if (googleMapNode) googleMapNode.hidden = true;
            if (radarNode) radarNode.hidden = false;
            setMapShellCopy(t('mapDisabled'));
            reject(new Error('Google Maps auth failed'));
        };

        const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
        if (existingScript) {
            existingScript.addEventListener('load', resolve, { once: true });
            existingScript.addEventListener('error', reject, { once: true });
            return;
        }

        const script = document.createElement('script');
        script.id = GOOGLE_MAPS_SCRIPT_ID;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(config.googleMaps.browserKey)}&v=weekly&loading=async&callback=__colokkanGoogleMapsReady`;
        script.async = true;
        script.defer = true;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    try {
        await googleMapsLoadPromise;
        if (googleMapsAuthFailed) {
            return false;
        }
        ensureGoogleMapInstance();
        return true;
    } catch (error) {
        googleMapsLoadPromise = null;
        return false;
    }
}

async function updateMapExperience() {
    const radarNode = document.getElementById('map-radar');
    const googleMapNode = document.getElementById('google-map');
    const cafes = getFilteredCafes();
    const mapsReady = await ensureGoogleMapsReady();

    if (mapsReady) {
        googleMapNode.hidden = false;
        radarNode.hidden = true;
        setMapShellCopy(t('mapEnabled'));
        renderGoogleMarkers(cafes);
        return;
    }

    googleMapNode.hidden = true;
    radarNode.hidden = false;
    clearGoogleMarkers();
    setMapShellCopy(t('mapDisabled'));
    renderMapRadar();
}

async function apiFetch(path, options = {}) {
    const response = await fetch(`${API_BASE}/${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(body.error || body.details || 'Request gagal');
    }
    return body;
}

function shouldUseBackend() {
    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
    if (!isLocal) return true;
    return window.location.port === '8888';
}

async function loadCafes() {
    if (!shouldUseBackend()) {
        Cafes = [...seedCafes];
        populateContributeOptions();
        renderAreaGrid();
        renderList();
        renderProfileSummary();
        updateMapExperience();
        return;
    }

    try {
        const result = await apiFetch('get-cafes');
        Cafes = result.cafes.length ? result.cafes : [...seedCafes];
    } catch (error) {
        Cafes = [...seedCafes];
    }

    populateContributeOptions();
    renderAreaGrid();
    renderList();
    renderProfileSummary();
    updateMapExperience();
}

function updateModeButtons() {
    document.querySelectorAll('.mode-chip').forEach((button) => {
        button.setAttribute('aria-pressed', button.dataset.mode === currentMode ? 'true' : 'false');
    });
}

function updateBestMatchCard(cafes = getFilteredCafes()) {
    bestMatchCafe = cafes[0] || null;

    const nameNode = document.getElementById('best-match-name');
    const metaNode = document.getElementById('best-match-meta');
    const reasonNode = document.getElementById('best-match-reason');
    const scoreNode = document.getElementById('best-match-score');
    const actionNode = document.getElementById('best-match-action');

    if (!bestMatchCafe) {
        nameNode.textContent = t('bestMatchEmptyTitle');
        metaNode.textContent = t('bestMatchEmptyMeta');
        reasonNode.textContent = t('bestMatchEmptyReason');
        scoreNode.textContent = '--';
        actionNode.disabled = true;
        return;
    }

    const modeLabel = getModeLabel(currentMode);
    const reasonBits = [
        `${bestMatchCafe.wifi || '--'} Mbps`,
        `confidence ${bestMatchCafe.confidenceScore || 0}/100`,
        bestMatchCafe.freshnessLabel
    ];

    nameNode.textContent = bestMatchCafe.name;
    metaNode.textContent = t('fitMeta', {
        neighborhood: bestMatchCafe.neighborhood,
        score: bestMatchCafe.fitScore,
        reports: bestMatchCafe.reportCount || 0
    });
    reasonNode.textContent = t('bestMatchReason', { mode: modeLabel, bits: reasonBits.join(' · ') });
    scoreNode.textContent = String(bestMatchCafe.score);
    actionNode.disabled = false;
}

function renderEmptyState(container, message) {
    container.innerHTML = `<div class="empty-state">${message}</div>`;
}

function renderMapRadar() {
    const container = document.getElementById('map-radar');
    if (!container) return;

    const cafes = getFilteredCafes();
    if (!cafes.length) {
        container.innerHTML = `<div class="empty-state">${t('emptyRadar')}</div>`;
        return;
    }

    const width = 760;
    const height = 420;
    const padding = 36;
    const lats = cafes.map((cafe) => Number(cafe.lat));
    const lngs = cafes.map((cafe) => Number(cafe.lng));
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const latRange = Math.max(0.0001, maxLat - minLat);
    const lngRange = Math.max(0.0001, maxLng - minLng);
    const featuredIds = new Set(cafes.slice(0, 4).map((cafe) => cafe.id));

    const dots = cafes.map((cafe) => {
        const x = padding + (((Number(cafe.lng) - minLng) / lngRange) * (width - (padding * 2)));
        const y = height - padding - (((Number(cafe.lat) - minLat) / latRange) * (height - (padding * 2)));
        const radius = 6 + Math.round((Number(cafe.confidenceScore || 0) / 100) * 8);
        const fill = cafe.id === bestMatchCafe?.id ? '#FAD80D' : '#6FC2FF';
        const safeName = cafe.name.replace(/&/g, '&amp;').replace(/</g, '&lt;');
        const label = featuredIds.has(cafe.id)
            ? `<text x="${x + radius + 6}" y="${y + 4}" font-size="11" font-weight="700" fill="#383838">${safeName}</text>`
            : '';
        return `
            <g tabindex="0" role="button" aria-label="Buka detail ${safeName}" onclick="showDetail('${cafe.id}')">
                <circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" stroke="#383838" stroke-width="2"></circle>
                <title>${safeName} | ${cafe.neighborhood} | ${cafe.wifi || '--'} Mbps | confidence ${cafe.confidenceScore || 0}/100</title>
                ${label}
            </g>
        `;
    }).join('');

    container.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" aria-label="Radar spot kerja Jakarta">
            <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="transparent" stroke="#383838" stroke-width="2"></rect>
            <text x="${padding}" y="28" font-size="12" font-weight="700" fill="#383838">${t('west')}</text>
            <text x="${width - 90}" y="28" font-size="12" font-weight="700" fill="#383838">${t('east')}</text>
            <text x="${padding}" y="${height - 12}" font-size="12" font-weight="700" fill="#383838">${t('north')}</text>
            <text x="${width - 86}" y="${height - 12}" font-size="12" font-weight="700" fill="#383838">${t('south')}</text>
            <line x1="${padding}" y1="${height / 2}" x2="${width - padding}" y2="${height / 2}" stroke="rgba(56,56,56,0.2)" stroke-dasharray="6 6"></line>
            <line x1="${width / 2}" y1="${padding}" x2="${width / 2}" y2="${height - padding}" stroke="rgba(56,56,56,0.2)" stroke-dasharray="6 6"></line>
            ${dots}
        </svg>
        <div class="map-radar__legend">
            <span><i style="width:10px;height:10px;border-radius:999px;background:#FAD80D;border:2px solid #383838;display:inline-block;"></i> ${t('bestMatchLegend')}</span>
            <span><i style="width:10px;height:10px;border-radius:999px;background:#6FC2FF;border:2px solid #383838;display:inline-block;"></i> ${t('otherSpotsLegend')}</span>
            <span>${t('markerSizeLegend')}</span>
        </div>
    `;
}

function renderAreaGrid() {
    const areaGrid = document.getElementById('area-grid');
    if (!areaGrid) return;

    const grouped = getFilteredCafes().reduce((accumulator, cafe) => {
        const key = cafe.neighborhood || 'Lainnya';
        if (!accumulator[key]) accumulator[key] = [];
        accumulator[key].push(cafe);
        return accumulator;
    }, {});

    const areas = Object.entries(grouped)
        .map(([name, cafes]) => {
            const sorted = cafes.slice().sort((a, b) => b.score - a.score);
            const topCafe = sorted[0];
            const avgConfidence = Math.round(sorted.reduce((sum, item) => sum + (item.confidenceScore || 0), 0) / sorted.length);
            return { name, total: sorted.length, topCafe, avgConfidence };
        })
        .sort((a, b) => b.topCafe.score - a.topCafe.score);

    if (!areas.length) {
        renderEmptyState(areaGrid, t('emptyArea'));
        return;
    }

    areaGrid.innerHTML = areas.map((area) => `
        <div class="area-card">
            <div style="display:flex; justify-content:space-between; gap:12px; align-items:start;">
                <div>
                    <h2 style="font-size:16px; margin:0;">${area.name}</h2>
                    <p class="area-card__meta">${area.total} spot · ${t('avgConfidence', { score: area.avgConfidence })}</p>
                </div>
                <span class="badge badge-muted">${t('topScore', { score: area.topCafe.score })}</span>
            </div>
            <div style="margin-top:12px;">
                <strong>${area.topCafe.name}</strong>
                <p class="area-card__meta">${area.topCafe.wifi} Mbps · ${area.topCafe.freshnessLabel}</p>
                <button class="btn btn-primary" type="button" style="margin-top:12px;" onclick="showDetail('${area.topCafe.id}')">${t('lookTopSpot')}</button>
            </div>
        </div>
    `).join('');
}

function renderList() {
    const container = document.getElementById('cafe-list');
    if (!container) return;

    const filteredCafes = getFilteredCafes();
    updateBestMatchCard(filteredCafes);
    renderAreaGrid();
    if (currentTab === 'map') {
        updateMapExperience();
    }

    if (!filteredCafes.length) {
        renderEmptyState(container, t('emptyList'));
        return;
    }

    container.innerHTML = filteredCafes.map((cafe) => `
        <button class="list-item${bestMatchCafe && cafe.id === bestMatchCafe.id ? ' list-item--featured' : ''}" type="button" role="listitem" data-cafe-id="${cafe.id}" aria-label="Buka detail ${cafe.name}, skor ${cafe.score}" onclick="showDetail('${cafe.id}')">
            <div style="display:flex; justify-content:space-between; align-items:start; gap:12px;">
                <div>
                    <h2 style="font-size:16px; margin:0;">${cafe.name}</h2>
                    <p class="list-item-location">${cafe.neighborhood}</p>
                    <p class="list-item-meta">${cafe.plugs} · ${cafe.noise}</p>
                    <span class="trust-badge">${cafe.confidenceScore || 0}/100 · ${cafe.freshnessLabel}</span>
                </div>
                <div style="text-align:right;">
                    <span class="badge badge-speed" style="font-size:12px;">${cafe.wifi || '--'} Mbps</span>
                    <p class="list-item-score-label">Skor ${cafe.score}</p>
                </div>
            </div>
        </button>
    `).join('');
}

function populateContributeOptions() {
    const select = document.getElementById('contribute-cafe-select');
    if (!select) return;

    const currentValue = select.value;
    const options = Cafes
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, 'id'))
        .map((cafe) => `<option value="${cafe.id}">${cafe.name}</option>`)
        .join('');

    select.innerHTML = `<option value="">Pilih spot</option>${options}`;
    if (currentValue) {
        select.value = currentValue;
    }
}

function toggleModal(id, show) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.hidden = !show;
        modal.style.display = show ? 'flex' : 'none';
        modal.setAttribute('aria-hidden', show ? 'false' : 'true');
        document.body.style.overflow = show ? 'hidden' : '';
    }
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach((button) => {
        const isActive = button.dataset.tab === tab;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    document.getElementById('map-tab').style.display = tab === 'map' ? 'block' : 'none';
    document.getElementById('list-tab').style.display = tab === 'list' ? 'block' : 'none';

    if (tab === 'map') {
        updateMapExperience();
    }
}

function hideAllViews() {
    document.getElementById('radar-view').style.display = 'none';
    document.getElementById('detail-view').style.display = 'none';
    document.getElementById('contribute-view').style.display = 'none';
    document.getElementById('profile-view').style.display = 'none';
}

function showRadar() {
    hideAllViews();
    document.getElementById('radar-view').style.display = 'block';
    switchTab(currentTab);
}

function showContribute() {
    hideAllViews();
    document.getElementById('contribute-view').style.display = 'block';
}

function showProfile() {
    hideAllViews();
    document.getElementById('profile-view').style.display = 'block';
    renderProfileSummary();
    renderAdminQueue();
}

function setWorkMode(mode) {
    if (!WORK_MODES[mode]) return;
    currentMode = mode;
    updateModeButtons();
    renderList();
}

function openBestMatch() {
    if (bestMatchCafe) {
        showDetail(bestMatchCafe.id);
    }
}

function buildVerificationItems(cafe) {
    const items = [];
    if (cafe.reportCount > 0) {
        items.push(t('seedMessage1', { count: cafe.reportCount, freshness: getFreshnessLabel(cafe).toLowerCase() }));
        items.push(t('seedMessage2', { score: cafe.confidenceScore || 0 }));
    } else {
        items.push(t('needFirstReport'));
    }
    return items;
}

function showDetail(cafeId) {
    const cafe = Cafes.find((item) => item.id === cafeId);
    if (!cafe) return;

    hideAllViews();
    document.getElementById('detail-view').style.display = 'block';

    document.getElementById('detail-name').textContent = cafe.name;
    document.getElementById('detail-wifi').textContent = String(cafe.wifi || '--');
    document.getElementById('detail-plugs').textContent = cafe.plugs || '--';
    document.getElementById('detail-noise').textContent = cafe.noise || '--';
    document.getElementById('detail-address').textContent = cafe.address || cafe.neighborhood || 'Alamat belum tersedia';
    document.getElementById('detail-hours').textContent = t('detailHours');
    document.getElementById('detail-aesthetic').textContent = cafe.rating ? '⭐'.repeat(Math.max(1, Math.round(cafe.rating))) : '⭐⭐⭐⭐';
    document.getElementById('detail-map-link').href = buildMapsSearchUrl(cafe);
    document.getElementById('detail-freshness').textContent = getFreshnessLabel(cafe);
    document.getElementById('detail-confidence').textContent = `${cafe.confidenceScore || 0}/100`;
    document.getElementById('detail-report-count').textContent = String(cafe.reportCount || 0);
    document.getElementById('verification-list').innerHTML = buildVerificationItems(cafe).map((item) => `<li>${item}</li>`).join('');
}

function applyFilters() {
    activeFilters.wifi = document.getElementById('filter-wifi').checked;
    activeFilters.plugs = document.getElementById('filter-plugs').checked;
    activeFilters.noise = document.getElementById('filter-noise').checked;
    toggleModal('filter-modal', false);
    renderList();
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function handleFileUpload(input) {
    const statusNode = document.getElementById('upload-status');
    if (!input.files || !input.files[0]) {
        selectedScreenshotDataUrl = '';
        statusNode.textContent = UPLOAD_IDLE_TEXT;
        return;
    }

    try {
        selectedScreenshotDataUrl = await fileToDataUrl(input.files[0]);
        statusNode.textContent = t('uploadReady', { name: input.files[0].name });
        statusNode.style.color = 'var(--mother-teal)';
    } catch (error) {
        selectedScreenshotDataUrl = '';
        statusNode.textContent = t('uploadFailed');
        statusNode.style.color = 'red';
    }
}

function resetContributionForm() {
    const form = document.getElementById('contribute-form');
    form.reset();
    selectedScreenshotDataUrl = '';
    const uploadStatus = document.getElementById('upload-status');
    uploadStatus.textContent = UPLOAD_IDLE_TEXT;
    uploadStatus.style.color = '';
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const statusNode = document.getElementById('submit-status');
    const payload = {
        cafeId: document.getElementById('contribute-cafe-select').value,
        reporterName: document.getElementById('reporter-name').value.trim(),
        wifiMbps: document.getElementById('contribute-wifi').value,
        plugs: document.getElementById('contribute-plugs').value,
        noise: document.getElementById('contribute-noise').value,
        notes: document.getElementById('contribute-notes').value.trim(),
        screenshotDataUrl: selectedScreenshotDataUrl
    };

    if (!payload.cafeId) {
        statusNode.textContent = t('chooseCafeFirst');
        statusNode.style.color = 'red';
        statusNode.style.display = 'block';
        return;
    }

    if (!shouldUseBackend()) {
        statusNode.textContent = t('backendNeededSubmit');
        statusNode.style.color = 'red';
        statusNode.style.display = 'block';
        return;
    }

    try {
        statusNode.textContent = t('submitting');
        statusNode.style.color = 'var(--charcoal)';
        statusNode.style.display = 'block';
        const result = await apiFetch('submit-report', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        statusNode.textContent = result.message || t('submitSuccess');
        statusNode.style.color = 'var(--mother-teal)';
        resetContributionForm();
        renderProfileSummary();
    } catch (error) {
        statusNode.textContent = error.message;
        statusNode.style.color = 'red';
    }
}

function renderProfileSummary() {
    const approvedCount = Cafes.reduce((sum, cafe) => sum + (Number(cafe.reportCount) || 0), 0);
    document.getElementById('profile-approved-count').textContent = String(approvedCount);
    document.getElementById('profile-queue-count').textContent = String(adminQueue.length);
    document.getElementById('profile-activity').textContent = bestMatchCafe
        ? t('topSpotActivity', { name: bestMatchCafe.name, score: bestMatchCafe.confidenceScore || 0 })
        : t('noBackendActivity');
}

function setAdminStatus(message, tone) {
    const node = document.getElementById('admin-status');
    node.textContent = message;
    node.style.display = 'block';
    node.style.color = tone === 'error' ? 'red' : tone === 'success' ? 'var(--mother-teal)' : 'var(--charcoal)';
}

function renderAdminQueue() {
    const queueNode = document.getElementById('admin-queue');
    if (!queueNode) return;

    if (!adminToken) {
        queueNode.innerHTML = `<div class="empty-state">${t('adminNeedLogin')}</div>`;
        return;
    }

    if (!adminQueue.length) {
        queueNode.innerHTML = `<div class="empty-state">${t('adminEmptyQueue')}</div>`;
        return;
    }

    queueNode.innerHTML = adminQueue.map((item) => `
        <div class="admin-queue-item">
            <div style="display:flex; justify-content:space-between; gap:12px; align-items:start;">
                <div>
                    <strong>${item.cafeName}</strong>
                    <p class="area-card__meta">${item.neighborhood} · ${item.reporterName || 'Anon'} · ${new Date(item.submittedAt).toLocaleString('id-ID')}</p>
                </div>
                <span class="badge badge-muted">${item.wifiMbps} Mbps</span>
            </div>
            <p class="area-card__meta" style="margin-top:8px;">${item.plugs} · ${item.noise}</p>
            ${item.notes ? `<p style="margin-top:8px; font-size:12px;">${item.notes}</p>` : ''}
            ${item.screenshotUrl ? `<a class="btn" style="margin-top:12px;" href="${item.screenshotUrl}" target="_blank" rel="noopener noreferrer">Lihat screenshot</a>` : ''}
            <div class="admin-queue-actions">
                <button class="btn btn-primary" type="button" onclick="reviewReport('${item.id}', 'approve')">Approve</button>
                <button class="btn" type="button" onclick="reviewReport('${item.id}', 'reject')">Reject</button>
            </div>
        </div>
    `).join('');
}

async function fetchAdminQueue() {
    if (!adminToken || !shouldUseBackend()) return;
    const result = await apiFetch('get-admin-queue', {
        method: 'GET',
        headers: {
            'x-admin-token': adminToken
        }
    });
    adminQueue = result.queue || [];
    renderAdminQueue();
    renderProfileSummary();
}

async function openAdminMode() {
    if (!shouldUseBackend()) {
        setAdminStatus(t('adminNeedBackend'), 'error');
        return;
    }

    if (!adminToken) {
        const token = window.prompt(t('adminPrompt'));
        if (!token) return;
        adminToken = token.trim();
        localStorage.setItem('colokkan_admin_token', adminToken);
    }

    try {
        setAdminStatus(t('loadingQueue'), 'info');
        await fetchAdminQueue();
        setAdminStatus(t('queueReady', { count: adminQueue.length }), 'success');
    } catch (error) {
        adminToken = '';
        localStorage.removeItem('colokkan_admin_token');
        adminQueue = [];
        renderAdminQueue();
        renderProfileSummary();
        setAdminStatus(error.message, 'error');
    }
}

async function reviewReport(reportId, action) {
    if (!shouldUseBackend()) {
        setAdminStatus(t('reviewNeedBackend'), 'error');
        return;
    }

    let rejectionReason = '';
    if (action === 'reject') {
        rejectionReason = window.prompt(t('rejectPrompt'));
        if (rejectionReason === null) return;
    }

    try {
        setAdminStatus(action === 'approve' ? t('approving') : t('rejecting'), 'info');
        await apiFetch('review-report', {
            method: 'POST',
            headers: {
                'x-admin-token': adminToken
            },
            body: JSON.stringify({
                reportId,
                action,
                rejectionReason
            })
        });
        await Promise.all([fetchAdminQueue(), loadCafes()]);
        setAdminStatus(action === 'approve' ? t('approvedDone') : t('rejectedDone'), 'success');
    } catch (error) {
        setAdminStatus(error.message, 'error');
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        toggleModal('filter-modal', false);
    }
});

document.addEventListener('click', (event) => {
    if (event.target.id === 'filter-modal') {
        toggleModal('filter-modal', false);
    }
});

const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (event) => {
        searchQuery = event.target.value.toLowerCase();
        renderList();
    });
}

applyLanguageToShell();
switchTab(currentTab);
updateModeButtons();
renderAreaGrid();
renderList();
loadCafes();

window.applyFilters = applyFilters;
window.handleFileUpload = handleFileUpload;
window.handleFormSubmit = handleFormSubmit;
window.openBestMatch = openBestMatch;
window.openAdminMode = openAdminMode;
window.reviewReport = reviewReport;
window.setLanguage = setLanguage;
window.setWorkMode = setWorkMode;
window.showContribute = showContribute;
window.showDetail = showDetail;
window.showProfile = showProfile;
window.showRadar = showRadar;
window.switchTab = switchTab;
window.toggleModal = toggleModal;
