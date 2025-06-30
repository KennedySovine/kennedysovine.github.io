// Basic admin functionality - you can expand this!

// Array to store tags
let tags = [];

// Show status messages
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => status.innerHTML = '', 5000);
}

// Simple authentication
async function authenticate() {
    // Load configuration first
    if (!loadConfig()) {
        showStatus('Configuration not loaded! Make sure config.js exists.', 'error');
        return;
    }
    
    const password = document.getElementById('admin-password').value;
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('upload-form').style.display = 'block';
        showStatus('Authenticated successfully!', 'success');
        initializeTagInput();
        initializeImagePreview();
        await initializeProjectSearch();
        initializeFormHandler();
    } else {
        showStatus('Incorrect password!', 'error');
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
let ADMIN_PASSWORD = '';

// Load configuration
function loadConfig() {
    if (window.CONFIG) {
        GITHUB_TOKEN = window.CONFIG.GITHUB_TOKEN;
        GITHUB_USERNAME = window.CONFIG.GITHUB_USERNAME;
        ADMIN_PASSWORD = window.CONFIG.ADMIN_PASSWORD;
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

// Format date for display
function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // If day is 1, just show "Month Year"
    if (day === 1) {
        return `${month} ${year}`;
    } else {
        return `${day} ${month} ${year}`;
    }
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
        const date = document.getElementById('art-date').value;
        const formattedDate = formatDateForDisplay(date);
        
        if (!imageFile) {
            showStatus('Please select an image!', 'error');
            return;
        }
        
        if (!category) {
            showStatus('Please select a category!', 'error');
            return;
        }
        
        // Prepare the art data object
        const artData = {
            id: Date.now(),
            title: title || 'Untitled',
            description: description || '',
            category: category,
            date: date,
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

// GitHub API integration complete!
// Configuration is now loaded from config.js for security
// Features implemented:
// 1. Secure token management
// 2. Real GitHub repository fetching
// 3. Enhanced project search and linking
