# Data Management: Portfolio Data Architecture

**Learning Data Organization and Configuration**

This guide teaches you how your portfolio organizes and manages data, from static configuration files to dynamic content loading. You'll understand the data flow, file structure, and best practices used in this project.

## 📊 Understanding Your Portfolio's Data Architecture

### Data Flow Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Static Data   │───▶│  JavaScript      │───▶│   User Interface│
│   (JSON/JS)     │    │  Processing      │    │   (HTML/CSS)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ user-data/      │    │ - Data Loading   │    │ - Dynamic Cards │
│ ├── config.js   │    │ - Processing     │    │ - Profile Info  │
│ ├── data.js     │    │ - Validation     │    │ - Project Lists │
│ ├── urls.js     │    │ - Formatting     │    │ - External Links│
│ └── art-data.js │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Types in Your Portfolio

1. **Configuration Data** (`user-data/config.js`) - API settings, cache duration
2. **Profile Data** (`user-data/data.js`) - Bio, experience, skills, projects
3. **External Links** (`user-data/urls.js`) - Social media, external profiles
4. **Art Portfolio Data** (`user-data/art-data.js`) - Artwork, gallery items

## 🏗️ Configuration Management

### Configuration System (`user-data/config.js`)

```javascript
// Your portfolio's configuration structure
export const config = {
  // GitHub integration (optional)
  GITHUB_TOKEN: '', // Personal access token for higher rate limits
  
  // Cache settings
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes in milliseconds
  
  // Debug mode for development
  DEBUG: false,
  
  // API endpoints
  API_ENDPOINTS: {
    github: 'https://api.github.com',
    linkedin: 'https://api.linkedin.com/v2',
  },
  
  // LinkedIn integration
  LINKEDIN: {
    PROFILE_URL: 'https://www.linkedin.com/in/kennedy-sovine-975090199',
    CLIENT_ID: '', // For LinkedIn API integration
    CLIENT_SECRET: '', // Keep secure!
    REDIRECT_URI: '', // OAuth redirect
    AUTO_FETCH: true, // Enable automatic data fetching
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  },
};
```

### Configuration Best Practices

```javascript
// Environment-specific configurations
const isDevelopment = window.location.hostname === 'localhost';

export const config = {
  DEBUG: isDevelopment,
  
  // Different settings for dev vs production
  CACHE_DURATION: isDevelopment ? 1000 : 10 * 60 * 1000,
  
  // Feature flags
  FEATURES: {
    githubIntegration: true,
    linkedinIntegration: true,
    artGallery: true
  }
};
```

## 📝 Profile Data Structure (`user-data/data.js`)

### Personal Information

```javascript
// Bio information (array of paragraphs)
export const bio = [
  "University student pursuing BSc in Computer Science for Games...",
  "Passionate about backend systems and plugin development...",
  "Always eager to learn new technologies and tackle challenging problems."
];

// Skills organized by category
export const skills = [
  {
    title: "Programming Languages",
    details: ["Java", "Kotlin", "Python", "JavaScript", "C#", "SQL"]
  },
  {
    title: "Frameworks & Tools",
    details: ["Unity", "Spring Boot", "React", "Node.js", "Git", "Docker"]
  },
  {
    title: "Databases",
    details: ["MySQL", "PostgreSQL", "MongoDB", "Redis"]
  }
];
```

### Experience Data

```javascript
export const experience = [
  {
    title: "IridiumMC",
    duration: "February 2025 - Present",
    location: "Remote",
    subtitle: "Developer",
    details: [
      "Working on Minecraft server as a developer",
      "Head developer for the Prisons server",
      "Implementing custom plugins and game mechanics"
    ],
    tags: ["Java", "Kotlin", "Minecraft", "Plugin Development"],
    icon: "code" // Icon identifier for styling
  },
  {
    title: "Previous Experience",
    duration: "Date Range",
    location: "Location",
    subtitle: "Role",
    details: [
      "Description of responsibilities",
      "Key achievements",
      "Technologies used"
    ],
    tags: ["Skill1", "Skill2", "Skill3"],
    icon: "work"
  }
];
```

### Project Data Structure

```javascript
export const projects = [
  {
    title: "MMO Balance Demo",
    description: "Research project focusing on game balance algorithms",
    fullDescription: `
      <h3>Project Overview</h3>
      <p>Comprehensive research into multiplayer game balance...</p>
      <h3>Technical Implementation</h3>
      <p>Built using Unity and C# with custom balance algorithms...</p>
    `,
    tags: ["Unity", "C#", "Game Design", "Research"],
    sourceCodeUrl: "https://github.com/example/project",
    image: "./IMAGES/project-preview.png",
    youtubeUrl: "https://youtu.be/example",
    featured: true // Highlight important projects
  }
];
```

