// MAZI-EATS Campus Map — Google Maps Style
// Full-screen map with bottom sheet place cards, user avatar tracking, and teardrop pins

// ═════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═════════════════════════════════════════════════════════════════════════════

const UNILAG_LAT = 6.6;
const UNILAG_LNG = 3.4;
const ZOOM_LEVEL = 16;
const ZOOM_MIN = 14;
const ZOOM_MAX = 18;

// Unilag campus bounds — map cannot be panned outside
const UNILAG_BOUNDS = L.latLngBounds(
    L.latLng(6.5046031,3.3825274),  // Southwest corner
    L.latLng(6.52242054,3.40255147)   // Northeast corner
);

// ═════════════════════════════════════════════════════════════════════════════
// VENDOR DATA (with images, ratings, reviews)
// ═════════════════════════════════════════════════════════════════════════════

const vendors = {
    stores: [
        {
            name: 'Unilag Cooperative Store',
            lat: 6.5165, lng: 3.3875,
            category: 'store',
            location: 'Faculty of Science area',
            hours: '8:00am – 6:00pm',
            price: '₦200 – ₦5,000',
            description: 'Great for bulk food items, spices, and cooking essentials. Students get small discounts.',
            emoji: '🏪',
            image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=200&fit=crop',
            rating: 4.2,
            reviews: 38
        },
        {
            name: 'SUB Mini Mart',
            lat: 6.5150, lng: 3.3850,
            category: 'store',
            location: 'Student Union Building',
            hours: '7:00am – 8:00pm',
            price: '₦100 – ₦3,000',
            description: 'Wide variety of provisions, drinks, and snacks. Very accessible from most faculties.',
            emoji: '🏪',
            image: 'https://images.unsplash.com/photo-1552821081-6456862aac4c?w=400&h=200&fit=crop',
            rating: 4.0,
            reviews: 52
        },
        {
            name: 'Main Gate Provisions',
            lat: 6.5140, lng: 3.3820,
            category: 'store',
            location: 'Near main entrance',
            hours: '8:00am – 7:00pm',
            price: '₦150 – ₦4,000',
            description: 'Affordable prices on everyday grocery items. Popular with off-campus students.',
            emoji: '🏪',
            image: 'https://images.unsplash.com/photo-1548594528-fbe54c67c0f9?w=400&h=200&fit=crop',
            rating: 3.9,
            reviews: 27
        }
    ],
    restaurants: [
        {
            name: 'Malete Canteen',
            lat: 6.5170, lng: 3.3890,
            category: 'restaurant',
            location: 'Near Engineering Faculty',
            hours: '11:00am – 9:00pm',
            price: '₦2,500 – ₦4,000',
            description: 'Generous portions of rice, stew, and local dishes. Popular with engineering students.',
            emoji: '🍽️',
            image: 'https://images.unsplash.com/photo-1546128740-7c33b60ecfa1?w=400&h=200&fit=crop',
            rating: 4.3,
            reviews: 52
        },
        {
            name: 'Senate Canteen',
            lat: 6.5160, lng: 3.3880,
            category: 'restaurant',
            location: 'Near Senate Building',
            hours: '10:00am – 8:00pm',
            price: '₦2,000 – ₦3,500',
            description: 'Central location, good jollof rice and soups. Quick service during lunch rush.',
            emoji: '🍽️',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop',
            rating: 4.1,
            reviews: 43
        },
        {
            name: 'Moremi Hall Cafeteria',
            lat: 6.5155, lng: 3.3870,
            category: 'restaurant',
            location: 'Moremi Hall',
            hours: '7:00am – 9:00pm',
            price: '₦1,500 – ₦3,000',
            description: 'Affordable breakfast and lunch options. Eba, egusi, and pepper soup available daily.',
            emoji: '🍽️',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop',
            rating: 4.0,
            reviews: 38
        },
        {
            name: 'Queen Amina Cafeteria',
            lat: 6.5145, lng: 3.3860,
            category: 'restaurant',
            location: 'Queen Amina Hall',
            hours: '7:00am – 9:00pm',
            price: '₦1,500 – ₦3,000',
            description: 'Budget-friendly hall cafeteria. Daily specials change each morning.',
            emoji: '🍽️',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop',
            rating: 3.8,
            reviews: 31
        },
        {
            name: 'FAD Canteen',
            lat: 6.5152, lng: 3.3855,
            category: 'restaurant',
            location: 'Faculty of Arts & Design',
            hours: '10:00am – 8:00pm',
            price: '₦2,000 – ₦3,500',
            description: 'Quiet spot with art-themed interior. Good food, great for studying between bites.',
            emoji: '🍽️',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop',
            rating: 4.2,
            reviews: 29
        }
    ],
    snacks: [
        {
            name: 'Suya Spot',
            lat: 6.5168, lng: 3.3895,
            category: 'snack',
            location: 'Outside Engineering complex',
            hours: '12:00pm – 8:00pm',
            price: '₦500 – ₦1,500',
            description: 'Delicious grilled meat (suya) and perfectly spiced portions. Quick takeout.',
            emoji: '🌮',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561913?w=400&h=200&fit=crop',
            rating: 4.4,
            reviews: 67
        },
        {
            name: 'Aroma Shawarma',
            lat: 6.5162, lng: 3.3875,
            category: 'snack',
            location: 'Near Moremi Hall',
            hours: '11:00am – 10:00pm',
            price: '₦800 – ₦1,800',
            description: 'Fresh shawarma wraps with your choice of toppings. Popular evening spot.',
            emoji: '🌮',
            image: 'https://images.unsplash.com/photo-1565876398253-1d5f9d51a7d4?w=400&h=200&fit=crop',
            rating: 4.5,
            reviews: 89
        },
        {
            name: 'Chin Chin & Puff Puff Stand',
            lat: 6.5148, lng: 3.3835,
            category: 'snack',
            location: 'Main campus quad',
            hours: '8:00am – 6:00pm',
            price: '₦200 – ₦800',
            description: 'Crispy snacks and fried dough. Perfect quick bites between classes.',
            emoji: '🌮',
            image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=200&fit=crop',
            rating: 4.3,
            reviews: 45
        }
    ]
};

