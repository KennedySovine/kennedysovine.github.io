// Admin-only project data - for temporary storage
// This file is not used on the main site

export let adminProjects = [
    // Temporary projects created during art upload will be stored here
    // They become permanent when the art upload form is submitted
];

// Function to add temporary project
export function addTemporaryProject(project) {
    // Check if project already exists
    const exists = adminProjects.find(p => p.title.toLowerCase() === project.title.toLowerCase());
    if (!exists) {
        adminProjects.push({
            ...project,
            id: Date.now(), // Temporary ID
            isTemporary: true,
            dateCreated: new Date().toISOString()
        });
    }
    return project;
}

// Function to make project permanent
export function makeProjectPermanent(projectId) {
    const project = adminProjects.find(p => p.id === projectId);
    if (project) {
        project.isTemporary = false;
    }
    return project;
}