## 🔗 External Links Management (`user-data/urls.js`)

### Social Media and Profile Links

```javascript
// Organized external links
export const socialLinks = {
  linkedin: "https://www.linkedin.com/in/kennedy-sovine-975090199",
  github: "https://github.com/KennedySovine",
  email: "mailto:contact@example.com",
  portfolio: "https://kennedysovine.github.io"
};

export const professionalLinks = {
  resume: "./documents/resume.pdf",
  portfolio: "./documents/portfolio.pdf",
  certifications: "./documents/certifications/"
};

// External project links
export const projectLinks = {
  github: "https://github.com/KennedySovine",
  youtube: "https://youtube.com/@example",
  demo: "https://example-demo.com"
};
```

## 🎨 Art Portfolio Data (`user-data/art-data.js`)

### Gallery Organization

```javascript
// Art portfolio structure (if applicable)
export const artPortfolio = [
  {
    id: 1,
    title: "Digital Art Piece",
    description: "Description of the artwork",
    image: "./IMAGES/KARMA_KNIFE_CA_1.png",
    thumbnail: "./IMAGES/thumbs/KARMA_KNIFE_CA_1_thumb.png",
    category: "digital",
    tags: ["3D", "Modeling", "Texture"],
    date: "2024-01-15",
    featured: true
  },
  {
    id: 2,
    title: "Character Design",
    description: "Character concept art",
    image: "./IMAGES/KARMA_PT_CA_1.png",
    thumbnail: "./IMAGES/thumbs/KARMA_PT_CA_1_thumb.png",
    category: "concept",
    tags: ["Character", "Design", "Concept"],
    date: "2024-02-20",
    featured: false
  }
];

export const artCategories = [
  { id: "digital", name: "Digital Art", count: 5 },
  { id: "concept", name: "Concept Art", count: 3 },
  { id: "3d", name: "3D Models", count: 7 }
];
```

## 🔄 Data Loading and Processing

### Module Import System

```javascript
// Import data modules in your main JavaScript
import { config } from './user-data/config.js';
import { bio, skills, experience, projects } from './user-data/data.js';
import { socialLinks, projectLinks } from './user-data/urls.js';

// Use the imported data
function displayProfile() {
  // Display bio information
  bio.forEach(paragraph => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    document.getElementById('bio-container').appendChild(p);
  });
  
  // Display skills
  skills.forEach(skillGroup => {
    const skillSection = createSkillSection(skillGroup);
    document.getElementById('skills-container').appendChild(skillSection);
  });
}
```

### Data Processing Functions

```javascript
// Process and format data for display
function processProjectsData(projects) {
  return projects.map(project => ({
    ...project,
    // Add computed properties
    slug: project.title.toLowerCase().replace(/\s+/g, '-'),
    hasSource: !!project.sourceCodeUrl,
    hasDemo: !!project.youtubeUrl,
    tagCount: project.tags.length,
    // Format description for display
    shortDescription: project.description.length > 100 
      ? project.description.substring(0, 100) + '...'
      : project.description
  }));
}

// Filter and sort data
function getFeaturedProjects(projects) {
  return projects
    .filter(project => project.featured)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getProjectsByTag(projects, tag) {
  return projects.filter(project => 
    project.tags.includes(tag)
  );
}
```
## ✅ Data Validation

### Input Validation Functions

```javascript
// Validate project data structure
function validateProjectData(projects) {
  const requiredFields = ['title', 'description', 'tags'];
  const errors = [];
  
  projects.forEach((project, index) => {
    // Check required fields
    requiredFields.forEach(field => {
      if (!project[field]) {
        errors.push(`Project ${index}: Missing required field '${field}'`);
      }
    });
    
    // Validate data types
    if (!Array.isArray(project.tags)) {
      errors.push(`Project ${index}: Tags must be an array`);
    }
    
    // Validate URLs if present
    if (project.sourceCodeUrl && !isValidUrl(project.sourceCodeUrl)) {
      errors.push(`Project ${index}: Invalid source code URL`);
    }
    
    if (project.youtubeUrl && !isValidUrl(project.youtubeUrl)) {
      errors.push(`Project ${index}: Invalid YouTube URL`);
    }
  });
  
  return errors;
}

// URL validation helper
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Configuration validation
function validateConfig(config) {
  const errors = [];
  
  // Check required configuration
  if (config.CACHE_DURATION && typeof config.CACHE_DURATION !== 'number') {
    errors.push('CACHE_DURATION must be a number');
  }
  
  // Validate LinkedIn settings
  if (config.LINKEDIN && config.LINKEDIN.PROFILE_URL) {
    if (!isValidUrl(config.LINKEDIN.PROFILE_URL)) {
      errors.push('LinkedIn profile URL is invalid');
    }
  }
  
  return errors;
}
```

