// Settings Module - Auto-save on every change
const Settings = {
    modal: null,
    saveTimeout: null,

    init() {
        this.modal = document.getElementById('settingsModal');
        this.loadSettings();
        this.bindEvents();
    },

    loadSettings() {
        const settings = Storage.getSettings();

        const setVal = (id, val, isChecked = false) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (isChecked) el.checked = val;
            else el.value = val;
        };

        setVal('focusDuration', settings.focusDuration);
        setVal('shortBreakDuration', settings.shortBreakDuration);
        setVal('longBreakDuration', settings.longBreakDuration);
        setVal('longBreakInterval', settings.longBreakInterval);
        setVal('autoStartBreaks', settings.autoStartBreaks, true);
        setVal('autoStartPomodoros', settings.autoStartPomodoros, true);
        setVal('alarmSound', settings.alarmSound);
        setVal('alarmVolume', settings.alarmVolume);
        setVal('dailyGoalCount', settings.dailyGoal);
        setVal('browserNotifications', settings.browserNotifications, true);
    },

    bindEvents() {
        // Close button
        const closeBtn = document.getElementById('closeSettings');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Click outside to close
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });
        }

        // Auto-save on ANY input change in modal
        const inputs = this.modal?.querySelectorAll('input, select');
        inputs?.forEach(input => {
            input.addEventListener('change', () => this.autoSave());
            input.addEventListener('input', () => this.debouncedSave());
        });

        // Notification permission button
        const notifBtn = document.getElementById('requestNotificationPermission');
        if (notifBtn) {
            notifBtn.addEventListener('click', async () => {
                const granted = await Notifications.requestPermission();
                if (granted && typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'success',
                        title: I18n.t('notificationsEnabled'),
                        showConfirmButton: false,
                        timer: 1500,
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)'
                    });
                }
            });
        }

        // Clear data with SweetAlert2
        const clearBtn = document.getElementById('clearData');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: I18n.t('clearDataTitle'),
                        text: I18n.t('clearDataText'),
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#6b7280',
                        confirmButtonText: I18n.t('clearDataConfirm'),
                        cancelButtonText: I18n.t('clearDataCancel'),
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Storage.clearAll();
                            Swal.fire({
                                icon: 'success',
                                title: I18n.t('clearDataSuccess'),
                                showConfirmButton: false,
                                timer: 1500,
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)'
                            }).then(() => {
                                location.reload();
                            });
                        }
                    });
                } else {
                    // Fallback for when Swal is not loaded
                    if (confirm(I18n.t('clearDataText'))) {
                        Storage.clearAll();
                        location.reload();
                    }
                }
            });
        }

        // Test alarm sound on change
        const alarmSound = document.getElementById('alarmSound');
        if (alarmSound) {
            alarmSound.addEventListener('change', (e) => {
                Sounds.playAlarm(e.target.value);
            });
        }
    },

    // Debounced save for text inputs
    debouncedSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => this.autoSave(), 300);
    },

    // Auto-save immediately
    autoSave() {
        const settings = this.getCurrentSettings();
        Storage.saveSettings(settings);

        // Update timer with new settings
        if (typeof App !== 'undefined' && App.timer) {
            App.timer.updateSettings(settings);
        }

        // Update sounds
        if (typeof Sounds !== 'undefined') {
            Sounds.setAlarmVolume(settings.alarmVolume);
        }

        // Update stats display
        if (typeof Stats !== 'undefined') {
            Stats.updateDisplay();
        }
    },

    getCurrentSettings() {
        return {
            focusDuration: parseInt(document.getElementById('focusDuration')?.value) || 25,
            shortBreakDuration: parseInt(document.getElementById('shortBreakDuration')?.value) || 5,
            longBreakDuration: parseInt(document.getElementById('longBreakDuration')?.value) || 15,
            longBreakInterval: parseInt(document.getElementById('longBreakInterval')?.value) || 4,
            autoStartBreaks: document.getElementById('autoStartBreaks')?.checked || false,
            autoStartPomodoros: document.getElementById('autoStartPomodoros')?.checked || false,
            alarmSound: document.getElementById('alarmSound')?.value || 'bell',
            alarmVolume: parseInt(document.getElementById('alarmVolume')?.value) || 80,
            dailyGoal: parseInt(document.getElementById('dailyGoalCount')?.value) || 8,
            browserNotifications: document.getElementById('browserNotifications')?.checked || false
        };
    },

    open() {
        this.loadSettings();
        this.modal?.classList.add('active');
    },

    close() {
        this.modal?.classList.remove('active');
    }
};
