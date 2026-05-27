// MAZI-EATS Campus Map — map.js
// Features: User location, routing/directions, search, rich popups, filters

const UNILAG_LAT = 6.5158;
const UNILAG_LNG = 3.3862;
const ZOOM_LEVEL = 16;

// Nominatim API (OpenStreetMap) - Free reverse geocoding, no API key needed
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/reverse';

// ─── Vendor Data ────────────────────────────────────────────────────────────
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
            emoji: '🏪'
        },
        {
            name: 'SUB Mini Mart',
            lat: 6.5150, lng: 3.3850,
            category: 'store',
            location: 'Student Union Building',
            hours: '7:00am – 8:00pm',
            price: '₦100 – ₦3,000',
            description: 'Wide variety of provisions, drinks, and snacks. Very accessible from most faculties.',
            emoji: '🏪'
        },
        {
            name: 'Main Gate Provisions',
            lat: 6.5140, lng: 3.3820,
            category: 'store',
            location: 'Near main entrance',
            hours: '8:00am – 7:00pm',
            price: '₦150 – ₦4,000',
            description: 'Affordable prices on everyday grocery items. Popular with off-campus students.',
            emoji: '🏪'
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
            emoji: '🍽️'
        },
        {
            name: 'Senate Canteen',
            lat: 6.5160, lng: 3.3880,
            category: 'restaurant',
            location: 'Near Senate Building',
            hours: '10:00am – 8:00pm',
            price: '₦2,000 – ₦3,500',
            description: 'Central location, good jollof rice and soups. Quick service during lunch rush.',
            emoji: '🍽️'
        },
        {
            name: 'Moremi Hall Cafeteria',
            lat: 6.5155, lng: 3.3870,
            category: 'restaurant',
            location: 'Moremi Hall',
            hours: '7:00am – 9:00pm',
            price: '₦1,500 – ₦3,000',
            description: 'Affordable breakfast and lunch options. Eba, egusi, and pepper soup available daily.',
            emoji: '🍽️'
        },
        {
            name: 'Queen Amina Cafeteria',
            lat: 6.5145, lng: 3.3860,
            category: 'restaurant',
            location: 'Queen Amina Hall',
            hours: '7:00am – 9:00pm',
            price: '₦1,500 – ₦3,000',
            description: 'Budget-friendly hall cafeteria. Daily specials change each morning.',
            emoji: '🍽️'
        },
        {
            name: 'FAD Canteen',
            lat: 6.5152, lng: 3.3855,
            category: 'restaurant',
            location: 'Faculty of Arts & Design',
            hours: '10:00am – 8:00pm',
            price: '₦2,000 – ₦3,500',
            description: 'Quiet spot with art-themed interior. Good food, great for studying between bites.',
            emoji: '🍽️'
        }
    ],
    snacks: [
        {
            name: 'Suya Spot',
            lat: 6.5168, lng: 3.3895,
            category: 'snack',
            location: 'Behind Sports Centre',
            hours: '2:00pm – 10:00pm',
            price: '₦500 – ₦1,000',
            description: 'Best suya on campus. Beef, chicken, and kidney available. Very busy on Friday evenings.',
            emoji: '🔥'
        },
        {
            name: 'Shawarma Stand',
            lat: 6.5148, lng: 3.3858,
            category: 'snack',
            location: 'Near Law Faculty',
            hours: '12:00pm – 9:00pm',
            price: '₦1,000 – ₦1,500',
            description: 'Chicken and beef shawarma. Fresh ingredients daily. Often has a queue after 4pm.',
            emoji: '🌯'
        },
        {
            name: 'Buka Row',
            lat: 6.5130, lng: 3.3840,
            category: 'snack',
            location: 'Off-campus, Unilag Road',
            hours: '11:00am – 10:00pm',
            price: '₦1,500 – ₦3,000',
            description: 'Row of local buka restaurants just outside the gate. Amala, ewedu, stew done right.',
            emoji: '🍲'
        },
        {
            name: 'Puff-Puff Junction',
            lat: 6.5142, lng: 3.3868,
            category: 'snack',
            location: 'Near Lagoon Front',
            hours: '3:00pm – 9:00pm',
            price: '₦100 – ₦300',
            description: 'Fresh hot puff-puff and akara. The cheapest snack on campus. Great lagoon view.',
            emoji: '🟡'
        }
    ]
};

