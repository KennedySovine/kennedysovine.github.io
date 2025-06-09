// UOB Modules Page Functionality
import { modules } from '../user-data/data.js';

// State management
let currentYear = "2022 - 2023";
let selectedModule = null;

// DOM elements
let yearButtons, moduleContainers, moduleTitle, moduleReadme, moduleBullets;

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
    
    moduleTitle = document.getElementById('module-title');
    moduleReadme = document.getElementById('module-readme');
    moduleBullets = document.getElementById('module-bullets');
    
    // Add event listeners
    setupYearButtons();
      // Load initial data (Year 1)
    loadModulesForYear("2022 - 2023");
    
    // Set default module selection
    selectFirstModule();
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
}

function selectFirstModule() {
    const firstModuleBtn = document.querySelector('.uob-module-btn');
    if (firstModuleBtn) {
        const moduleTitle = firstModuleBtn.dataset.moduleId;
        const module = modules.find(m => m.title === moduleTitle);
        if (module) {
            selectModule(module, firstModuleBtn);
        }
    }
}

function updateModuleInfo(module) {
    // Update title
    moduleTitle.textContent = module.title;
    
    // Update readme (simulate GitHub readme content)
    const readmeContent = generateReadmeContent(module);
    moduleReadme.textContent = readmeContent;
    
    // Update bullet points
    updateBulletPoints(module.content);
}

function generateReadmeContent(module) {
    // Generate a realistic README-style content based on the module
    const readmeText = `# ${module.title}

This repository contains coursework and projects for ${module.title} at the University of Brighton.

## Overview
This module covers fundamental concepts and practical applications in the field. Students will develop hands-on experience through various assignments and projects.

## Learning Objectives
- Understand core principles and methodologies
- Apply theoretical knowledge to practical scenarios
- Develop technical skills relevant to the subject area
- Complete assessments demonstrating competency

## Repository Structure
- \`/assignments\` - Weekly assignments and homework
- \`/projects\` - Major projects and coursework
- \`/resources\` - Additional learning materials
- \`/documentation\` - Project documentation and reports

## Technologies Used
- Programming languages and tools relevant to the module
- Development environments and frameworks
- Testing and deployment tools

## Assessment
This module includes various forms of assessment including practical work, written assignments, and project deliverables.

For more information about this module, please refer to the official University of Brighton course documentation.`;

    return readmeText;
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
