// Motivational quotes
const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "It's not about having time, it's about making time.", author: "Unknown" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Productivity is never an accident. It is always the result of commitment.", author: "Paul J. Meyer" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
    { text: "Time is what we want most, but what we use worst.", author: "William Penn" }
];

// Main Application
const App = {
    timer: null,
    currentMode: 'focus',
    isFullscreen: false,

    init() {
        // Initialize core modules
        I18n.init();
        Notifications.init();
        Settings.init();
        Stats.init();

        // Initialize V2 Modules
        Achievements.init();
        Tags.init();
        Projects.init();
        Themes.init();
        Avatars.init();
        ClockStyles.init();

        // Initialize timer
        const settings = Storage.getSettings();
        this.timer = new PomodoroTimer(settings);

        // Set initial mode and theme on HTML element (for CSS :root selectors)
        document.documentElement.setAttribute('data-mode', 'focus');
        document.documentElement.setAttribute('data-theme', Storage.get('theme', 'dark'));

        // Bind events
        this.bindEvents();

        // Set up timer callbacks
        this.setupTimerCallbacks();

        // Load quotes
        this.updateDailyQuote();

        // Initialize Task Manager
        if (typeof Tasks !== 'undefined') Tasks.init();

        // Initialize Wellness
        if (typeof Wellness !== 'undefined') Wellness.init();

        // Initialize Ambient Sounds
        if (typeof AmbientSounds !== 'undefined') AmbientSounds.init();

        // Initial UI update
        this.updateTimerDisplay(this.timer.getState());
        Stats.updateDisplay();
        this.updateDailyQuote();
        ClockStyles.applyStyle();
    },

    bindEvents() {
        // Start/Pause button
        document.getElementById('startBtn').addEventListener('click', () => this.toggleTimer());

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => this.resetTimer());

        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Language dropdown is handled by I18n.bindDropdown()

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => Settings.open());

        // Stats button
        document.getElementById('statsBtn').addEventListener('click', () => this.openStats());

        // Close stats
        document.getElementById('closeStats').addEventListener('click', () => this.closeStats());
        document.getElementById('statsModal').addEventListener('click', (e) => {
            if (e.target.id === 'statsModal') this.closeStats();
        });

        // Fullscreen button
        document.getElementById('fullscreenBtn')?.addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('mainFullscreenBtn')?.addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('fsControlBtn').addEventListener('click', () => this.toggleTimer());
        document.getElementById('fsExitBtn').addEventListener('click', () => this.toggleFullscreen());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // ESC to exit fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.toggleFullscreen();
            }
        });

        // Panel toggle buttons - with SVG rotation
        const leftToggle = document.getElementById('leftPanelToggle');
        const rightToggle = document.getElementById('rightPanelToggle');
        const leftPanel = document.getElementById('leftPanel');
        const rightPanel = document.getElementById('rightPanel');

        if (leftToggle && leftPanel) {
            leftToggle.addEventListener('click', () => {
                leftPanel.classList.toggle('collapsed');
                const arrow = leftToggle.querySelector('.toggle-arrow');
                if (arrow) {
                    arrow.style.transform = leftPanel.classList.contains('collapsed') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        }

        if (rightToggle && rightPanel) {
            rightToggle.addEventListener('click', () => {
                rightPanel.classList.toggle('collapsed');
                const arrow = rightToggle.querySelector('.toggle-arrow');
                if (arrow) {
                    arrow.style.transform = rightPanel.classList.contains('collapsed') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        }

        // Quick settings adjusters
        document.querySelectorAll('.adj-btn').forEach(btn => {
            btn.addEventListener('click', () => this.adjustQuickSetting(btn));
        });

        // Theme mini picker
        document.querySelectorAll('.theme-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                document.documentElement.setAttribute('data-theme', dot.dataset.theme);
                Storage.set('theme', dot.dataset.theme);
                document.getElementById('themeIcon').textContent = dot.dataset.theme === 'dark' ? '🌙' : '☀️';
            });
        });
    },

    setupTimerCallbacks() {
        this.timer.on('onTick', (state) => {
            this.updateTimerDisplay(state);
            Notifications.updateTitle(state.displayTime, state.mode, state.isRunning);
            if (state.isRunning) {
                Notifications.updateFavicon(state.progress, state.mode);
            }
        });

        this.timer.on('onComplete', (data) => {
            const settings = Storage.getSettings();

            // Play alarm
            Sounds.playAlarm(settings.alarmSound);

            if (data.mode === 'focus') {
                // Save completed pomodoro with tag and project
                const note = document.getElementById('sessionNotes').value;
                const tagId = Tags.currentTag;
                const projectId = Projects.currentProject;
                Storage.addPomodoro(settings.focusDuration, note, tagId, projectId);

                // Update project stats
                if (projectId) {
                    Projects.addPomodoroToProject(projectId, settings.focusDuration);
                }

                Stats.updateDisplay();

                // Check achievements
                const stats = Storage.getStats();
                Achievements.check(stats);

                // Check water reminder
                if (Wellness.checkWaterReminder()) {
                    setTimeout(() => Wellness.showWaterReminder(), 2000);
                }

                // Show notification
                if (settings.browserNotifications) {
                    Notifications.showPomodoroComplete();
                }

                // Check daily goal
                const todayCount = Storage.getTodayPomodoros();
                if (todayCount === settings.dailyGoal) {
                    Notifications.showGoalReached();
                    // Update goals reached count for achievements
                    const updatedStats = Storage.getStats();
                    updatedStats.goalsReached = (updatedStats.goalsReached || 0) + 1;
                    Storage.set('stats', updatedStats);
                }

                // Show Wellness tip
                if (typeof Wellness !== 'undefined') {
                    setTimeout(() => Wellness.showRandom(), 1500);
                }

                // Auto-start break
                if (settings.autoStartBreaks) {
                    setTimeout(() => this.timer.start(), 1000);
                }
            } else {
                // Break completed
                if (settings.browserNotifications) {
                    Notifications.showBreakComplete();
                }

                // Auto-start pomodoro
                if (settings.autoStartPomodoros) {
                    setTimeout(() => this.timer.start(), 1000);
                }

                // Show new quote and update project motivation
                this.showRandomQuote();
                Projects.updateMotivationDisplay();
            }

            this.updateTimerDisplay(this.timer.getState());
        });

        this.timer.on('onStateChange', (data) => {
            this.updateControlButtons();
            if (data.mode) {
                this.updateModeUI(data.mode);
            }
        });
    },

    toggleTimer() {
        this.timer.toggle();
        this.updateControlButtons();

        // Add running class for animation
        const timerContainer = document.querySelector('.timer-container');
        const appLayout = document.getElementById('appLayout');

        if (this.timer.isRunning) {
            timerContainer.classList.add('running');
            // Focus mode - hide panels
            if (appLayout) appLayout.setAttribute('data-focus', 'active');
        } else {
            timerContainer.classList.remove('running');
            // Show panels again
            if (appLayout) appLayout.removeAttribute('data-focus');
        }
    },

    resetTimer() {
        this.timer.reset();
        Notifications.resetTitle();
        Notifications.resetFavicon();
        document.querySelector('.timer-container').classList.remove('running');
    },

    switchMode(mode) {
        // Confirm switching if timer is running and mode is different
        if (this.timer.isRunning && mode !== this.currentMode) {
            const confirmed = confirm(I18n.t('stopTimerFirst'));
            if (!confirmed) return;

            // User confirmed stop
            this.timer.pause();
            document.querySelector('.timer-container').classList.remove('running');

            // Reset start button text/icon
            const startBtn = document.getElementById('startBtn');
            if (startBtn) {
                startBtn.innerHTML = `<span class="btn-icon">▶</span> ${I18n.t('start')}`;
            }
        }

        // Update UI FIRST before timer (in case timer callback errors)
        this.currentMode = mode;
        this.updateModeUI(mode);

        // Now update timer
        this.timer.setMode(mode);

        // Manually update display in case callback failed
        this.updateTimerDisplay(this.timer.getState());

        Notifications.resetTitle();
        Notifications.resetFavicon();
    },

    updateModeUI(mode) {
        console.log('updateModeUI called with mode:', mode);

        // Set data-mode on both html and body for CSS variables to work
        document.documentElement.setAttribute('data-mode', mode);
        document.body.setAttribute('data-mode', mode);

        // Update mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            const isActive = btn.dataset.mode === mode;
            console.log('Button:', btn.dataset.mode, 'isActive:', isActive);
            btn.classList.remove('active');
            if (isActive) {
                btn.classList.add('active');
            }
        });

        // Update timer label
        let labelKey;
        if (mode === 'focus') {
            labelKey = 'focusTime';
        } else if (mode === 'shortBreak') {
            labelKey = 'breakTime';
        } else {
            labelKey = 'breakTime';
        }

        const timerLabel = document.getElementById('timerLabel');
        const fsTimerLabel = document.getElementById('fsTimerLabel');

        if (timerLabel) timerLabel.textContent = I18n.t(labelKey);
        if (fsTimerLabel) fsTimerLabel.textContent = I18n.t(labelKey);
    },

    updateTimerDisplay(state) {
        const timerDisplay = document.getElementById('timerDisplay');
        const fsTimerDisplay = document.getElementById('fsTimerDisplay');

        if (timerDisplay) timerDisplay.textContent = state.displayTime;
        if (fsTimerDisplay) fsTimerDisplay.textContent = state.displayTime;

        // Update progress circle
        const circumference = 565.48;
        const offset = circumference * state.progress;

        const timerProgress = document.querySelector('.timer-progress');
        const fsTimerProgress = document.querySelector('.fs-timer-progress');

        if (timerProgress) timerProgress.style.strokeDashoffset = offset;
        if (fsTimerProgress) fsTimerProgress.style.strokeDashoffset = offset;
    },

    updateControlButtons() {
        const startBtn = document.getElementById('startBtn');
        const fsControlBtn = document.getElementById('fsControlBtn');
        const isRunning = this.timer.isRunning;

        startBtn.querySelector('.btn-icon').textContent = isRunning ? '⏸' : '▶';
        startBtn.querySelector('[data-i18n]').textContent = isRunning ? I18n.t('pause') : I18n.t('start');

        fsControlBtn.querySelector('.fs-btn-icon').textContent = isRunning ? '⏸' : '▶';
    },

    toggleTheme() {
        if (typeof Themes !== 'undefined') {
            Themes.toggle();
        } else {
            // Fallback for safety
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            Storage.set('theme', newTheme);
            document.getElementById('themeIcon').textContent = newTheme === 'dark' ? '🌙' : '☀️';
        }
    },

    toggleFullscreen() {
        // Try both classes to be safe with CSS/HTML updates
        const container = document.querySelector('.fs-timer-container') || document.querySelector('.fullscreen-mode');

        if (!container) {
            console.error('Fullscreen container not found!');
            return;
        }

        if (!this.isFullscreen) {
            container.classList.add('active');
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(e => console.log(e));
            }
            // Render ambient sounds immediately
            if (typeof AmbientSounds !== 'undefined') AmbientSounds.renderFullscreen();
        } else {
            container.classList.remove('active');
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(e => console.log(e));
            }
        }

        this.isFullscreen = !this.isFullscreen;
    },

    toggleSound(btn) {
        const sound = btn.dataset.sound;

        document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));

        if (sound !== 'none' && AmbientSounds.currentSound !== sound) {
            btn.classList.add('active');
        }

        AmbientSounds.toggle(sound);
    },

    loadSpotify() {
        const url = document.getElementById('spotifyUrl').value.trim();
        if (!url) return;

        // Extract playlist ID
        const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
        if (!match) {
            alert('Invalid Spotify URL');
            return;
        }

        const playlistId = match[1];
        const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;

        document.getElementById('spotifyEmbed').innerHTML = `
            <iframe src="${embedUrl}" width="100%" height="152" frameBorder="0" 
                allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"></iframe>
        `;
    },

    handleKeyboard(e) {
        // Ignore if in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.toggleTimer();
                break;
            case 'KeyR':
                this.resetTimer();
                break;
            case 'Digit1':
            case 'Numpad1':
                this.switchMode('focus');
                break;
            case 'Digit2':
            case 'Numpad2':
                this.switchMode('shortBreak');
                break;
            case 'Digit3':
            case 'Numpad3':
                this.switchMode('longBreak');
                break;
            case 'KeyF':
                this.toggleFullscreen();
                break;
        }
    },

    openStats() {
        document.getElementById('statsModal').classList.add('active');
        Stats.initCharts();
    },

    closeStats() {
        document.getElementById('statsModal').classList.remove('active');
    },

    showRandomQuote() {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('quoteText').textContent = `"${quote.text}"`;
        document.getElementById('quoteAuthor').textContent = `- ${quote.author}`;
    },

    updateTitle() {
        const state = this.timer.getState();
        if (this.timer.isRunning) {
            Notifications.updateTitle(state.displayTime, state.mode, true);
        }
    },

    adjustQuickSetting(btn) {
        const target = btn.dataset.target;
        const delta = parseInt(btn.dataset.delta);
        const settings = Storage.getSettings();

        if (target === 'focus') {
            settings.focusDuration = Math.max(5, Math.min(120, settings.focusDuration + delta));
            document.getElementById('quickFocusTime').textContent = settings.focusDuration;
            document.getElementById('focusDuration').value = settings.focusDuration;
        } else if (target === 'short') {
            settings.shortBreakDuration = Math.max(1, Math.min(30, settings.shortBreakDuration + delta));
            document.getElementById('quickShortTime').textContent = settings.shortBreakDuration;
            document.getElementById('shortBreakDuration').value = settings.shortBreakDuration;
        }

        Storage.saveSettings(settings);

        // Update timer if not running
        if (!this.timer.isRunning) {
            this.timer.setDurations(settings);
            this.updateTimerDisplay(this.timer.getState());
        }
    },

    // Load daily motivation quote based on current language
    updateDailyQuote() {
        const quote = I18n.getDailyQuote();
        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');

        if (quoteText && quote) {
            quoteText.textContent = `"${quote.text}"`;
        }
        if (quoteAuthor && quote) {
            quoteAuthor.textContent = `- ${quote.author}`;
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

// Register Service Worker for Offline Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => console.log('Service Worker registered:', reg.scope))
            .catch((err) => console.error('SW registration failed:', err));
    });
}

