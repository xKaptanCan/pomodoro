// Task Manager Module
const Tasks = {
    tasks: [],

    init() {
        this.tasks = Storage.get('tasks', []);
        this.render();
        this.bindEvents();
    },

    bindEvents() {
        const addBtn = document.getElementById('addTaskBtn');
        const input = document.getElementById('newTaskInput');

        if (addBtn && input) {
            addBtn.addEventListener('click', () => this.addTask());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addTask();
            });
        }
    },

    addTask() {
        const input = document.getElementById('newTaskInput');
        const text = input.value.trim();

        if (!text) return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false,
            pomodoros: 0, // Number of pomodoros spent on this task
            estimated: 1  // Estimated pomodoros
        };

        this.tasks.push(newTask);
        this.save();
        this.render();
        input.value = '';
    },

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.save();
            this.render();
        }
    },

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
        this.render();
    },

    selectActiveTask(id) {
        // Activate task logic (future implementation: track time per task)
        const previousActive = document.querySelector('.task-item.active');
        if (previousActive) previousActive.classList.remove('active');

        const newActive = document.querySelector(`[data-id="${id}"]`);
        if (newActive) newActive.classList.add('active');
    },

    save() {
        Storage.set('tasks', this.tasks);
    },

    render() {
        const container = document.getElementById('taskList');
        if (!container) return;

        container.innerHTML = '';

        if (this.tasks.length === 0) {
            container.innerHTML = `<div class="empty-state">${I18n.t('noTasks') || 'Henüz görev yok'}</div>`;
            return;
        }

        this.tasks.forEach(task => {
            const el = document.createElement('div');
            el.className = `task-item ${task.completed ? 'completed' : ''}`;
            el.dataset.id = task.id;

            el.innerHTML = `
                <div class="task-checkbox" onclick="Tasks.toggleTask(${task.id})">
                    ${task.completed ? '✓' : ''}
                </div>
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    <span class="task-stats">${task.pomodoros}/${task.estimated} 🍅</span>
                </div>
                <button class="task-delete" onclick="Tasks.deleteTask(${task.id})">×</button>
            `;

            container.appendChild(el);
        });
    }
};
