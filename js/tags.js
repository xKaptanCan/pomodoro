// Tags Module
const Tags = {
    defaultTags: [
        { id: 'work', name: 'Work', nametr: 'İş', color: '#FF6B6B', icon: '💼' },
        { id: 'study', name: 'Study', nametr: 'Öğrenme', color: '#4ECDC4', icon: '📚' },
        { id: 'personal', name: 'Personal', nametr: 'Kişisel', color: '#667eea', icon: '🏠' },
        { id: 'health', name: 'Health', nametr: 'Sağlık', color: '#00D9A5', icon: '💪' },
        { id: 'creative', name: 'Creative', nametr: 'Yaratıcı', color: '#FFB84D', icon: '🎨' }
    ],

    init() {
        const saved = Storage.get('tags', null);
        if (!saved) {
            Storage.set('tags', this.defaultTags);
        }
        this.currentTag = Storage.get('currentTag', null);
    },

    getAll() {
        return Storage.get('tags', this.defaultTags);
    },

    add(tag) {
        const tags = this.getAll();
        tag.id = 'tag_' + Date.now();
        tags.push(tag);
        Storage.set('tags', tags);
        return tag;
    },

    update(id, updates) {
        const tags = this.getAll();
        const index = tags.findIndex(t => t.id === id);
        if (index !== -1) {
            tags[index] = { ...tags[index], ...updates };
            Storage.set('tags', tags);
        }
    },

    delete(id) {
        // Don't delete default tags
        if (!id.startsWith('tag_')) return false;
        const tags = this.getAll().filter(t => t.id !== id);
        Storage.set('tags', tags);
        return true;
    },

    setCurrentTag(tagId) {
        this.currentTag = tagId;
        Storage.set('currentTag', tagId);
    },

    getCurrentTag() {
        if (!this.currentTag) return null;
        return this.getAll().find(t => t.id === this.currentTag);
    },

    clearCurrentTag() {
        this.currentTag = null;
        Storage.set('currentTag', null);
    },

    getTagStats() {
        const stats = Storage.getStats();
        const tagStats = {};

        // Aggregate stats by tag
        Object.values(stats.dailyData || {}).forEach(day => {
            (day.sessions || []).forEach(session => {
                const tagId = session.tagId || 'untagged';
                if (!tagStats[tagId]) {
                    tagStats[tagId] = { pomodoros: 0, minutes: 0 };
                }
                tagStats[tagId].pomodoros++;
                tagStats[tagId].minutes += session.minutes || 0;
            });
        });

        return tagStats;
    },

    renderSelector(container, onSelect) {
        const tags = this.getAll();
        const currentId = this.currentTag;

        container.innerHTML = `
            <div class="tag-selector">
                <button class="tag-chip ${!currentId ? 'active' : ''}" data-tag="">
                    <span>🏷️</span>
                    <span>${I18n.currentLang === 'tr' ? 'Hiçbiri' : 'None'}</span>
                </button>
                ${tags.map(t => `
                    <button class="tag-chip ${t.id === currentId ? 'active' : ''}" 
                            data-tag="${t.id}" 
                            style="--tag-color: ${t.color}">
                        <span>${t.icon}</span>
                        <span>${I18n.currentLang === 'tr' ? t.nametr : t.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.tag-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const tagId = chip.dataset.tag;
                this.setCurrentTag(tagId || null);
                container.querySelectorAll('.tag-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                if (onSelect) onSelect(tagId || null);
            });
        });
    }
};
