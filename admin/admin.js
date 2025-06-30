// Basic admin functionality - you can expand this!

// Array to store tags
let tags = [];

// Security features
let loginAttempts = 0;
let lastLoginAttempt = 0;
let sessionTimeout = null;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Show status messages
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => status.innerHTML = '', 5000);
}

// Simple authentication with secure password hashing
async function authenticate() {
    // Check if locked out
    const lockoutMinutes = isLockedOut();
    if (lockoutMinutes > 0) {
        showStatus(`Too many failed attempts. Try again in ${lockoutMinutes} minutes.`, 'error');
        return;
    }
    
    // Load configuration first
    if (!loadConfig()) {
        showStatus('Configuration not loaded! Make sure config.js exists.', 'error');
        return;
    }
    
    const password = document.getElementById('admin-password').value;
    
    if (!password) {
        showStatus('Please enter a password.', 'error');
        return;
    }
    
    const passwordHash = await sha256(password);
    
    if (passwordHash === ADMIN_PASSWORD_HASH) {
        // Successful login - reset attempts
        loginAttempts = 0;
        lastLoginAttempt = 0;
        
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('upload-form').style.display = 'block';
        showStatus('Authenticated successfully!', 'success');
        
        // Start session timeout
        startSessionTimeout();
        
        initializeTagInput();
        initializeImagePreview();
        initializeDateInput();
        await initializeProjectSearch();
        initializeFormHandler();
        initializeDateInput();
        
        // Clear the password field for security
        document.getElementById('admin-password').value = '';
    } else {
        // Failed login
        loginAttempts++;
        lastLoginAttempt = Date.now();
        
        const attemptsLeft = MAX_LOGIN_ATTEMPTS - loginAttempts;
        if (attemptsLeft > 0) {
            showStatus(`Incorrect password! ${attemptsLeft} attempts remaining.`, 'error');
        } else {
            showStatus('Too many failed attempts. Account locked for 5 minutes.', 'error');
        }
        
        // Clear the password field
        document.getElementById('admin-password').value = '';
    }
}

// Initialize tag input functionality
function initializeTagInput() {
    const tagInput = document.getElementById('tag-input');
    
    if (!tagInput) {
        console.error('Tag input not found!');
        return;
    }
    
    tagInput.addEventListener('keydown', function(e) {
        //console.log('Key pressed:', e.key, 'Value:', this.value);
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(this.value.trim());
            this.value = '';
        }
    });
    
    tagInput.addEventListener('blur', function() {
        if (this.value.trim()) {
            addTag(this.value.trim());
            this.value = '';
        }
    });
}

// Initialize image preview functionality
function initializeImagePreview() {
    const imageInput = document.getElementById('art-image');
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    
    if (!imageInput) {
        console.error('Image input not found!');
        return;
    }
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                showStatus('Please select an image file!', 'error');
                return;
            }
            
            // Create file reader
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                fileName.textContent = file.name;
                fileSize.textContent = formatFileSize(file.size);
                preview.style.display = 'block';
            };
            
            reader.readAsDataURL(file);
        } else {
            // Hide preview if no file selected
            preview.style.display = 'none';
        }
    });
}

// Format file size for display
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// GitHub API configuration - loaded from config.js
// Note: config.js is excluded from git for security
let GITHUB_TOKEN = '';
let GITHUB_USERNAME = '';
let ADMIN_PASSWORD_HASH = '';

// Utility function to generate SHA-256 hash
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Helper function to generate password hash (for setup)
async function generatePasswordHash(password) {
    const hash = await sha256(password);
    console.log(`Password hash for "${password}": ${hash}`);
    return hash;
}

// Load configuration
function loadConfig() {
    if (window.CONFIG) {
        GITHUB_TOKEN = window.CONFIG.GITHUB_TOKEN;
        GITHUB_USERNAME = window.CONFIG.GITHUB_USERNAME;
        ADMIN_PASSWORD_HASH = window.CONFIG.ADMIN_PASSWORD_HASH;
        return true;
    }
    return false;
}