// ─── Colors per category ────────────────────────────────────────────────────
const categoryColors = {
    store: { fill: '#2e7d32', header: 'linear-gradient(135deg, #2e7d32, #1b5e20)', label: 'Food Store' },
    restaurant: { fill: '#c62828', header: 'linear-gradient(135deg, #c62828, #7f0000)', label: 'Restaurant' },
    snack: { fill: '#e65100', header: 'linear-gradient(135deg, #e65100, #bf360c)', label: 'Snack Point' }
};

// ─── State ──────────────────────────────────────────────────────────────────
let map;
let allMarkers = [];
let userMarker = null;
let userLatLng = null;
let routingControl = null;
let activeFilter = 'all';
let unilagMarker = null;

// Zoom-based marker scaling
const BASE_VENDOR_SIZE = 45;
const BASE_USER_SIZE = 16;
const BASE_UNILAG_SIZE = 30;
const BASE_FONT_SIZE = 24;
const BASE_ZOOM = 16; // Reference zoom level

// Live tracking state
let watchId = null;
let trackingDestination = null;
let trackingAccuracyCircle = null;
let trackingAccCircle = null;
let isTracking = false;
let lastRerouteTime = 0;
const REROUTE_INTERVAL_MS = 15000;    // reroute every 15 seconds while moving
const OFF_ROUTE_THRESHOLD_M = 50;     // reroute if user drifts 50m from route

// ─── Calculate marker size based on zoom level ──────────────────────────────
function calculateMarkerSize(baseSize, currentZoom) {
    const zoomDiff = currentZoom - BASE_ZOOM;
    return Math.max(baseSize * Math.pow(1.15, zoomDiff), baseSize * 0.5);
}

// ─── Update all markers on zoom ─────────────────────────────────────────────
function updateMarkersOnZoom() {
    const currentZoom = map.getZoom();
    
    // Update vendor markers
    allMarkers.forEach(({ marker, vendor }) => {
        const newSize = calculateMarkerSize(BASE_VENDOR_SIZE, currentZoom);
        const fontSize = calculateMarkerSize(BASE_FONT_SIZE, currentZoom);
        const color = categoryColors[vendor.category].fill;
        
        const newIcon = L.divIcon({
            html: `<div style="background: ${color}; width: ${newSize}px; height: ${newSize}px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid white; font-size: ${fontSize}px; box-shadow: 0 3px 10px rgba(0,0,0,0.3); cursor: pointer;">${vendor.emoji}</div>`,
            iconSize: [newSize, newSize],
            iconAnchor: [newSize / 2, newSize / 2],
            popupAnchor: [0, -newSize / 2],
            className: ''
        });
        marker.setIcon(newIcon);
    });
    
    // Update user marker
    if (userMarker) {
        const newUserSize = calculateMarkerSize(BASE_USER_SIZE, currentZoom);
        const userIcon = L.divIcon({
            className: '',
            html: `<div class="user-location-pulse"></div>`,
            iconSize: [newUserSize, newUserSize],
            iconAnchor: [newUserSize / 2, newUserSize / 2]
        });
        userMarker.setIcon(userIcon);
    }
    
    // Update UNILAG center marker
    if (unilagMarker) {
        const newUnilagSize = calculateMarkerSize(BASE_UNILAG_SIZE, currentZoom);
        const unilagIcon = L.divIcon({
            className: '',
            html: `<div style="background:linear-gradient(135deg,#1a6b3c,#0d4a28);color:#fff;padding:6px 10px;border-radius:20px;font-size:${Math.max(11, 11 * calculateMarkerSize(1, currentZoom))}px;font-weight:700;white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,0.25);border:2px solid #fff;">🎓 Unilag</div>`,
            iconAnchor: [newUnilagSize, 15]
        });
        unilagMarker.setIcon(unilagIcon);
    }
}

