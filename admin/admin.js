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
function authenticate() {
    const password = document.getElementById('admin-password').value;
    const correctPassword = '@rtPortfolio'; // TODO: Change this!
    
    if (password === correctPassword) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('upload-form').style.display = 'block';
        showStatus('Authenticated successfully!', 'success');
        initializeTagInput();
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
        
        if (!imageFile) {
            showStatus('Please select an image!', 'error');
            return;
        }
        
        // TODO: Implement actual upload
        showStatus('Upload functionality not implemented yet!', 'error');
        console.log('Form data:', { imageFile, title, description, tags });
    });
}

// TODO: Implement GitHub API integration
// You'll need to:
// 1. Get a GitHub Personal Access Token
// 2. Implement file upload to repository
// 3. Update art-data.js with new entries
