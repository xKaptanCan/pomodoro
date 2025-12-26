const Themes = {
    // Tema Listesi (themes.css ile uyumlu olmalı)
    list: [
        { id: 'midnight', nameKey: 'theme_midnight', color: '#0D0D14', icon: '🌙' }, // Default Dark
        { id: 'light', nameKey: 'theme_light', color: '#f5f5f5', icon: '☀️' },      // Default Light
        { id: 'aurora', nameKey: 'theme_aurora', color: '#0a192f', icon: '🌌' },
        { id: 'sunset', nameKey: 'theme_sunset', color: '#1a1a2e', icon: '🌅' },
        { id: 'forest', nameKey: 'theme_forest', color: '#0d1b0d', icon: '🌲' },
        { id: 'ocean', nameKey: 'theme_ocean', color: '#0a1929', icon: '🌊' },
        { id: 'lavender', nameKey: 'theme_lavender', color: '#1a1625', icon: '💜' },
        { id: 'rose', nameKey: 'theme_rose', color: '#1f1318', icon: '🌹' },
        { id: 'coffee', nameKey: 'theme_coffee', color: '#1a140f', icon: '☕' },
        { id: 'nord', nameKey: 'theme_nord', color: '#2e3440', icon: '🧊' },
        { id: 'dracula', nameKey: 'theme_dracula', color: '#282a36', icon: '🧛' },
        { id: 'cream', nameKey: 'theme_cream', color: '#faf8f5', icon: '🍦' },
        { id: 'snow', nameKey: 'theme_snow', color: '#0D0D14', icon: '❄️' }
    ],

    init() {
        this.container = document.getElementById('themeGrid');

        // Kayıtlı temayı yükle
        const savedTheme = localStorage.getItem('theme') || 'midnight';
        this.apply(savedTheme, false); // false = don't save again (already saved)

        // UI oluştur
        this.render();
    },

    render() {
        if (!this.container) return;

        this.container.innerHTML = this.list.map(theme => `
            <button class="theme-btn ${this.currentTheme === theme.id ? 'active' : ''}" 
                    data-theme="${theme.id}"
                    title="${I18n.t(theme.nameKey) || theme.id}"
                    style="background-color: ${theme.color}">
                <span class="theme-icon">${theme.icon}</span>
            </button>
        `).join('');

        // Event Listeners
        this.container.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const themeId = btn.dataset.theme;
                this.apply(themeId);
            });
        });
    },

    apply(themeId, save = true) {
        // Eski active class'ı kaldır
        if (this.container) {
            const oldBtn = this.container.querySelector(`.theme-btn[data-theme="${this.currentTheme}"]`);
            if (oldBtn) oldBtn.classList.remove('active');

            // Yeni active class'ı ekle
            const newBtn = this.container.querySelector(`.theme-btn[data-theme="${themeId}"]`);
            if (newBtn) newBtn.classList.add('active');
        }

        // Temayı uygula
        document.documentElement.setAttribute('data-theme', themeId);
        document.body.setAttribute('data-theme', themeId);

        this.currentTheme = themeId;

        // Toggle buton ikonunu güncelle (genel light/dark durumuna göre)
        const isLight = ['light', 'cream'].includes(themeId);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = isLight ? '☀️' : '🌙';
        }

        if (save) {
            localStorage.setItem('theme', themeId);
        }
    },

    // App.js'teki toggleTheme fonksiyonu için (Header butonu)
    // Sıradaki temaya geç veya sadece light/dark arası geçiş yap?
    // Kullanıcı header butonuna basarsa sadece en son seçilen light/dark varyasyonuna geçebilir
    // veya basitçe Midnight <-> Light yapabilir.
    // Şimdilik basit toggle mantığını koruyalım: 
    // Eğer koyu bir temadaysa -> Light'a geç.
    // Eğer açık bir temadaysa -> Midnight'a geç.
    toggle() {
        const isLight = ['light', 'cream'].includes(this.currentTheme);
        this.apply(isLight ? 'midnight' : 'light');
    }
};