// ═════════════════════════════════════════════════════════════════════════════
// CATEGORY COLORS & PIN STYLES
// ═════════════════════════════════════════════════════════════════════════════

const categoryColors = {
    store: { fill: '#2e7d32', header: 'linear-gradient(135deg, #2e7d32, #1b5e20)', label: 'Food Store' },
    restaurant: { fill: '#c62828', header: 'linear-gradient(135deg, #c62828, #7f0000)', label: 'Restaurant' },
    snack: { fill: '#e65100', header: 'linear-gradient(135deg, #e65100, #bf360c)', label: 'Snack Point' }
};

// Teardrop pin marker
function createTeardropPin(color, emoji) {
    return L.divIcon({
        className: '',
        html: `
            <div style="
                position: relative;
                width: 40px;
                height: 48px;
            ">
                <div style="
                    width: 36px;
                    height: 36px;
                    background: ${color};
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid #fff;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
                "></div>
                <div style="
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    transform: rotate(45deg);
                ">
                    ${emoji}
                </div>
            </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 48],
        popupAnchor: [0, -48]
    });
}

// User avatar marker
function createUserAvatar() {
    return L.divIcon({
        className: 'user-avatar-marker',
        html: `
            <div style="
                position: relative;
                width: 44px;
                height: 44px;
                z-index: 1000;
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #1a6b3c, #2d9158);
                    border-radius: 50%;
                    border: 4px solid #fff;
                    box-shadow: 0 0 0 2px #1a6b3c, 0 4px 12px rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    margin: 2px;
                ">
                    🧑‍🎓
                </div>
            </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22]
    });
}

// ═════════════════════════════════════════════════════════════════════════════
// STATE & GLOBALS
// ═════════════════════════════════════════════════════════════════════════════

let map;
let allMarkers = [];
let userMarker = null;
let userLatLng = null;
let routingControl = null;
let activeFilter = 'all';
let currentVendor = null;

