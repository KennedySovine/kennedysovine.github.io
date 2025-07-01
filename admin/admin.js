// ================================================================
// PERSONAL PORTFOLIO ADMIN PANEL
// ================================================================
// This is a secure admin panel for uploading and managing artwork
// Key features:
// - Secure authentication with rate limiting
// - GitHub API integration for file storage
// - Dynamic tag and project management
// - Real-time upload progress tracking
// - Flexible date input (month/year or full date)
// ================================================================

// Note: admin-projects.js will be loaded separately as a regular script

// ==============================================
// GLOBAL STATE VARIABLES
// ==============================================

// Tags array - stores all tags for the current artwork being uploaded
// Tags are displayed as removable bubbles in the UI
let tags = [];

// Project management variables
let selectedProject = null;     // Currently selected project for linking
let existingProjects = [];      // Predefined projects from portfolio
let githubRepositories = [];    // Repositories fetched from GitHub API

// ==============================================
// SECURITY CONFIGURATION
// ==============================================
// Multi-layered security to protect the admin panel:

// Track failed login attempts to prevent brute force attacks
let loginAttempts = 0;        // Counter for failed attempts
let lastLoginAttempt = 0;     // Timestamp of last failed attempt
let sessionTimeout = null;    // Timer for auto-logout

// Security thresholds (all configurable)
const MAX_LOGIN_ATTEMPTS = 5;              // Lock out after 5 failed attempts
const LOCKOUT_TIME = 5 * 60 * 1000;        // 5 minutes lockout period
const SESSION_TIMEOUT = 30 * 60 * 1000;    // 30 minutes auto-logout

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
        showStatus('Configuration not loaded! Make sure config-fallback.js is loaded.', 'error');
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

// Make authenticate function globally available immediately
window.authenticate = authenticate;

// ==============================================
// UI INITIALIZATION FUNCTIONS
// ==============================================

/**
 * Initialize tag input functionality
 * Creates dynamic tag bubbles that users can add and remove
 * Tags help categorize and organize uploaded artwork
 */
function initializeTagInput() {
    const tagInput = document.getElementById('tag-input');
    
    if (!tagInput) {
        console.error('Tag input not found!');
        return;
    }
    
    // Add tag when user presses Enter or comma
    tagInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(this.value.trim());
            this.value = '';
        }
    });
    
    // Add tag when user clicks away from input (if there's text)
    tagInput.addEventListener('blur', function() {
        if (this.value.trim()) {
            addTag(this.value.trim());
            this.value = '';
        }
    });
}

/**
 * Initialize image preview functionality with drag & drop support
 * 
 * Features implemented:
 * - Traditional file input handling
 * - Drag and drop file handling
 * - Visual feedback during drag operations
 * - File validation (type and size)
 * - Preview with metadata display
 * - Accessibility support
 */