// ─── Init Map ───────────────────────────────────────────────────────────────
function initMap() {
    map = L.map('map', { zoomControl: false }).setView([UNILAG_LAT, UNILAG_LNG], ZOOM_LEVEL);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);

    // Zoom control top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Add all vendor markers
    Object.keys(vendors).forEach(category => {
        vendors[category].forEach(vendor => {
            addVendorMarker(vendor);
        });
    });

    // Unilag center marker
    const unilagIcon = L.divIcon({
        className: '',
        html: `<div style="background:linear-gradient(135deg,#1a6b3c,#0d4a28);color:#fff;padding:6px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,0.25);border:2px solid #fff;">🎓 Unilag</div>`,
        iconAnchor: [40, 15]
    });
    unilagMarker = L.marker([UNILAG_LAT, UNILAG_LNG], { icon: unilagIcon }).addTo(map);

    // Add zoom event listener for marker scaling
    map.on('zoom', updateMarkersOnZoom);

    setupFilters();
    setupSearch();
    setupLocateBtn();
    setupClearRoute();
}

// ─── Add Marker ─────────────────────────────────────────────────────────────
function addVendorMarker(vendor) {
    const color = categoryColors[vendor.category].fill;

    // Create custom emoji icon marker
    const icon = L.divIcon({
        html: `<div style="background: ${color}; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid white; font-size: 24px; box-shadow: 0 3px 10px rgba(0,0,0,0.3); cursor: pointer;">${vendor.emoji}</div>`,
        iconSize: [45, 45],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
        className: ''
    });

    const marker = L.marker([vendor.lat, vendor.lng], { icon }).addTo(map);

    marker.vendorData = vendor;

    marker.on('click', () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            openDrawer(vendor);
        } else {
            marker.bindPopup(buildPopupHTML(vendor), {
                maxWidth: 300,
                className: 'mazi-popup'
            }).openPopup();
        }
    });

    allMarkers.push({ marker, vendor });
}