// Navigation tracking
let watchId = null;
let trackingDestination = null;
let isTracking = false;
let lastRerouteTime = 0;
const REROUTE_INTERVAL_MS = 15000;
const ARRIVAL_THRESHOLD_M = 20;

// Location tracking options
const LOCATION_OPTIONS = {
    singleCheck: { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 },
    continuous: { enableHighAccuracy: true, timeout: 5000, maximumAge: 3000 }  // 3 sec cache for continuous
};

// ═════════════════════════════════════════════════════════════════════════════
// INITIALIZE MAP
// ═════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupEventListeners();
    setupBottomSheetDrag();
});

function initMap() {
    // Create map with optimized performance for mobile
    map = L.map('map', {
        center: [UNILAG_LAT, UNILAG_LNG],
        zoom: ZOOM_LEVEL,
        minZoom: ZOOM_MIN,
        maxZoom: ZOOM_MAX,
        zoomControl: false,
        tap: false,
        tapTolerance: 15,
        touchZoom: true,
        bounceAtZoomLimits: false,
        inertia: true,
        inertiaDeceleration: 2800,
        inertiaMaxSpeed: 12000,
        easeLinearity: 0.2,
        zoomAnimation: false,  // Disable zoom animation for better mobile performance
        zoomAnimationThreshold: 4,
        wheelPxPerZoomLevel: 100,
        attributionControl: false,  // Remove attribution to save space on mobile
        preferCanvas: true  // Use canvas rendering for better performance
    });

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
    }).addTo(map);

    // Add all vendor markers with teardrop pins
    Object.keys(vendors).forEach(category => {
        vendors[category].forEach(vendor => {
            addVendorMarker(vendor);
        });
    });
}

function addVendorMarker(vendor) {
    const color = categoryColors[vendor.category].fill;
    const icon = createTeardropPin(color, vendor.emoji);
    
    const marker = L.marker([vendor.lat, vendor.lng], { icon }).addTo(map);
    marker.vendorData = vendor;
    
    marker.on('click', () => {
        openPlaceCard(vendor);
    });
    
    allMarkers.push({ marker, vendor });
}

// ═════════════════════════════════════════════════════════════════════════════
// PLACE CARD (BOTTOM SHEET)
// ═════════════════════════════════════════════════════════════════════════════

function openPlaceCard(vendor) {
    currentVendor = vendor;
    
    // Populate place card
    document.getElementById('sheetImage').src = vendor.image;
    document.getElementById('sheetVendorName').textContent = vendor.emoji + ' ' + vendor.name;
    
    // Star rating
    const stars = '★'.repeat(Math.floor(vendor.rating)) + '☆'.repeat(5 - Math.floor(vendor.rating));
    document.getElementById('sheetRating').innerHTML = `
        <span class="star">${stars}</span>
        ${vendor.rating} · ${vendor.reviews} reviews
    `;
    
    document.getElementById('sheetCategory').textContent = categoryColors[vendor.category].label;
    document.getElementById('sheetLocation').textContent = vendor.location;
    document.getElementById('sheetHours').textContent = vendor.hours;
    document.getElementById('sheetPrice').textContent = vendor.price;
    document.getElementById('sheetDescription').textContent = vendor.description;
    
    // Open sheet (peek state on mobile, full on desktop)
    const sheet = document.getElementById('bottomSheet');
    sheet.classList.add('open-peek');
    if (window.innerWidth >= 1024) {
        sheet.classList.add('open-full');
        sheet.classList.remove('open-peek');
    }
    
    // Setup action buttons
    document.getElementById('directionsBtn').onclick = () => {
        getDirections(vendor.lat, vendor.lng, vendor.name);
    };
    
    document.getElementById('shareBtn').onclick = () => {
        shareLocation(vendor.lat, vendor.lng, vendor.name);
    };
}

function closePlaceCard() {
    const sheet = document.getElementById('bottomSheet');
    sheet.classList.remove('open-peek', 'open-full');
    currentVendor = null;
}

