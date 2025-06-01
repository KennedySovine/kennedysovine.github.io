/**
 * LinkedIn Integration Module - Public Profile Link Method
 * Provides LinkedIn profile reference and manual data configuration
 */

import { config } from '../user-data/config.js';

class LinkedInIntegration {
  constructor() {
    this.cacheKey = 'linkedin_profile_cache';
    this.cacheDuration = config.LINKEDIN?.CACHE_DURATION || 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Get cached LinkedIn data
   */
  getCachedData() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        const now = Date.now();
        if (now - data.timestamp < this.cacheDuration) {
          console.log('📋 Using cached LinkedIn data');
          return data.profile;
        }
      }
    } catch (error) {
      console.warn('⚠️ Error reading LinkedIn cache:', error);
    }
    return null;
  }

  /**
   * Cache LinkedIn data
   */
  setCachedData(profileData) {
    try {
      const cacheData = {
        profile: profileData,
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
      console.log('💾 LinkedIn data cached successfully');
    } catch (error) {
      console.warn('⚠️ Error caching LinkedIn data:', error);
    }
  }

  /**
   * Clear LinkedIn cache
   */
  clearCache() {
    try {
      localStorage.removeItem(this.cacheKey);
      console.log('🗑️ LinkedIn cache cleared');
    } catch (error) {
      console.warn('⚠️ Error clearing LinkedIn cache:', error);
    }
  }
  /**
   * Get LinkedIn profile information
   * Returns LinkedIn URL and setup instructions for manual configuration
   */
  async getLinkedInProfile() {
    try {
      // Check cache first
      const cachedData = this.getCachedData();
      if (cachedData) {
        return cachedData;
      }

      // Create profile info with LinkedIn URL
      const profileInfo = this.createProfileReference();
      
      // Cache the result
      this.setCachedData(profileInfo);
      
      return profileInfo;
    } catch (error) {
      console.error('❌ Error getting LinkedIn profile:', error);
      return this.createDefaultProfile();
    }
  }

  /**
   * Create LinkedIn profile reference with URL and instructions
   */
  createProfileReference() {
    const profileUrl = config.LINKEDIN?.PROFILE_URL;
    
    if (!profileUrl) {
      return this.createDefaultProfile();
    }

    return {
      source: 'linkedin_public',
      profileUrl: profileUrl,
      linkedInUrl: profileUrl,
      lastUpdated: new Date().toISOString(),
      status: 'configured',
      instructions: {
        title: 'LinkedIn Profile Connected',
        message: 'Your LinkedIn profile URL is configured. Update your portfolio data manually in data.js',
        steps: [
          '1. Visit your LinkedIn profile to get current information',
          '2. Update bio in user-data/data.js',
          '3. Update skills in user-data/data.js', 
          '4. Update experience in user-data/data.js'
        ],
        profileUrl: profileUrl
      }
    };
  }

  /**
   * Create default profile when LinkedIn URL is not configured
   */
  createDefaultProfile() {
    return {
      source: 'not_configured',
      profileUrl: null,
      linkedInUrl: null,
      lastUpdated: new Date().toISOString(),
      status: 'not_configured',
      instructions: {
        title: 'LinkedIn Not Configured',
        message: 'Add your LinkedIn profile URL to enable integration',
        steps: [
          '1. Add your LinkedIn profile URL to user-data/config.js',
          '2. Set LINKEDIN.PROFILE_URL to your public LinkedIn URL',
          '3. Refresh the page to see your LinkedIn profile reference'
        ]
      }
    };
  }

  /**
   * Generate LinkedIn profile button HTML
   */
  generateLinkedInButton() {
    const profileUrl = config.LINKEDIN?.PROFILE_URL;
    
    if (!profileUrl) {
      return `
        <div class="linkedin-status not-configured">
          <i class="fab fa-linkedin"></i>
          <span>LinkedIn Not Configured</span>
          <small>Add your profile URL to config.js</small>
        </div>
      `;
    }

    return `
      <a href="${profileUrl}" target="_blank" class="linkedin-profile-link">
        <i class="fab fa-linkedin"></i>
        <span>View LinkedIn Profile</span>
      </a>
    `;
  }

  /**
   * Update portfolio data with LinkedIn reference
   * This doesn't auto-populate but provides guidance for manual updates
   */
  async updatePortfolioWithLinkedIn() {
    try {
      const linkedInInfo = await this.getLinkedInProfile();
      
      // Add LinkedIn URL to contact information
      if (linkedInInfo.profileUrl) {
        this.addLinkedInToContacts(linkedInInfo.profileUrl);
      }

      // Show instructions for manual data update
      this.showUpdateInstructions(linkedInInfo);
      
      return linkedInInfo;
    } catch (error) {
      console.error('❌ Error updating portfolio with LinkedIn:', error);
      return null;
    }
  }

  /**
   * Add LinkedIn URL to contact links
   */
  addLinkedInToContacts(profileUrl) {
    try {
      // Check if LinkedIn link already exists
      const existingLink = document.querySelector('a[href*="linkedin.com"]');
      
      if (!existingLink) {
        // Find social links container
        const socialContainer = document.querySelector('.social-links, .contact-links, .social');
        
        if (socialContainer) {
          const linkedInLink = document.createElement('a');
          linkedInLink.href = profileUrl;
          linkedInLink.target = '_blank';
          linkedInLink.innerHTML = '<i class="fab fa-linkedin"></i>';
          linkedInLink.title = 'LinkedIn Profile';
          linkedInLink.className = 'social-link linkedin';
          
          socialContainer.appendChild(linkedInLink);
          console.log('✅ LinkedIn link added to social contacts');
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not add LinkedIn link to contacts:', error);
    }
  }

  /**
   * Show instructions for updating portfolio data
   */
  showUpdateInstructions(linkedInInfo) {
    if (config.DEBUG) {
      console.group('📋 LinkedIn Integration Instructions');
      console.log('Status:', linkedInInfo.status);
      console.log('Profile URL:', linkedInInfo.profileUrl);
      console.log('Instructions:');
      linkedInInfo.instructions.steps?.forEach((step, index) => {
        console.log(`  ${step}`);
      });
      console.groupEnd();
    }
  }
}

// Export the LinkedIn integration class
export default LinkedInIntegration;

// Helper function to initialize LinkedIn integration
export async function initializeLinkedInIntegration() {
  const linkedin = new LinkedInIntegration();
  
  try {
    const profileInfo = await linkedin.getLinkedInProfile();
    console.log('✅ LinkedIn integration initialized');
    
    // Add LinkedIn link to page if configured
    await linkedin.updatePortfolioWithLinkedIn();
    
    return profileInfo;
  } catch (error) {
    console.error('❌ LinkedIn integration initialization failed:', error);
    return null;
  }
}

// Console commands for testing
if (typeof window !== 'undefined') {
  window.LinkedInIntegration = LinkedInIntegration;
  window.testLinkedIn = async () => {
    const linkedin = new LinkedInIntegration();
    const result = await linkedin.getLinkedInProfile();
    console.log('LinkedIn Profile Info:', result);
    return result;
  };
}