function initializeImagePreview() {
    const imageInput = document.getElementById('art-image');
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const dropZone = document.getElementById('drop-zone');
    
    if (!imageInput || !dropZone) {
        console.error('Image input or drop zone not found!');
        return;
    }
    
    // ==============================================
    // TRADITIONAL FILE INPUT HANDLING
    // ==============================================
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileSelection(file);
        }
    });
    
    // ==============================================
    // DRAG & DROP EVENT HANDLERS
    // ==============================================
    
    // Prevent default drag behaviors on document
    // This prevents the browser from trying to open dropped files
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, preventDefaults, false);
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlightDropZone, false);
    });
    
    // Remove highlight when item leaves drop zone
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlightDropZone, false);
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Add click handler for drop zone to trigger file selection
    dropZone.addEventListener('click', function() {
        imageInput.click();
    });
    
    // Add keyboard support for accessibility
    dropZone.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            imageInput.click();
        }
    });
    
    // Make drop zone focusable for keyboard users
    dropZone.setAttribute('tabindex', '0');
    dropZone.setAttribute('role', 'button');
    dropZone.setAttribute('aria-label', 'Click to select an image file or drag and drop');
    
    // ==============================================
    // DRAG & DROP HELPER FUNCTIONS
    // ==============================================
    
    /**
     * Prevent default drag behaviors
     * Stops the browser from trying to navigate to dropped files
     */
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    /**
     * Visual feedback when dragging over the drop zone
     * Adds CSS class to show user they can drop here
     */
    function highlightDropZone() {
        dropZone.classList.add('drag-over');
    }
    
    /**
     * Remove visual feedback when drag leaves the zone
     * Removes the highlight class
     */
    function unhighlightDropZone() {
        dropZone.classList.remove('drag-over');
    }
    
    /**
     * Handle file drop event
     * Extracts the file from the drag event and processes it
     * @param {DragEvent} e - The drop event
     */
    function handleDrop(e) {
        const files = e.dataTransfer.files;
        
        if (files.length > 0) {
            const file = files[0]; // Only handle the first file
            
            // Update the file input to match the dropped file
            // This ensures form validation works correctly
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageInput.files = dataTransfer.files;
            
            // Process the file
            handleFileSelection(file);
        }
    }
    
    /**
     * Central file handling function
     * Validates and processes both dropped and selected files
     * @param {File} file - The file to process
     */
    function handleFileSelection(file) {
        // Clear any previous error states
        dropZone.classList.remove('error');
        
        // VALIDATION 1: Check if it's an image file
        if (!file.type.startsWith('image/')) {
            showFileError('Please select an image file! Supported formats: JPG, PNG, GIF, WebP');
            return;
        }
        
        // VALIDATION 2: Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            showFileError(`File is too large! Maximum size is 10MB. Your file is ${formatFileSize(file.size)}.`);
            return;
        }
        
        // VALIDATION 3: Check for common image formats
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type.toLowerCase())) {
            showFileError('Unsupported image format! Please use JPG, PNG, GIF, or WebP.');
            return;
        }
        
        // File is valid - process it
        displayImagePreview(file);
        hideDropZone();
        showStatus('Image selected successfully! ✓', 'success');
    }
    
    /**
     * Display error for invalid files
     * Shows visual feedback and error message
     * @param {string} message - Error message to display
     */
    function showFileError(message) {
        dropZone.classList.add('error');
        showStatus(message, 'error');
        
        // Remove error state after animation
        setTimeout(() => {
            dropZone.classList.remove('error');
        }, 500);
        
        // Clear the file input
        imageInput.value = '';
    }
    
    /**
     * Create and display image preview
     * Uses FileReader to create a preview thumbnail
     * @param {File} file - The image file to preview
     */
    function displayImagePreview(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Update preview elements
            previewImg.src = e.target.result;
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            
            // Show the preview with animation
            preview.style.display = 'block';
            
            // Add loading state while image loads
            previewImg.onload = function() {
                // Image loaded successfully
                previewImg.style.opacity = '1';
            };
            
            previewImg.onerror = function() {
                showFileError('Failed to load image preview. Please try a different file.');
                showDropZone();
            };
            
            // Start with transparent image for smooth loading
            previewImg.style.opacity = '0.5';
        };
        
        reader.onerror = function() {
            showFileError('Failed to read the selected file. Please try again.');
            showDropZone();
        };
        
        // Read the file as data URL for preview
        reader.readAsDataURL(file);
    }
    
    /**
     * Hide the drop zone (when image is selected)
     * Creates smooth transition from drop zone to preview
     */
    function hideDropZone() {
        dropZone.style.display = 'none';
    }
    
    /**
     * Show the drop zone (when changing/removing image)
     * Resets the interface for new file selection
     */
    function showDropZone() {
        dropZone.style.display = 'flex';
        preview.style.display = 'none';
        dropZone.classList.remove('drag-over', 'error');
    }
    
    // ==============================================
    // GLOBAL HELPER FUNCTIONS FOR FILE MANAGEMENT
    // ==============================================
    
    /**
     * Change image function (called by "Change Image" button)
     * Resets the interface and allows new file selection
     */
    window.changeImage = function() {
        imageInput.value = ''; // Clear file input
        showDropZone(); // Show drop zone again
        showStatus('Select a new image file', 'info');
    };
}

/**
 * Format file size in human-readable format
 * Converts bytes to KB, MB, GB as appropriate
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size (e.g., "2.5 MB")
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ==============================================
// AUTHENTICATION & SECURITY UTILITIES
// ==============================================

/**
 * GitHub API configuration - loaded from config.js
 * Note: config.js is excluded from git for security
 * These variables store sensitive authentication data
 */
let GITHUB_TOKEN = '';        // Personal access token for GitHub API
let GITHUB_USERNAME = '';     // GitHub username for repository operations
let ADMIN_PASSWORD_HASH = ''; // Hashed admin password (never store plaintext!)

/**
 * Utility function to generate SHA-256 hash
 * Used for secure password storage and comparison
 * @param {string} message - The text to hash
 * @returns {Promise<string>} - The SHA-256 hash as a hexadecimal string
 */
