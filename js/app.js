// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('focusboard_user');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Redirect logic
    if (!isLoggedIn && ['dashboard.html', 'todos.html', 'events.html', 'notes.html'].includes(currentPage)) {
        window.location.href = 'login.html';
        return;
    }
    
    if (isLoggedIn && ['index.html', 'login.html'].includes(currentPage)) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Initialize theme
    initTheme();
    
    // Initialize page-specific functionality
    switch(currentPage) {
        case 'dashboard.html':
            initDashboard();
            break;
        case 'todos.html':
            initTodos();
            break;
        case 'events.html':
            initEvents();
            break;
        case 'notes.html':
            initNotes();
            break;
    }
    
    // Setup theme toggle button
    setupThemeToggle();
}

// Theme functionality
function initTheme() {
    const savedTheme = localStorage.getItem('focusboard_theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
    updateThemeToggleIcon();
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('focusboard_theme', '');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('focusboard_theme', 'dark-theme');
    }
    
    updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '☀️' : '🌙';
        themeToggle.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
}

// Dashboard functionality
function initDashboard() {
    updateDashboardStats();
    loadRecentItems();
    
    // Update user name
    const user = JSON.parse(localStorage.getItem('focusboard_user') || '{}');
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = user.name || 'User';
    }
}

function updateDashboardStats() {
    const todos = JSON.parse(localStorage.getItem('focusboard_todos') || '[]');
    const events = JSON.parse(localStorage.getItem('focusboard_events') || '[]');
    const notes = JSON.parse(localStorage.getItem('focusboard_notes') || '[]');
    
    // Update counts
    const todoCount = todos.filter(todo => !todo.completed).length;
    const eventCount = events.filter(event => new Date(event.date) >= new Date()).length;
    const noteCount = notes.length;
    
    document.getElementById('todoCount').textContent = todoCount;
    document.getElementById('eventCount').textContent = eventCount;
    document.getElementById('noteCount').textContent = noteCount;
}

function loadRecentItems() {
    loadRecentTodos();
    loadUpcomingEvents();
    loadRecentNotes();
}

function loadRecentTodos() {
    const todos = JSON.parse(localStorage.getItem('focusboard_todos') || '[]');
    const recentTodos = todos.filter(todo => !todo.completed).slice(0, 3);
    const container = document.getElementById('recentTodos');
    
    if (recentTodos.length === 0) {
        container.innerHTML = '<p class="no-items">No todos yet. <a href="todos.html">Create your first todo</a></p>';
        return;
    }
    
    container.innerHTML = recentTodos.map(todo => `
        <div class="recent-item">
            <strong>${todo.title}</strong>
            ${todo.dueDate ? `<span class="meta">Due: ${formatDate(todo.dueDate)}</span>` : ''}
        </div>
    `).join('');
}

function loadUpcomingEvents() {
    const events = JSON.parse(localStorage.getItem('focusboard_events') || '[]');
    const upcomingEvents = events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
    
    const container = document.getElementById('upcomingEvents');
    
    if (upcomingEvents.length === 0) {
        container.innerHTML = '<p class="no-items">No events scheduled. <a href="events.html">Schedule an event</a></p>';
        return;
    }
    
    container.innerHTML = upcomingEvents.map(event => `
        <div class="recent-item">
            <strong>${event.title}</strong>
            <span class="meta">${formatDate(event.date)} at ${event.time}</span>
        </div>
    `).join('');
}

function loadRecentNotes() {
    const notes = JSON.parse(localStorage.getItem('focusboard_notes') || '[]');
    const recentNotes = notes
        .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
        .slice(0, 3);
    
    const container = document.getElementById('recentNotes');
    
    if (recentNotes.length === 0) {
        container.innerHTML = '<p class="no-items">No notes yet. <a href="notes.html">Create your first note</a></p>';
        return;
    }
    
    container.innerHTML = recentNotes.map(note => `
        <div class="recent-item">
            <strong>${note.title}</strong>
            <span class="meta">Modified: ${formatDate(note.lastModified)}</span>
        </div>
    `).join('');
}

// Todo functionality
function initTodos() {
    loadTodos();
    setupTodoEvents();
}

function setupTodoEvents() {
    // Add todo button
    document.getElementById('addTodoBtn').addEventListener('click', showTodoForm);
    
    // Cancel todo button
    document.getElementById('cancelTodo').addEventListener('click', hideTodoForm);
    
    // Add todo form submission
    document.getElementById('addTodoForm').addEventListener('submit', addTodo);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterTodos(this.dataset.filter);
        });
    });
}

