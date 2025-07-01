// Art Gallery JavaScript
// Handles search, filtering, sorting, and display of artwork

// Import art data
import { artworks, artCategories } from '../user-data/art-data.js';

// State management
let filteredArtworks = [];
let allTags = new Set();
let allProjects = new Set();
let currentFilters = {
    search: '',
    types: ['all'],
    tags: [],
    projects: []
};
let currentSort = 'newest-created'; // Default to date created, newest first

// Define sort type mapping for toggling directions
const sortTypeMapping = {
    'newest-upload': 'oldest-upload',
    'oldest-upload': 'newest-upload',
    'newest-created': 'oldest-created',
    'oldest-created': 'newest-created',
    'alphabetical': 'reverse-alphabetical',
    'reverse-alphabetical': 'alphabetical'
};

/**
 * Check if the site is running on GitHub Pages
 * @returns {boolean} True if running on GitHub Pages
 */
function isRunningOnGitHubPages() {
    const hostname = window.location.hostname;
    
    // Check for GitHub Pages domains
    return hostname.includes('github.io') || 
           hostname.includes('githubusercontent.com') ||
           (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('local'));
}

/**
 * Hide admin panel if running on GitHub Pages
 */
function hideAdminPanelIfOnPages() {
    if (isRunningOnGitHubPages()) {
        // Hide main admin panel link
        const adminLink = document.getElementById('admin-panel-link');
        if (adminLink) {
            adminLink.style.display = 'none';
        }
        
        // Hide upload link in empty state message
        const adminUploadWrapper = document.getElementById('admin-upload-link-wrapper');
        if (adminUploadWrapper) {
            adminUploadWrapper.style.display = 'none';
        }
        
        console.log('Admin panel hidden - running on GitHub Pages');
    }
}

// Initialize gallery when page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Hide admin panel if on GitHub Pages
        hideAdminPanelIfOnPages();
        
        await initializeGallery();
    } catch (error) {
        console.error('Failed to initialize gallery:', error);
        showEmptyState();
    }
});

/**
 * Initialize the gallery with artwork data
 */
async function initializeGallery() {
    // If no artworks exist locally, try to fetch from GitHub
    if (!artworks || artworks.length === 0) {
        await tryFetchFromGitHub();
    }
    
    if (!artworks || artworks.length === 0) {
        showEmptyState();
        return;
    }
    
    // Extract all unique tags and projects
    extractMetadata();
    
    // Initialize UI components
    initializeFilters();
    initializeEventListeners();
    
    // Initial display
    applyFiltersAndSort();
    
    // Hide loading state
    document.getElementById('loading-state').style.display = 'none';
}

/**
 * Try to fetch artwork data from GitHub if local data is empty
 */
async function tryFetchFromGitHub() {
    try {
        const response = await fetch('./user-data/art-data.js');
        if (response.ok) {
            const text = await response.text();
            // Parse the module exports to get artworks array
            const match = text.match(/export const artworks = \[([\s\S]*?)\];/);
            if (match) {
                const artworksData = JSON.parse('[' + match[1] + ']');
                // Update the artworks array
                artworks.length = 0;
                artworks.push(...artworksData);
            }
        }
    } catch (error) {
        console.warn('Could not fetch artwork data from GitHub:', error);
    }
}

/**
 * Extract unique tags and projects from artwork data
 */
function extractMetadata() {
    artworks.forEach(artwork => {
        // Collect tags
        if (artwork.tags && Array.isArray(artwork.tags)) {
            artwork.tags.forEach(tag => allTags.add(tag));
        }
        
        // Collect projects
        if (artwork.linkedProject && artwork.linkedProject.title) {
            allProjects.add(artwork.linkedProject.title);
        }
    });
}

/**
 * Initialize filter UI components
 */
