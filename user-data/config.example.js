// Configuration template for the portfolio website
// Copy this file to config.js and fill in your actual values
export const config = {
  // GitHub Personal Access Token (optional, for higher rate limits)
  // Get one from: https://github.com/settings/tokens
  // KEEP THIS SECRET - DO NOT COMMIT TO REPOSITORY
  GITHUB_TOKEN: '', // Add your token here (locally only)
  
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
    // Your LinkedIn profile URL (public)
    PROFILE_URL: 'https://www.linkedin.com/in/your-profile-here',
    
    // LinkedIn API credentials (optional - requires LinkedIn app)
    // KEEP THESE SECRET - DO NOT COMMIT TO REPOSITORY
    CLIENT_ID: '', // Add your LinkedIn app client ID here (locally only)
    CLIENT_SECRET: '', // Add your LinkedIn app client secret here (locally only)
    REDIRECT_URI: '', // Add your app's redirect URI here (locally only)
    
    // Enable automatic LinkedIn data fetching
    AUTO_FETCH: true, // Set to true to enable automatic fetching
    
    // Cache duration for LinkedIn data (in milliseconds)
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  },
};