## 💾 Simple Caching Implementation

### Basic Browser Storage

```javascript
// Simple localStorage cache for portfolio data
class PortfolioCache {
  constructor(prefix = 'portfolio_') {
    this.prefix = prefix;
  }
  
  // Store data with expiration
  set(key, data, ttl = 10 * 60 * 1000) { // 10 minutes default
    const item = {
      data: data,
      expires: Date.now() + ttl,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }
  }
  
  // Retrieve data if not expired
  get(key) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      
      if (Date.now() > parsed.expires) {
        this.remove(key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn('Cache retrieval failed:', error);
      return null;
    }
  }
  
  // Remove cached item
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn('Cache removal failed:', error);
    }
  }
  
  // Clear all portfolio cache
  clear() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  }
}

// Usage example
const cache = new PortfolioCache();

// Cache user data
cache.set('user_profile', { name: 'Kennedy', role: 'Developer' });

// Retrieve cached data
const profile = cache.get('user_profile');
if (profile) {
  console.log('Using cached profile:', profile);
} else {
  console.log('Profile not in cache or expired');
}
```
  // Local storage cache (persistent)
  setLocal(key, data, ttl = 3600000) { // 1 hour default
    const item = {
      data,
      expires: Date.now() + ttl
    };
    
    try {
      this.localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set localStorage cache:', error);
    }
  }
  
  getLocal(key) {
    try {
      const item = JSON.parse(this.localStorage.getItem(key));
      if (!item) return null;
      
      if (Date.now() > item.expires) {
        this.localStorage.removeItem(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.warn('Failed to get localStorage cache:', error);
      return null;
    }
  }
  
  // Session storage cache (tab-specific)
  setSession(key, data) {
    try {
      this.sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to set sessionStorage cache:', error);
    }
  }
  
  getSession(key) {
    try {
      const data = this.sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to get sessionStorage cache:', error);
      return null;
    }
  }
  
  // Smart cache getter (checks all levels)
  get(key) {
    // Check memory cache first (fastest)
    let data = this.getMemory(key);
    if (data) return data;
    
    // Check session cache
    data = this.getSession(key);
    if (data) {
      // Promote to memory cache
      this.setMemory(key, data);
      return data;
    }
    
    // Check local storage cache
    data = this.getLocal(key);
    if (data) {
      // Promote to memory and session cache
      this.setMemory(key, data);
      this.setSession(key, data);
      return data;
    }
    
    return null;
  }
  
  // Smart cache setter
  set(key, data, options = {}) {
    const { 
      memory = true, 
      session = true, 
      local = true,
      memoryTTL = 300000,
      localTTL = 3600000
    } = options;
    
    if (memory) this.setMemory(key, data, memoryTTL);
    if (session) this.setSession(key, data);
    if (local) this.setLocal(key, data, localTTL);
  }
  
  // Clear all caches
  clear() {
    this.memoryCache.clear();
    this.sessionStorage.clear();
    
    // Clear only our cache keys from localStorage
    const keysToRemove = [];
    for (let i = 0; i < this.localStorage.length; i++) {
      const key = this.localStorage.key(i);
      if (key.startsWith('portfolio-')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => this.localStorage.removeItem(key));
  }
}

// Global cache instance
const cache = new CacheManager();
```

## 🔄 State Management

### Application State

```javascript
// Simple state management for your portfolio
class PortfolioState {
  constructor() {
    this.state = {
      user: null,
      repositories: [],
      projects: [],
      loading: {
        repositories: false,
        profile: false,
        projects: false
      },
      errors: {
        repositories: null,
        profile: null,
        projects: null
      },
      ui: {
        currentProject: 0,
        sidebarOpen: false,
        modalOpen: false
      }
    };
    
    this.listeners = new Map();
  }
  
  // Subscribe to state changes
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key).add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(key).delete(callback);
    };
  }
  
  // Update state and notify listeners
  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // Notify listeners of changed keys
    Object.keys(updates).forEach(key => {
      if (this.listeners.has(key)) {
        this.listeners.get(key).forEach(callback => {
          callback(this.state[key], prevState[key]);
        });
      }
    });
  }
  
  // Get current state
  getState() {
    return { ...this.state };
  }
  
  // Set loading state
  setLoading(key, isLoading) {
    this.setState({
      loading: {
        ...this.state.loading,
        [key]: isLoading
      }
    });
  }
  
  // Set error state
  setError(key, error) {
    this.setState({
      errors: {
        ...this.state.errors,
        [key]: error
      }
    });
  }
  
  // Clear error
  clearError(key) {
    this.setError(key, null);
  }
}

