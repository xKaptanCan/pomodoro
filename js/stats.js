// Stats Module
const Stats = {
    weeklyChart: null,
    monthlyChart: null,

    init() {
        // Charts will be initialized when modal opens
        this.updateDisplay();
        this.updateWeekDots();
    },

    updateDisplay() {
        const stats = Storage.getStats();
        const settings = Storage.getSettings();

        // Update left panel stat cards
        const todayPomodorosEl = document.getElementById('todayPomodoros');
        const todayMinutesEl = document.getElementById('todayMinutes');

        if (todayPomodorosEl) todayPomodorosEl.textContent = Storage.getTodayPomodoros();
        if (todayMinutesEl) todayMinutesEl.textContent = Storage.getTodayMinutes();

        // Update goal progress bar and text
        const todayCount = Storage.getTodayPomodoros();
        const goalFill = document.getElementById('goalFill');
        const goalText = document.getElementById('goalText');

        if (goalFill) {
            const progress = Math.min((todayCount / settings.dailyGoal) * 100, 100);
            goalFill.style.width = progress + '%';
        }
        if (goalText) goalText.textContent = `${todayCount}/${settings.dailyGoal}`;

        // Update session dots
        this.updateSessionDots(todayCount, settings.dailyGoal);

        // Update stats modal if open
        const totalPomodorosEl = document.getElementById('totalPomodoros');
        const currentStreakEl = document.getElementById('currentStreak');
        const bestStreakEl = document.getElementById('bestStreak');
        const totalTimeEl = document.getElementById('totalTime');

        if (totalPomodorosEl) totalPomodorosEl.textContent = stats.totalPomodoros;
        if (currentStreakEl) currentStreakEl.textContent = stats.currentStreak;
        if (bestStreakEl) bestStreakEl.textContent = stats.bestStreak || stats.currentStreak;
        if (totalTimeEl) totalTimeEl.textContent = Math.floor(stats.totalMinutes / 60) + 'h';

        // Update week dots
        this.updateWeekDots();
    },

    updateSessionDots(completed, goal) {
        const container = document.getElementById('sessionDots');
        if (!container) return;

        container.innerHTML = '';

        const maxDots = Math.min(goal, 8);
        for (let i = 0; i < maxDots; i++) {
            const dot = document.createElement('span');
            dot.className = 'session-dot' + (i < completed ? ' completed' : '');
            container.appendChild(dot);
        }

        const countEl = document.getElementById('sessionCount');
        if (countEl) countEl.textContent = `${Math.min(completed, goal)}/${goal}`;
    },

    updateWeekDots() {
        const weekData = Storage.getWeekData();
        const weekDots = document.getElementById('weekDots');
        if (!weekDots) return;

        const dayFills = weekDots.querySelectorAll('.day-fill');
        const settings = Storage.getSettings();
        const todayKey = Storage.getTodayKey();

        dayFills.forEach((fill, index) => {
            if (weekData[index]) {
                const dayData = weekData[index];
                const progress = Math.min((dayData.pomodoros / settings.dailyGoal) * 100, 100);

                fill.classList.remove('active', 'today');
                if (dayData.pomodoros > 0) {
                    fill.classList.add('active');
                    fill.style.setProperty('--fill-percent', progress + '%');
                }
                if (dayData.date === todayKey) {
                    fill.classList.add('today');
                }
            }
        });
    },

    initCharts() {
        this.initWeeklyChart();
        this.initMonthlyChart();
        this.updateHistoryList();
    },

    initWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        const weekData = Storage.getWeekData();
        const days = [
            I18n.t('sunday'), I18n.t('monday'), I18n.t('tuesday'),
            I18n.t('wednesday'), I18n.t('thursday'), I18n.t('friday'), I18n.t('saturday')
        ];

        if (this.weeklyChart) {
            this.weeklyChart.destroy();
        }

        this.weeklyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weekData.map(d => days[d.day]),
                datasets: [{
                    label: I18n.t('pomodoros'),
                    data: weekData.map(d => d.pomodoros),
                    backgroundColor: 'rgba(255, 107, 107, 0.8)',
                    borderColor: '#FF6B6B',
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: '#a0a0b0' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    x: {
                        ticks: { color: '#a0a0b0' },
                        grid: { display: false }
                    }
                }
            }
        });
    },

    initMonthlyChart() {
        const ctx = document.getElementById('monthlyChart');
        if (!ctx) return;

        const monthData = Storage.getMonthData();

        if (this.monthlyChart) {
            this.monthlyChart.destroy();
        }

        this.monthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthData.map((d, i) => i % 5 === 0 ? d.date.slice(5) : ''),
                datasets: [{
                    label: I18n.t('pomodoros'),
                    data: monthData.map(d => d.pomodoros),
                    borderColor: '#4ECDC4',
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: '#a0a0b0' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    x: {
                        ticks: { color: '#a0a0b0' },
                        grid: { display: false }
                    }
                }
            }
        });
    },

    updateHistoryList() {
        const container = document.getElementById('historyList');
        if (!container) return;

        const sessions = Storage.getRecentSessions(10);

        if (sessions.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No sessions yet</p>';
            return;
        }

        container.innerHTML = sessions.map(s => `
            <div class="history-item">
                <span class="history-item-date">${new Date(s.time).toLocaleDateString()} ${new Date(s.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span class="history-item-count">🍅 ${s.minutes} min</span>
            </div>
        `).join('');
    }
};
