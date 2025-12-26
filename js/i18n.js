// Internationalization Module
const I18n = {
    currentLang: 'en',
    translations: {
        en: {
            appTitle: 'Pomodoro Timer',
            focus: 'Focus',
            shortBreak: 'Short Break',
            longBreak: 'Long Break',
            focusTime: 'Focus Time',
            breakTime: 'Break Time',
            start: 'START',
            pause: 'PAUSE',
            reset: 'RESET',
            fullscreen: 'FULLSCREEN',

            // Share
            shareStats: 'Share Stats',
            shareHint: 'Preparing image...',
            readyToShare: 'Ready to share!',
            download: 'Download',
            shareTwitter: 'Share on Twitter',
            generating: 'Generating...',
            dailyGoal: 'Daily Goal:',
            pomodoros: 'pomodoros',
            ambientSounds: 'Ambient Sounds',
            spotifyPlaylist: 'Spotify Playlist',
            optional: '(optional)',
            spotifyPlaceholder: 'Paste Spotify playlist URL...',
            load: 'Load',
            sessionNotes: 'Session Notes',
            notesPlaceholder: 'What are you working on?',
            shortcuts: 'Shortcuts:',
            startPause: 'Start/Pause',
            resetKey: 'Reset',
            modeSwitch: 'Switch Mode',
            fullscreenKey: 'Fullscreen',
            settings: 'Settings',
            timerSettings: 'Timer Settings',
            focusDuration: 'Focus Duration (minutes)',
            shortBreakDuration: 'Short Break (minutes)',
            longBreakDuration: 'Long Break (minutes)',
            longBreakInterval: 'Long Break After (sessions)',
            automation: 'Automation',
            autoStartBreaks: 'Auto-start Breaks',
            autoStartPomodoros: 'Auto-start Pomodoros',
            soundSettings: 'Sound Settings',
            alarmSound: 'Alarm Sound',
            bell: 'Bell',
            digital: 'Digital',
            gentle: 'Gentle',
            alarmVolume: 'Alarm Volume',
            goalSettings: 'Goal Settings',
            dailyGoalCount: 'Daily Goal (pomodoros)',
            notificationSettings: 'Notifications',
            browserNotifications: 'Browser Notifications',
            enableNotifications: 'Enable Notifications',
            dataManagement: 'Data Management',
            exportData: 'Export Data',
            importData: 'Import Data',
            saveSettings: 'Save Settings',
            statistics: 'Statistics',
            todayPomodoros: "Today's Pomodoros",
            todayMinutes: 'Minutes Today',
            dayStreak: 'Day Streak',
            totalPomodoros: 'Total Pomodoros',
            weeklyOverview: 'Weekly Overview',
            monthlyTrend: 'Monthly Trend',
            recentSessions: 'Recent Sessions',
            pressEscToExit: 'Press ESC or F to exit fullscreen',
            pomodoroComplete: 'Pomodoro Complete!',
            breakComplete: 'Break Complete!',
            timeForBreak: 'Time for a break!',
            timeToFocus: 'Time to focus!',
            timeToFocus: 'Time to focus!',
            goalReached: 'Daily goal reached! 🎉',
            stopTimerFirst: 'Timer is running. Stop and switch mode?',

            // Tasks
            tasks: 'Tasks',
            addTaskPlaceholder: 'Add a new task...',
            noTasks: 'What is your plan for today? Add a task! 🚀',

            // Wellness
            wellnessTitle: 'Wellness Break',
            ok: 'OK',
            wellness_neck: 'Gently stretch your neck to the right, left, and forward.',
            wellness_shoulder: 'Lift your shoulders and roll them back a few times.',
            wellness_stand: 'Stand up and take a short walk or stretch.',
            wellness_eyes_20: 'Look away from the screen for 20 seconds.',
            wellness_eyes_blink: 'Blink your eyes rapidly 10 times.',
            wellness_water: 'Refresh your body with a glass of water.',

            // Ambient Sounds
            ambientSounds: 'Ambient',
            sound_rain: 'Rain',
            sound_forest: 'Forest',
            sound_cafe: 'Cafe',
            sound_fire: 'Fireplace',
            sound_waves: 'Waves',
            sound_thunder: 'Thunder',
            sound_wind: 'Wind',
            sound_crickets: 'Crickets',

            monday: 'Mon',
            tuesday: 'Tue',
            wednesday: 'Wed',
            thursday: 'Thu',
            friday: 'Fri',
            saturday: 'Sat',
            sunday: 'Sun',
            theme: 'Theme',
            theme_midnight: 'Midnight',
            theme_light: 'Light',
            theme_aurora: 'Aurora',
            theme_sunset: 'Sunset',
            theme_forest: 'Forest',
            theme_ocean: 'Ocean',
            theme_lavender: 'Lavender',
            theme_rose: 'Rose',
            theme_coffee: 'Coffee',
            theme_nord: 'Nord',
            theme_dracula: 'Dracula',
            theme_cream: 'Cream',
        },
        tr: {
            // App
            appTitle: 'Pomodoro Zamanlayıcı',

            // Modes
            focus: 'Odaklan',
            shortBreak: 'Kısa Mola',
            longBreak: 'Uzun Mola',
            focusTime: 'ODAKLANMA ZAMANI',
            breakTime: 'MOLA ZAMANI',

            // Controls
            start: 'BAŞLAT',
            pause: 'DURAKLAT',
            reset: 'SIFIRLA',

            // Left Panel
            todayStats: 'Bugünkü İstatistik',
            dailyGoal: 'Günlük Hedef',
            achievements: 'Başarılar',
            thisWeek: 'Bu Hafta',

            // Right Panel
            sessionNotes: 'Oturum Notları',
            quickSettings: 'Hızlı Ayarlar',
            theme: 'Tema',
            theme_midnight: 'Gece Yarısı',
            theme_light: 'Aydınlık',
            theme_aurora: 'Aurora',
            theme_sunset: 'Gün Batımı',
            theme_forest: 'Orman',
            theme_ocean: 'Okyanus',
            theme_lavender: 'Lavanta',
            theme_rose: 'Gül',
            theme_coffee: 'Kahve',
            theme_nord: 'Kuzey',
            theme_dracula: 'Drakula',
            theme_cream: 'Krema',

            reset: 'SIFIRLA',
            fullscreen: 'TAM EKRAN',

            // Share
            shareStats: 'İstatistikleri Paylaş',
            shareHint: 'Görsel hazırlanıyor...',
            readyToShare: 'Paylaşmaya hazır!',
            download: 'İndir',
            shareTwitter: 'Twitter\'da Paylaş',
            generating: 'Oluşturuluyor...',

            // Stats
            pomodoros: 'pomodoro',
            todayPomodoros: 'Bugünkü Pomodorolar',
            todayMinutes: 'Bugünkü Dakikalar',
            totalPomodoros: 'Toplam Pomodoro',
            totalTime: 'Toplam Süre',
            currentStreak: 'Güncel Seri',
            bestStreak: 'En İyi Seri',
            dayStreak: 'Gün Serisi',
            weeklyOverview: 'Haftalık Özet',
            monthlyTrend: 'Aylık Trend',
            recentSessions: 'Son Oturumlar',

            // Days
            monday: 'Pzt',
            tuesday: 'Sal',
            wednesday: 'Çar',
            thursday: 'Per',
            friday: 'Cum',
            saturday: 'Cmt',
            sunday: 'Paz',

            // Settings
            settings: 'Ayarlar',
            timerSettings: 'Zamanlayıcı Ayarları',
            focusDuration: 'Odaklanma Süresi (dakika)',
            shortBreakDuration: 'Kısa Mola (dakika)',
            longBreakDuration: 'Uzun Mola (dakika)',
            longBreakInterval: 'Uzun Mola Sonrası (oturum)',
            dailyGoalNumber: 'Günlük Hedef (pomodoro)',

            // Automation
            automation: 'Otomasyon',
            autoStartBreaks: 'Molaları Otomatik Başlat',
            autoStartPomodoros: 'Pomodoroları Otomatik Başlat',

            // Sound
            soundSettings: 'Ses Ayarları',
            alarmSound: 'Alarm Sesi',
            bell: 'Zil',
            digital: 'Dijital',
            gentle: 'Yumuşak',
            alarmVolume: 'Alarm Ses Seviyesi',

            // Goals
            goalSettings: 'Hedef Ayarları',
            dailyGoalCount: 'Günlük Hedef (pomodoro)',

            // Data
            data: 'Veri',
            exportData: 'Dışa Aktar',
            importData: 'İçe Aktar',
            clearData: 'Verileri Sil',
            dataManagement: 'Veri Yönetimi',

            // Notifications
            notificationSettings: 'Bildirimler',
            browserNotifications: 'Tarayıcı Bildirimleri',
            enableNotifications: 'Bildirimleri Etkinleştir',

            // Messages
            pomodoroComplete: 'Pomodoro Tamamlandı!',
            breakComplete: 'Mola Bitti!',
            timeForBreak: 'Mola zamanı!',
            timeToFocus: 'Odaklanma zamanı!',
            goalReached: 'Günlük hedef tamamlandı! 🎉',
            stopTimerFirst: 'Zamanlayıcı çalışıyor. Durdurup mod değiştirilsin mi?',

            // Shortcuts
            shortcuts: 'Kısayollar:',
            startPause: 'Başlat/Duraklat',
            resetKey: 'Sıfırla',
            modeSwitch: 'Mod Değiştir',
            fullscreenKey: 'Tam Ekran',
            resetKey: 'Sıfırla',
            modeSwitch: 'Mod Değiştir',
            fullscreenKey: 'Tam Ekran',
            pressEscToExit: 'Tam ekrandan çıkmak için ESC veya F',

            // Tasks
            tasks: 'Görevler',
            addTaskPlaceholder: 'Yeni görev ekle...',
            noTasks: 'Bugün için planın ne? Hadi bir görev ekle! 🚀',

            // Wellness
            wellnessTitle: 'Sağlık Molası',
            ok: 'Tamam',
            wellness_neck: 'Boynunu yavaşça sağa, sola ve öne doğru esnet.',
            wellness_shoulder: 'Omuzlarını yukarı kaldır ve geriye doğru birkaç kez çevir.',
            wellness_stand: 'Ayağa kalk ve kısa bir yürüyüş yap veya gerin.',
            wellness_eyes_20: 'Gözlerini ekrandan ayır ve 20 saniye uzağa bak.',
            wellness_eyes_blink: 'Gözlerini 10 kez hızlıca kırpıştır.',
            wellness_water: 'Bir bardak su içerek vücudunu yenile.',

            // Ambient Sounds
            ambientSounds: 'Atmosfer',
            sound_rain: 'Yağmur',
            sound_forest: 'Orman',
            sound_cafe: 'Kafe',
            sound_fire: 'Şömine',
            sound_waves: 'Dalga',
            sound_thunder: 'Gök Gürültüsü',
            sound_wind: 'Rüzgar',
            sound_crickets: 'Cırcır Böceği',

            // Statistics Modal
            statistics: 'İstatistikler',

            // Misc
            notesPlaceholder: 'Ne üzerinde çalışıyorsun?',
            ambientSounds: 'Ortam Sesleri',
            spotifyPlaylist: 'Spotify Çalma Listesi',
            optional: '(isteğe bağlı)',
            spotifyPlaceholder: 'Spotify çalma listesi URL yapıştır...',
            load: 'Yükle',
            saveSettings: 'Ayarları Kaydet',
            autoSaveHint: '✓ Değişiklikler otomatik kaydedilir',

            // Motivation Quotes
            quotes: [
                { text: 'Başlamanın sırrı, konuşmayı bırakıp yapmaya başlamaktır.', author: 'Walt Disney' },
                { text: 'Bugün yapabileceğini yarına bırakma.', author: 'Benjamin Franklin' },
                { text: 'Başarı, her gün tekrarlanan küçük çabaların toplamıdır.', author: 'Robert Collier' },
                { text: 'Odaklan. Az ama iyi yap.', author: 'Steve Jobs' },
                { text: 'Her uzun yolculuk tek bir adımla başlar.', author: 'Lao Tzu' },
                { text: 'Disiplin, başarının köprüsüdür.', author: 'Jim Rohn' },
                { text: 'Zamanını yönetemezsen, hiçbir şeyi yönetemezsin.', author: 'Peter Drucker' },
                { text: 'Mükemmellik bir eylem değil, bir alışkanlıktır.', author: 'Aristoteles' }
            ]
        }
    },

    // Motivation quotes for English
    motivationQuotes: {
        en: [
            { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
            { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
            { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
            { text: 'Focus. Do less, but better.', author: 'Steve Jobs' },
            { text: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
            { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
            { text: 'If you can\'t manage your time, you can\'t manage anything.', author: 'Peter Drucker' },
            { text: 'Excellence is not an act, but a habit.', author: 'Aristotle' }
        ],
        tr: [
            { text: 'Başlamanın sırrı, konuşmayı bırakıp yapmaya başlamaktır.', author: 'Walt Disney' },
            { text: 'Bugün yapabileceğini yarına bırakma.', author: 'Benjamin Franklin' },
            { text: 'Başarı, her gün tekrarlanan küçük çabaların toplamıdır.', author: 'Robert Collier' },
            { text: 'Odaklan. Az ama iyi yap.', author: 'Steve Jobs' },
            { text: 'Her uzun yolculuk tek bir adımla başlar.', author: 'Lao Tzu' },
            { text: 'Disiplin, başarının köprüsüdür.', author: 'Jim Rohn' },
            { text: 'Zamanını yönetemezsen, hiçbir şeyi yönetemezsin.', author: 'Peter Drucker' },
            { text: 'Mükemmellik bir eylem değil, bir alışkanlıktır.', author: 'Aristoteles' }
        ]
    },

    getRandomQuote() {
        const quotes = this.motivationQuotes[this.currentLang] || this.motivationQuotes['en'];
        const index = Math.floor(Math.random() * quotes.length);
        return quotes[index];
    },

    getDailyQuote() {
        const quotes = this.motivationQuotes[this.currentLang] || this.motivationQuotes['en'];
        const today = new Date().toDateString();
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = ((hash << 5) - hash) + today.charCodeAt(i);
            hash = hash & hash;
        }
        const index = Math.abs(hash) % quotes.length;
        return quotes[index];
    },

    init() {
        const savedLang = Storage.get('language', 'en');
        this.setLanguage(savedLang);
    },

    setLanguage(lang) {
        if (!this.translations[lang]) lang = 'en';
        this.currentLang = lang;
        Storage.set('language', lang);
        this.updateUI();
        document.getElementById('currentLang').textContent = lang.toUpperCase();
    },

    toggleLanguage() {
        const newLang = this.currentLang === 'en' ? 'tr' : 'en';
        this.setLanguage(newLang);
    },

    t(key) {
        return this.translations[this.currentLang][key] || this.translations['en'][key] || key;
    },

    updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });

        // Update page title based on timer state
        if (typeof App !== 'undefined' && App.timer) {
            App.updateTitle();
            // Also update timer label based on current mode
            App.updateModeUI(App.currentMode);
            // Update daily motivation quote
            App.updateDailyQuote();
        }
    }
};
