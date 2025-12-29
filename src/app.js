/* src/app.js */

// 1. App State
let map, service, infoWindow;
let markers = [];
let Cafes = [
    {
        id: "factual_1",
        name: "Common Grounds (Ashta)",
        lat: -6.2238,
        lng: 106.8094,
        neighborhood: "Senopati",
        wifi: 82,
        plugs: "Plenty at most tables",
        noise: "Moderate Buzz",
        rating: 4.6,
        address: "Ashta District 8, GF, Senayan"
    },
    {
        id: "factual_2",
        name: "Lucky Cat Coffee",
        lat: -6.2205,
        lng: 106.8309,
        neighborhood: "Kuningan",
        wifi: 45,
        plugs: "Limited near walls",
        noise: "Lively",
        rating: 4.5,
        address: "Pasar Festival, Kuningan"
    },
    {
        id: "factual_3",
        name: "1/15 Coffee (Senopati)",
        lat: -6.2301,
        lng: 106.8078,
        neighborhood: "Senopati",
        wifi: 65,
        plugs: "Good at long table",
        noise: "Chill",
        rating: 4.7,
        address: "Jl. Senopati No. 67"
    },
    {
        id: "factual_4",
        name: "Anomali Coffee (Senopati)",
        lat: -6.2289,
        lng: 106.8066,
        neighborhood: "Senopati",
        wifi: 35,
        plugs: "Available indoors",
        noise: "Productive Buzz",
        rating: 4.4,
        address: "Jl. Senopati No. 19"
    },
    {
        id: "factual_5",
        name: "Pison Jakarta",
        lat: -6.2324,
        lng: 106.8105,
        neighborhood: "Senopati",
        wifi: 55,
        plugs: "Mixed availability",
        noise: "Bustling",
        rating: 4.6,
        address: "Jl. Kertanegara No. 70"
    },
    {
        id: "factual_6",
        name: "Fillmore Coffee",
        lat: -6.2244,
        lng: 106.8262,
        neighborhood: "Kuningan",
        wifi: 70,
        plugs: "Excellent",
        noise: "Quiet/Chill",
        rating: 4.8,
        address: "Jl. H. Sidik No. 7, Kuningan"
    },
    {
        id: "factual_7",
        name: "Emji Coffee Bar",
        lat: -6.2282,
        lng: 106.8288,
        neighborhood: "Kuningan",
        wifi: 90,
        plugs: "Co-working standard",
        noise: "Quiet",
        rating: 4.5,
        address: "Stellar Powerhouse, Kuningan"
    },
    {
        id: "factual_8",
        name: "Chief Coffee (Kemang)",
        lat: -6.2642,
        lng: 106.8115,
        neighborhood: "Kemang",
        wifi: 50,
        plugs: "Very reliable",
        noise: "Vibrant",
        rating: 4.6,
        address: "Jl. Kemang Raya No. 27"
    },
    {
        id: "factual_9",
        name: "Sophie Authentique",
        lat: -6.2735,
        lng: 106.8142,
        neighborhood: "Kemang",
        wifi: 40,
        plugs: "Spaced out",
        noise: "Peaceful",
        rating: 4.5,
        address: "Jl. Kemang Selatan No. 100"
    },
    {
        id: "factual_10",
        name: "Eighty/nine Eatery",
        lat: -6.2625,
        lng: 106.8167,
        neighborhood: "Kemang",
        wifi: 60,
        plugs: "Plentiful",
        noise: "Lively but large",
        rating: 4.4,
        address: "Jl. Kemang Raya No. 89"
    },
    {
        id: "factual_11",
        name: "Djournal Coffee",
        lat: -6.2248,
        lng: 106.8301,
        neighborhood: "Kuningan City",
        wifi: 55,
        plugs: "Reliable at benches",
        noise: "Mall Buzz",
        rating: 4.3,
        address: "Kuningan City Mall, GF"
    },
    {
        id: "factual_12",
        name: "Ottoman's Coffee",
        lat: -6.2305,
        lng: 106.8248,
        neighborhood: "Kuningan",
        wifi: 65,
        plugs: "Good at communal table",
        noise: "Chic/Paced",
        rating: 4.7,
        address: "Sopo Del Tower, Kuningan"
    }
];
let currentTab = 'map';
let activeFilters = {
    wifi: false,
    plugs: false,
    noise: false
};
let searchQuery = '';