async function sha256(message) {
    // Convert string to bytes for hashing
    const msgBuffer = new TextEncoder().encode(message);
    
    // Use Web Crypto API to generate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    
    // Convert hash to hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Helper function to generate password hash (for setup)
 * Use this in the browser console to generate hashes for config.js
 * Example: await generatePasswordHash('your-password-here')
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - The generated hash
 */
async function generatePasswordHash(password) {
    const hash = await sha256(password);
    console.log(`Password hash for "${password}": ${hash}`);
    return hash;
}

// Make generatePasswordHash function globally available immediately
window.generatePasswordHash = generatePasswordHash;

/**
 * Load configuration from config.js
 * This file contains sensitive data and is excluded from git
 * @returns {boolean} - True if config loaded successfully
 */
function loadConfig() {
    // Try to load from CONFIG_FALLBACK first (from config-fallback.js)
    if (window.CONFIG_FALLBACK) {
        GITHUB_TOKEN = window.CONFIG_FALLBACK.GITHUB_TOKEN;
        GITHUB_USERNAME = window.CONFIG_FALLBACK.GITHUB_USERNAME;
        ADMIN_PASSWORD_HASH = window.CONFIG_FALLBACK.ADMIN_PASSWORD_HASH;
        return true;
    }
    // Fallback to old CONFIG for backwards compatibility
    if (window.CONFIG) {
        GITHUB_TOKEN = window.CONFIG.GITHUB_TOKEN;
        GITHUB_USERNAME = window.CONFIG.GITHUB_USERNAME;
        ADMIN_PASSWORD_HASH = window.CONFIG.ADMIN_PASSWORD_HASH;
        return true;
    }
    return false;
}

/**
 * Load existing projects from your main portfolio
 * These are the projects already featured on your website
 * You can modify this list to match your actual projects
 */
function loadExistingProjects() {
    existingProjects = [
        { title: "Final Project - Balancing in MMOs Demo", type: "project" },
        { title: "Crossing Roads - Integrated Group Project", type: "project" },
        { title: "Web Dev Suika Game", type: "project" },
        { title: "Project: New World", type: "project" }
    ];
}

/**
 * Load GitHub repositories via GitHub API
 * Fetches your repositories and caches them for project linking
 * Includes repository metadata like language, stars, description
 */
async function loadGitHubRepositories() {
    // Skip if GitHub token is not configured
    if (!GITHUB_TOKEN) {
        showStatus('GitHub token not configured. Project linking will work with manual entries only.', 'warning');
        return;
    }
    
    try {
        showStatus('Loading GitHub repositories...', 'info');
        
        // Fetch repositories from GitHub API
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
        
        // Transform repository data for our project system
        githubRepositories = repos.map(repo => ({
            title: repo.name,
            description: repo.description || '',
            url: repo.html_url,
            type: 'repository',
            updated: repo.updated_at,
            language: repo.language,
            stars: repo.stargazers_count,
            private: repo.private
        }));
        
        // Sort by most recently updated
        githubRepositories.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        
        console.log(`Loaded ${githubRepositories.length} GitHub repositories`);
        showStatus(`Loaded ${githubRepositories.length} GitHub repositories`, 'success');
        
    } catch (error) {
        console.error('Error loading GitHub repositories:', error);
        showStatus('Could not load GitHub repositories. Project linking will still work with manual entries.', 'warning');
        githubRepositories = []; // Ensure it's an empty array on failure
    }
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

// ==============================================
// PROJECT MANAGEMENT SYSTEM
// ==============================================

/**
 * Initialize project search and linking functionality
 * Sets up the project dropdown and search capabilities
 */
async function initializeProjectSearch() {
    // Load existing projects and GitHub repositories
    loadExistingProjects();
    await loadGitHubRepositories();
    
    const searchInput = document.getElementById('project-search');
    const dropdown = document.getElementById('project-dropdown');
    
    if (!searchInput || !dropdown) {
        console.warn('Project search elements not found - skipping project initialization');
        return;
    }
    
    // Handle search input
    searchInput.addEventListener('input', function() {
        const query = this.value.trim(); // Keep original case
        const queryLower = query.toLowerCase(); // For searching
        showProjectDropdown(query, queryLower);
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.form-group')) {
            dropdown.style.display = 'none';
        }
    });
}

/**
 * Load existing projects from your main portfolio
 * These are the projects already featured on your website
/**
 * Show project dropdown with filtered results
 */
function showProjectDropdown(query, queryLower) {
    const dropdown = document.getElementById('project-dropdown');
    
    if (!query) {
        dropdown.style.display = 'none';
        return;
    }
    
    // Combine all project sources: existing, GitHub repos, and admin projects
    const allProjects = [...existingProjects, ...githubRepositories, ...adminProjects];
    
    // Filter projects based on query (case-insensitive search)
    const filtered = allProjects.filter(project => 
        project.title.toLowerCase().includes(queryLower)
    );
    
    // Clear and populate dropdown
    dropdown.innerHTML = '';
    
    if (filtered.length > 0) {
        filtered.forEach(project => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.innerHTML = `
                <div class="project-title">${project.title}</div>
                <div class="project-type">${project.type}${project.isTemporary ? ' (temporary)' : ''}</div>
                ${project.description ? `<div class="project-description">${project.description}</div>` : ''}
            `;
            item.addEventListener('click', () => selectProject(project));
            dropdown.appendChild(item);
        });
        dropdown.style.display = 'block';
    } else if (query) {
        // Show option to create new project (using original case)
        const item = document.createElement('div');
        item.className = 'dropdown-item create-new';
        item.innerHTML = `<div class="project-title">Create "${query}" as new project</div>`;
        item.addEventListener('click', () => createNewProject(query));
        dropdown.appendChild(item);
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

/**
 * Select a project for linking
 */
function selectProject(project) {
    selectedProject = project;
    document.getElementById('project-search').value = '';
    document.getElementById('project-dropdown').style.display = 'none';
    updateSelectedProject();
}

/**
 * Create a new project entry
 */
function createNewProject(title) {
    const newProject = {
        title: title, // Preserve original capitalization
        type: 'custom',
        isTemporary: true
    };
    
    // Add to persistent storage and get the project with ID
    const persistedProject = addTemporaryProject(newProject);
    
    selectProject(persistedProject);
}

/**
 * Update the selected project display
 */
function updateSelectedProject() {
    const container = document.getElementById('selected-project');
    const nameSpan = document.getElementById('project-name');
    
    if (selectedProject) {
        let displayText = selectedProject.title;
        if (selectedProject.isTemporary) {
            displayText += ' (temporary)';
        } else {
            displayText += ` (${selectedProject.type})`;
        }
        
        nameSpan.textContent = displayText;
        container.style.display = 'flex';
    }
}

/**
 * Clear the selected project
 */
function clearProject() {
    selectedProject = null;
    document.getElementById('selected-project').style.display = 'none';
}

// Make clearProject function globally available immediately
window.clearProject = clearProject;

// Initialize form handler
/**
 * Initialize form handler with enhanced validation
 * Handles form submission with comprehensive validation for drag & drop system
 */
function initializeFormHandler() {
    document.getElementById('upload-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // ==============================================
        // COLLECT FORM DATA
        // ==============================================
        
        const imageFile = document.getElementById('art-image').files[0];
        const title = document.getElementById('art-title').value.trim();
        const description = document.getElementById('art-description').value.trim();
        const category = document.querySelector('input[name="art-category"]:checked')?.value;
        const dateData = getCurrentDateValue();
        const formattedDate = formatDateForDisplay(dateData.value, dateData.precision);
        
        // ==============================================
        // COMPREHENSIVE FORM VALIDATION
        // ==============================================
        
        // VALIDATION 1: Image file validation
        if (!imageFile) {
            showImageError('Please select an image file using the upload area above.');
            return;
        }
        
        // Additional image validation (in case drag & drop validation was bypassed)
        if (!imageFile.type.startsWith('image/')) {
            showImageError('Selected file is not a valid image. Please choose a JPG, PNG, GIF, or WebP file.');
            return;
        }
        
        // VALIDATION 2: File size validation
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (imageFile.size > maxSize) {
            showImageError(`Image file is too large! Maximum size is 10MB. Your file is ${formatFileSize(imageFile.size)}.`);
            return;
        }
        
        // VALIDATION 3: Category validation
        if (!category) {
            showFieldError('Please select a category for your artwork.', 'art-category');
            return;
        }
        
        // VALIDATION 4: Date validation
        if (!dateData.value) {
            showFieldError('Please enter the date when this artwork was created.', 'date');
            return;
        }
        
        // VALIDATION 5: Title validation (optional but recommended)
        if (!title) {
            const proceed = confirm('No title entered. Would you like to proceed with "Untitled" as the title?');
            if (!proceed) {
                document.getElementById('art-title').focus();
                return;
            }
        }
        
        // ==============================================
        // PREPARE ARTWORK DATA OBJECT
        // ==============================================
        
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
        
        // ==============================================
        // HANDLE TEMPORARY PROJECTS
        // ==============================================
        
        // If there's a temporary project, make it permanent
        if (selectedProject && selectedProject.isTemporary) {
            makeProjectPermanent(selectedProject.id);
            selectedProject.isTemporary = false;
            showStatus('Project has been made permanent and can be reused for future uploads.', 'success');
        }
        
        // ==============================================
        // PERFORM UPLOAD
        // ==============================================
        
        try {
            showStatus('Starting upload process...', 'info');
            await uploadArtwork(artData);
        } catch (error) {
            // Error handling is done in uploadArtwork function
            console.error('Upload process failed:', error);
        }
    });
}

// ==============================================
// ENHANCED VALIDATION HELPER FUNCTIONS
// ==============================================

/**
 * Show error specific to image upload area
 * Highlights the drop zone and shows error message
 * @param {string} message - Error message to display
 */
function showImageError(message) {
    // Highlight the drop zone with error state
    const dropZone = document.getElementById('drop-zone');
    const preview = document.getElementById('image-preview');
    
    if (dropZone && dropZone.style.display !== 'none') {
        dropZone.classList.add('error');
        setTimeout(() => dropZone.classList.remove('error'), 2000);
    }
    
    // If preview is shown, you could also highlight it
    if (preview && preview.style.display !== 'none') {
        preview.style.border = '2px solid #dc3545';
        setTimeout(() => preview.style.border = '', 2000);
    }
    
    showStatus(message, 'error');
    
    // Scroll to upload area
    document.getElementById('drop-zone').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

/**
 * Show error for specific form fields
 * Highlights the problematic field and focuses it
 * @param {string} message - Error message to display
 * @param {string} fieldType - Type of field with error
 */
function showFieldError(message, fieldType) {
    showStatus(message, 'error');
    
    // Focus on the problematic field
    switch(fieldType) {
        case 'art-category':
            // Scroll to category section
            document.querySelector('input[name="art-category"]').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            break;
        case 'date':
            // Focus on the visible date input
            const monthInput = document.getElementById('art-date-month');
            const fullInput = document.getElementById('art-date-full');
            if (monthInput.style.display !== 'none') {
                monthInput.focus();
            } else {
                fullInput.focus();
            }
            break;
        default:
            // Try to focus on element by ID
            const element = document.getElementById(fieldType);
            if (element) {
                element.focus();
            }
    }
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

// Make logout function globally available immediately
window.logout = logout;

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

// ==============================================
// GITHUB API UTILITIES FOR FILE UPLOAD
// ==============================================

/**
 * Converts a File object to base64 string for GitHub API upload
 * 
 * Why base64? GitHub's Contents API requires file content to be base64 encoded.
 * This function removes the "data:image/png;base64," prefix that FileReader adds.
 * 
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 encoded file content
 */
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Split removes the "data:image/png;base64," part, keeping only the base64 data
            const base64 = reader.result.split(',')[1]; 
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file); // This creates a data URL with base64 content
    });
}

