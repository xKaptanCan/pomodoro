const Wellness = {
    tips: {
        stretch: [
            { id: 'neck', icon: '🧘', textKey: 'wellness_neck' },
            { id: 'shoulder', icon: '🤷', textKey: 'wellness_shoulder' },
            { id: 'stand', icon: '🚶', textKey: 'wellness_stand' },
        ],
        eyes: [
            { id: '20-20-20', icon: '👀', textKey: 'wellness_eyes_20' },
            { id: 'blink', icon: '👁️', textKey: 'wellness_eyes_blink' },
        ],
        hydrate: [
            { id: 'water', icon: '💧', textKey: 'wellness_water' }
        ]
    },

    init() {
        this.createOverlay();
    },

    createOverlay() {
        if (document.getElementById('wellnessOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'wellnessOverlay';
        overlay.className = 'wellness-overlay';
        overlay.innerHTML = `
            <div class="wellness-card">
                <button class="wellness-close" onclick="Wellness.hide()">×</button>
                <div class="wellness-icon" id="wellnessIcon">🧘</div>
                <h3 class="wellness-title" data-i18n="wellnessTitle">Wellness Break</h3>
                <p class="wellness-text" id="wellnessText">Take a deep breath...</p>
                <div class="wellness-actions">
                    <button class="btn-primary" onclick="Wellness.hide()" data-i18n="ok">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    showRandom() {
        const allTips = [
            ...this.tips.stretch,
            ...this.tips.eyes,
            ...this.tips.hydrate
        ];

        const randomTip = allTips[Math.floor(Math.random() * allTips.length)];
        this.show(randomTip);
    },

    show(tip) {
        const overlay = document.getElementById('wellnessOverlay');
        const icon = document.getElementById('wellnessIcon');
        const text = document.getElementById('wellnessText');

        if (overlay && icon && text) {
            icon.textContent = tip.icon;
            text.setAttribute('data-i18n', tip.textKey);

            // Translate immediately if I18n is available
            if (typeof I18n !== 'undefined') {
                text.textContent = I18n.t(tip.textKey);
                // Also update title and button just in case
                const title = overlay.querySelector('[data-i18n="wellnessTitle"]');
                const btn = overlay.querySelector('[data-i18n="ok"]');
                if (title) title.textContent = I18n.t('wellnessTitle');
                if (btn) btn.textContent = I18n.t('ok');
            } else {
                text.textContent = tip.textKey; // Fallback
            }

            overlay.classList.add('visible');

            // Auto hide after 10 seconds if user doesn't interact
            setTimeout(() => {
                if (overlay.classList.contains('visible')) {
                    // Optional: auto hide? Maybe annoying. Let's keep it manual close for now.
                    // this.hide(); 
                }
            }, 10000);
        }
    },

    hide() {
        const overlay = document.getElementById('wellnessOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
    }
};
