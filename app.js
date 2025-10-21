document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const taskList = document.getElementById('task-list');
    const totalCount = document.getElementById('total-count');
    const remainingCount = document.getElementById('remaining-count');
    const filters = document.querySelectorAll('.filter');
    const searchInput = document.getElementById('search');
    const empty = document.getElementById('empty');

    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const editInput = document.getElementById('edit-input');
    const editPriority = document.getElementById('edit-priority');
    const cancelEdit = document.getElementById('cancel-edit');

    // Simple model and persistence
    let tasks = JSON.parse(localStorage.getItem('tasks_v1') || '[]');
    let currentFilter = 'all';

    // Utilities
    function save() { localStorage.setItem('tasks_v1', JSON.stringify(tasks)); }

    function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

    function render() {
        taskList.innerHTML = '';
        const query = searchInput.value.trim().toLowerCase();
        const visible = tasks
            .filter(t => {
                if (currentFilter === 'active') return !t.completed;
                if (currentFilter === 'completed') return t.completed;
                return true;
            })
            .filter(t => t.text.toLowerCase().includes(query));

        visible.forEach(t => taskList.appendChild(renderTask(t)));

        totalCount.textContent = tasks.length;
        remainingCount.textContent = tasks.filter(t => !t.completed).length + ' remaining';

        empty.style.display = tasks.length ? 'none' : 'block';
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        const main = document.createElement('div');
        main.className = 'task-main';

        const check = document.createElement('button');
        check.className = 'checkbox';
        check.setAttribute('aria-label', task.completed ? 'Mark as incomplete' : 'Mark as complete');
        check.innerHTML = task.completed ? '✓' : '';
        check.onclick = () => {
            task.completed = !task.completed;
            save(); render();
        };

        const desc = document.createElement('div');
        desc.className = 'task-desc' + (task.completed ? ' completed' : '');
        desc.textContent = task.text;

        const meta = document.createElement('div');
        meta.className = 'meta';

        const pri = document.createElement('span');
        pri.className = 'pill priority-' + task.priority;
        pri.textContent = task.priority;

        meta.appendChild(pri);

        main.appendChild(check);
        main.appendChild(desc);
        main.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'icon-btn';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => openEdit(task.id);

        const del = document.createElement('button');
        del.className = 'delete-btn';
        del.textContent = 'Delete';
        del.onclick = () => { if (confirm('Delete this task?')) { tasks = tasks.filter(x => x.id !== task.id); save(); render(); } };

        actions.appendChild(editBtn);
        actions.appendChild(del);

        li.appendChild(main);
        li.appendChild(actions);

        return li;
    }

    // Add task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        const priority = prioritySelect.value || 'medium';
        if (!text) return;
        tasks.unshift({ id: uid(), text, priority, completed: false, created: Date.now() });
        save();
        taskInput.value = '';
        render();
    });

    // Filters
    filters.forEach(f => f.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        f.classList.add('active');
        currentFilter = f.dataset.filter;
        render();
    }));

    // Search
    let searchTimer = null;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(render, 200);
    });

    // Edit modal
    let editingId = null;
    function openEdit(id){
        const t = tasks.find(x => x.id === id);
        if(!t) return;
        editingId = id;
        editInput.value = t.text;
        editPriority.value = t.priority;
        editModal.setAttribute('aria-hidden','false');
    }

    function closeEdit(){ editingId = null; editModal.setAttribute('aria-hidden','true'); }

    cancelEdit.addEventListener('click', (e) => { e.preventDefault(); closeEdit(); });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if(!editingId) return closeEdit();
        const t = tasks.find(x => x.id === editingId);
        if(!t) return closeEdit();
        t.text = editInput.value.trim();
        t.priority = editPriority.value;
        save(); render(); closeEdit();
    });

    // Close modal on backdrop click
    editModal.addEventListener('click', (e) => { if(e.target === editModal) closeEdit(); });

    // Initial render
    render();
});
