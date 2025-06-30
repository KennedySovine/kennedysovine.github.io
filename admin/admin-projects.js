// Admin-only project data - for temporary storage
// This file is not used on the main site

export let adminProjects = [
    // Temporary projects created during art upload will be stored here
    // They become permanent when the art upload form is submitted
];

// Function to add temporary project
export function addTemporaryProject(project) {
    // Check if project already exists (case-insensitive)
    const exists = adminProjects.find(p => p.title.toLowerCase() === project.title.toLowerCase());
    if (!exists) {
        const newProject = {
            ...project,
            id: Date.now(), // Temporary ID
            isTemporary: true,
            dateCreated: new Date().toISOString()
        };
        adminProjects.push(newProject);
        console.log(`New temporary project created: "${newProject.title}"`);
        return newProject;
    }
    console.log(`Project "${project.title}" already exists`);
    return exists;
}

// Function to make project permanent
export function makeProjectPermanent(projectId) {
    const project = adminProjects.find(p => p.id === projectId);
    if (project) {
        project.isTemporary = false;
        project.dateMadePermanent = new Date().toISOString();
        console.log(`Project "${project.title}" made permanent`);
    }
    return project;
}

// Function to get all projects (for debugging)
export function getAllProjects() {
    return adminProjects;
}

// Function to clear temporary projects (for cleanup)
export function clearTemporaryProjects() {
    const temporaryCount = adminProjects.filter(p => p.isTemporary).length;
    adminProjects = adminProjects.filter(p => !p.isTemporary);
    console.log(`Cleared ${temporaryCount} temporary projects`);
    return adminProjects;
}