// ═════════════════════════════════════════════════════════════════════════════
// SEARCH & FILTERS
// ═════════════════════════════════════════════════════════════════════════════

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('mapSearch');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        performSearch(query);
    });
    
    // Filters
    document.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyFilters();
        });
    });
    
    // Locate me
    document.getElementById('locateBtn').addEventListener('click', locateUser);
    
    // Zoom buttons with debouncing for performance
    let zoomTimeout = null;
    const debounceZoom = (direction) => {
        if (zoomTimeout) return;
        if (direction === 'in') map.zoomIn();
        else map.zoomOut();
        zoomTimeout = setTimeout(() => { zoomTimeout = null; }, 200);
    };
    document.getElementById('zoomInBtn').addEventListener('click', () => debounceZoom('in'));
    document.getElementById('zoomOutBtn').addEventListener('click', () => debounceZoom('out'));
    
    // Center map
    document.getElementById('centerBtn').addEventListener('click', () => {
        map.setView([UNILAG_LAT, UNILAG_LNG], ZOOM_LEVEL);
        // Close place card when centering map
        closePlaceCard();
    });
    
    // Close sheet on background click
    document.getElementById('map').addEventListener('click', (e) => {
        if (e.target.id === 'map') {
            closePlaceCard();
        }
    });
    
    // Close search results when clicking on map
    document.getElementById('map').addEventListener('click', (e) => {
        if (e.target.id === 'map') {
            document.getElementById('searchResults').classList.remove('show');
        }
    });
}

// ═════════════════════════════════════════════════════════════════════════════
// BOTTOM SHEET DRAGGING (MOBILE)
// ═════════════════════════════════════════════════════════════════════════════

function setupBottomSheetDrag() {
    const sheet = document.getElementById('bottomSheet');
    const handle = document.querySelector('.sheet-handle');
    let touchStart = 0;
    let sheetHeight = 0;
    
    if (!handle) return;
    
    handle.addEventListener('touchstart', (e) => {
        touchStart = e.touches[0].clientY;
        sheetHeight = sheet.offsetHeight;
    });
    
    handle.addEventListener('touchmove', (e) => {
        if (!sheet.classList.contains('open-peek')) return;
        
        const touchCurrent = e.touches[0].clientY;
        const diff = touchStart - touchCurrent;
        
        // Allow expanding sheet by dragging up
        if (diff > 50) {
            sheet.classList.remove('open-peek');
            sheet.classList.add('open-full');
        }
    });
    
    handle.addEventListener('touchend', () => {
        // Just toggle between states
    });
}

function performSearch(query) {
    const results = [];
    Object.keys(vendors).forEach(category => {
        vendors[category].forEach(vendor => {
            if (vendor.name.toLowerCase().includes(query) ||
                vendor.location.toLowerCase().includes(query) ||
                vendor.description.toLowerCase().includes(query)) {
                results.push(vendor);
            }
        });
    });
    
    const resultsDiv = document.getElementById('searchResults');
    if (query.length === 0) {
        resultsDiv.classList.remove('show');
        return;
    }
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div style="padding: 1rem; text-align: center; color: #8888aa;">No results found</div>';
    } else {
        resultsDiv.innerHTML = results.map((v, idx) => `
            <div class="search-result-item" onclick="selectVendorFromSearch(${idx})">
                <div>
                    <div class="result-name">${v.emoji} ${v.name}</div>
                    <div class="result-category">${v.location}</div>
                </div>
            </div>
        `).join('');
        
        // Store results globally for reference
        window.searchResultsCache = results;
    }
    resultsDiv.classList.add('show');
}

function selectVendorFromSearch(idx) {
    if (window.searchResultsCache && window.searchResultsCache[idx]) {
        const vendor = window.searchResultsCache[idx];
        document.getElementById('mapSearch').value = '';
        document.getElementById('searchResults').classList.remove('show');
        openPlaceCard(vendor);
        
        // Pan to vendor
        map.panTo([vendor.lat, vendor.lng]);
    }
}

function applyFilters() {
    allMarkers.forEach(({ marker }) => {
        if (activeFilter === 'all') {
            marker.setOpacity(1);
        } else {
            marker.setOpacity(marker.vendorData.category === activeFilter ? 1 : 0.2);
        }
    });
}

