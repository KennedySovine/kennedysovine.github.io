/**
 * LinkedIn Integration Setup Script
 * Run this in the browser console to set up LinkedIn integration
 */

// Setup instructions and helper functions
window.LinkedInSetup = {
  
  /**
   * Step 1: Configure LinkedIn profile URL
   */
  setProfileUrl: function(profileUrl) {
    if (!profileUrl) {
      console.log('❌ Please provide your LinkedIn profile URL');
      console.log('📝 Example: LinkedInSetup.setProfileUrl("https://www.linkedin.com/in/your-profile")');
      return;
    }
    
    console.log('🔗 LinkedIn profile URL configured:', profileUrl);
    console.log('💡 Add this to your config.js file:');
    console.log(`
LINKEDIN: {
  PROFILE_URL: '${profileUrl}',
  AUTO_FETCH: false, // Set to true to enable automatic fetching
  CACHE_DURATION: 24 * 60 * 60 * 1000 // 24 hours
}`);
  },
  
  /**
   * Step 2: Enable automatic fetching
   */
  enableAutoFetch: function() {
    console.log('🚀 To enable automatic LinkedIn data fetching:');
    console.log('1. Add your profile URL using LinkedInSetup.setProfileUrl()');
    console.log('2. Set AUTO_FETCH: true in your config.js');
    console.log('3. Refresh the page');
  },
  
  /**
   * Step 3: Manual data sync from LinkedIn
   */
  syncManually: function() {
    console.log('📝 Manual LinkedIn data synchronization:');
    console.log('1. Copy your LinkedIn "About" section → Update bio in data.js');
    console.log('2. Copy your skills → Update skills array in data.js');
    console.log('3. Copy work experience → Update experience array in data.js');
    console.log('4. Copy education → Update education array in data.js');
    
    const template = `
// Example data.js structure with LinkedIn info:
export const bio = [
  "Your LinkedIn headline/summary here",
  "Your professional description from LinkedIn About section"
];

export const skills = [
  "Skill 1, Skill 2, Skill 3", // Copy from LinkedIn skills section
  "Technology stack from LinkedIn experience"
];

export const experience = [
  {
    title: "Company Name from LinkedIn",
    duration: "Start Date - End Date",
    subtitle: "Job Title from LinkedIn",
    details: [
      "• Achievement 1 from LinkedIn experience",
      "• Achievement 2 from LinkedIn experience"
    ],
    tags: ["Tech1", "Tech2"], // Technologies used
    icon: "briefcase"
  }
];`;
    
    console.log('📋 Template:', template);
  },
  
  /**
   * Advanced: LinkedIn API setup
   */
  setupAPI: function() {
    console.log('🔧 LinkedIn API Setup (Advanced):');
    console.log('1. Go to https://www.linkedin.com/developers/');
    console.log('2. Create a new app');
    console.log('3. Get Client ID and Client Secret');
    console.log('4. Set up OAuth redirect URI');
    console.log('5. Add credentials to config.js');
    
    const apiConfig = `
LINKEDIN: {
  PROFILE_URL: 'your-profile-url',
  CLIENT_ID: 'your-client-id',
  CLIENT_SECRET: 'your-client-secret', // Keep secure!
  REDIRECT_URI: 'your-redirect-uri',
  AUTO_FETCH: true
}`;
    
    console.log('⚙️ API Configuration:', apiConfig);
    console.log('⚠️ Note: LinkedIn API requires app approval for profile access');
  },
  
  /**
   * Test current configuration
   */
  testConfig: function() {
    // Check if config is loaded
    if (typeof config !== 'undefined' && config.LINKEDIN) {
      console.log('✅ LinkedIn configuration found:');
      console.log('Profile URL:', config.LINKEDIN.PROFILE_URL || 'Not set');
      console.log('Auto Fetch:', config.LINKEDIN.AUTO_FETCH || false);
      console.log('Client ID:', config.LINKEDIN.CLIENT_ID ? 'Set' : 'Not set');
      
      if (config.LINKEDIN.PROFILE_URL) {
        console.log('🔗 You can view your profile at:', config.LINKEDIN.PROFILE_URL);
      } else {
        console.log('❌ Profile URL not configured. Use LinkedInSetup.setProfileUrl() to set it.');
      }
    } else {
      console.log('❌ LinkedIn configuration not found in config.js');
      console.log('💡 Add LinkedIn configuration to your config.js file');
    }
  },
  
  /**
   * Clear LinkedIn cache
   */
  clearCache: function() {
    try {
      localStorage.removeItem('linkedin_profile_cache');
      console.log('✅ LinkedIn cache cleared');
    } catch (error) {
      console.log('❌ Error clearing cache:', error);
    }
  },
  
  /**
   * Show all available commands
   */
  help: function() {
    console.log('🔗 LinkedIn Integration Setup Commands:');
    console.log('LinkedInSetup.setProfileUrl("url") - Set your LinkedIn profile URL');
    console.log('LinkedInSetup.enableAutoFetch() - Enable automatic data fetching');
    console.log('LinkedInSetup.syncManually() - Get manual sync instructions');
    console.log('LinkedInSetup.setupAPI() - Advanced API setup instructions');
    console.log('LinkedInSetup.testConfig() - Test current configuration');
    console.log('LinkedInSetup.clearCache() - Clear cached LinkedIn data');
    console.log('LinkedInSetup.help() - Show this help message');
  }
};

// Auto-show help when script loads
console.log('🚀 LinkedIn Integration Setup Loaded!');
console.log('💡 Type LinkedInSetup.help() to see available commands');

// Test configuration on load
if (typeof config !== 'undefined') {
  LinkedInSetup.testConfig();
} else {
  console.log('⏳ Waiting for config to load...');
}
