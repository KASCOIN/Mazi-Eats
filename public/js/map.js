// MAZI-EATS Campus Map — Google Maps Style
// Full-screen map with bottom sheet place cards, user avatar tracking, and teardrop pins

// ═════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═════════════════════════════════════════════════════════════════════════════

const UNILAG_LAT = 6.6;
const UNILAG_LNG = 3.4;
const ZOOM_LEVEL = 16;

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
        className: '',
        html: `
            <div style="
                position: relative;
                width: 36px;
                height: 36px;
            ">
                <div style="
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #1a6b3c, #2d9158);
                    border-radius: 50%;
                    border: 3px solid #fff;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                ">
                    🧑‍🎓
                </div>
                <div style="
                    position: absolute;
                    bottom: -4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 8px;
                    height: 8px;
                    background: #1a6b3c;
                    border-radius: 50%;
                    border: 2px solid #fff;
                "></div>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
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

// ═════════════════════════════════════════════════════════════════════════════
// INITIALIZE MAP
// ═════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupEventListeners();
    setupBottomSheetDrag();
});

function initMap() {
    // Create map with bounds restriction
    map = L.map('map', {
        center: [UNILAG_LAT, UNILAG_LNG],
        zoom: ZOOM_LEVEL,
        minZoom: 15,
        maxZoom: 19,
        maxBounds: UNILAG_BOUNDS,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
        tap: false,
        tapTolerance: 15,
        touchZoom: true,
        bounceAtZoomLimits: false,
        inertia: true,
        inertiaDeceleration: 3000,
        inertiaMaxSpeed: 1500,
        easeLinearity: 0.25,
        zoomAnimation: true,
        zoomAnimationThreshold: 4,
        wheelPxPerZoomLevel: 80
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
    
    // Zoom buttons
    document.getElementById('zoomInBtn').addEventListener('click', () => map.zoomIn());
    document.getElementById('zoomOutBtn').addEventListener('click', () => map.zoomOut());
    
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
// USER LOCATION & NAVIGATION
// ═════════════════════════════════════════════════════════════════════════════

function locateUser() {
    if (!navigator.geolocation) {
        showToast('Geolocation not supported', 'error');
        return;
    }
    
    const btn = document.getElementById('locateBtn');
    btn.textContent = '⏳';
    
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            userLatLng = { lat, lng };
            
            // Create avatar marker (silently, no popup, no address)
            if (userMarker) map.removeLayer(userMarker);
            userMarker = L.marker([lat, lng], { icon: createUserAvatar() }).addTo(map);
            
            // Pan to user, don't zoom
            map.panTo([lat, lng]);
            
            btn.textContent = '🧑‍🎓';
            showToast('Location found', 'success');
        },
        () => {
            btn.textContent = '🧑‍🎓';
            showToast('Unable to get location', 'error');
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
    
    // Show navigation banner
    const banner = document.getElementById('navBanner');
    banner.classList.add('show');
    
    // Start live tracking
    watchId = navigator.geolocation.watchPosition(
        (pos) => updateTracking(pos),
        null,
        { enableHighAccuracy: true, maximumAge: 5000 }
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

function updateTracking(pos) {
    userLatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    
    if (userMarker) {
        userMarker.setLatLng([userLatLng.lat, userLatLng.lng]);
    }
    
    if (trackingDestination) {
        const distance = map.distance(
            [userLatLng.lat, userLatLng.lng],
            [trackingDestination.lat, trackingDestination.lng]
        );
        
        // Check arrival
        if (distance < ARRIVAL_THRESHOLD_M) {
            stopNavigation();
            showToast('🎉 You arrived!', 'success');
            return;
        }
        
        // Update banner (no address, just destination + distance + ETA)
        const mins = Math.ceil(distance / 1.4 / 60);  // ~1.4 m/s walking speed
        const banner = document.getElementById('navBanner');
        document.getElementById('navDestination').textContent = `🟢 Navigating to ${trackingDestination.name}`;
        document.getElementById('navDetails').textContent = `${Math.round(distance)}m away · ~${mins} min walk`;
        
        // Reroute occasionally
        if (Date.now() - lastRerouteTime > REROUTE_INTERVAL_MS) {
            lastRerouteTime = Date.now();
            // Reroute with new current position
        }
    }
}

function stopNavigation() {
    isTracking = false;
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    document.getElementById('navBanner').classList.remove('show');
    document.getElementById('navStopBtn').onclick = null;
}

document.getElementById('navStopBtn').onclick = stopNavigation;

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