// 2. Google Maps Initialization
function initMap() {
    // If the map is already initialized, don't do it again
    if (map) return;

    console.log("Initializing Google Maps...");
    const mapContainer = document.getElementById('map-tab');
    if (!mapContainer) return;

    // Clear the mock map UI
    mapContainer.innerHTML = '';
    mapContainer.style.height = '500px';
    mapContainer.className = 'tab-content';

    // Center of Jakarta
    const jakarta = { lat: -6.2088, lng: 106.8456 };

    map = new google.maps.Map(mapContainer, {
        center: jakarta,
        zoom: 14,
        disableDefaultUI: true,
        styles: [
            { "saturation": -100 },
            { "lightness": 0 } // Reset lightness to ensure tiles are visible
        ]
    });

    service = new google.maps.places.PlacesService(map);
    infoWindow = new google.maps.InfoWindow();

    // Render starter data
    renderMarkers();
    renderList();

    // Fetch live data
    fetchNearbyCafes();
}

// Robust fallback for initMap if the callback fails
function checkGoogleMaps() {
    if (typeof google !== 'undefined' && google.maps && !map) {
        initMap();
    } else if (!map) {
        setTimeout(checkGoogleMaps, 500);
    }
}
window.addEventListener('load', checkGoogleMaps);

// 3. Fetch Nearby Cafes
function fetchNearbyCafes() {
    const request = {
        location: map.getCenter(),
        radius: '3000', // Increased to 3km for better coverage
        type: ['cafe'],
        // keyword: 'working space' - Removed to broaden results
    };

    service.nearbySearch(request, (results, status) => {
        console.log("Places API Status:", status);

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            Cafes = results.map(place => ({
                id: place.place_id,
                name: place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                neighborhood: place.vicinity || "Jakarta",
                wifi: Math.floor(Math.random() * (80 - 30) + 30), // Mocked for demonstration
                plugs: "Verified Nearby", // To be updated on detail view
                noise: "Scanning...",
                rating: place.rating || 0,
                address: place.vicinity
            }));

            renderMarkers();
            renderList();
        } else {
            // Visualize the error for the user
            document.getElementById('map-tab').innerHTML = `
                <div style="padding: 20px; text-align: center; color: #ff0000; font-weight: 700;">
                    API ERROR: ${status}<br>
                    <span style="font-size: 10px; color: #383838; font-weight: 400;">
                        Wait for "OK". If you see "REQUEST_DENIED", visit Google Cloud Console to enable Billing or the Places API.
                    </span>
                </div>
            `;
        }
    });
}

function renderMarkers() {
    // Clear old markers first
    markers.forEach(m => m.setMap(null));
    markers = [];

    Cafes.forEach(cafe => {
        const matchesSearch = cafe.name.toLowerCase().includes(searchQuery) || cafe.neighborhood.toLowerCase().includes(searchQuery);
        const matchesWifi = !activeFilters.wifi || cafe.wifi >= 50;
        const matchesPlugs = !activeFilters.plugs || (cafe.plugs && !cafe.plugs.toLowerCase().includes('scarce') && !cafe.plugs.toLowerCase().includes('no plugs'));
        const matchesNoise = !activeFilters.noise || (cafe.noise && (cafe.noise.toLowerCase().includes('quiet') || cafe.noise.toLowerCase().includes('chill')));

        if (matchesSearch && matchesWifi && matchesPlugs && matchesNoise) {
            const marker = new google.maps.Marker({
                position: { lat: cafe.lat, lng: cafe.lng },
                map: map,
                title: cafe.name,
                icon: {
                    path: 'M20,60 C20,50 30,45 40,45 C45,35 60,35 70,45 C85,45 85,60 85,60 C85,75 75,85 60,85 L40,85 C25,85 20,75 20,60 Z',
                    fillColor: '#6FC2FF',
                    fillOpacity: 1,
                    strokeColor: '#383838',
                    strokeWeight: 2,
                    scale: 0.3
                }
            });

            marker.addListener('click', () => {
                showInfoCard(cafe.id);
            });

            markers.push(marker);
        }
    });
}

// 4. Detailed Data Fetching
function showInfoCard(placeId) {
    const cafe = Cafes.find(c => c.id === placeId);
    const card = document.getElementById('map-info-card');

    document.getElementById('info-card-name').innerText = cafe.name;
    document.getElementById('info-card-wifi').innerText = cafe.wifi + ' Mbps';
    document.getElementById('info-card-plugs').innerText = 'Verified';
    card.style.display = 'block';

    card.onclick = () => showDetail(placeId);
}

