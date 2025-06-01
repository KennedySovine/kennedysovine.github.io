// Configuration for the portfolio website
export const config = {
  // GitHub Personal Access Token (optional, for higher rate limits)
  // Get one from: https://github.com/settings/tokens
  GITHUB_TOKEN: '', // Leave empty if not using authentication
  
  // Cache duration for GitHub API calls (in milliseconds)
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
  
  // Debug mode
  DEBUG: false,
    // API endpoints
  API_ENDPOINTS: {
    github: 'https://api.github.com',
    stackexchange: 'https://api.stackexchange.com/2.2',
    linkedin: 'https://api.linkedin.com/v2',
  },
  
  // LinkedIn integration settings
  LINKEDIN: {
    // Your LinkedIn profile URL (public)
    PROFILE_URL: 'https://www.linkedin.com/in/kennedy-sovine-975090199',
    
    // LinkedIn API credentials (optional - requires LinkedIn app)
    CLIENT_ID: '', // LinkedIn app client ID
    CLIENT_SECRET: '', // LinkedIn app client secret (keep secure!)
    REDIRECT_URI: '', // Your app's redirect URI
      // Enable automatic LinkedIn data fetching
    AUTO_FETCH: true, // Set to true to enable automatic fetching
    
    // Cache duration for LinkedIn data (in milliseconds)
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  },
};