// ═════════════════════════════════════════════════════════════════════════════
// LOCATION TRACKING METHODS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * METHOD 1: Single Ad-Hoc Check (High Accuracy, One-Time)
 * Best for: Initial "Locate me" button — quick, precise location discovery
 * Waits for GPS lock with desired accuracy threshold + smoothing
 */
function getSingleLocation(successCallback, errorCallback) {
    if (!navigator.geolocation) {
        errorCallback({ message: 'Geolocation not supported' });
        return;
    }
    
    const BEST_ACCURACY_TARGET = 20;     // Aim for <20m accuracy (like Google Maps)
    const ACCEPTABLE_ACCURACY = 30;     // Accept anything <30m
    const MAX_WAIT_TIME = 60000;        // Wait up to 60 seconds for best fix
    const SMOOTHING_SAMPLES = 5;        // Average 5 readings for stability
    const startTime = Date.now();
    let readings = [];
    let bestCoords = null;
    
    function averageReadings(samples) {
        if (samples.length === 0) return null;
        const avgLat = samples.reduce((sum, r) => sum + r.lat, 0) / samples.length;
        const avgLng = samples.reduce((sum, r) => sum + r.lng, 0) / samples.length;
        const avgAccuracy = samples.reduce((sum, r) => sum + r.accuracy, 0) / samples.length;
        return { lat: avgLat, lng: avgLng, accuracy: avgAccuracy };
    }
    
    function tryGetLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date()
                };
                
                readings.push(coords);
                console.log(`📍 GPS Fix #${readings.length} - Accuracy: ${Math.round(coords.accuracy)}m`);
                bestCoords = coords;
                
                // If we have collected enough samples, average them for stability
                if (readings.length >= SMOOTHING_SAMPLES) {
                    const smoothed = averageReadings(readings);
                    console.log(`✅ Smoothed ${SMOOTHING_SAMPLES} readings: Accuracy ${Math.round(smoothed.accuracy)}m`);
                    successCallback(smoothed);
                    return;
                }
                
                // If we got excellent accuracy on first try, return early
                if (coords.accuracy < ACCEPTABLE_ACCURACY && readings.length === 1) {
                    console.log('⚡ Excellent accuracy on first try!');
                    successCallback(coords);
                    return;
                }
                
                // Keep collecting readings until time runs out
                if (Date.now() - startTime < MAX_WAIT_TIME) {
                    console.log(`⏳ Collecting readings for accuracy: ${Math.round(coords.accuracy)}m / ${BEST_ACCURACY_TARGET}m target...`);
                    setTimeout(tryGetLocation, 1500);  // Try again in 1.5 seconds
                } else {
                    // Time exceeded, use best available
                    if (readings.length >= 2) {
                        const smoothed = averageReadings(readings);
                        console.log(`⚠️ GPS timeout - using averaged ${readings.length} readings: ${Math.round(smoothed.accuracy)}m`);
                        successCallback(smoothed);
                    } else {
                        console.log('⚠️ GPS timeout - using best single fix');
                        successCallback(bestCoords);
                    }
                }
            },
            (error) => {
                console.error('GPS error:', error);
                // Don't give up immediately on error, retry
                if (Date.now() - startTime < MAX_WAIT_TIME) {
                    console.log('🔄 GPS error, retrying...');
                    setTimeout(tryGetLocation, 1500);
                } else {
                    errorCallback(error);
                }
            },
            LOCATION_OPTIONS.singleCheck
        );
    }
    
    tryGetLocation();
}

/**
 * METHOD 2: Continuous Real-Time Tracking (High Accuracy, Streaming)
 * Best for: Active navigation — live updates as user moves
 * Updates every 3 seconds with network error recovery
 */
let trackingRetryCount = 0;
const MAX_TRACKING_RETRIES = 3;

