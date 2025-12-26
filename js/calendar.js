// Calendar Module - GitHub-style Heatmap
const Calendar = {
    init() { },

    getYearData() {
        const stats = Storage.getStats();
        const data = [];
        const today = new Date();

        // Get data for last 365 days
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            const dayData = stats.dailyData?.[key];

            data.push({
                date: key,
                dayOfWeek: date.getDay(),
                pomodoros: dayData?.pomodoros || 0,
                minutes: dayData?.minutes || 0
            });
        }

        return data;
    },

    getIntensity(pomodoros) {
        if (pomodoros === 0) return 0;
        if (pomodoros <= 2) return 1;
        if (pomodoros <= 4) return 2;
        if (pomodoros <= 6) return 3;
        return 4;
    },

    render(container) {
        const data = this.getYearData();
        const weeks = [];
        let currentWeek = [];

        // Organize data into weeks
        data.forEach((day, index) => {
            if (day.dayOfWeek === 0 && currentWeek.length > 0) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push(day);
        });
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        // Calculate stats
        const totalPomodoros = data.reduce((sum, d) => sum + d.pomodoros, 0);
        const activeDays = data.filter(d => d.pomodoros > 0).length;
        const avgPerDay = activeDays > 0 ? (totalPomodoros / activeDays).toFixed(1) : 0;

        const dayNames = I18n.currentLang === 'tr'
            ? ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
            : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        container.innerHTML = `
            <div class="calendar-stats">
                <div class="calendar-stat">
                    <span class="stat-value">${totalPomodoros}</span>
                    <span class="stat-label">${I18n.currentLang === 'tr' ? 'Toplam Pomodoro' : 'Total Pomodoros'}</span>
                </div>
                <div class="calendar-stat">
                    <span class="stat-value">${activeDays}</span>
                    <span class="stat-label">${I18n.currentLang === 'tr' ? 'Aktif Gün' : 'Active Days'}</span>
                </div>
                <div class="calendar-stat">
                    <span class="stat-value">${avgPerDay}</span>
                    <span class="stat-label">${I18n.currentLang === 'tr' ? 'Günlük Ort.' : 'Daily Avg'}</span>
                </div>
            </div>
            <div class="calendar-heatmap">
                <div class="calendar-days">
                    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<div class="day-label">${dayNames[i]}</div>`).join('')}
                </div>
                <div class="calendar-grid">
                    ${weeks.map(week => `
                        <div class="calendar-week">
                            ${week.map(day => `
                                <div class="calendar-cell intensity-${this.getIntensity(day.pomodoros)}" 
                                     title="${day.date}: ${day.pomodoros} 🍅"
                                     data-date="${day.date}">
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="calendar-legend">
                <span>${I18n.currentLang === 'tr' ? 'Az' : 'Less'}</span>
                <div class="legend-cells">
                    <div class="calendar-cell intensity-0"></div>
                    <div class="calendar-cell intensity-1"></div>
                    <div class="calendar-cell intensity-2"></div>
                    <div class="calendar-cell intensity-3"></div>
                    <div class="calendar-cell intensity-4"></div>
                </div>
                <span>${I18n.currentLang === 'tr' ? 'Çok' : 'More'}</span>
            </div>
        `;
    }
};

// Productivity Insights Module
const Insights = {
    getHourlyData() {
        const stats = Storage.getStats();
        const hourlyData = Array(24).fill(0);

        Object.values(stats.dailyData || {}).forEach(day => {
            (day.sessions || []).forEach(session => {
                const hour = new Date(session.time).getHours();
                hourlyData[hour]++;
            });
        });

        return hourlyData;
    },

    getMostProductiveHour() {
        const hourlyData = this.getHourlyData();
        const maxIndex = hourlyData.indexOf(Math.max(...hourlyData));
        return maxIndex;
    },

    getTrendData() {
        const stats = Storage.getStats();
        const today = new Date();

        // This week
        let thisWeekPomodoros = 0;
        let lastWeekPomodoros = 0;

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            thisWeekPomodoros += stats.dailyData?.[key]?.pomodoros || 0;
        }

        for (let i = 7; i < 14; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split('T')[0];
            lastWeekPomodoros += stats.dailyData?.[key]?.pomodoros || 0;
        }

        const change = lastWeekPomodoros > 0
            ? ((thisWeekPomodoros - lastWeekPomodoros) / lastWeekPomodoros * 100).toFixed(0)
            : thisWeekPomodoros > 0 ? 100 : 0;

        return {
            thisWeek: thisWeekPomodoros,
            lastWeek: lastWeekPomodoros,
            change: parseInt(change),
            trend: thisWeekPomodoros >= lastWeekPomodoros ? 'up' : 'down'
        };
    },

    render(container) {
        const hourlyData = this.getHourlyData();
        const maxHourly = Math.max(...hourlyData, 1);
        const productiveHour = this.getMostProductiveHour();
        const trend = this.getTrendData();

        const getMessage = () => {
            if (I18n.currentLang === 'tr') {
                if (productiveHour >= 5 && productiveHour < 12) return '☀️ Sen bir sabah insanısın!';
                if (productiveHour >= 12 && productiveHour < 17) return '🌤️ Öğleden sonraları parlıyorsun!';
                if (productiveHour >= 17 && productiveHour < 21) return '🌆 Akşamları en verimlisin!';
                return '🌙 Gece kuşusun!';
            } else {
                if (productiveHour >= 5 && productiveHour < 12) return '☀️ You\'re a morning person!';
                if (productiveHour >= 12 && productiveHour < 17) return '🌤️ You shine in the afternoon!';
                if (productiveHour >= 17 && productiveHour < 21) return '🌆 Evenings are your peak!';
                return '🌙 You\'re a night owl!';
            }
        };

        container.innerHTML = `
            <div class="insights-section">
                <h4>${I18n.currentLang === 'tr' ? 'En Verimli Saatler' : 'Most Productive Hours'}</h4>
                <div class="hourly-chart">
                    ${hourlyData.map((count, hour) => `
                        <div class="hour-bar" style="--height: ${(count / maxHourly) * 100}%">
                            <div class="hour-fill ${hour === productiveHour ? 'peak' : ''}"></div>
                            <span class="hour-label">${hour}</span>
                        </div>
                    `).join('')}
                </div>
                <p class="insight-message">${getMessage()}</p>
            </div>
            
            <div class="insights-section">
                <h4>${I18n.currentLang === 'tr' ? 'Haftalık Trend' : 'Weekly Trend'}</h4>
                <div class="trend-comparison">
                    <div class="trend-week">
                        <span class="trend-value">${trend.thisWeek}</span>
                        <span class="trend-label">${I18n.currentLang === 'tr' ? 'Bu Hafta' : 'This Week'}</span>
                    </div>
                    <div class="trend-arrow ${trend.trend}">
                        ${trend.trend === 'up' ? '📈' : '📉'}
                        <span class="trend-change ${trend.trend}">${trend.change > 0 ? '+' : ''}${trend.change}%</span>
                    </div>
                    <div class="trend-week">
                        <span class="trend-value">${trend.lastWeek}</span>
                        <span class="trend-label">${I18n.currentLang === 'tr' ? 'Geçen Hafta' : 'Last Week'}</span>
                    </div>
                </div>
            </div>
        `;
    }
};