// ─── Popup HTML ─────────────────────────────────────────────────────────────
function buildPopupHTML(vendor) {
    const colors = categoryColors[vendor.category];
    return `
        <div>
            <div class="popup-header" style="background:${colors.header}">
                <div class="popup-category-badge">${colors.label}</div>
                <p class="popup-name">${vendor.emoji} ${vendor.name}</p>
            </div>
            <div class="popup-body">
                <div class="popup-info-row"><span class="popup-info-icon">📍</span><span>${vendor.location}</span></div>
                <div class="popup-info-row"><span class="popup-info-icon">🕐</span><span>${vendor.hours}</span></div>
                <div class="popup-info-row"><span class="popup-info-icon">💰</span><span>${vendor.price}</span></div>
                <div class="popup-info-row"><span class="popup-info-icon">ℹ️</span><span>${vendor.description}</span></div>
                <div class="popup-actions">
                    <button class="popup-btn popup-btn-primary" onclick="getDirections(${vendor.lat}, ${vendor.lng}, '${vendor.name.replace(/'/g, "\\'")}')">
                        🗺️ Directions
                    </button>
                    <button class="popup-btn popup-btn-secondary" onclick="shareLocation(${vendor.lat}, ${vendor.lng}, '${vendor.name.replace(/'/g, "\\'")}')">
                        📤 Share
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ─── Mobile Drawer ──────────────────────────────────────────────────────────
function openDrawer(vendor) {
    const colors = categoryColors[vendor.category];
    const content = document.getElementById('drawerContent');
    content.innerHTML = `
        <div style="background:${colors.header};color:#fff;padding:1rem;border-radius:12px;margin-bottom:1rem;">
            <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;opacity:0.8;margin-bottom:0.3rem;">${colors.label}</div>
            <div style="font-size:1.1rem;font-weight:700;">${vendor.emoji} ${vendor.name}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.6rem;margin-bottom:1rem;">
            <div style="display:flex;gap:0.5rem;align-items:flex-start;font-size:0.875rem;color:#4a4a6a;">
                <span>📍</span><span>${vendor.location}</span>
            </div>
            <div style="display:flex;gap:0.5rem;align-items:flex-start;font-size:0.875rem;color:#4a4a6a;">
                <span>🕐</span><span>${vendor.hours}</span>
            </div>
            <div style="display:flex;gap:0.5rem;align-items:flex-start;font-size:0.875rem;color:#4a4a6a;">
                <span>💰</span><span>${vendor.price}</span>
            </div>
            <div style="display:flex;gap:0.5rem;align-items:flex-start;font-size:0.875rem;color:#4a4a6a;">
                <span>ℹ️</span><span>${vendor.description}</span>
            </div>
        </div>
        <div style="display:flex;gap:0.75rem;">
            <button onclick="getDirections(${vendor.lat}, ${vendor.lng}, '${vendor.name.replace(/'/g, "\\'")}'); document.getElementById('bottomDrawer').classList.remove('open');"
                style="flex:1;padding:0.75rem;background:${colors.fill};color:#fff;border:none;border-radius:12px;font-size:0.875rem;font-weight:600;cursor:pointer;">
                🗺️ Get Directions
            </button>
            <button onclick="shareLocation(${vendor.lat}, ${vendor.lng}, '${vendor.name.replace(/'/g, "\\'")}');"
                style="flex:1;padding:0.75rem;background:#f7faf8;color:#4a4a6a;border:1px solid #e8f0eb;border-radius:12px;font-size:0.875rem;font-weight:600;cursor:pointer;">
                📤 Share
            </button>
        </div>
    `;
    document.getElementById('bottomDrawer').classList.add('open');
    map.panTo([vendor.lat, vendor.lng]);
}

// ─── Directions & Live Tracking ──────────────────────────────────────────────
function getDirections(destLat, destLng, name) {
    if (!userLatLng) {
        showToast('Please tap "Locate Me" first to get directions.', 'info');
        locateUser(() => getDirections(destLat, destLng, name));
        return;
    }

    clearRoute();
    trackingDestination = { lat: destLat, lng: destLng, name };
    drawRoute(userLatLng.lat, userLatLng.lng, destLat, destLng, name);
    startLiveTracking(destLat, destLng, name);
    document.getElementById('clearRouteBtn').classList.add('show');
}

function drawRoute(fromLat, fromLng, destLat, destLng, name) {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(fromLat, fromLng),
            L.latLng(destLat, destLng)
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: true,
        lineOptions: {
            styles: [{ color: '#1a6b3c', weight: 5, opacity: 0.85 }]
        },
        createMarker: (i, wp) => {
            // Only show destination marker, not origin (we have the pulse dot)
            if (i === 1) {
                const destMarkerSize = calculateMarkerSize(14, map.getZoom());
                return L.marker(wp.latLng, {
                    icon: L.divIcon({
                        className: '',
                        html: `<div style="background:#c62828;width:${destMarkerSize}px;height:${destMarkerSize}px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
                        iconSize: [destMarkerSize, destMarkerSize],
                        iconAnchor: [destMarkerSize / 2, destMarkerSize / 2]
                    })
                });
            }
            return null;
        },
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
        })
    }).addTo(map);

    routingControl.on('routesfound', (e) => {
        const route = e.routes[0];
        const distM = route.summary.totalDistance;
        const mins = Math.ceil(route.summary.totalTime / 60);
        const distDisplay = distM < 1000
            ? `${Math.round(distM)}m`
            : `${(distM / 1000).toFixed(2)}km`;

        updateTrackingBanner(name, distDisplay, mins);
        showToast(`Navigating to ${name} — ${distDisplay}, ~${mins} min`, 'success');
    });

    routingControl.on('routingerror', () => {
        showToast('Could not calculate route. Check your connection.', 'error');
    });
}