function startContinuousTracking(updateCallback, errorCallback) {
    if (!navigator.geolocation) {
        errorCallback({ message: 'Geolocation not supported' });
        return null;
    }
    
    trackingRetryCount = 0;
    
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            trackingRetryCount = 0;  // Reset retry counter on success
            const coords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                speed: position.coords.speed,
                heading: position.coords.heading,
                timestamp: new Date()
            };
            console.log(`🔄 Location update: ${Math.round(coords.accuracy)}m accuracy`);
            updateCallback(coords);
        },
        (error) => {
            trackingRetryCount++;
            console.error(`❌ Tracking error (attempt ${trackingRetryCount}):`, error.message);
            
            // If network error, try to recover
            if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
                if (trackingRetryCount < MAX_TRACKING_RETRIES) {
                    console.log(`🔄 Retrying tracking... (${trackingRetryCount}/${MAX_TRACKING_RETRIES})`);
                    // Continue watching, will retry automatically
                    return;
                }
            }
            
            // If max retries exceeded, notify user but keep trying
            errorCallback(error);
        },
        LOCATION_OPTIONS.continuous
    );
    
    return watchId;
}

/**
 * Stop continuous tracking and save battery
 */
function stopContinuousTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// USER LOCATION & NAVIGATION
// ═════════════════════════════════════════════════════════════════════════════

function locateUser() {
    const icon = document.getElementById('locateIcon');
    
    // Show that we're waiting for GPS
    showToast('📡 Searching for GPS signal...', 'info');
    icon.innerHTML = 'settings';  // Loading spinner icon
    
    getSingleLocation(
        (coords) => {
            console.log('✅ Location received:', coords);
            userLatLng = { lat: coords.lat, lng: coords.lng };
            
            // Create/update user avatar marker
            if (userMarker) map.removeLayer(userMarker);
            userMarker = L.marker([coords.lat, coords.lng], { icon: createUserAvatar() }).addTo(map);
            
            // Zoom to user location
            map.setView([coords.lat, coords.lng], 17);
            
            // Add accuracy circle visualization (optional)
            L.circle([coords.lat, coords.lng], {
                radius: coords.accuracy,
                color: '#1a6b3c',
                weight: 2,
                opacity: 0.2,
                fill: true,
                fillColor: '#1a6b3c',
                fillOpacity: 0.05
            }).addTo(map);
            
            icon.innerHTML = 'my_location';
            showToast(`📍 Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)} (±${Math.round(coords.accuracy)}m)`, 'success');
        },
        (error) => {
            console.error('❌ Location error:', error);
            icon.innerHTML = 'location_disabled';
            showToast('Error: ' + error.message, 'error');
        }
    );
}

function getDirections(lat, lng, name) {
    if (!userLatLng) {
        showToast('Please tap "Locate me" first', 'info');
        return;
    }
    
    trackingDestination = { lat, lng, name };
    isTracking = true;
    trackingErrorCount = 0;  // Reset error counter
    
    // Show navigation banner
    const banner = document.getElementById('navBanner');
    banner.classList.add('show');
    
    // Start continuous real-time tracking (METHOD 2)
    startContinuousTracking(
        (coords) => {
            updateTracking(coords);
        },
        (error) => {
            handleTrackingError(error);
        }
    );
    
    // Setup routing
    if (routingControl) map.removeControl(routingControl);
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(userLatLng.lat, userLatLng.lng),
            L.latLng(lat, lng)
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: true,
        lineOptions: {
            styles: [{ color: '#1a6b3c', weight: 5, opacity: 0.85 }]
        },
        createMarker: () => null,  // Don't show default markers
        router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' })
    }).addTo(map);
    
    closePlaceCard();
}

let lastKnownPosition = null;  // Fallback position if tracking fails
let trackingErrorCount = 0;

let lastUpdateTime = 0;
const UPDATE_THROTTLE = 1000;  // Update UI every 1 second to reduce repaints

