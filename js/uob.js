// UOB Modules Page Functionality
import { modules } from '../user-data/data.js';

// State management
let currentYear = "2022 - 2023";
let selectedModule = null;

// DOM elements
let yearButtons, moduleContainers, moduleReadme, moduleBullets;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM references
    yearButtons = {
        year1: document.getElementById('year1-btn'),
        year2: document.getElementById('year2-btn'),
        year3: document.getElementById('year3-btn')
    };
      moduleContainers = {
        semester1: document.getElementById('semester1-modules'),
        semester2: document.getElementById('semester2-modules'),
        semester3: document.getElementById('semester3-modules')
    };
    
    moduleReadme = document.getElementById('module-readme');
    moduleBullets = document.getElementById('module-bullets');
    
    // Add event listeners
    setupYearButtons();
    // Load initial data (Year 1)
    loadModulesForYear("2022 - 2023");
    
    // Set default module selection
    // selectFirstModule(); // Will be called at the end of loadModulesForYear
});

function setupYearButtons() {    yearButtons.year1.addEventListener('click', () => {
        setActiveYear('year1', "2022 - 2023");
        loadModulesForYear("2022 - 2023");
    });
    
    yearButtons.year2.addEventListener('click', () => {
        setActiveYear('year2', "2023 - 2024");
        loadModulesForYear("2023 - 2024");
    });
    
    yearButtons.year3.addEventListener('click', () => {
        setActiveYear('year3', "2024 - 2025");
        loadModulesForYear("2024 - 2025");
    });
}

function setActiveYear(activeYear, year) {
    // Remove active class from all buttons
    Object.values(yearButtons).forEach(btn => btn.classList.remove('active'));
    
    // Add active class to selected button
    yearButtons[activeYear].classList.add('active');
    
    currentYear = year;
}

function loadModulesForYear(year) {
    // Clear existing modules
    clearModuleContainers();
    
    // Filter modules by year
    const yearModules = modules.filter(module => module.year === year);
    
    // Group modules by semester
    const modulesBySemester = {
        '1': yearModules.filter(module => module.semester === '1'),
        '2': yearModules.filter(module => module.semester === '2'),
        '3': yearModules.filter(module => module.semester === '3')
    };
    
    // Populate each semester
    populateSemester('1', modulesBySemester['1']);
    populateSemester('2', modulesBySemester['2']);
    populateSemester('3', modulesBySemester['3']);
    
    // Select first available module
    selectFirstModule();
}

function clearModuleContainers() {
    moduleContainers.semester1.innerHTML = '';
    moduleContainers.semester2.innerHTML = '';
    moduleContainers.semester3.innerHTML = '';
}

function populateSemester(semester, semesterModules) {
    const container = semester === '3' ? moduleContainers.semester3 : 
                     semester === '2' ? moduleContainers.semester2 : 
                     moduleContainers.semester1;
    
    semesterModules.forEach(module => {
        const moduleBtn = createModuleButton(module, semester);
        container.appendChild(moduleBtn);
    });
    
    // Show/hide semester 3 container based on whether there are modules
    if (semester === '3') {
        const semester3Row = container.parentElement;
        if (semesterModules.length > 0) {
            semester3Row.style.display = 'flex';
        } else {
            semester3Row.style.display = 'none';
        }
    }
}

function createModuleButton(module, semester) {
    const button = document.createElement('button');
    button.className = `uob-module-btn ${semester === '3' ? 'sem3' : ''}`;
    button.textContent = module.title;
    button.dataset.moduleId = module.title;
    
    // Add click event listener
    button.addEventListener('click', () => {
        selectModule(module, button);
    });
    
    return button;
}

