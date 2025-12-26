// Timer Class
class PomodoroTimer {
    constructor(options = {}) {
        this.modes = {
            focus: options.focusDuration || 25,
            shortBreak: options.shortBreakDuration || 5,
            longBreak: options.longBreakDuration || 15
        };
        this.currentMode = 'focus';
        this.timeRemaining = this.modes.focus * 60;
        this.totalTime = this.timeRemaining;
        this.isRunning = false;
        this.interval = null;
        this.sessionsCompleted = 0;
        this.longBreakInterval = options.longBreakInterval || 4;

        this.callbacks = {
            onTick: null,
            onComplete: null,
            onStateChange: null
        };
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.interval = setInterval(() => this.tick(), 1000);
        this.triggerCallback('onStateChange', { isRunning: true });
    }

    pause() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearInterval(this.interval);
        this.interval = null;
        this.triggerCallback('onStateChange', { isRunning: false });
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    reset() {
        this.pause();
        this.timeRemaining = this.modes[this.currentMode] * 60;
        this.totalTime = this.timeRemaining;
        this.triggerCallback('onTick', this.getState());
    }

    skip() {
        this.pause();
        this.complete();
    }

    setMode(mode) {
        if (!this.modes[mode]) return;
        this.pause();
        this.currentMode = mode;
        this.timeRemaining = this.modes[mode] * 60;
        this.totalTime = this.timeRemaining;
        this.triggerCallback('onTick', this.getState());
        this.triggerCallback('onStateChange', { mode });
    }

    updateSettings(settings) {
        if (settings.focusDuration) this.modes.focus = settings.focusDuration;
        if (settings.shortBreakDuration) this.modes.shortBreak = settings.shortBreakDuration;
        if (settings.longBreakDuration) this.modes.longBreak = settings.longBreakDuration;
        if (settings.longBreakInterval) this.longBreakInterval = settings.longBreakInterval;

        // Reset current timer with new duration
        if (!this.isRunning) {
            this.timeRemaining = this.modes[this.currentMode] * 60;
            this.totalTime = this.timeRemaining;
            this.triggerCallback('onTick', this.getState());
        }
    }

    setDurations(settings) {
        this.updateSettings(settings);
    }

    tick() {
        this.timeRemaining--;
        this.triggerCallback('onTick', this.getState());

        if (this.timeRemaining <= 0) {
            this.complete();
        }
    }

    complete() {
        this.pause();
        const completedMode = this.currentMode;

        if (this.currentMode === 'focus') {
            this.sessionsCompleted++;
        }

        this.triggerCallback('onComplete', {
            mode: completedMode,
            sessionsCompleted: this.sessionsCompleted
        });

        // Auto switch to next mode
        this.autoSwitchMode();
    }

    autoSwitchMode() {
        if (this.currentMode === 'focus') {
            // After focus, go to break
            if (this.sessionsCompleted % this.longBreakInterval === 0) {
                this.setMode('longBreak');
            } else {
                this.setMode('shortBreak');
            }
        } else {
            // After break, go to focus
            this.setMode('focus');
        }
    }

    getState() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const progress = 1 - (this.timeRemaining / this.totalTime);

        return {
            mode: this.currentMode,
            timeRemaining: this.timeRemaining,
            totalTime: this.totalTime,
            minutes,
            seconds,
            progress,
            isRunning: this.isRunning,
            sessionsCompleted: this.sessionsCompleted,
            displayTime: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        };
    }

    on(event, callback) {
        if (this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event] = callback;
        }
    }

    triggerCallback(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event](data);
        }
    }

    resetSessions() {
        this.sessionsCompleted = 0;
    }
}
