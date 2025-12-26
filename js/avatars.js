// Avatars Module - 8 Tomato Characters
const Avatars = {
    definitions: [
        { id: 'happy', icon: '😊', name: 'Happy Tomato', nametr: 'Mutlu Domates', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#FF6B6B"/><ellipse cx="35" cy="50" rx="6" ry="8" fill="#333"/><ellipse cx="65" cy="50" rx="6" ry="8" fill="#333"/><path d="M35 65 Q50 80 65 65" stroke="#333" stroke-width="3" fill="none"/><ellipse cx="50" cy="25" rx="8" ry="5" fill="#4CAF50"/><path d="M50 20 Q55 10 60 15" stroke="#4CAF50" stroke-width="4" fill="none"/></svg>` },
        { id: 'sleepy', icon: '😴', name: 'Sleepy Tomato', nametr: 'Uykulu Domates', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#FF8E53"/><path d="M30 50 L40 50" stroke="#333" stroke-width="3"/><path d="M60 50 L70 50" stroke="#333" stroke-width="3"/><ellipse cx="50" cy="65" rx="8" ry="5" fill="#333"/><text x="70" y="30" font-size="12" fill="#667eea">z z z</text><ellipse cx="50" cy="25" rx="8" ry="5" fill="#4CAF50"/></svg>` },
        { id: 'strong', icon: '💪', name: 'Strong Tomato', nametr: 'Güçlü Domates', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#FF6B6B"/><rect x="28" y="48" width="12" height="8" rx="2" fill="#333"/><rect x="60" y="48" width="12" height="8" rx="2" fill="#333"/><path d="M35 68 L65 68" stroke="#333" stroke-width="3"/><ellipse cx="50" cy="25" rx="8" ry="5" fill="#4CAF50"/><text x="75" y="45" font-size="16">💪</text></svg>` },
        { id: 'ninja', icon: '🥷', name: 'Ninja Tomato', nametr: 'Ninja Domates', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#FF6B6B"/><rect x="20" y="45" width="60" height="15" fill="#1a1a2e"/><ellipse cx="35" cy="52" rx="8" ry="5" fill="#fff"/><ellipse cx="65" cy="52" rx="8" ry="5" fill="#fff"/><circle cx="35" cy="52" r="3" fill="#333"/><circle cx="65" cy="52" r="3" fill="#333"/><ellipse cx="50" cy="25" rx="8" ry="5" fill="#4CAF50"/></svg>` },
        { id: 'student', icon: '🎓', name: 'Student Tomato', nametr: 'Öğrenci Domates', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#FF6B6B"/><ellipse cx="35" cy="50" rx="6" ry="8" fill="#333"/><ellipse cx="65" cy="50" rx="6" ry="8" fill="#333"/><path d="M35 65 Q50 75 65 65" stroke="#333" stroke-width="3" fill="none"/><rect x="25" y="42" width="20" height="16" rx="2" fill="none" stroke="#333" stroke-width="2"/><rect x="55" y="42" width="20" height="16" rx="2" fill="none" stroke="#333" stroke-width="2"/><polygon points="50,5 20,20 50,25 80,20" fill="#1a1a2e"/><rect x="48" y="20" width="4" height="15" fill="#1a1a2e"/></svg>` },
        { id: 'business', icon: '👔', name: 'Business Tomato', nametr: 'İş Domates', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#FF6B6B"/><ellipse cx="35" cy="50" rx="5" ry="7" fill="#333"/><ellipse cx="65" cy="50" rx="5" ry="7" fill="#333"/><path d="M40 65 L60 65" stroke="#333" stroke-width="2"/><polygon points="50,70 40,90 50,85 60,90" fill="#1a1a2e"/><rect x="45" y="70" width="10" height="5" fill="#fff"/><ellipse cx="50" cy="25" rx="8" ry="5" fill="#4CAF50"/></svg>` },
        { id: 'artist', icon: '🎨', name: 'Artist Tomato', nametr: 'Sanatçı Domates', svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#FF6B6B"/><ellipse cx="35" cy="50" rx="6" ry="8" fill="#333"/><ellipse cx="65" cy="50" rx="6" ry="8" fill="#333"/><path d="M35 65 Q50 80 65 65" stroke="#333" stroke-width="3" fill="none"/><ellipse cx="50" cy="25" rx="8" ry="5" fill="#4CAF50"/><circle cx="20" cy="35" r="5" fill="#FF69B4"/><circle cx="80" cy="35" r="5" fill="#4ECDC4"/><circle cx="75" cy="75" r="4" fill="#FFD700"/></svg>` },
        { id: 'golden', icon: '🌟', name: 'Golden Tomato', nametr: 'Altın Domates', svg: `<svg viewBox="0 0 100 100"><defs><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FFD700"/><stop offset="100%" style="stop-color:#FFA500"/></linearGradient></defs><circle cx="50" cy="55" r="35" fill="url(#gold)"/><ellipse cx="35" cy="50" rx="6" ry="8" fill="#333"/><ellipse cx="65" cy="50" rx="6" ry="8" fill="#333"/><path d="M35 65 Q50 80 65 65" stroke="#333" stroke-width="3" fill="none"/><polygon points="50,5 53,15 63,15 55,22 58,32 50,26 42,32 45,22 37,15 47,15" fill="#FFD700"/><ellipse cx="30" cy="40" rx="8" ry="5" fill="rgba(255,255,255,0.3)"/></svg>`, unlockable: true }
    ],

    currentAvatar: 'happy',

    init() {
        this.currentAvatar = Storage.get('selectedAvatar', 'happy');
    },

    getAll() {
        return this.definitions;
    },

    getCurrent() {
        return this.definitions.find(a => a.id === this.currentAvatar) || this.definitions[0];
    },

    select(avatarId) {
        const avatar = this.definitions.find(a => a.id === avatarId);
        if (!avatar) return;

        // Check if unlockable
        if (avatar.unlockable) {
            const achievements = Storage.get('achievements', []);
            if (achievements.length < 11) {
                alert(I18n.currentLang === 'tr' ? 'Bu avatar için tüm başarımları açmalısın!' : 'Unlock all achievements to use this avatar!');
                return;
            }
        }

        this.currentAvatar = avatarId;
        Storage.set('selectedAvatar', avatarId);
        this.updateDisplay();
    },

    updateDisplay() {
        const avatar = this.getCurrent();
        const container = document.getElementById('avatarDisplay');
        if (container) {
            container.innerHTML = avatar.svg;
        }
    },

    renderGrid(container) {
        const achievements = Storage.get('achievements', []);
        const canUseGolden = achievements.length >= 11;

        container.innerHTML = this.definitions.map(a => {
            const isLocked = a.unlockable && !canUseGolden;
            return `
                <div class="avatar-card ${a.id === this.currentAvatar ? 'active' : ''} ${isLocked ? 'locked' : ''}" 
                     data-avatar="${a.id}">
                    <div class="avatar-preview">${isLocked ? '🔒' : a.icon}</div>
                    <div class="avatar-name">${I18n.currentLang === 'tr' ? a.nametr : a.name}</div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.avatar-card').forEach(card => {
            card.addEventListener('click', () => {
                this.select(card.dataset.avatar);
                container.querySelectorAll('.avatar-card').forEach(c => c.classList.remove('active'));
                if (!card.classList.contains('locked')) {
                    card.classList.add('active');
                }
            });
        });
    }
};