function selectModule(module, buttonElement) {
    // Remove active class from all module buttons
    document.querySelectorAll('.uob-module-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    buttonElement.classList.add('active');
    
    // Update selected module
    selectedModule = module;
    
    // Update info section
    updateModuleInfo(module);

    // Update repo link button
    const repoBtn = document.getElementById('repo-link-btn');
    if (module.githubrepo) { // Changed from repo_url to githubrepo
        repoBtn.style.display = 'flex'; // Show button if URL exists
        repoBtn.onclick = () => openGitHubRepo(module.githubrepo); // Changed from repo_url to githubrepo
    } else {
        repoBtn.style.display = 'none'; // Hide button if no URL
    }
}

function selectFirstModule() {
    const firstModuleBtn = document.querySelector('.uob-module-btn');
    if (firstModuleBtn) {
        const moduleTitle = firstModuleBtn.dataset.moduleId;
        const module = modules.find(m => m.title === moduleTitle);
        if (module) {
            selectModule(module, firstModuleBtn);
        }
    } else {
        // If no modules are loaded (e.g., for an empty year), clear the info section
        if (moduleReadme) {
            moduleReadme.innerHTML = renderMarkdown("README IS UNAVAILABLE");
        }
        if (moduleBullets) {
            moduleBullets.innerHTML = "";
        }
        const repoBtn = document.getElementById('repo-link-btn');
        if (repoBtn) {
            repoBtn.style.display = 'none';
        }
    }
}

async function fetchAndDisplayReadme(module) {
    if (!moduleReadme) {
        console.error("Module README DOM element not found.");
        return;
    }

    if (!module || !module.githubrepo) {
        moduleReadme.innerHTML = renderMarkdown("README IS UNAVAILABLE");
        return;
    }

    const repoUrl = module.githubrepo.trim().replace(/\/$/, ''); // Remove trailing slash
    const urlParts = repoUrl.split('/');
    if (urlParts.length < 5 || urlParts[2] !== 'github.com') {
        moduleReadme.innerHTML = renderMarkdown("README IS UNAVAILABLE\n(Invalid GitHub repository URL)");
        return;
    }
    const owner = urlParts[3];
    const repo = urlParts[4];
    
    const branchesToTry = ['main', 'master'];
    let readmeContent = null;
    let successfulBranchName = null; // To store the branch from which README was fetched

    moduleReadme.innerHTML = renderMarkdown("<em>Loading README...</em>"); // No owner/repo/branch here

    for (const currentBranchTry of branchesToTry) {
        const rawReadmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${currentBranchTry}/README.md`;
        try {
            const response = await fetch(rawReadmeUrl);
            if (response.ok) {
                readmeContent = await response.text();
                successfulBranchName = currentBranchTry; // Store the successful branch
                break; // Found README, exit loop
            }
        } catch (error) {
            console.warn(`Error fetching README from ${rawReadmeUrl}:`, error);
            // Continue to next branch or fallback
        }
    }

    if (readmeContent) {
        moduleReadme.innerHTML = renderMarkdown(readmeContent, owner, repo, successfulBranchName);
    } else {
        moduleReadme.innerHTML = renderMarkdown("README IS UNAVAILABLE");
    }
}


function updateModuleInfo(module) {
    // Update readme with actual GitHub README or fallback
    fetchAndDisplayReadme(module);
    
    // Update bullet points
    updateBulletPoints(module.content);

    // Update repo link button
    const repoBtn = document.getElementById('repo-link-btn');
    if (module.githubrepo) { // Changed from repo_url to githubrepo
        repoBtn.style.display = 'flex'; // Show button if URL exists
        repoBtn.onclick = () => openGitHubRepo(module.githubrepo); // Changed from repo_url to githubrepo
    } else {
        repoBtn.style.display = 'none'; // Hide button if no URL
    }
}

/* REMOVE THIS FUNCTION
function generateReadmeContent(module) {
    // Generate a realistic README-style content based on the module
    const readmeText = `# ${module.title}\\n\\nThis repository contains coursework and projects for ${module.title} at the University of Brighton.\\n\\n## Overview\\nThis module covers fundamental concepts and practical applications in the field. Students will develop hands-on experience through various assignments and projects.\\n\\n## Learning Objectives\\n- Understand core principles and methodologies\\n- Apply theoretical knowledge to practical scenarios\\n- Develop technical skills relevant to the subject area\\n- Complete assessments demonstrating competency\\n\\n## Repository Structure\\n- \\\\\`/assignments\\\\\` - Weekly assignments and homework\\n- \\\\\`/projects\\\\\` - Major projects and coursework\\n- \\\\\`/resources\\\\\` - Additional learning materials\\n- \\\\\`/documentation\\\\\` - Project documentation and reports\\n\\n## Technologies Used\\n- Programming languages and tools relevant to the module\\n- Development environments and frameworks\\n- Testing and deployment tools\\n\\n## Assessment\\nThis module includes various forms of assessment including practical work, written assignments, and project deliverables.\\n\\nFor more information about this module, please refer to the official University of Brighton course documentation.`;

    return readmeText;
}
*/

function renderMarkdown(text, owner, repo, branch) {
    let html = text;

    // Phase 1: Resolve URLs and convert Markdown images and links
    if (owner && repo && branch) {
        // Convert relative Markdown image links: ![alt text](path/to/image.png)
        // Matches if URL does not start with a protocol like http:, mailto:, etc.
        html = html.replace(/!\[(.*?)\]\((?!([a-zA-Z]+:))(.*?)\)/g, (match, altText, protocol, imgUrl) => {
            let resolvedUrl = imgUrl.trim();
            if (resolvedUrl.startsWith('/')) {
                resolvedUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}${resolvedUrl}`;
            } else {
                resolvedUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${resolvedUrl}`;
            }
            return `<img src="${resolvedUrl}" alt="${altText || 'image'}" style="max-width: 100%; height: auto;">`;
        });

        // Convert relative Markdown links: [link text](path/to/document)
        html = html.replace(/\[(.*?)\]\((?!([a-zA-Z]+:))(.*?)\)/g, (match, linkText, protocol, linkUrl) => {
            let resolvedUrl = linkUrl.trim();
            if (resolvedUrl.startsWith('/')) {
                resolvedUrl = `https://github.com/${owner}/${repo}/blob/${branch}${resolvedUrl}`;
            } else {
                resolvedUrl = `https://github.com/${owner}/${repo}/blob/${branch}/${resolvedUrl}`;
            }
            return `<a href="${resolvedUrl}" target="_blank">${linkText}</a>`;
        });
    }

    // Convert absolute Markdown image links (those starting with a protocol)
    html = html.replace(/!\[(.*?)\]\(([a-zA-Z]+:.*?)\)/g, (match, altText, imgUrl) => {
        return `<img src="${imgUrl.trim()}" alt="${altText || 'image'}" style="max-width: 100%; height: auto;">`;
    });

    // Convert absolute Markdown links
    html = html.replace(/\[(.*?)\]\(([a-zA-Z]+:.*?)\)/g, (match, linkText, linkUrl) => {
        return `<a href="${linkUrl.trim()}" target="_blank">${linkText}</a>`;
    });
    
    // Phase 2: Existing structural Markdown conversions
    // Convert headers (# ## ###) - Order is important
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Convert bold text: **text** or __text__
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Convert code blocks with backticks (inline)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert horizontal rules: ---, ***, ___
    html = html.replace(/^\s*([-*_]){3,}\s*$/gm, '<hr>');
    
    // Convert bullet points (ul lists) - lines starting with *, -, or +
    html = html.replace(/^[\*\-\+] (.*$)/gm, '<li>$1</li>');
    
    // Convert numbered lists (ol lists) - lines starting with number.
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>'); 

    // Wrap consecutive list items in ul tags (simplistic)
    html = html.replace(/(<li>.*<\/li>\s*)+/g, function(match) {
        return '<ul>' + match.replace(/<\/li>\s*<li>/g, '</li><li>') + '</ul>';
    });
    
    // Convert line breaks to paragraphs
    html = html.split('\n\n').map(paragraph => {
        paragraph = paragraph.trim();
        if (!paragraph) return '';
        if (/^<(h[1-6]|ul|ol|li|hr|p|img|a|code|strong|em|pre|blockquote|table|thead|tbody|tr|th|td)/i.test(paragraph.trim())) {
            return paragraph;
        }
        return '<p>' + paragraph.replace(/\n/g, '<br>') + '</p>';
    }).join('');

    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p><br><\/p>/g, '');

    return html;
}

function updateBulletPoints(content) {
    // Clear existing bullets
    moduleBullets.innerHTML = '';
    
    // Add new bullet points
    if (content && content.length > 0) {
        content.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            moduleBullets.appendChild(li);
        });
    } else {
        // Add default message if no content
        const li = document.createElement('li');
        li.textContent = 'Module content details to be updated';
        moduleBullets.appendChild(li);
    }
}

// Handle GitHub repository links
function openGitHubRepo(url) {
    if (url) {
        window.open(url, '_blank');
    }
}

// Export functions for potential external use
window.UOBModules = {
    loadModulesForYear,
    selectModule,
    openGitHubRepo
};
