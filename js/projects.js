// Projects Module
const Projects = {
    motivationalMessages: {
        en: [
            "You're doing great! Keep going! 💪",
            "Every pomodoro brings you closer to success! 🎯",
            "Focus mode: ON. Distractions: OFF. 🔥",
            "You've got this! Stay focused! ⭐",
            "Progress, not perfection. Keep it up! 🚀",
            "Small steps lead to big achievements! 🏆",
            "Your future self will thank you! 🙌",
            "Crushing it one pomodoro at a time! 💎",
            "Stay in the zone! You're unstoppable! ⚡",
            "Building great things, one focus session at a time! 🌟"
        ],
        tr: [
            "Harika gidiyorsun! Devam et! 💪",
            "Her pomodoro seni başarıya yaklaştırıyor! 🎯",
            "Odak modu: AÇIK. Dikkat dağıtıcılar: KAPALI. 🔥",
            "Başarabilirsin! Odaklanmaya devam! ⭐",
            "Mükemmellik değil, ilerleme. Böyle devam! 🚀",
            "Küçük adımlar büyük başarılara götürür! 🏆",
            "Gelecekteki sen bunun için teşekkür edecek! 🙌",
            "Her pomodoroda bir adım daha ileri! 💎",
            "Bölgede kal! Durdurulamazsın! ⚡",
            "Harika şeyler inşa ediyorsun! 🌟"
        ]
    },

    init() {
        const saved = Storage.get('projects', null);
        if (!saved) {
            Storage.set('projects', []);
        }
        this.currentProject = Storage.get('currentProject', null);
    },

    getAll() {
        return Storage.get('projects', []);
    },

    add(project) {
        const projects = this.getAll();
        project.id = 'proj_' + Date.now();
        project.createdAt = new Date().toISOString();
        project.pomodoros = 0;
        project.minutes = 0;
        projects.push(project);
        Storage.set('projects', projects);
        return project;
    },

    update(id, updates) {
        const projects = this.getAll();
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...updates };
            Storage.set('projects', projects);
        }
    },

    delete(id) {
        const projects = this.getAll().filter(p => p.id !== id);
        Storage.set('projects', projects);
        if (this.currentProject === id) {
            this.clearCurrentProject();
        }
    },

    setCurrentProject(projectId) {
        this.currentProject = projectId;
        Storage.set('currentProject', projectId);
        this.updateMotivationDisplay();
    },

    getCurrentProject() {
        if (!this.currentProject) return null;
        return this.getAll().find(p => p.id === this.currentProject);
    },

    clearCurrentProject() {
        this.currentProject = null;
        Storage.set('currentProject', null);
    },

    addPomodoroToProject(projectId, minutes) {
        const projects = this.getAll();
        const index = projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            projects[index].pomodoros++;
            projects[index].minutes += minutes;
            Storage.set('projects', projects);
        }
    },

    getRandomMotivation() {
        const lang = I18n.currentLang;
        const messages = this.motivationalMessages[lang] || this.motivationalMessages.en;
        return messages[Math.floor(Math.random() * messages.length)];
    },

    updateMotivationDisplay() {
        const project = this.getCurrentProject();
        const container = document.getElementById('projectMotivation');
        if (!container) return;

        if (project) {
            const motivation = this.getRandomMotivation();
            container.innerHTML = `
                <div class="project-display">
                    <div class="project-badge" style="background: ${project.color || '#667eea'}">
                        ${project.icon || '📁'}
                    </div>
                    <div class="project-info">
                        <div class="project-name">${project.name}</div>
                        <div class="project-motivation">${motivation}</div>
                    </div>
                </div>
            `;
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    },

    renderSelector(container, onSelect) {
        const projects = this.getAll();
        const currentId = this.currentProject;

        container.innerHTML = `
            <div class="project-selector">
                <button class="project-chip ${!currentId ? 'active' : ''}" data-project="">
                    <span>📁</span>
                    <span>${I18n.currentLang === 'tr' ? 'Proje Yok' : 'No Project'}</span>
                </button>
                ${projects.map(p => `
                    <button class="project-chip ${p.id === currentId ? 'active' : ''}" 
                            data-project="${p.id}"
                            style="--project-color: ${p.color || '#667eea'}">
                        <span>${p.icon || '📁'}</span>
                        <span>${p.name}</span>
                        <small>${p.pomodoros || 0} 🍅</small>
                    </button>
                `).join('')}
                <button class="project-chip add-new" id="addNewProject">
                    <span>➕</span>
                    <span>${I18n.currentLang === 'tr' ? 'Yeni Proje' : 'New Project'}</span>
                </button>
            </div>
        `;

        container.querySelectorAll('.project-chip:not(.add-new)').forEach(chip => {
            chip.addEventListener('click', () => {
                const projectId = chip.dataset.project;
                this.setCurrentProject(projectId || null);
                container.querySelectorAll('.project-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                if (onSelect) onSelect(projectId || null);
            });
        });

        document.getElementById('addNewProject')?.addEventListener('click', () => {
            this.showAddProjectModal();
        });
    },

    showAddProjectModal() {
        const name = prompt(I18n.currentLang === 'tr' ? 'Proje adı:' : 'Project name:');
        if (name && name.trim()) {
            const project = this.add({
                name: name.trim(),
                color: '#667eea',
                icon: '📁'
            });
            this.setCurrentProject(project.id);
            // Refresh selector if exists
            const container = document.getElementById('projectSelectorContainer');
            if (container) {
                this.renderSelector(container);
            }
        }
    }
};