// Global state instance
const portfolioState = new PortfolioState();

// Usage example
portfolioState.subscribe('repositories', (repos, prevRepos) => {
  if (repos.length !== prevRepos?.length) {
    console.log(`Repository count changed: ${repos.length}`);
    updateRepositoryDisplay(repos);
  }
});

portfolioState.subscribe('loading', (loading) => {
  Object.keys(loading).forEach(key => {
    if (loading[key]) {
      showLoadingSpinner(key);
    } else {
      hideLoadingSpinner(key);
    }
  });
});
```

## 🔄 Data Synchronization

### Real-time Updates

```javascript
// WebSocket connection for real-time updates
class RealtimeSync {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }
  
  connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.reconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.reconnect();
    }
  }
  
  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Reconnecting WebSocket (attempt ${this.reconnectAttempts})`);
        this.connect();
      }, delay);
    }
  }
  
  handleMessage(data) {
    switch (data.type) {
      case 'repository_updated':
        this.handleRepositoryUpdate(data.payload);
        break;
      case 'profile_updated':
        this.handleProfileUpdate(data.payload);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }
  
  handleRepositoryUpdate(repo) {
    // Update the repository in state
    const currentRepos = portfolioState.getState().repositories;
    const updatedRepos = currentRepos.map(r => 
      r.id === repo.id ? { ...r, ...repo } : r
    );
    
    portfolioState.setState({ repositories: updatedRepos });
    
    // Clear related cache
    cache.clear();
  }
  
  handleProfileUpdate(profile) {
    portfolioState.setState({ user: profile });
    cache.set('user-profile', profile);
  }
}
```

### Background Sync

```javascript
// Service Worker for background sync
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-repos') {
    event.waitUntil(syncRepositories());
  }
});

async function syncRepositories() {
  try {
    const repos = await fetchRepositories();
    
    // Store in IndexedDB for offline access
    await storeInIndexedDB('repositories', repos);
    
    // Notify main thread
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'repositories-synced',
          data: repos
        });
      });
    });
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Register background sync
if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
  navigator.serviceWorker.ready.then(registration => {
    registration.sync.register('background-sync-repos');
  });
}
```

## 📈 Performance Monitoring

### API Performance Tracking

```javascript
// Track API performance
class APIPerformanceTracker {
  constructor() {
    this.metrics = new Map();
  }
  
  startTimer(operation) {
    const startTime = performance.now();
    return {
      end: () => {
        const duration = performance.now() - startTime;
        this.recordMetric(operation, duration);
        return duration;
      }
    };
  }
  
  recordMetric(operation, duration) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    const metrics = this.metrics.get(operation);
    metrics.push({
      duration,
      timestamp: Date.now()
    });
    
    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
  }
  
  getMetrics(operation) {
    const metrics = this.metrics.get(operation) || [];
    
    if (metrics.length === 0) {
      return { average: 0, min: 0, max: 0, count: 0 };
    }
    
    const durations = metrics.map(m => m.duration);
    
    return {
      average: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      count: durations.length
    };
  }
  
  report() {
    const report = {};
    
    this.metrics.forEach((metrics, operation) => {
      report[operation] = this.getMetrics(operation);
    });
    
    return report;
  }
}

// Usage
const perfTracker = new APIPerformanceTracker();

async function fetchWithTracking(operation, fetchFunction) {
  const timer = perfTracker.startTimer(operation);
  
  try {
    const result = await fetchFunction();
    timer.end();
    return result;
  } catch (error) {
    timer.end();
    throw error;
  }
}

// Example usage
const repos = await fetchWithTracking('github-repos', () => 
  githubService.getRepositories('KennedySovine')
);
```

## 🎯 Best Practices Summary

### Data Management
1. **Structured Data**: Use consistent data structures
2. **Validation**: Validate data at boundaries
3. **Normalization**: Avoid data duplication
4. **Versioning**: Handle data format changes gracefully
5. **Backup**: Keep backups of critical data

### API Integration
1. **Error Handling**: Always handle API failures gracefully
2. **Rate Limiting**: Respect API rate limits
3. **Caching**: Implement multi-level caching
4. **Authentication**: Handle auth tokens securely
5. **Monitoring**: Track API performance and usage

### Performance
1. **Lazy Loading**: Load data only when needed
2. **Pagination**: Handle large datasets efficiently
3. **Debouncing**: Limit API calls for user interactions
4. **Background Sync**: Update data in the background
5. **Offline Support**: Provide offline functionality

This data management system ensures your portfolio is fast, reliable, and provides an excellent user experience even when external APIs are slow or unavailable!
