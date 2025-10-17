// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
});

function initNavigation() {
    setupActiveNavigation();
    setupSidebarToggle();
    setupKeyboardShortcuts();
    setupThemeToggle();
    updateThemeToggleIcon(); // Initialize icon on load
}

function setupThemeToggle() {
    // Add theme toggle functionality to all pages
    document.addEventListener('click', function(e) {
        if (e.target.id === 'themeToggle') {
            toggleTheme();
        }
    });
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

function setupActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function setupSidebarToggle() {
    // Add mobile sidebar toggle functionality
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && window.innerWidth <= 768) {
        // Create toggle button for mobile
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '☰';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 1rem;
            left: 1rem;
            z-index: 1001;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 0.5rem;
            cursor: pointer;
            display: none;
        `;
        
        document.body.appendChild(toggleBtn);
        
        // Show toggle button on mobile
        function checkMobile() {
            if (window.innerWidth <= 768) {
                toggleBtn.style.display = 'block';
                sidebar.style.transform = 'translateX(-100%)';
                sidebar.style.position = 'fixed';
                sidebar.style.height = '100vh';
                sidebar.style.zIndex = '1000';
                sidebar.style.transition = 'transform 0.3s ease';
            } else {
                toggleBtn.style.display = 'none';
                sidebar.style.transform = 'translateX(0)';
                sidebar.style.position = 'static';
                sidebar.style.transition = 'none';
            }
        }
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        // Toggle sidebar
        toggleBtn.addEventListener('click', function() {
            const isOpen = sidebar.style.transform === 'translateX(0px)';
            sidebar.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0)';
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !toggleBtn.contains(e.target) &&
                sidebar.style.transform === 'translateX(0px)') {
                sidebar.style.transform = 'translateX(-100%)';
            }
        });
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only activate shortcuts when not typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Ctrl/Cmd + number keys for navigation
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            const pages = ['dashboard.html', 'todos.html', 'events.html', 'notes.html'];
            const pageIndex = parseInt(e.key) - 1;
            if (pages[pageIndex]) {
                window.location.href = pages[pageIndex];
            }
        }
        
        // Specific page shortcuts
        switch(e.key) {
            case 'h':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.location.href = 'dashboard.html';
                }
                break;
            case 't':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.location.href = 'todos.html';
                }
                break;
            case 'e':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.location.href = 'events.html';
                }
                break;
            case 'n':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.location.href = 'notes.html';
                }
                break;
        }
        
        // Page-specific shortcuts
        const currentPage = window.location.pathname.split('/').pop();
        
        switch(currentPage) {
            case 'todos.html':
                handleTodoShortcuts(e);
                break;
            case 'events.html':
                handleEventShortcuts(e);
                break;
            case 'notes.html':
                handleNoteShortcuts(e);
                break;
        }
    });
}

function handleTodoShortcuts(e) {
    switch(e.key) {
        case '+':
        case '=':
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const addBtn = document.getElementById('addTodoBtn');
                if (addBtn) addBtn.click();
            }
            break;
        case 'Escape':
            const cancelBtn = document.getElementById('cancelTodo');
            if (cancelBtn && document.getElementById('todoForm').style.display !== 'none') {
                cancelBtn.click();
            }
            break;
        case 'a':
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const allFilter = document.querySelector('[data-filter="all"]');
                if (allFilter) allFilter.click();
            }
            break;
        case 'p':
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const pendingFilter = document.querySelector('[data-filter="pending"]');
                if (pendingFilter) pendingFilter.click();
            }
            break;
        case 'c':
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const completedFilter = document.querySelector('[data-filter="completed"]');
                if (completedFilter) completedFilter.click();
            }
            break;
    }
}

function handleEventShortcuts(e) {
    switch(e.key) {
        case '+':
        case '=':
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const addBtn = document.getElementById('addEventBtn');
                if (addBtn) addBtn.click();
            }
            break;
        case 'Escape':
            const cancelBtn = document.getElementById('cancelEvent');
            if (cancelBtn && document.getElementById('eventForm').style.display !== 'none') {
                cancelBtn.click();
            }
            break;
        case 'ArrowLeft':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const prevBtn = document.getElementById('prevMonth');
                if (prevBtn) prevBtn.click();
            }
            break;
        case 'ArrowRight':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const nextBtn = document.getElementById('nextMonth');
                if (nextBtn) nextBtn.click();
            }
            break;
    }
}

function handleNoteShortcuts(e) {
    switch(e.key) {
        case '+':
        case '=':
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const addBtn = document.getElementById('addNoteBtn');
                if (addBtn) addBtn.click();
            }
            break;
        case 's':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const saveBtn = document.getElementById('saveNote');
                if (saveBtn && document.getElementById('noteEditor').style.display !== 'none') {
                    saveBtn.click();
                }
            }
            break;
        case 'Escape':
            const closeBtn = document.getElementById('closeEditor');
            if (closeBtn && document.getElementById('noteEditor').style.display !== 'none') {
                closeBtn.click();
            }
            break;
        case 'f':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const searchBox = document.getElementById('noteSearch');
                if (searchBox) {
                    searchBox.focus();
                    searchBox.select();
                }
            }
            break;
    }
}

// Breadcrumb functionality
function updateBreadcrumb() {
    const currentPage = window.location.pathname.split('/').pop();
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    
    if (!breadcrumbContainer) return;
    
    const pageNames = {
        'dashboard.html': 'Dashboard',
        'todos.html': 'Todos',
        'events.html': 'Events',
        'notes.html': 'Notes'
    };
    
    const currentPageName = pageNames[currentPage] || 'Page';
    
    breadcrumbContainer.innerHTML = `
        <a href="dashboard.html">Dashboard</a>
        ${currentPage !== 'dashboard.html' ? `<span class="separator">></span><span class="current">${currentPageName}</span>` : ''}
    `;
}

// Page transition effects
function addPageTransitions() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't apply transition for external links or current page
            if (!href || href.startsWith('#') || href === window.location.pathname.split('/').pop()) {
                return;
            }
            
            e.preventDefault();
            
            // Add fade out effect
            document.body.style.opacity = '0.7';
            document.body.style.transition = 'opacity 0.2s ease';
            
            setTimeout(() => {
                window.location.href = href;
            }, 200);
        });
    });
}

// Navigation state management
function saveNavigationState() {
    const currentPage = window.location.pathname.split('/').pop();
    const scrollPosition = window.scrollY;
    
    sessionStorage.setItem('focusboard_last_page', currentPage);
    sessionStorage.setItem('focusboard_scroll_position', scrollPosition);
}

function restoreNavigationState() {
    const savedScrollPosition = sessionStorage.getItem('focusboard_scroll_position');
    
    if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition));
        sessionStorage.removeItem('focusboard_scroll_position');
    }
}

// Initialize page transitions and state management
window.addEventListener('beforeunload', saveNavigationState);
window.addEventListener('load', restoreNavigationState);

// Add navigation help tooltip
function addNavigationHelp() {
    const helpTooltip = document.createElement('div');
    helpTooltip.className = 'navigation-help';
    helpTooltip.innerHTML = `
        <div class="help-content">
            <h4>Keyboard Shortcuts</h4>
            <ul>
                <li><kbd>Ctrl+1</kbd> - Dashboard</li>
                <li><kbd>Ctrl+2</kbd> - Todos</li>
                <li><kbd>Ctrl+3</kbd> - Events</li>
                <li><kbd>Ctrl+4</kbd> - Notes</li>
                <li><kbd>+</kbd> - Add new item</li>
                <li><kbd>Esc</kbd> - Cancel/Close</li>
            </ul>
        </div>
    `;
    
    helpTooltip.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2c3e50;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateY(100%);
        transition: transform 0.3s ease;
        max-width: 250px;
    `;
    
    const helpBtn = document.createElement('button');
    helpBtn.innerHTML = '?';
    helpBtn.className = 'help-toggle';
    helpBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #3498db;
        color: white;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1001;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: background 0.3s ease;
    `;
    
    document.body.appendChild(helpTooltip);
    document.body.appendChild(helpBtn);
    
    let helpVisible = false;
    
    helpBtn.addEventListener('click', function() {
        helpVisible = !helpVisible;
        helpTooltip.style.transform = helpVisible ? 'translateY(-60px)' : 'translateY(100%)';
        helpBtn.style.background = helpVisible ? '#e74c3c' : '#3498db';
        helpBtn.innerHTML = helpVisible ? '×' : '?';
    });
    
    // Hide help when clicking outside
    document.addEventListener('click', function(e) {
        if (!helpTooltip.contains(e.target) && !helpBtn.contains(e.target) && helpVisible) {
            helpVisible = false;
            helpTooltip.style.transform = 'translateY(100%)';
            helpBtn.style.background = '#3498db';
            helpBtn.innerHTML = '?';
        }
    });
}

// Initialize navigation help
setTimeout(addNavigationHelp, 1000);