// Notifications Module
const Notifications = {
    permission: 'default',
    originalTitle: 'Pomodoro Timer',

    init() {
        this.permission = Notification.permission;
        this.originalTitle = document.title;
    },

    async requestPermission() {
        if (!('Notification' in window)) {
            console.log('Notifications not supported');
            return false;
        }

        try {
            this.permission = await Notification.requestPermission();
            return this.permission === 'granted';
        } catch (e) {
            console.error('Notification permission error:', e);
            return false;
        }
    },

    show(title, options = {}) {
        if (this.permission !== 'granted') return;

        const notification = new Notification(title, {
            icon: 'icons/icon-192.png',
            badge: 'icons/icon-192.png',
            tag: 'pomodoro',
            renotify: true,
            ...options
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        return notification;
    },

    showPomodoroComplete() {
        this.show(I18n.t('pomodoroComplete'), {
            body: I18n.t('timeForBreak')
        });
    },

    showBreakComplete() {
        this.show(I18n.t('breakComplete'), {
            body: I18n.t('timeToFocus')
        });
    },

    showGoalReached() {
        this.show(I18n.t('goalReached'), {
            body: '🎉🍅🎉'
        });
    },

    // Update tab title with timer
    updateTitle(displayTime, mode, isRunning) {
        if (isRunning) {
            const modeEmoji = mode === 'focus' ? '🍅' : '☕';
            document.title = `${displayTime} ${modeEmoji} Pomodoro`;
        } else {
            document.title = this.originalTitle;
        }
    },

    resetTitle() {
        document.title = this.originalTitle;
    },

    // Update favicon with progress
    updateFavicon(progress, mode) {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = mode === 'focus' ? '#FF6B6B' : '#4ECDC4';
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fill();

        // Progress arc
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(16, 16, 11, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress));
        ctx.stroke();

        // Update favicon
        let favicon = document.querySelector('link[rel="icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.href = canvas.toDataURL();
    },

    resetFavicon() {
        let favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = 'icons/favicon.svg';
        }
    }
};
