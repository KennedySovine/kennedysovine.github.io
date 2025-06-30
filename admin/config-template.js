// Configuration for admin panel
// IMPORTANT: This file should be gitignored for security!

export const config = {
    // Get your GitHub Personal Access Token from:
    // https://github.com/settings/personal-access-tokens
    // Needs 'repo' scope for your repository
    githubToken: 'YOUR_GITHUB_TOKEN_HERE',
    
    // Repository information
    repoOwner: 'KennedySovine',
    repoName: 'kennedysovine.github.io',
    branch: 'main',
    
    // Admin password (change this!)
    adminPassword: 'change-this-password'
};

// GitHub API endpoints
export const endpoints = {
    uploadFile: (path) => `https://api.github.com/repos/${config.repoOwner}/${config.repoName}/contents/${path}`,
    getFile: (path) => `https://api.github.com/repos/${config.repoOwner}/${config.repoName}/contents/${path}`
};