// Initialize project search functionality
let selectedProject = null;
let existingProjects = []; // Will be loaded from GitHub
let adminProjects = []; // Temporary projects
let githubRepos = []; // Cached GitHub repositories

async function initializeProjectSearch() {
    const searchInput = document.getElementById('project-search');
    const dropdown = document.getElementById('project-dropdown');
    
    // Load existing projects and GitHub repositories
    loadExistingProjects();
    await loadGitHubRepositories();
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length > 0) {
            showProjectDropdown(query);
        } else {
            dropdown.style.display = 'none';
        }
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.form-group')) {
            dropdown.style.display = 'none';
        }
    });
}

function loadExistingProjects() {
    // Load from your main projects data
    existingProjects = [
        { title: "Final Project - Balancing in MMOs Demo", type: "project" },
        { title: "Crossing Roads - Integrated Group Project", type: "project" },
        { title: "Web Dev Suika Game", type: "project" },
        { title: "Project: New World", type: "project" }
    ];
}

async function loadGitHubRepositories() {
    if (!GITHUB_TOKEN) {
        showStatus('GitHub token not configured. Project linking will work with manual entries only.', 'warning');
        return;
    }
    
    try {
        showStatus('Loading GitHub repositories...', 'info');
        
        const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        
        const repos = await response.json();
        githubRepos = repos.map(repo => ({
            title: repo.name,
            description: repo.description || '',
            url: repo.html_url,
            type: 'repository',
            updated: repo.updated_at,
            language: repo.language,
            stars: repo.stargazers_count,
            private: repo.private
        }));
        
        // Sort by recently updated
        githubRepos.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        
        console.log(`Loaded ${githubRepos.length} GitHub repositories`);
        showStatus(`Loaded ${githubRepos.length} GitHub repositories`, 'success');
    } catch (error) {
        console.error('Error loading GitHub repositories:', error);
        showStatus('Could not load GitHub repositories. Project linking will still work with manual entries.', 'warning');
        githubRepos = []; // Ensure it's an empty array
    }
}

function showProjectDropdown(query) {
    const dropdown = document.getElementById('project-dropdown');
    const results = searchProjects(query);
    
    dropdown.innerHTML = '';
    
    // Show matching projects (existing projects first)
    const existingMatches = results.filter(p => p.type === 'project');
    const repoMatches = results.filter(p => p.type === 'repository');
    const adminMatches = results.filter(p => p.type === 'admin-project');
    
    // Add existing projects
    existingMatches.forEach(project => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.innerHTML = `
            <div class="project-item">
                <span class="project-title">${project.title}</span>
                <span class="project-type">(${project.type})</span>
            </div>
        `;
        item.onclick = () => selectProject(project);
        dropdown.appendChild(item);
    });
    
    // Add GitHub repositories
    repoMatches.forEach(repo => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.innerHTML = `
            <div class="project-item">
                <span class="project-title">${repo.title}</span>
                <span class="project-type">(GitHub repository)</span>
                ${repo.language ? `<span class="project-language">${repo.language}</span>` : ''}
                ${repo.private ? '<span class="project-private">Private</span>' : ''}
                ${repo.stars > 0 ? `<span class="project-stars">★ ${repo.stars}</span>` : ''}
            </div>
            ${repo.description ? `<div class="project-description">${repo.description}</div>` : ''}
        `;
        item.onclick = () => selectProject(repo);
        dropdown.appendChild(item);
    });
    
    // Add admin projects
    adminMatches.forEach(project => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.innerHTML = `
            <div class="project-item">
                <span class="project-title">${project.title}</span>
                <span class="project-type">(temporary)</span>
            </div>
        `;
        item.onclick = () => selectProject(project);
        dropdown.appendChild(item);
    });
    
    // Add "Add new project" option
    const addNew = document.createElement('div');
    addNew.className = 'dropdown-item add-new';
    addNew.innerHTML = `<div class="add-new-text">+ Add new project: "${query}"</div>`;
    addNew.onclick = () => addNewProject(query);
    dropdown.appendChild(addNew);
    
    dropdown.style.display = 'block';
}

