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
    medium: 'https://api.rss2json.com/v1/api.json'
  }
};