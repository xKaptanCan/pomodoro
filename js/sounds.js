const AmbientSounds = {
    audio: null,
    currentSound: null,
    volume: 0.5,
    isPlaying: false,

    sounds: {
        // Local Sound Files
        rain: { name: 'rain', icon: '🌧️', url: 'assets/sounds/rain.mp4' },
        forest: { name: 'forest', icon: '🐦', url: 'assets/sounds/forest.mp4' },
        cafe: { name: 'cafe', icon: '☕', url: 'assets/sounds/cafe.mp4' },
        fire: { name: 'fire', icon: '🔥', url: 'assets/sounds/fire.mp4' },
        waves: { name: 'waves', icon: '🌊', url: 'assets/sounds/waves.mp4' },
        thunder: { name: 'thunder', icon: '⚡', url: 'assets/sounds/thunder.mp4' },
        wind: { name: 'wind', icon: '💨', url: 'assets/sounds/wind.mp4' },
        crickets: { name: 'crickets', icon: '🦗', url: 'assets/sounds/crickets.mp4' }
    },

    init() {
        // Load saved settings
        const savedVolume = Storage.get('ambientVolume');
        if (savedVolume !== null) this.volume = savedVolume;

        this.render();
    },

    toggle(soundKey) {
        if (this.currentSound === soundKey && this.isPlaying) {
            this.stop();
        } else {
            this.play(soundKey);
        }
    },

    play(soundKey) {
        // Stop current if playing
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }

        const sound = this.sounds[soundKey];
        if (!sound) return;

        this.currentSound = soundKey;
        this.isPlaying = true;

        this.audio = new Audio(sound.url);
        this.audio.loop = true;
        this.audio.volume = this.volume;
        this.audio.play().catch(e => console.error('Audio play failed:', e));

        this.updateUI();
    },

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
        this.isPlaying = false;
        this.currentSound = null;
        this.updateUI();
    },

    setVolume(value) {
        this.volume = value;
        if (this.audio) {
            this.audio.volume = value;
        }
        Storage.set('ambientVolume', value);
    },

    updateUI() {
        // Update regular sound buttons
        document.querySelectorAll('.sound-btn').forEach(btn => {
            const key = btn.dataset.sound;
            if (key === this.currentSound && this.isPlaying) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update fullscreen sound buttons
        document.querySelectorAll('.fs-sound-btn').forEach(btn => {
            const key = btn.dataset.sound;
            if (key === this.currentSound && this.isPlaying) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },

    renderFullscreen() {
        const container = document.getElementById('fsSoundGrid');
        if (!container || container.children.length > 0) return; // Already rendered

        let html = '';
        Object.entries(this.sounds).forEach(([key, sound]) => {
            html += `
                <button class="fs-sound-btn ${this.currentSound === key && this.isPlaying ? 'active' : ''}" 
                        data-sound="${key}" 
                        onclick="AmbientSounds.toggle('${key}')" 
                        title="${I18n.t('sound_' + key)}">
                    <span class="fs-sound-icon">${sound.icon}</span>
                </button>
            `;
        });
        container.innerHTML = html;

        // Sync volume slider
        const slider = document.querySelector('.fs-volume-slider');
        if (slider) {
            slider.value = this.volume;
            slider.oninput = (e) => this.setVolume(e.target.value);
        }
    },

    render() {
        const container = document.getElementById('ambientControls');
        if (!container) return;

        let html = '<div class="ambient-grid">';

        Object.entries(this.sounds).forEach(([key, sound]) => {
            html += `
                <button class="sound-btn" data-sound="${key}" onclick="AmbientSounds.toggle('${key}')" title="${I18n.t('sound_' + key)}">
                    <span class="sound-icon">${sound.icon}</span>
                </button>
            `;
        });

        html += '</div>';

        // Volume slider
        html += `
            <div class="volume-control">
                <span class="volume-icon">🔊</span>
                <input type="range" min="0" max="1" step="0.1" value="${this.volume}" class="volume-slider" oninput="AmbientSounds.setVolume(this.value)">
            </div>
        `;

        container.innerHTML = html;
    }
};