function searchProjects(query) {
    const allProjects = [...existingProjects, ...githubRepos, ...adminProjects];
    return allProjects.filter(project => 
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 10); // Limit to 10 results
}

function selectProject(project) {
    selectedProject = project;
    document.getElementById('project-search').value = '';
    document.getElementById('project-dropdown').style.display = 'none';
    showSelectedProject();
}

function addNewProject(title) {
    const newProject = {
        title: title,
        type: "admin-project",
        id: Date.now(),
        isTemporary: true
    };
    
    adminProjects.push(newProject);
    selectProject(newProject);
}

function showSelectedProject() {
    const container = document.getElementById('selected-project');
    const nameSpan = document.getElementById('project-name');
    
    if (selectedProject) {
        let displayText = selectedProject.title;
        if (selectedProject.type === 'repository') {
            displayText += ' (GitHub repository)';
        } else if (selectedProject.type === 'admin-project') {
            displayText += ' (temporary)';
        } else {
            displayText += ` (${selectedProject.type})`;
        }
        
        nameSpan.textContent = displayText;
        container.style.display = 'flex';
    }
}

function clearProject() {
    selectedProject = null;
    document.getElementById('selected-project').style.display = 'none';
}

// Format date for display with flexible precision
function formatDateForDisplay(dateString, precision = 'auto') {
    if (!dateString) return '';
    
    const date = new Date(dateString + (dateString.length === 7 ? '-01' : '')); // Add day if month-only
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // If precision is month or if it's auto and day is 1, just show "Month Year"
    if (precision === 'month' || (precision === 'auto' && day === 1)) {
        return `${month} ${year}`;
    } else {
        return `${day} ${month} ${year}`;
    }
}

// Initialize date input functionality
function initializeDateInput() {
    const monthInput = document.getElementById('art-date-month');
    const fullInput = document.getElementById('art-date-full');
    const precisionRadios = document.querySelectorAll('input[name="date-precision"]');
    
    if (!monthInput || !fullInput) {
        console.error('Date inputs not found!');
        return;
    }
    
    // Handle precision toggle
    precisionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'month') {
                monthInput.style.display = 'block';
                fullInput.style.display = 'none';
                fullInput.value = '';
            } else {
                monthInput.style.display = 'none';
                fullInput.style.display = 'block';
                monthInput.value = '';
            }
        });
    });
}

// Get the current date value and precision
function getCurrentDateValue() {
    const monthInput = document.getElementById('art-date-month');
    const fullInput = document.getElementById('art-date-full');
    const precision = document.querySelector('input[name="date-precision"]:checked')?.value;
    
    if (precision === 'month' && monthInput.value) {
        return {
            value: monthInput.value,
            precision: 'month'
        };
    } else if (precision === 'full' && fullInput.value) {
        return {
            value: fullInput.value,
            precision: 'full'
        };
    }
    
    return { value: '', precision: 'month' };
}

// Add a tag
function addTag(tagText) {
    console.log('Adding tag:', tagText);
    if (!tagText || tags.includes(tagText)) {
        console.log('Tag rejected - empty or duplicate');
        return;
    }
    
    tags.push(tagText);
    console.log('Tags array:', tags);
    renderTags();
}

// Remove a tag
function removeTag(tagText) {
    const index = tags.indexOf(tagText);
    if (index > -1) {
        tags.splice(index, 1);
        renderTags();
    }
}

// Render all tags
function renderTags() {
    const container = document.getElementById('tags-container');
    if (!container) {
        console.error('Tags container not found!');
        return;
    }
    
    console.log('Rendering tags:', tags);
    container.innerHTML = '';
    
    tags.forEach(tag => {
        const tagBubble = document.createElement('div');
        tagBubble.className = 'tag-bubble';
        tagBubble.innerHTML = `
            <span class="tag-text">${tag}</span>
            <button type="button" class="tag-remove" onclick="removeTag('${tag}')">&times;</button>
        `;
        container.appendChild(tagBubble);
    });
}