function updateTracking(coords) {
    lastKnownPosition = { lat: coords.lat, lng: coords.lng };  // Store fallback
    userLatLng = { lat: coords.lat, lng: coords.lng };
    trackingErrorCount = 0;  // Reset error counter on successful update
    
    // Update marker immediately (smooth movement)
    if (userMarker) {
        userMarker.setLatLng([coords.lat, coords.lng]);
    }
    
    if (trackingDestination) {
        const distance = map.distance(
            [coords.lat, coords.lng],
            [trackingDestination.lat, trackingDestination.lng]
        );
        
        // Check arrival
        if (distance < ARRIVAL_THRESHOLD_M) {
            stopNavigation();
            showToast('🎉 You arrived!', 'success');
            return;
        }
        
        // Throttle banner updates to reduce repaints (every 1 second)
        const now = Date.now();
        if (now - lastUpdateTime > UPDATE_THROTTLE) {
            lastUpdateTime = now;
            const mins = Math.ceil(distance / 1.4 / 60);  // ~1.4 m/s walking speed
            document.getElementById('navDestination').textContent = `🟢 Navigating to ${trackingDestination.name}`;
            document.getElementById('navDetails').textContent = `${Math.round(distance)}m away · ~${mins} min walk · Accuracy: ±${Math.round(coords.accuracy)}m`;
        }
        
        // Reroute occasionally
        if (Date.now() - lastRerouteTime > REROUTE_INTERVAL_MS) {
            lastRerouteTime = Date.now();
            // Reroute with new current position
        }
    }
}

function handleTrackingError(error) {
    trackingErrorCount++;
    console.error(`⚠️ Navigation error #${trackingErrorCount}:`, error.message);
    
    // Use last known position as fallback if available
    if (lastKnownPosition) {
        console.log('🔄 Using last known position as fallback...');
        // Keep showing last known position
        if (userMarker) {
            userMarker.setLatLng([lastKnownPosition.lat, lastKnownPosition.lng]);
        }
    }
    
    // Show error if too many consecutive failures
    if (trackingErrorCount >= 3) {
        showToast('⚠️ Network issue - using last position', 'warning');
    }
}

function stopNavigation() {
    isTracking = false;
    stopContinuousTracking();  // Uses METHOD 2 cleanup
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    document.getElementById('navBanner').classList.remove('show');
    document.getElementById('navStopBtn').onclick = null;
}

document.getElementById('navStopBtn').onclick = stopNavigation;

// Safety check for all DOM elements before attaching listeners
document.addEventListener('DOMContentLoaded', () => {
    const navStopBtn = document.getElementById('navStopBtn');
    if (navStopBtn) {
        navStopBtn.onclick = stopNavigation;
    }
});

function shareLocation(lat, lng, name) {
    const text = `Check out ${name} on Unilag Campus! lat: ${lat}, lng: ${lng}`;
    if (navigator.share) {
        navigator.share({ title: 'MAZI-EATS', text, url: window.location.href });
    } else {
        const url = `https://maps.google.com/?q=${lat},${lng}`;
        prompt('Share this location:', url);
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// MANUAL LOCATION INPUT (DEBUG/TESTING)
// ═════════════════════════════════════════════════════════════════════════════

function setManualLocation() {
    const lat = prompt('Enter latitude:');
    const lng = prompt('Enter longitude:');
    
    if (lat && lng) {
        const coords = {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            accuracy: 5,
            timestamp: new Date()
        };
        
        console.log('🎯 Manual location set:', coords);
        userLatLng = { lat: coords.lat, lng: coords.lng };
        
        // Create/update user avatar marker
        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.marker([coords.lat, coords.lng], { icon: createUserAvatar() }).addTo(map);
        
        // Zoom to location
        map.setView([coords.lat, coords.lng], 17);
        
        // Add accuracy circle
        L.circle([coords.lat, coords.lng], {
            radius: coords.accuracy,
            color: '#1a6b3c',
            weight: 2,
            opacity: 0.2,
            fill: true,
            fillColor: '#1a6b3c',
            fillOpacity: 0.05
        }).addTo(map);
        
        showToast(`📍 Manual location set: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`, 'success');
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═════════════════════════════════════════════════════════════════════════════

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add distance method to map if not present
if (!L.Map.prototype.distance) {
    L.Map.prototype.distance = function(latlng1, latlng2) {
        const R = 6371e3;  // Earth's radius in meters
        const φ1 = (latlng1[0] * Math.PI) / 180;
        const φ2 = (latlng2[0] * Math.PI) / 180;
        const Δφ = ((latlng2[0] - latlng1[0]) * Math.PI) / 180;
        const Δλ = ((latlng2[1] - latlng1[1]) * Math.PI) / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };
}