function initializeFilters() {
    // Populate type filters
    const typeFilterOptions = document.getElementById('type-filter-options');
    typeFilterOptions.innerHTML = '';
    
    // Add "All Types" option first
    const allTypesLabel = document.createElement('label');
    allTypesLabel.className = 'filter-option';
    allTypesLabel.innerHTML = `
        <input type="checkbox" value="all" checked>
        <span>All Types</span>
    `;
    const allTypesCheckbox = allTypesLabel.querySelector('input');
    allTypesCheckbox.addEventListener('change', handleTypeFilter);
    typeFilterOptions.appendChild(allTypesLabel);
    
    // Add category filters based on artCategories
    artCategories.forEach(category => {
        const categoryValue = category.toLowerCase().replace(/\s+/g, '');
        const label = document.createElement('label');
        label.className = 'filter-option';
        label.innerHTML = `
            <input type="checkbox" value="${categoryValue}">
            <span>${category}</span>
        `;
        const checkbox = label.querySelector('input');
        checkbox.addEventListener('change', handleTypeFilter);
        typeFilterOptions.appendChild(label);
    });
    
    // Populate tags filter
    const tagsFilter = document.getElementById('tags-filter');
    tagsFilter.innerHTML = '';
    
    Array.from(allTags).sort().forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'filter-tag';
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => toggleTagFilter(tag));
        tagsFilter.appendChild(tagElement);
    });
    
    // Populate projects filter
    const projectsFilter = document.getElementById('projects-filter');
    projectsFilter.innerHTML = '';
    
    Array.from(allProjects).sort().forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'filter-project';
        projectElement.textContent = project;
        projectElement.addEventListener('click', () => toggleProjectFilter(project));
        projectsFilter.appendChild(projectElement);
    });
}

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', handleSearch);
    
    // Type filters are now handled dynamically in initializeFilters()
    
    // Sort dropdown
    const sortSelect = document.getElementById('sort-select');
    
    sortSelect.addEventListener('change', function(event) {
        const selectedValue = event.target.value;
        
        // If the same option is selected again, toggle the direction
        if (selectedValue === currentSort) {
            toggleSortDirection();
        } else {
            currentSort = selectedValue;
            applyFiltersAndSort();
        }
    });
    
    // Modal close events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

/**
 * Toggle sort direction for the current sort type
 */
function toggleSortDirection() {
    // Get the opposite sort direction
    const newSort = sortTypeMapping[currentSort];
    if (newSort) {
        currentSort = newSort;
        // Update the dropdown to reflect the new sort
        const sortSelect = document.getElementById('sort-select');
        sortSelect.value = currentSort;
        applyFiltersAndSort();
    }
}

/**
 * Handle search input
 */
function handleSearch(event) {
    currentFilters.search = event.target.value.toLowerCase();
    applyFiltersAndSort();
}

/**
 * Handle type filter changes
 */
function handleTypeFilter(event) {
    const value = event.target.value;
    const checked = event.target.checked;
    
    console.log('Type filter changed:', value, checked); // Debug log
    
    if (value === 'all') {
        if (checked) {
            currentFilters.types = ['all'];
            // Uncheck other type filters
            document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
                if (cb.value !== 'all') cb.checked = false;
            });
        }
    } else {
        // Uncheck "all" if specific type is selected
        document.querySelector('.filter-option input[value="all"]').checked = false;
        
        if (checked) {
            currentFilters.types = currentFilters.types.filter(t => t !== 'all');
            currentFilters.types.push(value);
        } else {
            currentFilters.types = currentFilters.types.filter(t => t !== value);
        }
        
        // If no types selected, select "all"
        if (currentFilters.types.length === 0) {
            currentFilters.types = ['all'];
            document.querySelector('.filter-option input[value="all"]').checked = true;
        }
    }
    
    console.log('Current filters:', currentFilters); // Debug log
    applyFiltersAndSort();
}

/**
 * Toggle tag filter
 */
function toggleTagFilter(tag) {
    // Find the tag element by checking text content
    const tagElements = document.querySelectorAll('.filter-tag');
    const tagElement = Array.from(tagElements).find(el => el.textContent === tag);
    
    if (currentFilters.tags.includes(tag)) {
        currentFilters.tags = currentFilters.tags.filter(t => t !== tag);
        if (tagElement) tagElement.classList.remove('active');
    } else {
        currentFilters.tags.push(tag);
        if (tagElement) tagElement.classList.add('active');
    }
    
    applyFiltersAndSort();
}

/**
 * Toggle project filter
 */
function toggleProjectFilter(project) {
    // Find the project element by checking text content
    const projectElements = document.querySelectorAll('.filter-project');
    const projectElement = Array.from(projectElements).find(el => el.textContent === project);
    
    if (currentFilters.projects.includes(project)) {
        currentFilters.projects = currentFilters.projects.filter(p => p !== project);
        if (projectElement) projectElement.classList.remove('active');
    } else {
        currentFilters.projects.push(project);
        if (projectElement) projectElement.classList.add('active');
    }
    
    applyFiltersAndSort();
}