function startLiveTracking(destLat, destLng, name) {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }

    isTracking = true;
    showTrackingBanner(name);

    watchId = navigator.geolocation.watchPosition(
        (pos) => {
            const newLat = pos.coords.latitude;
            const newLng = pos.coords.longitude;
            const accuracy = pos.coords.accuracy;

            userLatLng = { lat: newLat, lng: newLng };

            // Update user marker position
            if (userMarker) {
                userMarker.setLatLng([newLat, newLng]);
            }

            // Update accuracy circle
            if (trackingAccuracyCircle) {
                map.removeLayer(trackingAccuracyCircle);
            }
            trackingAccuracyCircle = L.circle([newLat, newLng], {
                radius: accuracy,
                color: '#2196F3',
                fillColor: '#2196F3',
                fillOpacity: 0.08,
                weight: 1,
                dashArray: '4'
            }).addTo(map);

            // Keep map centered on user while tracking
            map.panTo([newLat, newLng], { animate: true, duration: 0.5 });

            // Check if arrived (within 20 metres)
            const distToDestM = getDistanceM(newLat, newLng, destLat, destLng);
            if (distToDestM < 20) {
                arrivalHandler(name);
                return;
            }

            // Reroute if enough time has passed
            const now = Date.now();
            if (now - lastRerouteTime > REROUTE_INTERVAL_MS) {
                lastRerouteTime = now;
                drawRoute(newLat, newLng, destLat, destLng, name);
            }
        },
        (err) => {
            if (err.code === 1) {
                showToast('Location permission denied. Cannot track movement.', 'error');
                stopTracking();
            }
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 8000
        }
    );
}

function stopTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    if (trackingAccuracyCircle) {
        map.removeLayer(trackingAccuracyCircle);
        trackingAccuracyCircle = null;
    }
    isTracking = false;
    trackingDestination = null;
    hideTrackingBanner();
}

function clearRoute() {
    stopTracking();
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    document.getElementById('clearRouteBtn').classList.remove('show');
}

function setupClearRoute() {
    document.getElementById('clearRouteBtn').addEventListener('click', () => {
        clearRoute();
        showToast('Navigation stopped.', 'info');
    });
}

// ─── Arrival Handler ─────────────────────────────────────────────────────────
function arrivalHandler(name) {
    stopTracking();
    clearRoute();
    showToast(`🎉 You have arrived at ${name}! Enjoy your meal.`, 'success');

    // Show a prominent arrival popup on the map
    const arrivedPopup = L.popup({ closeButton: true, className: 'mazi-popup' })
        .setLatLng([userLatLng.lat, userLatLng.lng])
        .setContent(`
            <div style="text-align:center;padding:1rem;">
                <div style="font-size:2rem;margin-bottom:0.5rem;">🎉</div>
                <div style="font-weight:700;font-size:1rem;color:#1a6b3c;">You've arrived!</div>
                <div style="font-size:0.85rem;color:#4a4a6a;margin-top:0.25rem;">${name}</div>
            </div>
        `)
        .openOn(map);

    setTimeout(() => map.closePopup(arrivedPopup), 5000);
}

