// Achievements Module
const Achievements = {
    definitions: [
        { id: 'first_step', icon: '🌱', name: 'First Step', nametr: 'İlk Adım', desc: 'Complete your first pomodoro', desctr: 'İlk pomodoroyu tamamla', check: (s) => s.totalPomodoros >= 1 },
        { id: 'fire_started', icon: '🔥', name: 'Fire Started', nametr: 'Ateş Başladı', desc: 'Complete 5 pomodoros', desctr: '5 pomodoro tamamla', check: (s) => s.totalPomodoros >= 5 },
        { id: 'star', icon: '⭐', name: 'Star', nametr: 'Yıldız', desc: 'Complete 25 pomodoros', desctr: '25 pomodoro tamamla', check: (s) => s.totalPomodoros >= 25 },
        { id: 'diamond', icon: '💎', name: 'Diamond', nametr: 'Elmas', desc: 'Complete 100 pomodoros', desctr: '100 pomodoro tamamla', check: (s) => s.totalPomodoros >= 100 },
        { id: 'runner', icon: '🏃', name: 'Runner', nametr: 'Koşucu', desc: '3 day streak', desctr: '3 gün art arda', check: (s) => s.currentStreak >= 3 },
        { id: 'lion', icon: '🦁', name: 'Lion', nametr: 'Aslan', desc: '7 day streak', desctr: '7 gün art arda', check: (s) => s.currentStreak >= 7 },
        { id: 'dragon', icon: '🐉', name: 'Dragon', nametr: 'Ejderha', desc: '30 day streak', desctr: '30 gün art arda', check: (s) => s.currentStreak >= 30 },
        { id: 'night_owl', icon: '🌙', name: 'Night Owl', nametr: 'Gece Kuşu', desc: 'Pomodoro after midnight', desctr: 'Gece yarısından sonra pomodoro', check: (s, ctx) => ctx?.hour >= 0 && ctx?.hour < 5 },
        { id: 'early_bird', icon: '☀️', name: 'Early Bird', nametr: 'Erken Kalkan', desc: 'Pomodoro before 6 AM', desctr: 'Sabah 6\'dan önce pomodoro', check: (s, ctx) => ctx?.hour >= 5 && ctx?.hour < 6 },
        { id: 'goal_achiever', icon: '🎯', name: 'Goal Achiever', nametr: 'Hedefçi', desc: 'Reach daily goal 10 times', desctr: 'Günlük hedefe 10 kez ulaş', check: (s) => s.goalsReached >= 10 },
        { id: 'speed_demon', icon: '⚡', name: 'Speed Demon', nametr: 'Hız Canavarı', desc: '12 pomodoros in one day', desctr: 'Bir günde 12 pomodoro', check: (s, ctx) => ctx?.todayPomodoros >= 12 },
        { id: 'legend', icon: '👑', name: 'Legend', nametr: 'Efsane', desc: 'Unlock all achievements', desctr: 'Tüm başarımları aç', check: (s) => s.unlockedCount >= 11 }
    ],

    init() {
        this.unlocked = Storage.get('achievements', []);
    },

    check(stats, context = {}) {
        const newUnlocks = [];
        const hour = new Date().getHours();
        const todayPomodoros = Storage.getTodayPomodoros();

        const ctx = { ...context, hour, todayPomodoros };

        for (const achievement of this.definitions) {
            if (!this.unlocked.includes(achievement.id)) {
                const checkStats = { ...stats, unlockedCount: this.unlocked.length };
                if (achievement.check(checkStats, ctx)) {
                    this.unlocked.push(achievement.id);
                    newUnlocks.push(achievement);
                }
            }
        }

        if (newUnlocks.length > 0) {
            Storage.set('achievements', this.unlocked);
            newUnlocks.forEach(a => this.showNotification(a));
        }

        return newUnlocks;
    },

    showNotification(achievement) {
        const name = I18n.currentLang === 'tr' ? achievement.nametr : achievement.name;
        const desc = I18n.currentLang === 'tr' ? achievement.desctr : achievement.desc;

        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'achievement-toast animate-slideUp';
        toast.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">${I18n.currentLang === 'tr' ? 'Başarım Açıldı!' : 'Achievement Unlocked!'}</div>
                <div class="achievement-name">${name}</div>
                <div class="achievement-desc">${desc}</div>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('animate-fadeOut');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    getAll() {
        return this.definitions.map(a => ({
            ...a,
            unlocked: this.unlocked.includes(a.id)
        }));
    },

    getUnlockedCount() {
        return this.unlocked.length;
    },

    renderGrid(container) {
        const achievements = this.getAll();
        container.innerHTML = achievements.map(a => `
            <div class="achievement-card ${a.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${a.unlocked ? a.icon : '🔒'}</div>
                <div class="achievement-name">${I18n.currentLang === 'tr' ? a.nametr : a.name}</div>
                <div class="achievement-desc">${I18n.currentLang === 'tr' ? a.desctr : a.desc}</div>
            </div>
        `).join('');
    }
};