function showTodoForm() {
    document.getElementById('todoForm').style.display = 'block';
    document.getElementById('todoTitle').focus();
}

function hideTodoForm() {
    document.getElementById('todoForm').style.display = 'none';
    document.getElementById('addTodoForm').reset();
}

function addTodo(e) {
    e.preventDefault();
    
    const title = document.getElementById('todoTitle').value;
    const dueDate = document.getElementById('todoDueDate').value;
    const priority = document.getElementById('todoPriority').value;
    const description = document.getElementById('todoDescription').value;
    
    const todo = {
        id: Date.now(),
        title,
        dueDate,
        priority,
        description,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    const todos = JSON.parse(localStorage.getItem('focusboard_todos') || '[]');
    todos.push(todo);
    localStorage.setItem('focusboard_todos', JSON.stringify(todos));
    
    hideTodoForm();
    loadTodos();
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('focusboard_todos') || '[]');
    const container = document.getElementById('todoList');
    
    if (todos.length === 0) {
        container.innerHTML = '<p class="no-items">No todos yet. Click "Add Todo" to get started!</p>';
        return;
    }
    
    container.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <div class="todo-content">
                <div class="todo-title">${todo.title}</div>
                <div class="todo-meta">
                    <span class="todo-priority ${todo.priority}">${todo.priority}</span>
                    ${todo.dueDate ? `<span>Due: ${formatDate(todo.dueDate)}</span>` : ''}
                </div>
            </div>
            <div class="todo-actions">
                <button class="btn btn-danger" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function toggleTodo(id) {
    const todos = JSON.parse(localStorage.getItem('focusboard_todos') || '[]');
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('focusboard_todos', JSON.stringify(todos));
        loadTodos();
    }
}

function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this todo?')) {
        const todos = JSON.parse(localStorage.getItem('focusboard_todos') || '[]');
        const filteredTodos = todos.filter(t => t.id !== id);
        localStorage.setItem('focusboard_todos', JSON.stringify(filteredTodos));
        loadTodos();
    }
}

function filterTodos(filter) {
    const todos = document.querySelectorAll('.todo-item');
    todos.forEach(todo => {
        const isCompleted = todo.classList.contains('completed');
        let show = true;
        
        switch(filter) {
            case 'pending':
                show = !isCompleted;
                break;
            case 'completed':
                show = isCompleted;
                break;
            case 'all':
            default:
                show = true;
                break;
        }
        
        todo.style.display = show ? 'flex' : 'none';
    });
}

// Event functionality
function initEvents() {
    loadEvents();
    setupEventEvents();
    initCalendar();
}

function setupEventEvents() {
    document.getElementById('addEventBtn').addEventListener('click', showEventForm);
    document.getElementById('cancelEvent').addEventListener('click', hideEventForm);
    document.getElementById('addEventForm').addEventListener('submit', addEvent);
}

function showEventForm() {
    document.getElementById('eventForm').style.display = 'block';
    document.getElementById('eventTitle').focus();
}

function hideEventForm() {
    document.getElementById('eventForm').style.display = 'none';
    document.getElementById('addEventForm').reset();
}

