// MAZI-EATS Home Page Mini Map
// Shows Unilag campus area with vendor pins

console.log('home-map.js loading...');

// Unilag coordinates
const UNILAG_LAT = 6.5155;
const UNILAG_LNG = 3.385;
const ZOOM_LEVEL = 15;

// Sample vendor data for the home map
const homeMapVendors = [
    {
        name: 'Item7Go',
        lat: 6.5180, lng: 3.3890,
        emoji: '🍕',
        category: 'restaurant'
    },
    {
        name: 'Moremi Canteen',
        lat: 6.5155, lng: 3.3870,
        emoji: '🍽️',
        category: 'restaurant'
    },
    {
        name: 'Korede Spag',
        lat: 6.5165, lng: 3.3880,
        emoji: '🍝',
        category: 'restaurant'
    },
    {
        name: 'Suya Spot',
        lat: 6.5170, lng: 3.3900,
        emoji: '🔥',
        category: 'snacks'
    },
    {
        name: 'GABBY Shawarma',
        lat: 6.5145, lng: 3.3860,
        emoji: '🌯',
        category: 'snacks'
    },
    {
        name: 'YEMYEM Stores',
        lat: 6.5175, lng: 3.3875,
        emoji: '🏪',
        category: 'store'
    }
];

let homeMapInstance = null;

// Initialize map when document is ready
function initializeHomeMap() {
    console.log('initializeHomeMap called, L is:', typeof L);
    
    const mapContainer = document.getElementById('homeMap');
    
    if (!mapContainer) {
        console.warn('❌ Home map container not found');
        return false;
    }

    console.log('✓ Map container found, size:', mapContainer.offsetWidth, 'x', mapContainer.offsetHeight);

    if (typeof L === 'undefined') {
        console.warn('❌ Leaflet library not loaded, retrying in 100ms...');
        setTimeout(initializeHomeMap, 100);
        return false;
    }

    console.log('✓ Leaflet library loaded');

    try {
        // Ensure container has size
        if (mapContainer.offsetHeight === 0) {
            console.warn('⚠️ Map container has 0 height, the element may not be visible');
        }

        // Create the map
        homeMapInstance = L.map('homeMap', {
            center: [UNILAG_LAT, UNILAG_LNG],
            zoom: ZOOM_LEVEL,
            scrollWheelZoom: true,
            dragging: true,
            zoomControl: false,
            attributionControl: false,
            touchZoom: true,
            doubleClickZoom: true,
            keyboard: false
        });

        console.log('✓ Map instance created');

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19,
            minZoom: 14
        }).addTo(homeMapInstance);

        console.log('✓ Tiles added');

        // Add vendor markers
        homeMapVendors.forEach((vendor, idx) => {
            // Create custom HTML marker with emoji
            const markerHTML = `<div style="
                font-size: 32px;
                text-align: center;
                cursor: pointer;
                background: white;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                border: 2px solid #FBDB65;
                line-height: 1;
            ">${vendor.emoji}</div>`;

            const customIcon = L.divIcon({
                html: markerHTML,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -15],
                className: 'home-map-marker-icon'
            });

            // Create marker
            const marker = L.marker([vendor.lat, vendor.lng], { icon: customIcon })
                .bindPopup(`<div style="text-align: center; font-weight: 600; color: #0a0908;">${vendor.emoji} <br> ${vendor.name}</div>`)
                .addTo(homeMapInstance);
        });

        console.log('✓ Added ' + homeMapVendors.length + ' vendor markers');

        // Add a center marker for Unilag
        L.circleMarker([UNILAG_LAT, UNILAG_LNG], {
            radius: 5,
            fillColor: '#1B5E20',
            color: '#0a0908',
            weight: 2,
            opacity: 0.7,
            fillOpacity: 0.5
        }).addTo(homeMapInstance).bindPopup('UNILAG Campus Center');

        console.log('✓✓✓ Home map initialized successfully! ✓✓✓');
        
        // Trigger resize to ensure proper rendering
        setTimeout(() => {
            if (homeMapInstance) {
                homeMapInstance.invalidateSize(true);
                console.log('✓ Map size invalidated');
            }
        }, 100);

        return true;

    } catch (error) {
        console.error('❌ Error initializing home map:', error);
        console.error(error.stack);
        return false;
    }
}

// Wait for script to be attached to window
if (typeof L !== 'undefined') {
    console.log('✓ Leaflet available immediately, initializing...');
    initializeHomeMap();
} else if (document.readyState === 'loading') {
    console.log('⏳ DOM still loading, waiting for it...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✓ DOM loaded, checking for Leaflet...');
        if (typeof L !== 'undefined') {
            initializeHomeMap();
        } else {
            console.log('⏳ Leaflet not available yet, retrying...');
            setTimeout(initializeHomeMap, 500);
        }
    });
} else {
    console.log('✓ DOM already loaded, initializing...');
    setTimeout(initializeHomeMap, 100);
}

// Make map responsive
window.addEventListener('resize', function() {
    if (homeMapInstance) {
        homeMapInstance.invalidateSize();
    }
});