// ─── Tracking Banner ──────────────────────────────────────────────────────────
function showTrackingBanner(name) {
    let banner = document.getElementById('trackingBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'trackingBanner';
        banner.style.cssText = `
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            background: linear-gradient(135deg, #1a6b3c, #0d4a28);
            color: #fff;
            padding: 0.6rem 1.25rem;
            border-radius: 50px;
            font-size: 0.825rem;
            font-weight: 600;
            box-shadow: 0 4px 16px rgba(26,107,60,0.4);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            white-space: nowrap;
            max-width: 90vw;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        document.body.appendChild(banner);
    }
    banner.innerHTML = `<span style="animation:pulse 1.5s infinite">📍</span> <span id="bannerText">Navigating to ${name}…</span>`;
    banner.style.display = 'flex';
}

function updateTrackingBanner(name, dist, mins) {
    const text = document.getElementById('bannerText');
    if (text) text.textContent = `${name} — ${dist} away (~${mins} min)`;
}

function hideTrackingBanner() {
    const banner = document.getElementById('trackingBanner');
    if (banner) banner.style.display = 'none';
}

// ─── Distance Helper (Haversine) ─────────────────────────────────────────────
function getDistanceM(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Get Address from Coordinates (Nominatim OSM) ─────────────────────────
async function getAddressFromCoordinates(lat, lng) {
    try {
        const url = `${NOMINATIM_API}?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mazi-Eats/1.0 (your@email.com)'
            }
        });
        const data = await response.json();
        if (data && data.display_name) {
            // Use the most relevant part of the address
            const address = data.address;
            // Prefer road + suburb + city, fallback to display_name
            let mainLocation = '';
            if (address.road) mainLocation += address.road + ', ';
            if (address.suburb) mainLocation += address.suburb + ', ';
            if (address.city) mainLocation += address.city;
            if (!mainLocation) mainLocation = data.display_name;
            return mainLocation;
        }
        return 'Location found';
    } catch (error) {
        console.error('Error fetching address:', error);
        return 'Location found';
    }
}

// ─── User Location ───────────────────────────────────────────────────────────
function locateUser(callback) {
    const btn = document.getElementById('locateBtn');
    btn.classList.add('locating');
    btn.textContent = '📍 Locating...';

    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser.', 'error');
        btn.classList.remove('locating');
        btn.textContent = '📍 Locate Me';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const accuracy = pos.coords.accuracy;
            userLatLng = { lat, lng };

            // Warn user if accuracy is worse than 100 metres
            if (accuracy > 100) {
                showToast(`⚠️ Low GPS accuracy (±${Math.round(accuracy)}m). Move outside for better signal.`, 'info');
            }

            // Draw accuracy circle
            if (trackingAccCircle) map.removeLayer(trackingAccCircle);
            trackingAccCircle = L.circle([lat, lng], {
                radius: accuracy,
                color: '#2196F3',
                fillColor: '#2196F3',
                fillOpacity: 0.1,
                weight: 1.5,
                dashArray: '5 4'
            }).addTo(map);

            if (userMarker) map.removeLayer(userMarker);

            const userSize = calculateMarkerSize(BASE_USER_SIZE, map.getZoom());
            const pulseIcon = L.divIcon({
                className: '',
                html: `<div class="user-location-pulse"></div>`,
                iconSize: [userSize, userSize],
                iconAnchor: [userSize / 2, userSize / 2]
            });

            userMarker = L.marker([userLatLng.lat, userLatLng.lng], { icon: pulseIcon }).addTo(map);
            
            // Show loading state first
            let popupContent = `
                <div class="user-location-popup">
                    <div class="popup-header">
                        <span class="popup-icon">📍</span>
                        <h3 class="popup-title">Your Location</h3>
                    </div>
                    <div class="popup-body">
                        <p class="popup-address">
                            <span class="loading-spinner">⟳</span> Finding address...
                        </p>
                        <p class="popup-hint">📌 Tap a vendor marker for directions</p>
                    </div>
                </div>
            `;
            userMarker.bindPopup(popupContent, { 
                maxWidth: 280,
                className: 'user-location-popup-container'
            }).openPopup();

            // Fetch and update with actual address
            getAddressFromCoordinates(userLatLng.lat, userLatLng.lng).then(address => {
                popupContent = `
                    <div class="user-location-popup">
                        <div class="popup-header">
                            <span class="popup-icon">📍</span>
                            <h3 class="popup-title">Your Location</h3>
                        </div>
                        <div class="popup-body">
                            <p class="popup-address">
                                ${address}
                            </p>
                            <p class="popup-hint">📌 Tap a vendor marker for directions</p>
                        </div>
                    </div>
                `;
                userMarker.setPopupContent(popupContent);
            });

            map.setView([userLatLng.lat, userLatLng.lng], 17);

            btn.classList.remove('locating');
            btn.textContent = '✅ Located';
            setTimeout(() => { btn.textContent = '📍 Locate Me'; }, 3000);

            showToast('Location found! Tap a vendor marker for directions.', 'success');

            if (callback) callback();
        },
        (err) => {
            btn.classList.remove('locating');
            btn.textContent = '📍 Locate Me';
            const messages = {
                1: 'Location permission denied. Please allow location access.',
                2: 'Location unavailable. Try again.',
                3: 'Location request timed out. Try again.'
            };
            showToast(messages[err.code] || 'Could not get your location.', 'error');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
}