function showDetail(placeId) {
    const request = {
        placeId: placeId,
        fields: ['name', 'opening_hours', 'formatted_address', 'rating', 'photos']
    };

    service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            hideAllViews();
            document.getElementById('detail-view').style.display = 'block';

            document.getElementById('detail-name').innerText = place.name;
            document.getElementById('detail-wifi').innerText = Math.floor(Math.random() * 50 + 20); // Simulated verification
            document.getElementById('detail-plugs').innerText = "AVAILABLE";
            document.getElementById('detail-noise').innerText = "QUIET";
            document.getElementById('detail-address').innerText = place.formatted_address;
            document.getElementById('detail-hours').innerText = place.opening_hours ? place.opening_hours.weekday_text[0] : "Check Map";
            document.getElementById('detail-aesthetic').innerText = "⭐".repeat(Math.round(place.rating || 0));
        }
    });
}

// 5. Navigation & Modal Logic
function toggleModal(id, show) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
    }
}

function showRadar() {
    hideAllViews();
    document.getElementById('radar-view').style.display = 'block';
}

function showContribute() {
    hideAllViews();
    document.getElementById('contribute-view').style.display = 'block';
}

function showProfile() {
    hideAllViews();
    document.getElementById('profile-view').style.display = 'block';
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add('active');

    document.getElementById('map-tab').style.display = tab === 'map' ? 'block' : 'none';
    document.getElementById('list-tab').style.display = tab === 'list' ? 'block' : 'none';
}

function renderList() {
    const container = document.getElementById('cafe-list');
    const filteredCafes = Cafes.filter(cafe => {
        const matchesSearch = cafe.name.toLowerCase().includes(searchQuery) || cafe.neighborhood.toLowerCase().includes(searchQuery);
        const matchesWifi = !activeFilters.wifi || cafe.wifi >= 50;
        const matchesPlugs = !activeFilters.plugs || (cafe.plugs && !cafe.plugs.toLowerCase().includes('scarce') && !cafe.plugs.toLowerCase().includes('no plugs'));
        const matchesNoise = !activeFilters.noise || (cafe.noise && (cafe.noise.toLowerCase().includes('quiet') || cafe.noise.toLowerCase().includes('chill')));
        return matchesSearch && matchesWifi && matchesPlugs && matchesNoise;
    });

    if (filteredCafes.length === 0) {
        container.innerHTML = '<div style="padding: 40px; text-align: center; color: #666;">No spots found matching your criteria.</div>';
        return;
    }

    container.innerHTML = filteredCafes.map(cafe => `
        <div class="list-item" onclick="showDetail('${cafe.id}')">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h2 style="font-size: 16px; margin: 0;">${cafe.name}</h2>
                    <p style="font-size: 11px; color: #666; margin: 4px 0 0 0;">${cafe.neighborhood}</p>
                </div>
                <div style="text-align: right;">
                    <span class="badge badge-speed" style="font-size: 12px;">${cafe.wifi} Mbps</span>
                    <p style="font-size: 9px; font-weight:700; margin-top:4px; color: var(--mother-blue);">PLUGS OK</p>
                </div>
            </div>
        </div>
    `).join('');
}

function hideAllViews() {
    document.getElementById('radar-view').style.display = 'none';
    document.getElementById('detail-view').style.display = 'none';
    document.getElementById('contribute-view').style.display = 'none';
    document.getElementById('profile-view').style.display = 'none';
}

// 6. OCR Simulation
function handleFileUpload(input) {
    if (input.files && input.files[0]) {
        document.getElementById('upload-status').innerText = "Analyzing Screenshot...";
        setTimeout(() => {
            document.getElementById('upload-status').innerText = "Detected: 62 Mbps";
            document.getElementById('upload-status').style.color = "var(--mother-teal)";
        }, 1500);
    }
}

// 7. Initialize
// Handled by callback and checkGoogleMaps fallback
document.querySelector('.search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderList();
    renderMarkers();
});

function applyFilters() {
    activeFilters.wifi = document.getElementById('filter-wifi').checked;
    activeFilters.plugs = document.getElementById('filter-plugs').checked;
    activeFilters.noise = document.getElementById('filter-noise').checked;

    toggleModal('filter-modal', false);
    renderList();
    renderMarkers();
}

function handleFormSubmit(e) {
    e.preventDefault();
    const status = document.getElementById('submit-status');
    status.innerText = "REPORT SUBMITTED! THANK YOU.";
    status.style.display = "block";
    setTimeout(() => {
        status.style.display = "none";
        showRadar();
    }, 2000);
}