/**
 * Generates a unique filename to prevent conflicts
 * 
 * Logic: category-originalname-timestamp.extension
 * Example: "painting-sunset-2024-06-30T14-30-45-123Z.jpg"
 * 
 * Why unique names? Prevents overwriting existing files and makes organization easier.
 * 
 * @param {string} originalName - Original filename from user's computer
 * @param {string} category - Art category (painting, drawing, digital)
 * @returns {string} - Unique filename safe for web use
 */
function generateUniqueFilename(originalName, category) {
    // ISO string gives us "2024-06-30T14:30:45.123Z" format
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Replace : and . with -
    const extension = originalName.split('.').pop(); // Get file extension (.jpg, .png, etc.)
    const baseName = originalName.split('.').slice(0, -1).join('.'); // Everything except extension
    // Replace unsafe characters with hyphens (spaces, special chars become -)
    const safeName = baseName.replace(/[^a-zA-Z0-9-_]/g, '-');
    return `${category}-${safeName}-${timestamp}.${extension}`;
}

/**
 * Uploads a file to GitHub repository using the Contents API
 * 
 * GitHub API Process:
 * 1. Check if file exists (to get SHA if updating)
 * 2. Convert file to base64
 * 3. Create upload payload with commit message
 * 4. PUT request to GitHub API
 * 5. Return download URLs and paths
 * 
 * @param {File} file - The file to upload
 * @param {string} filename - Unique filename to use
 * @param {string} folder - Destination folder (default: 'IMAGES/art')
 * @returns {Object} - Upload result with URLs and paths
 */
