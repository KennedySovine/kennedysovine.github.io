import { projects } from '../user-data/projects.js';

/* TODO:
- [ ] Add a search bar to the projects page
- [ ] Implement a filter system for the projects page
- [ ] Add a loading spinner for the projects page
- [ ] Populate the projects page with data from a JS file (./user-data/projects.js)
- [ ] Add project cards that shows image, title, description, tags, and a link to the project
- [ ] Add 2 buttons: "View Source Code" and "Play Browser Game"
*/

// DOM Elements
const projectsGrid = document.getElementById('projectsGrid');
const searchInput = document.getElementById('projectSearch');
const tagsFilterContent = document.getElementById('tagsFilterContent');
const backBtn = document.getElementById('backBtn');
const tagsCollapseHeader = document.getElementById('tagsCollapseHeader');
const tagsCollapseIcon = document.getElementById('tagsCollapseIcon');

let activeTags = [];
let searchTerm = '';
let tagsCollapsed = false;

// Utility: Get all unique tags
function getAllTags(projects) {
    const tagSet = new Set();
    projects.forEach(p => (p.tags || []).forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
}

// Render tag bubbles
function renderTagBubbles(tags) {
    tagsFilterContent.innerHTML = '';
    tags.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'tag-bubble' + (activeTags.includes(tag) ? ' active' : '');
        tagEl.textContent = tag;
        tagEl.onclick = () => toggleTag(tag);
        tagsFilterContent.appendChild(tagEl);
    });
}

function toggleTag(tag) {
    if (activeTags.includes(tag)) {
        activeTags = activeTags.filter(t => t !== tag);
    } else {
        activeTags.push(tag);
    }
    renderTagBubbles(getAllTags(projects));
    renderProjects();
}

// Render project cards
function renderProjects() {
    let filtered = projects.filter(project => {
        // Filter by search
        const matchesSearch =
            !searchTerm ||
            (project.title && project.title.toLowerCase().includes(searchTerm)) ||
            (project.description && project.description.toLowerCase().includes(searchTerm)) ||
            (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        // Filter by tags
        const matchesTags =
            activeTags.length === 0 ||
            (project.tags && activeTags.every(tag => project.tags.includes(tag)));
        return matchesSearch && matchesTags;
    });
    projectsGrid.innerHTML = '';
    if (filtered.length === 0) {
        projectsGrid.innerHTML = '<p style="color:var(--gray-500);font-size:var(--font-size-lg);text-align:center;">No projects found.</p>';
        return;
    }
    filtered.forEach((project, idx) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.idx = idx;
        // Determine image field
        let imgSrc = project.image || project.thumbnail || 'PROFILE.jpeg';
        // Use higher-res YouTube thumbnail if available
        let ytId = '';
        let ytUrl = project.youtubeUrl || project.youtube || '';
        if (ytUrl) {
            // Extract YouTube video ID
            const match = ytUrl.match(/[?&]v=([^&#]+)|youtu\.be\/([^&#]+)/);
            ytId = match ? (match[1] || match[2]) : '';
            if (ytId) {
                // Try maxresdefault first, fallback to hqdefault if it fails to load
                imgSrc = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
            }
        }
        // Determine language field
        let lang = project.language || (project.tags ? project.tags[0] : '');
        // Determine source code URL
        let source = project.sourceCodeUrl || project.repo || '';
        // Determine playable URL
        let play = project.playableURL || project.play || '';
        // Dates (not always present)
        let dates = project.dates || '';
        // Use short and full description
        let shortDesc = project.description || '';
        let fullDesc = project.fullDescription || shortDesc;
        card.innerHTML = `
      <div class="card-header">
        <span class="lang-tag">${lang || ''}</span>
        <span class="project-title">${project.title || ''}</span>
        <span class="project-dates">${dates}</span>
      </div>
      <div class="project-thumbnail">
        <img src="${imgSrc}" alt="${project.title || ''} thumbnail" onerror="this.onerror=null;this.src='https://img.youtube.com/vi/${ytId}/hqdefault.jpg'" />
      </div>
      <div class="project-description">${shortDesc}</div>
      <div class="project-description-full" style="display:none;">${fullDesc}</div>
      <div class="project-tags">
        ${(project.tags || []).map(tag => `<span class="project-tag">${tag}</span>`).join('')}
      </div>
      <div class="card-actions">
        ${source ? `<a href="${source.startsWith('http') ? source : 'https://github.com/kennedysovine/' + source}" class="card-btn" target="_blank"><i class="fas fa-code"></i> Source Code</a>` : ''}
        ${play ? `<a href="${play}" class="card-btn secondary" target="_blank"><i class="fas fa-play"></i> Play</a>` : ''}
        ${ytUrl ? `<a href="${ytUrl}" class="card-btn secondary" target="_blank"><i class="fab fa-youtube"></i> YouTube</a>` : ''}
      </div>
      <button class="expand-btn" title="Show more" aria-label="Expand/collapse description"><span class="arrow">&#9660;</span></button>
    `;
        // Expand/collapse logic
        const expandBtn = card.querySelector('.expand-btn');
        const descShort = card.querySelector('.project-description');
        const descFull = card.querySelector('.project-description-full');
        let expanded = false;
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            expanded = !expanded;
            card.classList.toggle('expanded', expanded);
            if (expanded) {
                descShort.style.display = 'none';
                descFull.style.display = '';
                expandBtn.title = 'Show less';
            } else {
                descShort.style.display = '';
                descFull.style.display = 'none';
                expandBtn.title = 'Show more';
            }
        });
        projectsGrid.appendChild(card);
    });
}

// Search functionality
searchInput.addEventListener('input', e => {
    searchTerm = e.target.value.trim().toLowerCase();
    renderProjects();
});

// Collapsible tags
if (tagsCollapseHeader) {
    tagsCollapseHeader.addEventListener('click', () => {
        tagsCollapsed = !tagsCollapsed;
        tagsFilterContent.classList.toggle('collapsed', tagsCollapsed);
        tagsCollapseIcon.style.transform = tagsCollapsed ? 'rotate(-90deg)' : 'rotate(0)';
    });
}

// Back button
if (backBtn) {
    backBtn.onclick = () => window.location.href = 'index.html';
}

// Initial render
renderTagBubbles(getAllTags(projects));
renderProjects();