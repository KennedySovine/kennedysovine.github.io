// Fallback configuration with safe defaults
// This file provides default configuration when config.js is not available
export const defaultConfig = {
  // GitHub Personal Access Token (empty for public access)
  GITHUB_TOKEN: '',
  
  // Cache duration for GitHub API calls (in milliseconds)
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
  
  // Debug mode
  DEBUG: false,
  
  // API endpoints
  API_ENDPOINTS: {
    github: 'https://api.github.com',
    linkedin: 'https://api.linkedin.com/v2',
  },
  
  // LinkedIn integration settings
  LINKEDIN: {
    // Default LinkedIn profile URL
    PROFILE_URL: 'https://www.linkedin.com/in/kennedy-sovine-975090199',
    
    // LinkedIn API credentials (empty for fallback)
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    REDIRECT_URI: '',
    
    // Enable automatic LinkedIn data fetching
    AUTO_FETCH: false, // Disabled by default for security
    
    // Cache duration for LinkedIn data (in milliseconds)
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Try to import the real config, fall back to defaults
let config;
try {
  const configModule = await import('./config.js');
  config = configModule.config;
  console.log('Loaded user configuration');
} catch (error) {
  config = defaultConfig;
  console.warn('Using default configuration. Create user-data/config.js for full functionality.');
}

export { config };