async function uploadFileToGitHub(file, filename, folder = 'IMAGES/art') {
    try {
        // Step 1: Convert file to base64 (required by GitHub API)
        const base64Content = await fileToBase64(file);
        const path = `${folder}/${filename}`; // Full path in repository
        
        // Step 2: Check if file already exists (GitHub requires SHA for updates)
        let sha = null;
        try {
            const existingFile = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/kennedysovine.github.io/contents/${path}`, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (existingFile.ok) {
                const fileData = await existingFile.json();
                sha = fileData.sha; // SHA is like a version ID for the file
            }
        } catch (error) {
            // File doesn't exist, which is fine for new uploads
        }
        
        // Step 3: Prepare upload data
        const uploadData = {
            message: `Upload artwork: ${filename}`, // Git commit message
            content: base64Content, // Base64 encoded file
            ...(sha && { sha }) // Include SHA only if file exists (for updates)
        };
        
        // Step 4: Upload via GitHub API
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/kennedysovine.github.io/contents/${path}`, {
            method: 'PUT', // PUT creates or updates files
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`, // Your personal access token
                'Accept': 'application/vnd.github.v3+json', // GitHub API version
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            // Enhanced error reporting for common issues
            let errorMessage = `GitHub API error: ${response.status} - ${errorData.message || response.statusText}`;
            
            if (response.status === 403) {
                console.error('🔒 403 Forbidden Error Details:');
                console.error('   - Token permissions insufficient');
                console.error('   - Required: "repo" scope for full repository access');
                console.error('   - Current repository:', `${GITHUB_USERNAME}/kennedysovine.github.io`);
                console.error('   - Attempting to write to:', path);
                
                errorMessage = `GitHub API access denied (403). Your personal access token needs "repo" permissions. Please:\n\n` +
                             `1. Go to GitHub Settings → Developer settings → Personal access tokens\n` +
                             `2. Delete your current token\n` +
                             `3. Create a new token with "repo" scope (full repository access)\n` +
                             `4. Update your config.js with the new token`;
            } else if (response.status === 404) {
                console.error('🔍 404 Not Found Error Details:');
                console.error('   - Repository may not exist or be accessible');
                console.error('   - Check repository name:', `${GITHUB_USERNAME}/kennedysovine.github.io`);
                console.error('   - Verify username is correct');
                
                errorMessage = `Repository not found (404). Please verify:\n` +
                             `- Repository exists: ${GITHUB_USERNAME}/kennedysovine.github.io\n` +
                             `- Username is correct in config.js\n` +
                             `- Repository is public or token has access to private repos`;
            } else if (response.status === 401) {
                errorMessage = `Authentication failed (401). Please check:\n` +
                             `- Token is correct in config.js\n` +
                             `- Token hasn't expired\n` +
                             `- No extra spaces in token string`;
            }
            
            throw new Error(errorMessage);
        }
        
        // Step 5: Return useful information about the uploaded file
        const result = await response.json();
        return {
            success: true,
            downloadUrl: result.content.download_url, // Direct link to file
            htmlUrl: result.content.html_url, // GitHub page for file
            path: path // Path within repository
        };
        
    } catch (error) {
        console.error('📋 File upload error details:', error);
        
        // Log additional debugging information
        console.error('🔧 Debug Information:');
        console.error('   - GitHub Username:', GITHUB_USERNAME);
        console.error('   - Repository:', `${GITHUB_USERNAME}/kennedysovine.github.io`);
        console.error('   - Upload Path:', path);
        console.error('   - File Size:', file.size, 'bytes');
        console.error('   - Token Present:', !!GITHUB_TOKEN);
        console.error('   - Token Length:', GITHUB_TOKEN ? GITHUB_TOKEN.length : 0);
        
        throw error; // Re-throw so calling function can handle it
    }
}

