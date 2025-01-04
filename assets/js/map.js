// Sound map data - Sample locations and sounds
const soundData = [
    {
        id: 1,
        name: "Morning Market",
        category: "urban",
        location: [31.5017, 34.4668],
        description: "The bustling sounds of a morning market in Gaza City",
        audioUrl: "assets/audio/market.mp3"
    },
    {
        id: 2,
        name: "Mediterranean Waves",
        category: "nature",
        location: [31.5204, 34.4367],
        description: "Waves crashing on Gaza's Mediterranean coast",
        audioUrl: "assets/audio/waves.mp3"
    },
    {
        id: 3,
        name: "Evening Call to Prayer",
        category: "cultural",
        location: [31.4156, 34.3513],
        description: "The melodic evening call to prayer echoing across Khan Yunis",
        audioUrl: "assets/audio/prayer.mp3"
    }
];

// Initialize map
let map;
let markers = [];
let activeAudio = null;
let isPlayingAll = false;

function initMap() {
    // Create map centered on Gaza
    map = L.map('sound-map').setView([31.5017, 34.4668], 11);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add sound markers
    addSoundMarkers();

    // Initialize controls
    initControls();
}

function addSoundMarkers(category = 'all') {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];

    // Add new markers based on category
    soundData.forEach(sound => {
        if (category === 'all' || sound.category === category) {
            const marker = L.marker(sound.location)
                .bindPopup(`
                    <h4>${sound.name}</h4>
                    <p>${sound.description}</p>
                    <button class="play-sound-btn" data-id="${sound.id}">
                        ▶ Play Sound
                    </button>
                `);

            marker.on('popupopen', () => {
                const btn = document.querySelector(`.play-sound-btn[data-id="${sound.id}"]`);
                if (btn) {
                    btn.addEventListener('click', () => playSound(sound));
                }
            });

            marker.addTo(map);
            markers.push(marker);
        }
    });
}

function playSound(sound) {
    // Stop any currently playing audio
    if (activeAudio) {
        activeAudio.pause();
        activeAudio = null;
    }

    // Create and play new audio
    const audio = new Audio(sound.audioUrl);
    audio.play();
    activeAudio = audio;

    // Update marker icon to show playing state
    markers.forEach(marker => {
        const markerSound = soundData.find(s =>
            s.location[0] === marker.getLatLng().lat &&
            s.location[1] === marker.getLatLng().lng
        );

        if (markerSound.id === sound.id) {
            marker.setIcon(L.divIcon({
                className: 'playing-marker',
                html: '🔊'
            }));

            // Reset icon when audio ends
            audio.onended = () => {
                marker.setIcon(L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34]
                }));
                activeAudio = null;
            };
        }
    });
}

function playAllSounds() {
    if (isPlayingAll) {
        // Stop playing all sounds
        if (activeAudio) {
            activeAudio.pause();
            activeAudio = null;
        }
        isPlayingAll = false;
        document.getElementById('play-all').innerHTML = '<span class="btn-icon">▶</span> Play All Sounds';
    } else {
        // Start playing all sounds sequentially
        isPlayingAll = true;
        document.getElementById('play-all').innerHTML = '<span class="btn-icon">⏹</span> Stop All Sounds';
        playNextSound(0);
    }
}

function playNextSound(index) {
    if (!isPlayingAll || index >= soundData.length) {
        isPlayingAll = false;
        document.getElementById('play-all').innerHTML = '<span class="btn-icon">▶</span> Play All Sounds';
        return;
    }

    const sound = soundData[index];
    playSound(sound);

    // Play next sound when current one ends
    if (activeAudio) {
        activeAudio.onended = () => {
            playNextSound(index + 1);
        };
    }
}

function initControls() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Update markers
            const category = e.target.dataset.category;
            addSoundMarkers(category);
        });
    });

    // Play all button
    document.getElementById('play-all').addEventListener('click', playAllSounds);
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', initMap); 