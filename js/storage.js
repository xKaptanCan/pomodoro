// Storage Module - LocalStorage Wrapper
const Storage = {
    prefix: 'pomodoro_',

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (e) {
            return false;
        }
    },

    // Settings
    getSettings() {
        return this.get('settings', {
            focusDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            longBreakInterval: 4,
            autoStartBreaks: false,
            autoStartPomodoros: false,
            alarmSound: 'bell',
            alarmVolume: 80,
            dailyGoal: 8,
            browserNotifications: true
        });
    },

    saveSettings(settings) {
        return this.set('settings', settings);
    },

    // Stats
    getStats() {
        return this.get('stats', {
            totalPomodoros: 0,
            totalMinutes: 0,
            currentStreak: 0,
            lastActiveDate: null,
            dailyData: {}
        });
    },

    saveStats(stats) {
        return this.set('stats', stats);
    },

    // Get today's key
    getTodayKey() {
        return new Date().toISOString().split('T')[0];
    },

    // Add completed pomodoro
    addPomodoro(minutes, note = '') {
        const stats = this.getStats();
        const todayKey = this.getTodayKey();

        // Initialize today's data if not exists
        if (!stats.dailyData[todayKey]) {
            stats.dailyData[todayKey] = {
                pomodoros: 0,
                minutes: 0,
                sessions: []
            };
        }

        // Update stats
        stats.totalPomodoros++;
        stats.totalMinutes += minutes;
        stats.dailyData[todayKey].pomodoros++;
        stats.dailyData[todayKey].minutes += minutes;
        stats.dailyData[todayKey].sessions.push({
            time: new Date().toISOString(),
            minutes: minutes,
            note: note
        });

        // Update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday.toISOString().split('T')[0];

        if (stats.lastActiveDate === todayKey) {
            // Already active today, streak continues
        } else if (stats.lastActiveDate === yesterdayKey) {
            // Was active yesterday, increment streak
            stats.currentStreak++;
        } else if (stats.lastActiveDate !== todayKey) {
            // Streak broken, reset to 1
            stats.currentStreak = 1;
        }
        stats.lastActiveDate = todayKey;

        this.saveStats(stats);
        return stats;
    },

    // Get today's pomodoros
    getTodayPomodoros() {
        const stats = this.getStats();
        const todayKey = this.getTodayKey();
        return stats.dailyData[todayKey]?.pomodoros || 0;
    },

    // Get today's minutes
    getTodayMinutes() {
        const stats = this.getStats();
        const todayKey = this.getTodayKey();
        return stats.dailyData[todayKey]?.minutes || 0;
    },

    // Get week data
    getWeekData() {
        const stats = this.getStats();
        const data = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            data.push({
                date: key,
                day: date.getDay(),
                pomodoros: stats.dailyData[key]?.pomodoros || 0,
                minutes: stats.dailyData[key]?.minutes || 0
            });
        }

        return data;
    },

    // Get month data
    getMonthData() {
        const stats = this.getStats();
        const data = [];

        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            data.push({
                date: key,
                pomodoros: stats.dailyData[key]?.pomodoros || 0
            });
        }

        return data;
    },

    // Get recent sessions
    getRecentSessions(limit = 10) {
        const stats = this.getStats();
        const sessions = [];

        const sortedDates = Object.keys(stats.dailyData).sort().reverse();

        for (const date of sortedDates) {
            const daySessions = stats.dailyData[date].sessions || [];
            for (const session of daySessions.reverse()) {
                sessions.push({ ...session, date });
                if (sessions.length >= limit) break;
            }
            if (sessions.length >= limit) break;
        }

        return sessions;
    },

    // Export all data
    exportData() {
        return {
            settings: this.getSettings(),
            stats: this.getStats(),
            language: this.get('language', 'en'),
            theme: this.get('theme', 'dark'),
            exportDate: new Date().toISOString()
        };
    },

    // Import data
    importData(data) {
        try {
            if (data.settings) this.saveSettings(data.settings);
            if (data.stats) this.saveStats(data.stats);
            if (data.language) this.set('language', data.language);
            if (data.theme) this.set('theme', data.theme);
            return true;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    },

    // Clear all data
    clearAll() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(this.prefix));
        keys.forEach(k => localStorage.removeItem(k));
    }
};