/**
 * Apply all filters and sorting
 */
function applyFiltersAndSort() {
    // Start with all artworks
    filteredArtworks = [...artworks];
    
    // Apply search filter
    if (currentFilters.search) {
        filteredArtworks = filteredArtworks.filter(artwork => {
            const searchText = [
                artwork.title,
                artwork.description,
                ...(artwork.tags || []),
                artwork.category
            ].join(' ').toLowerCase();
            
            return searchText.includes(currentFilters.search);
        });
    }
    
    // Apply type filter
    if (!currentFilters.types.includes('all')) {
        console.log('Applying type filter:', currentFilters.types); // Debug log
        const beforeFilter = filteredArtworks.length;
        
        filteredArtworks = filteredArtworks.filter(artwork => {
            // Map filter values to possible category values
            const categoryMappings = {
                'digital': ['Digital Art', 'Digital'],
                'painting': ['Painting', 'Paintings', 'Oil Paint', 'Acrylic', 'Watercolor'],
                'drawing': ['Drawing', 'Sketches', 'Pencil', 'Ink'],
                'traditional': ['Traditional Art', 'Traditional', 'Pencil', 'Ink', 'Watercolor', 'Oil Paint', 'Acrylic'],
                '3d': ['3D Art', '3D', 'Three Dimensional']
            };
            
            const matches = currentFilters.types.some(type => {
                const possibleCategories = categoryMappings[type] || [type];
                return possibleCategories.some(cat => 
                    artwork.category === cat || 
                    artwork.category.toLowerCase() === cat.toLowerCase() ||
                    artwork.medium === cat ||
                    artwork.medium.toLowerCase() === cat.toLowerCase()
                );
            });
            
            if (matches) {
                console.log('Artwork matches filter:', artwork.title, artwork.category, artwork.medium); // Debug log
            }
            
            return matches;
        });
        
        console.log(`Type filter: ${beforeFilter} -> ${filteredArtworks.length} artworks`); // Debug log
    }
    
    // Apply tag filter
    if (currentFilters.tags.length > 0) {
        filteredArtworks = filteredArtworks.filter(artwork => {
            return currentFilters.tags.some(tag => 
                artwork.tags && artwork.tags.includes(tag)
            );
        });
    }
    
    // Apply project filter
    if (currentFilters.projects.length > 0) {
        filteredArtworks = filteredArtworks.filter(artwork => {
            return artwork.linkedProject && 
                   currentFilters.projects.includes(artwork.linkedProject.title);
        });
    }
    
    // Apply sorting
    applySorting();
    
    // Update display
    updateGalleryDisplay();
    updateResultsCount();
}

/**
 * Apply sorting to filtered artworks
 */
function applySorting() {
    switch (currentSort) {
        case 'newest-upload':
            filteredArtworks.sort((a, b) => new Date(b.uploadDate || b.dateAdded) - new Date(a.uploadDate || a.dateAdded));
            break;
        case 'newest-created':
            filteredArtworks.sort((a, b) => new Date(b.dateCreated || b.year) - new Date(a.dateCreated || a.year));
            break;
        case 'oldest-upload':
            filteredArtworks.sort((a, b) => new Date(a.uploadDate || a.dateAdded) - new Date(b.uploadDate || b.dateAdded));
            break;
        case 'oldest-created':
            filteredArtworks.sort((a, b) => new Date(a.dateCreated || a.year) - new Date(b.dateCreated || b.year));
            break;
        case 'alphabetical':
            filteredArtworks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'reverse-alphabetical':
            filteredArtworks.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }
}

/**
 * Update the gallery display with filtered artworks
 */