function setupLocateBtn() {
    document.getElementById('locateBtn').addEventListener('click', () => locateUser());
}

// ─── Filters ─────────────────────────────────────────────────────────────────
function setupFilters() {
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeFilter = pill.dataset.filter;
            applyFilter(activeFilter);
        });
    });
}

function applyFilter(filter) {
    allMarkers.forEach(({ marker, vendor }) => {
        const categoryMap = { stores: 'store', restaurants: 'restaurant', snacks: 'snack' };
        const show = filter === 'all' || categoryMap[filter] === vendor.category;
        if (show) {
            if (!map.hasLayer(marker)) marker.addTo(map);
        } else {
            if (map.hasLayer(marker)) map.removeLayer(marker);
        }
    });
}

// ─── Search ──────────────────────────────────────────────────────────────────
function setupSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    let debounceTimer;

    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = input.value.trim().toLowerCase();

        if (query.length < 2) {
            results.classList.remove('show');
            return;
        }

        debounceTimer = setTimeout(() => searchVendors(query), 300);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            results.classList.remove('show');
            input.blur();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            results.classList.remove('show');
        }
    });
}

function searchVendors(query) {
    const results = document.getElementById('searchResults');
    const allVendors = [
        ...vendors.stores,
        ...vendors.restaurants,
        ...vendors.snacks
    ];

    const matches = allVendors.filter(v =>
        v.name.toLowerCase().includes(query) ||
        v.location.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        categoryColors[v.category].label.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        results.innerHTML = `<div class="search-result-item" style="color:#8888aa;justify-content:center;">No vendors found for "${query}"</div>`;
        results.classList.add('show');
        return;
    }

    results.innerHTML = matches.map(vendor => {
        const color = categoryColors[vendor.category].fill;
        const label = categoryColors[vendor.category].label;
        return `
            <div class="search-result-item" onclick="selectSearchResult(${vendor.lat}, ${vendor.lng}, '${vendor.name.replace(/'/g, "\\'")}')">
                <div class="search-result-icon" style="background:${color}20;color:${color};">${vendor.emoji}</div>
                <div class="search-result-info">
                    <div class="search-result-name">${vendor.name}</div>
                    <div class="search-result-sub">${label} · ${vendor.location}</div>
                </div>
                <div style="font-size:0.75rem;color:#8888aa;">${vendor.price}</div>
            </div>
        `;
    }).join('');

    results.classList.add('show');
}

function selectSearchResult(lat, lng, name) {
    document.getElementById('searchResults').classList.remove('show');
    document.getElementById('searchInput').value = name;

    map.setView([lat, lng], 18, { animate: true });

    const found = allMarkers.find(({ vendor }) =>
        vendor.lat === lat && vendor.lng === lng
    );

    if (found) {
        setTimeout(() => {
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                openDrawer(found.vendor);
            } else {
                found.marker.bindPopup(buildPopupHTML(found.vendor), {
                    maxWidth: 300,
                    className: 'mazi-popup'
                }).openPopup();
            }
        }, 400);
    }
}

// ─── Share Location ──────────────────────────────────────────────────────────
function shareLocation(lat, lng, name) {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    if (navigator.share) {
        navigator.share({ title: name, text: `Find ${name} on Unilag campus`, url });
    } else {
        navigator.clipboard.writeText(url).then(() => {
            showToast('Google Maps link copied to clipboard!', 'success');
        });
    }
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ─── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('map')) {
        initMap();
    }
});