// ==============================================
// ART DATA MANAGEMENT SYSTEM
// ==============================================

/**
 * Fetch current art data from GitHub repository
 * 
 * How it works:
 * 1. Makes API call to get user-data/art-data.js file
 * 2. Decodes the base64 content to readable JavaScript
 * 3. Extracts the artData array using regex pattern matching
 * 4. Returns both the data and SHA (needed for updates)
 * 
 * Error handling:
 * - If file doesn't exist (404), returns empty array
 * - If file exists but has no data, returns empty array
 * - Returns SHA for version control (GitHub requirement)
 * 
 * @returns {Object} - { artData: Array, sha: string|null }
 */
async function getCurrentArtData() {
    try {
        // Fetch the art data file from GitHub
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/kennedysovine.github.io/contents/user-data/art-data.js`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                // File doesn't exist yet - this is normal for first upload
                console.log('Art data file does not exist yet, will create new one');
                return { artData: [], sha: null };
            }
            throw new Error(`Failed to fetch art data: ${response.status}`);
        }
        
        const fileData = await response.json();
        
        // Decode base64 content to readable JavaScript code
        const content = atob(fileData.content);
        
        // Extract the artData array from the JavaScript file using regex
        // This looks for: const artData = [...]
        const match = content.match(/const\s+artData\s*=\s*(\[[\s\S]*?\]);/);
        
        if (match) {
            // Parse the JSON array from the JavaScript code
            const artData = JSON.parse(match[1]);
            console.log(`Loaded ${artData.length} existing artworks from database`);
            return { artData, sha: fileData.sha };
        } else {
            // File exists but no artData found - use empty array
            console.log('Art data file exists but contains no artwork data');
            return { artData: [], sha: fileData.sha };
        }
        
    } catch (error) {
        console.error('Error fetching art data:', error);
        return { artData: [], sha: null }; // Fallback to empty data
    }
}

/**
 * Update art data file on GitHub with new artwork
 * 
 * Process:
 * 1. Creates properly formatted JavaScript file content
 * 2. Encodes content as base64 (GitHub API requirement)
 * 3. Includes SHA for version control (prevents conflicts)
 * 4. Creates descriptive commit message
 * 5. Uploads via GitHub Contents API
 * 
 * File structure created:
 * ```javascript
 * // Art portfolio data
 * // This file is automatically updated by the admin panel
 * const artData = [
 *   { id: 1, title: "Artwork 1", ... },
 *   { id: 2, title: "Artwork 2", ... }
 * ];
 * window.artData = artData;
 * ```
 * 
 * @param {Array} newArtData - Complete array of art objects
 * @param {string|null} sha - Version SHA from GitHub (for updates)
 * @returns {Object} - GitHub API response
 */
async function updateArtDataFile(newArtData, sha) {
    try {
        // Create formatted JavaScript file content
        // This creates a proper .js file that can be imported by your portfolio
        const fileContent = `// Art portfolio data
// This file is automatically updated by the admin panel

export const artworks = ${JSON.stringify(newArtData, null, 2)};

// Also make data available globally for backward compatibility
window.artData = artworks;

// You can add more art-related data exports here
export const artCategories = [
    "Digital Art",
    "Painting",
    "Drawing",
];
`;
        
        // Encode content as base64 (GitHub API requirement)
        const base64Content = btoa(fileContent);
        
        // Prepare upload payload
        const uploadData = {
            message: `Add new artwork: ${newArtData[newArtData.length - 1].title}`, // Git commit message
            content: base64Content, // Base64 encoded file content
            ...(sha && { sha }) // Include SHA only if updating existing file
        };
        
        // Upload to GitHub via Contents API
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/kennedysovine.github.io/contents/user-data/art-data.js`, {
            method: 'PUT', // PUT creates or updates files
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update art data: ${response.status} - ${errorData.message}`);
        }
        
        console.log(`Successfully updated art database with ${newArtData.length} artworks`);
        return await response.json();
        
    } catch (error) {
        console.error('Error updating art data:', error);
        throw error; // Re-throw so upload function can handle it
    }
}

// ==============================================
// MAIN UPLOAD FUNCTION
// ==============================================

// ==============================================
// MAIN UPLOAD WORKFLOW
// ==============================================

/**
 * Show or hide the upload progress indicator
 * Provides visual feedback during the upload process
 * @param {boolean} show - Whether to show or hide the progress bar
 */
function showUploadProgress(show = true) {
    const progressDiv = document.getElementById('upload-progress');
    const uploadBtn = document.getElementById('upload-btn');
    
    if (show) {
        progressDiv.style.display = 'block';
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';
    } else {
        progressDiv.style.display = 'none';
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload Artwork';
    }
}

/**
 * Update the progress bar and status text
 * Shows users what stage of the upload process is happening
 * @param {number} percentage - Progress percentage (0-100)
 * @param {string} text - Status message to display
 */
function updateProgress(percentage, text) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = text;
}

/**
 * MAIN UPLOAD FUNCTION - This is where everything comes together!
 * 
 * Upload Process Overview:
 * 1. Generate unique filename to prevent conflicts
 * 2. Upload image file to GitHub repository
 * 3. Fetch current art database from GitHub
 * 4. Add new artwork entry to database
 * 5. Update art database file on GitHub
 * 6. Show success message and clear form
 * 
 * Error Handling:
 * - Network failures are caught and reported
 * - GitHub API errors are parsed and displayed
 * - Progress bar is hidden on errors
 * - Form remains intact so user can retry
 * 
 * @param {Object} artData - Complete artwork data from form
 * @returns {Object} - The created art entry
 */
async function uploadArtwork(artData) {
    try {
        // Initialize progress tracking
        showUploadProgress(true);
        updateProgress(10, 'Preparing files...');
        
        // STEP 1: Generate unique filename
        // This prevents conflicts and organizes files by category
        const filename = generateUniqueFilename(artData.imageName, artData.category);
        updateProgress(20, 'Uploading image to GitHub...');
        
        // STEP 2: Upload the actual image file
        // This is the most time-consuming part of the process
        const uploadResult = await uploadFileToGitHub(artData.imageFile, filename);
        updateProgress(60, 'Image uploaded! Updating art database...');
        
        // STEP 3: Get current art database
        // We need the existing data and SHA for updating the file
        const { artData: currentArtData, sha } = await getCurrentArtData();
        updateProgress(80, 'Adding artwork to database...');
        
        // STEP 4: Create the new art entry
        // This structures all the metadata for the artwork
        const newArtEntry = {
            id: artData.id,                           // Unique timestamp ID
            title: artData.title,                     // User-entered title
            description: artData.description,         // User description
            category: artData.category,               // painting/drawing/digital
            date: artData.date,                       // Date created (user input)
            datePrecision: artData.datePrecision,     // 'month' or 'full'
            formattedDate: artData.formattedDate,     // Human-readable date
            tags: artData.tags,                       // Array of tag strings
            linkedProject: artData.linkedProject,    // Connected project info
            image: uploadResult.path,                 // Path within repository
            imageUrl: uploadResult.downloadUrl,      // Direct download URL
            uploadDate: new Date().toISOString(),     // When uploaded to admin
            featured: false                          // Can be set to true later
        };
        
        // STEP 5: Update the art database
        // Add new entry and push changes to GitHub
        const updatedArtData = [...currentArtData, newArtEntry];
        await updateArtDataFile(updatedArtData, sha);
        updateProgress(100, 'Upload complete!');
        
        // SUCCESS! Show completion and clean up
        setTimeout(() => {
            showUploadProgress(false);
            showStatus('Artwork uploaded successfully! 🎨', 'success');
            clearForm(); // Reset form for next upload
        }, 1000);
        
        return newArtEntry;
        
    } catch (error) {
        // ERROR HANDLING: Log details and show user-friendly message
        console.error('Upload failed:', error);
        showUploadProgress(false);
        showStatus(`Upload failed: ${error.message}`, 'error');
        throw error; // Re-throw for any additional error handling
    }
}

/**
 * Clear the form after successful upload
 * Resets all inputs to their default state, ready for the next artwork
 * This includes clearing preview images, tags, projects, and all form fields
 */
/**
 * Clear the form after successful upload
 * Resets all inputs to their default state, ready for the next artwork
 * Updated to work with drag & drop interface
 */
function clearForm() {
    // ==============================================
    // CLEAR FILE INPUT AND RESET DRAG & DROP ZONE
    // ==============================================
    
    // Clear the hidden file input
    document.getElementById('art-image').value = '';
    
    // Reset drag & drop interface - show drop zone, hide preview
    const dropZone = document.getElementById('drop-zone');
    const preview = document.getElementById('image-preview');
    
    if (dropZone) {
        dropZone.style.display = 'flex';
        dropZone.classList.remove('drag-over', 'error');
    }
    
    if (preview) {
        preview.style.display = 'none';
        preview.style.border = ''; // Clear any error borders
    }
    
    // ==============================================
    // CLEAR TEXT INPUTS
    // ==============================================
    
    document.getElementById('art-title').value = '';
    document.getElementById('art-description').value = '';
    document.getElementById('tag-input').value = '';
    
    // ==============================================
    // RESET RADIO BUTTONS AND SELECTIONS
    // ==============================================
    
    // Clear category selection
    const selectedCategory = document.querySelector('input[name="art-category"]:checked');
    if (selectedCategory) {
        selectedCategory.checked = false;
    }
    
    // ==============================================
    // RESET DATE INPUTS
    // ==============================================
    
    // Clear date inputs and reset to month precision
    document.getElementById('art-date-month').value = '';
    document.getElementById('art-date-full').value = '';
    
    // Reset to month precision (default)
    const monthPrecision = document.querySelector('input[name="date-precision"][value="month"]');
    if (monthPrecision) {
        monthPrecision.checked = true;
    }
    
    // Show month input, hide full date input
    const monthInput = document.getElementById('art-date-month');
    const fullInput = document.getElementById('art-date-full');
    if (monthInput && fullInput) {
        monthInput.style.display = 'block';
        fullInput.style.display = 'none';
    }
    
    // ==============================================
    // CLEAR PROJECT AND TAG SELECTIONS
    // ==============================================
    
    // Clear selected project
    clearProject();
    
    // Clear tags array and update UI
    tags = [];
    renderTags();
    
    // ==============================================
    // RESET FORM STATE AND PROVIDE FEEDBACK
    // ==============================================
    
    // Reset any form validation states
    const form = document.getElementById('upload-form');
    if (form) {
        form.classList.remove('was-validated');
    }
    
    // Scroll back to top of form for next upload
    document.getElementById('drop-zone').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    // Confirm form is ready for next upload
    showStatus('Form cleared. Ready for next upload! 🎨', 'info');
    
    // Focus on the drop zone for immediate interaction
    setTimeout(() => {
        if (dropZone) {
            dropZone.focus();
        }
    }, 500);
}

// ==============================================
// DRAG & DROP SYSTEM COMPLETE!
// ==============================================
// 
// Features implemented:
// 1. Visual drag & drop interface with animations
// 2. File validation (type, size, format)
// 3. Enhanced preview with metadata
// 4. Smooth transitions between states
// 5. Accessibility support (keyboard navigation)
// 6. Error handling with visual feedback
// 7. Integration with existing upload system
//
// GitHub API integration complete!
// Configuration is now loaded from config.js for security
// Core features implemented:
// 1. Secure token management
// 2. Real GitHub repository fetching
// 3. Enhanced project search and linking

// Note: Functions are made globally available immediately after their definitions
// to ensure they're accessible to HTML onclick handlers