// Initialize form handler
function initializeFormHandler() {
    document.getElementById('upload-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const imageFile = document.getElementById('art-image').files[0];
        const title = document.getElementById('art-title').value;
        const description = document.getElementById('art-description').value;
        const category = document.querySelector('input[name="art-category"]:checked')?.value;
        const dateData = getCurrentDateValue();
        const formattedDate = formatDateForDisplay(dateData.value, dateData.precision);
        
        if (!imageFile) {
            showStatus('Please select an image!', 'error');
            return;
        }
        
        if (!category) {
            showStatus('Please select a category!', 'error');
            return;
        }
        
        if (!dateData.value) {
            showStatus('Please enter a date!', 'error');
            return;
        }
        
        // Prepare the art data object
        const artData = {
            id: Date.now(),
            title: title || 'Untitled',
            description: description || '',
            category: category,
            date: dateData.value,
            datePrecision: dateData.precision,
            formattedDate: formattedDate,
            tags: [...tags],
            linkedProject: selectedProject ? {
                title: selectedProject.title,
                type: selectedProject.type,
                url: selectedProject.url || null,
                language: selectedProject.language || null
            } : null,
            imageFile: imageFile,
            imageName: imageFile.name
        };
        
        // If there's a temporary project, make it permanent
        if (selectedProject && selectedProject.isTemporary) {
            selectedProject.isTemporary = false;
            // In a real implementation, you'd save this to admin-projects.js
        }
        
        // TODO: Implement actual file upload and data saving
        console.log('Prepared art data:', artData);
        showStatus('Upload functionality coming soon! Check console for data preview.', 'info');
        
        // For now, just show what would be saved
        console.log('This would be added to art-data.js:', {
            ...artData,
            imageFile: `[File: ${artData.imageName}, ${formatFileSize(artData.imageFile.size)}]`
        });
    });
}

// Check if user is locked out
function isLockedOut() {
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        const timeSinceLastAttempt = Date.now() - lastLoginAttempt;
        if (timeSinceLastAttempt < LOCKOUT_TIME) {
            const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 60000);
            return remainingTime;
        } else {
            // Reset attempts after lockout period
            loginAttempts = 0;
        }
    }
    return 0;
}

// Start session timeout
function startSessionTimeout() {
    if (sessionTimeout) {
        clearTimeout(sessionTimeout);
    }
    
    sessionTimeout = setTimeout(() => {
        logout();
        showStatus('Session expired for security. Please log in again.', 'warning');
    }, SESSION_TIMEOUT);
}

// Logout function
function logout() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('upload-form').style.display = 'none';
    document.getElementById('admin-password').value = '';
    
    if (sessionTimeout) {
        clearTimeout(sessionTimeout);
        sessionTimeout = null;
    }
    
    // Clear any sensitive data
    selectedProject = null;
    tags = [];
    renderTags();
    
    showStatus('Logged out successfully.', 'info');
}

// Add keyboard support for login
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('admin-password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                authenticate();
            }
        });
    }
    
    // Make generatePasswordHash available globally for console use
    window.generatePasswordHash = generatePasswordHash;
});

// Activity tracking for session timeout
let lastActivity = Date.now();

function trackActivity() {
    lastActivity = Date.now();
    // Extend session if user is active
    if (sessionTimeout) {
        startSessionTimeout();
    }
}

// Track user activity
document.addEventListener('mousemove', trackActivity);
document.addEventListener('keypress', trackActivity);
document.addEventListener('click', trackActivity);

// GitHub API integration complete!
// Configuration is now loaded from config.js for security
// Features implemented:
// 1. Secure token management
// 2. Real GitHub repository fetching
// 3. Enhanced project search and linking
