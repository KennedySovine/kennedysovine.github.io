// Example configuration file
// Copy this to config.js and fill in your actual values
// NEVER commit config.js to git!

const CONFIG = {
    // Get your GitHub Personal Access Token from:
    // https://github.com/settings/tokens
    // Required permissions: repo (for private repos) or public_repo (for public repos only)
    GITHUB_TOKEN: 'your_github_token_here',
    
    // Your GitHub username (will be auto-detected from API if left empty)
    GITHUB_USERNAME: 'your_username_here',
    
    // Admin panel password hash (SHA-256)
    // Generate this by running: generatePasswordHash('your_password_here') in browser console
    // Default password '@rtPortfolio' hash is shown below
    ADMIN_PASSWORD_HASH: 'a1b2c3d4e5f6...' // Replace with your actual password hash
};

// Make config available globally
window.CONFIG = CONFIG;
