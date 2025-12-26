// Clock Styles Module - 4 Different Timer Styles
const ClockStyles = {
    styles: ['circle', 'digital', 'minimal', 'analog'],
    currentStyle: 'circle',

    init() {
        this.currentStyle = Storage.get('clockStyle', 'circle');
    },

    getAll() {
        return [
            { id: 'circle', name: 'Circle', nametr: 'Daire', icon: '⭕' },
            { id: 'digital', name: 'Digital', nametr: 'Dijital', icon: '🔢' },
            { id: 'minimal', name: 'Minimal', nametr: 'Minimal', icon: '⬜' },
            { id: 'analog', name: 'Analog', nametr: 'Analog', icon: '🕐' }
        ];
    },

    setStyle(styleId) {
        if (!this.styles.includes(styleId)) return;
        this.currentStyle = styleId;
        Storage.set('clockStyle', styleId);
        this.applyStyle();
    },

    applyStyle() {
        const timerContainer = document.querySelector('.timer-container');
        if (!timerContainer) return;

        // Remove all style classes
        this.styles.forEach(s => timerContainer.classList.remove(`style-${s}`));
        timerContainer.classList.add(`style-${this.currentStyle}`);

        // Update display based on style
        this.updateDisplay();
    },

    updateDisplay() {
        const timerDisplay = document.querySelector('.timer-display');
        const timerSvg = document.querySelector('.timer-svg');

        if (!timerDisplay || !timerSvg) return;

        switch (this.currentStyle) {
            case 'circle':
                timerSvg.style.display = 'block';
                timerDisplay.classList.remove('digital-style', 'minimal-style', 'analog-style');
                break;
            case 'digital':
                timerSvg.style.display = 'none';
                timerDisplay.classList.add('digital-style');
                timerDisplay.classList.remove('minimal-style', 'analog-style');
                break;
            case 'minimal':
                timerSvg.style.display = 'none';
                timerDisplay.classList.add('minimal-style');
                timerDisplay.classList.remove('digital-style', 'analog-style');
                break;
            case 'analog':
                timerSvg.style.display = 'block';
                timerDisplay.classList.add('analog-style');
                timerDisplay.classList.remove('digital-style', 'minimal-style');
                break;
        }
    },

    renderAnalogClock(minutes, seconds, totalMinutes) {
        const container = document.getElementById('analogClock');
        if (!container || this.currentStyle !== 'analog') return;

        const totalSeconds = minutes * 60 + seconds;
        const totalSecondsMax = totalMinutes * 60;
        const progress = 1 - (totalSeconds / totalSecondsMax);
        const angle = progress * 360;

        container.innerHTML = `
            <svg viewBox="0 0 100 100" class="analog-clock-svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-tertiary)" stroke-width="2"/>
                ${[...Array(12)].map((_, i) => {
            const a = (i * 30 - 90) * Math.PI / 180;
            const x1 = 50 + 38 * Math.cos(a);
            const y1 = 50 + 38 * Math.sin(a);
            const x2 = 50 + 42 * Math.cos(a);
            const y2 = 50 + 42 * Math.sin(a);
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--text-muted)" stroke-width="2"/>`;
        }).join('')}
                <line x1="50" y1="50" x2="${50 + 30 * Math.cos((angle - 90) * Math.PI / 180)}" y2="${50 + 30 * Math.sin((angle - 90) * Math.PI / 180)}" stroke="var(--mode-primary)" stroke-width="3" stroke-linecap="round"/>
                <circle cx="50" cy="50" r="4" fill="var(--mode-primary)"/>
            </svg>
        `;
    },

    renderSelector(container) {
        const styles = this.getAll();
        container.innerHTML = styles.map(s => `
            <button class="style-btn ${s.id === this.currentStyle ? 'active' : ''}" data-style="${s.id}">
                <span class="style-icon">${s.icon}</span>
                <span class="style-name">${I18n.currentLang === 'tr' ? s.nametr : s.name}</span>
            </button>
        `).join('');

        container.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setStyle(btn.dataset.style);
                container.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
};
