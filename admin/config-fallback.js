// Fallback admin configuration
// Provides minimal functionality when admin/config.js is not available

// Default configuration with no sensitive data
const DEFAULT_CONFIG = {
    GITHUB_TOKEN: '', // Empty - requires manual setup
    GITHUB_USERNAME: '', // Empty - will be detected from token if available
    ADMIN_PASSWORD_HASH: '' // Empty - admin access disabled
};

// Initialize config if not already loaded
if (!window.CONFIG) {
    // Try to load the real config file dynamically
    try {
        const script = document.createElement('script');
        script.src = './config.js?' + Date.now(); // Add cache busting
        script.onload = () => {
            console.log('Config loaded successfully');
        };
        script.onerror = () => {
            console.warn('Admin config not found. Using fallback configuration.');
            window.CONFIG = DEFAULT_CONFIG;
        };
        document.head.appendChild(script);
    } catch (error) {
        console.warn('Using fallback admin configuration.');
        window.CONFIG = DEFAULT_CONFIG;
    }

    // If no config is loaded after a brief delay, use defaults
    setTimeout(() => {
        if (!window.CONFIG) {
            window.CONFIG = DEFAULT_CONFIG;
            console.warn('Admin config not available. Some features may be disabled.');
        }
    }, 500); // Increased timeout
}