function addEvent(e) {
    e.preventDefault();
    
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const location = document.getElementById('eventLocation').value;
    const description = document.getElementById('eventDescription').value;
    
    const event = {
        id: Date.now(),
        title,
        date,
        time,
        location,
        description,
        createdAt: new Date().toISOString()
    };
    
    const events = JSON.parse(localStorage.getItem('focusboard_events') || '[]');
    events.push(event);
    localStorage.setItem('focusboard_events', JSON.stringify(events));
    
    hideEventForm();
    loadEvents();
    initCalendar();
}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem('focusboard_events') || '[]');
    const container = document.getElementById('eventList');
    
    if (events.length === 0) {
        container.innerHTML = '<p class="no-items">No events scheduled. Click "Add Event" to get started!</p>';
        return;
    }
    
    const sortedEvents = events.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
    
    container.innerHTML = sortedEvents.map(event => `
        <div class="event-item" data-id="${event.id}">
            <div class="event-time">${event.time}</div>
            <div class="event-content">
                <div class="event-title">${event.title}</div>
                <div class="event-location">${event.location || 'No location'}</div>
                <div class="event-date">${formatDate(event.date)}</div>
            </div>
            <div class="event-actions">
                <button class="btn btn-danger" onclick="deleteEvent(${event.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        const events = JSON.parse(localStorage.getItem('focusboard_events') || '[]');
        const filteredEvents = events.filter(e => e.id !== id);
        localStorage.setItem('focusboard_events', JSON.stringify(filteredEvents));
        loadEvents();
        initCalendar();
    }
}

function initCalendar() {
    // Basic calendar implementation would go here
    // For now, just show current month
    const currentMonth = document.getElementById('currentMonth');
    if (currentMonth) {
        const now = new Date();
        currentMonth.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
}

// Notes functionality
function initNotes() {
    loadNotesList();
    setupNotesEvents();
}

function setupNotesEvents() {
    document.getElementById('addNoteBtn').addEventListener('click', createNewNote);
    document.getElementById('createFirstNote').addEventListener('click', createNewNote);
    document.getElementById('saveNote').addEventListener('click', saveCurrentNote);
    document.getElementById('deleteNote').addEventListener('click', deleteCurrentNote);
    document.getElementById('closeEditor').addEventListener('click', closeNoteEditor);
    document.getElementById('noteSearch').addEventListener('input', searchNotes);
}

let currentNoteId = null;

function createNewNote() {
    currentNoteId = null;
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('deleteNote').style.display = 'none';
    document.getElementById('welcomeMessage').style.display = 'none';
    document.getElementById('noteEditor').style.display = 'flex';
    document.getElementById('noteTitle').focus();
}

function saveCurrentNote() {
    const title = document.getElementById('noteTitle').value.trim() || 'Untitled Note';
    const content = document.getElementById('noteContent').value;
    
    const notes = JSON.parse(localStorage.getItem('focusboard_notes') || '[]');
    
    if (currentNoteId) {
        // Update existing note
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title,
                content,
                lastModified: new Date().toISOString()
            };
        }
    } else {
        // Create new note
        const note = {
            id: Date.now(),
            title,
            content,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        notes.push(note);
        currentNoteId = note.id;
    }
    
    localStorage.setItem('focusboard_notes', JSON.stringify(notes));
    document.getElementById('deleteNote').style.display = 'inline-block';
    loadNotesList();
    
    // Show success feedback
    const saveBtn = document.getElementById('saveNote');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    setTimeout(() => {
        saveBtn.textContent = originalText;
    }, 1000);
}

function deleteCurrentNote() {
    if (currentNoteId && confirm('Are you sure you want to delete this note?')) {
        const notes = JSON.parse(localStorage.getItem('focusboard_notes') || '[]');
        const filteredNotes = notes.filter(n => n.id !== currentNoteId);
        localStorage.setItem('focusboard_notes', JSON.stringify(filteredNotes));
        loadNotesList();
        closeNoteEditor();
    }
}

function closeNoteEditor() {
    document.getElementById('noteEditor').style.display = 'none';
    document.getElementById('welcomeMessage').style.display = 'flex';
    currentNoteId = null;
}

function loadNotesList() {
    const notes = JSON.parse(localStorage.getItem('focusboard_notes') || '[]');
    const container = document.getElementById('notesList');
    
    if (notes.length === 0) {
        container.innerHTML = '<p class="no-items">No notes yet. Click "Add Note" to get started!</p>';
        return;
    }
    
    const sortedNotes = notes.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    
    container.innerHTML = sortedNotes.map(note => `
        <div class="note-item ${note.id === currentNoteId ? 'active' : ''}" 
             onclick="openNote(${note.id})" data-id="${note.id}">
            <div class="note-item-title">${note.title}</div>
            <div class="note-item-preview">${note.content.substring(0, 100)}...</div>
            <div class="note-item-date">${formatDate(note.lastModified)}</div>
        </div>
    `).join('');
}

function openNote(id) {
    const notes = JSON.parse(localStorage.getItem('focusboard_notes') || '[]');
    const note = notes.find(n => n.id === id);
    
    if (note) {
        currentNoteId = id;
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        document.getElementById('deleteNote').style.display = 'inline-block';
        document.getElementById('welcomeMessage').style.display = 'none';
        document.getElementById('noteEditor').style.display = 'flex';
        
        // Update active note in list
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-id="${id}"]`).classList.add('active');
    }
}

function searchNotes() {
    const query = document.getElementById('noteSearch').value.toLowerCase();
    const noteItems = document.querySelectorAll('.note-item');
    
    noteItems.forEach(item => {
        const title = item.querySelector('.note-item-title').textContent.toLowerCase();
        const preview = item.querySelector('.note-item-preview').textContent.toLowerCase();
        const matches = title.includes(query) || preview.includes(query);
        item.style.display = matches ? 'block' : 'none';
    });
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Make functions globally available
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
window.deleteEvent = deleteEvent;
window.openNote = openNote;