function updateGalleryDisplay() {
    const galleryGrid = document.getElementById('gallery-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (filteredArtworks.length === 0) {
        galleryGrid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    galleryGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Clear existing content
    galleryGrid.innerHTML = '';
    
    // Create artwork cards
    filteredArtworks.forEach(artwork => {
        const artworkCard = createArtworkCard(artwork);
        galleryGrid.appendChild(artworkCard);
    });
}

/**
 * Create an artwork card element
 */
function createArtworkCard(artwork) {
    const card = document.createElement('div');
    card.className = 'artwork-card';
    card.addEventListener('click', () => openModal(artwork));
    
    // Format date for display
    console.log(artwork.dateCreated, artwork.year); // Debug log
    const displayDate = artwork.formattedDate || 'Unknown Date';
    
    // Truncate description
    const description = artwork.description || '';
    const truncatedDescription = description.length > 100 ? 
        description.substring(0, 100) + '...' : description;
    
    card.innerHTML = `
        <div class="artwork-image">
            <img src="${artwork.imageUrl}" alt="${artwork.title}" loading="lazy">
        </div>
        <div class="artwork-info">
            <h3 class="artwork-title">${artwork.title}</h3>
            <p class="artwork-description">${truncatedDescription}</p>
            <div class="artwork-metadata">
                <span class="artwork-category">${formatCategory(artwork.category)}</span>
                <span class="artwork-date">${displayDate}</span>
            </div>
            <div class="artwork-tags">
                ${(artwork.tags || []).slice(0, 5).map(tag => 
                    `<span class="artwork-tag">${tag}</span>`
                ).join('')}
                ${artwork.tags && artwork.tags.length > 5 ? 
                    `<span class="artwork-tag">+${artwork.tags.length - 5}</span>` : ''
                }
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Format category for display
 */
function formatCategory(category) {
    const categoryMap = {
        'digital': 'Digital Art',
        'painting': 'Painting',
        'drawing': 'Drawing',
        'traditional': 'Traditional Art',
        '3d': '3D Art'
    };
    
    // If it's already a display name, return as is
    if (Object.values(categoryMap).includes(category)) {
        return category;
    }
    
    // Otherwise, map from lowercase to display name
    return categoryMap[category.toLowerCase()] || category;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
}

/**
 * Update results count display
 */
function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    const total = artworks.length;
    const filtered = filteredArtworks.length;
    
    if (filtered === total) {
        resultsCount.textContent = `Showing all ${total} artworks`;
    } else {
        resultsCount.textContent = `Showing ${filtered} of ${total} artworks`;
    }
}

/**
 * Open artwork modal
 */
function openModal(artwork) {
    const modal = document.getElementById('artwork-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalCategory = document.getElementById('modal-category');
    const modalDate = document.getElementById('modal-date');
    const modalTags = document.getElementById('modal-tags');
    const modalProjectContainer = document.getElementById('modal-project-container');
    const modalProject = document.getElementById('modal-project');
    
    // Populate modal content
    modalImg.src = artwork.imageUrl;
    modalImg.alt = artwork.title;
    modalTitle.textContent = artwork.title;
    modalDescription.textContent = artwork.description || 'No description available.';
    modalCategory.textContent = formatCategory(artwork.category);
    modalDate.textContent = artwork.formattedDate || 'Unknown Date';
    
    // Populate tags
    modalTags.innerHTML = '';
    if (artwork.tags && artwork.tags.length > 0) {
        artwork.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'modal-tag';
            tagElement.textContent = tag;
            modalTags.appendChild(tagElement);
        });
    }
    
    // Handle project link
    if (artwork.linkedProject) {
        modalProject.textContent = artwork.linkedProject.title;
        modalProject.href = artwork.linkedProject.url || '#';
        modalProjectContainer.style.display = 'block';
    } else {
        modalProjectContainer.style.display = 'none';
    }
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Close artwork modal
 */
function closeModal() {
    const modal = document.getElementById('artwork-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

/**
 * Clear all filters
 */
function clearAllFilters() {
    // Reset filters
    currentFilters = {
        search: '',
        types: ['all'],
        tags: [],
        projects: []
    };
    
    // Reset UI
    document.getElementById('search-input').value = '';
    
    // Reset type checkboxes
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.value === 'all';
    });
    
    // Reset tag and project filters
    document.querySelectorAll('.filter-tag.active').forEach(tag => {
        tag.classList.remove('active');
    });
    document.querySelectorAll('.filter-project.active').forEach(project => {
        project.classList.remove('active');
    });
    
    // Reset sort
    document.getElementById('sort-select').value = 'newest-upload';
    currentSort = 'newest-upload';
    
    // Apply changes
    applyFiltersAndSort();
}

/**
 * Show empty state when no artworks are available
 */
function showEmptyState() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('gallery-grid').style.display = 'none';
    document.getElementById('empty-state').style.display = 'flex';
    document.getElementById('results-count').textContent = 'No artwork found';
}

// Export functions for global access
window.closeModal = closeModal;
window.clearAllFilters = clearAllFilters;
