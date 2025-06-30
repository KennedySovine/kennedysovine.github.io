# GitHub Integration: Understanding API-Driven Development

**Learning How Your Portfolio Connects to GitHub**

This guide explains how your portfolio integrates with GitHub's API to store images and data, teaching you modern API integration patterns and cloud storage concepts.

## 🌐 Why GitHub as a Backend?

Your portfolio uses GitHub as a **Backend-as-a-Service (BaaS)**, providing:

### **Storage Benefits:**
- **Free hosting** for images and data
- **Global CDN** for fast image loading worldwide
- **Version control** for all your content
- **99.9% uptime** with enterprise-grade reliability
- **Unlimited bandwidth** for public repositories

### **Developer Benefits:**
- **No server maintenance** required
- **Automatic backups** through Git history
- **Easy migration** - just clone the repository
- **Transparent costs** - completely free for public repos

### **How It Works:**
```
Your Admin Panel → GitHub API → GitHub Repository → Your Website
     ↓               ↓              ↓               ↓
Upload Image → Store in /IMAGES/ → Update art-data.js → Display in Gallery
```

## 🔐 Authentication System

### Personal Access Tokens

GitHub uses **Personal Access Tokens (PAT)** for API authentication:

```javascript
// Token stored in config.js (never committed to git)
export const config = {
  github: {
    token: 'ghp_your_personal_access_token_here',
    owner: 'your-username',
    repo: 'your-repository-name'
  }
};
```

**Token Permissions Required:**
- `repo` - Full repository access
- `public_repo` - Public repository access (for public repos)

### Token Security Best Practices

**✅ Do:**
- Store tokens in `config.js` (excluded from git)
- Use minimal required permissions
- Regenerate tokens periodically
- Keep tokens secret and secure

**❌ Don't:**
- Commit tokens to version control
- Share tokens in screenshots or logs
- Use tokens with excessive permissions
- Hardcode tokens in your code

### Authentication in API Calls

```javascript
// Every GitHub API request includes authentication
const response = await fetch('https://api.github.com/repos/owner/repo/contents/file.js', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${config.github.token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github+json'
  },
  body: JSON.stringify(requestData)
});
```

## 📡 GitHub API Deep Dive

### API Structure and Endpoints

**Base URL:** `https://api.github.com`

**Key Endpoints You Use:**
```javascript
// Repository contents
GET    /repos/{owner}/{repo}/contents/{path}
PUT    /repos/{owner}/{repo}/contents/{path}
DELETE /repos/{owner}/{repo}/contents/{path}

// Repository information
GET    /repos/{owner}/{repo}

// User repositories
GET    /user/repos
```

### Content API for File Operations

**Reading Files:**
```javascript
async function readFileFromGitHub(path) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Content is base64 encoded
    const content = atob(data.content);
    return { content, sha: data.sha };
    
  } catch (error) {
    console.error('Failed to read file:', error);
    throw error;
  }
}
```

**Writing Files:**
```javascript
async function writeFileToGitHub(path, content, message = 'Update file') {
  try {
    // Get current file SHA if it exists
    let sha = null;
    try {
      const existing = await readFileFromGitHub(path);
      sha = existing.sha;
    } catch (error) {
      // File doesn't exist, that's okay
    }

    // Encode content as base64
    const encodedContent = btoa(content);

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          content: encodedContent,
          sha: sha, // Required for updates, omit for new files
          branch: 'main'
        })
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Failed to write file:', error);
    throw error;
  }
}
```

### Image Upload Process

Your admin panel uploads images through this process:

```javascript
async function uploadArtworkImage(file, artworkData) {
  try {
    // 1. Convert image to base64
    const base64Image = await fileToBase64(file);
    
    // 2. Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = file.name.split('.').pop();
    const filename = `${artworkData.title.replace(/\s+/g, '-')}-${timestamp}.${extension}`;
    
    // 3. Upload image to GitHub
    const imageResult = await writeFileToGitHub(
      `IMAGES/${filename}`,
      base64Image,
      `Upload artwork: ${artworkData.title}`
    );
    
    // 4. Update artwork data with image URL
    artworkData.imageUrl = imageResult.content.download_url;
    artworkData.filename = filename;
    
    // 5. Update art database
    await updateArtDatabase(artworkData);
    
    return { success: true, artwork: artworkData };
    
  } catch (error) {
    console.error('Image upload failed:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove data URL prefix (data:image/jpeg;base64,)
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

## 📊 Data Management Strategy

### JSON as a Database

Your portfolio uses a JavaScript file as a simple database:

```javascript
// user-data/art-data.js
export const artworks = [
  {
    id: "artwork-2024-001",
    title: "Digital Landscape",
    description: "A beautiful digital painting of mountains",
    category: "Digital Art",
    medium: "Digital",
    imageUrl: "https://raw.githubusercontent.com/user/repo/main/IMAGES/digital-landscape.jpg",
    thumbnailUrl: "https://raw.githubusercontent.com/user/repo/main/IMAGES/thumbnails/digital-landscape.jpg",
    tags: ["landscape", "digital", "mountains"],
    createdDate: "2024-06-15",
    uploadDate: "2024-06-30T10:30:00Z",
    dimensions: "1920x1080",
    fileSize: "2.5MB",
    metadata: {
      software: "Photoshop",
      timeSpent: "4 hours",
      inspiration: "Mountain hike last weekend"
    }
  }
];
```

### Database Operations

**Adding New Artwork:**
```javascript
async function addArtwork(newArtwork) {
  try {
    // 1. Read current database
    const { content, sha } = await readFileFromGitHub('user-data/art-data.js');
    
    // 2. Parse existing artworks
    const artworkMatch = content.match(/export const artworks = (\[[\s\S]*?\]);/);
    const existingArtworks = JSON.parse(artworkMatch[1]);
    
    // 3. Add new artwork
    existingArtworks.push(newArtwork);
    
    // 4. Generate new file content
    const newContent = content.replace(
      /export const artworks = \[[\s\S]*?\];/,
      `export const artworks = ${JSON.stringify(existingArtworks, null, 2)};`
    );
    
    // 5. Write back to GitHub
    await writeFileToGitHub(
      'user-data/art-data.js',
      newContent,
      `Add artwork: ${newArtwork.title}`
    );
    
    return { success: true };
    
  } catch (error) {
    console.error('Failed to add artwork:', error);
    return { success: false, error: error.message };
  }
}
```

**Updating Existing Artwork:**
```javascript
async function updateArtwork(artworkId, updates) {
  try {
    const { content, sha } = await readFileFromGitHub('user-data/art-data.js');
    const artworkMatch = content.match(/export const artworks = (\[[\s\S]*?\]);/);
    const artworks = JSON.parse(artworkMatch[1]);
    
    // Find and update artwork
    const index = artworks.findIndex(artwork => artwork.id === artworkId);
    if (index === -1) {
      throw new Error('Artwork not found');
    }
    
    artworks[index] = { ...artworks[index], ...updates };
    
    const newContent = content.replace(
      /export const artworks = \[[\s\S]*?\];/,
      `export const artworks = ${JSON.stringify(artworks, null, 2)};`
    );
    
    await writeFileToGitHub(
      'user-data/art-data.js',
      newContent,
      `Update artwork: ${artworks[index].title}`
    );
    
    return { success: true };
    
  } catch (error) {
    console.error('Failed to update artwork:', error);
    return { success: false, error: error.message };
  }
}
```

## 🚀 Advanced GitHub API Features

### Repository Information

```javascript
async function getRepositoryInfo() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json'
        }
      }
    );

    const repo = await response.json();
    
    return {
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      size: repo.size, // in KB
      lastUpdated: repo.updated_at,
      language: repo.language,
      isPrivate: repo.private
    };
    
  } catch (error) {
    console.error('Failed to get repo info:', error);
    return null;
  }
}
```

### Listing Repository Contents

```javascript
async function listDirectoryContents(path = '') {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json'
        }
      }
    );

    const contents = await response.json();
    
    return contents.map(item => ({
      name: item.name,
      path: item.path,
      type: item.type, // 'file' or 'dir'
      size: item.size,
      downloadUrl: item.download_url
    }));
    
  } catch (error) {
    console.error('Failed to list directory:', error);
    return [];
  }
}

// Usage: List all images
const images = await listDirectoryContents('IMAGES');
const imageFiles = images.filter(item => 
  item.type === 'file' && 
  /\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)
);
```

### Commit History and Versioning

```javascript
async function getFileHistory(filePath) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json'
        }
      }
    );

    const commits = await response.json();
    
    return commits.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      date: commit.commit.author.date,
      author: commit.commit.author.name
    }));
    
  } catch (error) {
    console.error('Failed to get file history:', error);
    return [];
  }
}
```

## 🔄 Real-Time Updates and Webhooks

### Webhook Integration (Advanced)

For real-time updates when content changes:

```javascript
// Server-side webhook handler (if you add a backend later)
app.post('/webhook/github', (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  if (event === 'push') {
    // Repository was updated
    const modifiedFiles = payload.commits.flatMap(commit => 
      [...commit.added, ...commit.modified, ...commit.removed]
    );
    
    if (modifiedFiles.includes('user-data/art-data.js')) {
      // Artwork database was updated
      notifyClientsOfUpdate();
    }
  }

  res.status(200).send('OK');
});
```

### Client-Side Polling for Updates

```javascript
// Check for updates periodically
class UpdateChecker {
  constructor(checkInterval = 30000) { // 30 seconds
    this.checkInterval = checkInterval;
    this.lastKnownSha = null;
    this.isChecking = false;
  }

  async start() {
    this.lastKnownSha = await this.getCurrentSha();
    this.scheduleNextCheck();
  }

  async getCurrentSha() {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/user-data/art-data.js`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json'
          }
        }
      );

      const data = await response.json();
      return data.sha;
      
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return null;
    }
  }

  async checkForUpdates() {
    if (this.isChecking) return;
    
    this.isChecking = true;
    try {
      const currentSha = await this.getCurrentSha();
      
      if (currentSha && currentSha !== this.lastKnownSha) {
        // Content has changed!
        this.lastKnownSha = currentSha;
        await this.handleUpdate();
      }
      
    } catch (error) {
      console.error('Update check failed:', error);
    } finally {
      this.isChecking = false;
      this.scheduleNextCheck();
    }
  }

  async handleUpdate() {
    // Reload artwork data
    const newArtworks = await loadArtworksFromGitHub();
    updateGalleryDisplay(newArtworks);
    
    // Show notification
    showNotification('Gallery updated with new content!');
  }

  scheduleNextCheck() {
    setTimeout(() => this.checkForUpdates(), this.checkInterval);
  }
}

// Usage
const updateChecker = new UpdateChecker();
updateChecker.start();
```

## 🔧 Error Handling and Rate Limits

### Rate Limiting

GitHub API has rate limits:
- **Authenticated requests**: 5,000 per hour
- **Unauthenticated requests**: 60 per hour

```javascript
class GitHubAPIClient {
  constructor(token) {
    this.token = token;
    this.rateLimitRemaining = 5000;
    this.rateLimitReset = Date.now();
  }

  async makeRequest(url, options = {}) {
    // Check rate limit
    if (this.rateLimitRemaining <= 10 && Date.now() < this.rateLimitReset) {
      const waitTime = this.rateLimitReset - Date.now();
      console.warn(`Rate limit nearly exceeded. Waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github+json',
        ...options.headers
      }
    });

    // Update rate limit info
    this.rateLimitRemaining = parseInt(response.headers.get('x-ratelimit-remaining') || '5000');
    this.rateLimitReset = parseInt(response.headers.get('x-ratelimit-reset') || '0') * 1000;

    if (!response.ok) {
      throw new GitHubAPIError(response.status, await response.text());
    }

    return response;
  }
}

class GitHubAPIError extends Error {
  constructor(status, message) {
    super(`GitHub API Error ${status}: ${message}`);
    this.status = status;
  }
}
```

### Retry Logic with Exponential Backoff

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: wait 1s, 2s, 4s, 8s...
      const waitTime = Math.pow(2, attempt) * 1000;
      console.warn(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Usage
const result = await retryWithBackoff(async () => {
  return await uploadToGitHub(imageData, filename);
});
```

## 🌟 Best Practices

### API Request Optimization

**Batch Operations:**
```javascript
async function uploadMultipleArtworks(artworks) {
  // Use Promise.allSettled to handle partial failures
  const results = await Promise.allSettled(
    artworks.map(artwork => uploadArtwork(artwork))
  );

  const successes = results.filter(r => r.status === 'fulfilled');
  const failures = results.filter(r => r.status === 'rejected');

  return {
    successful: successes.length,
    failed: failures.length,
    errors: failures.map(f => f.reason)
  };
}
```

**Caching API Responses:**
```javascript
class CachedGitHubClient {
  constructor(token) {
    this.client = new GitHubAPIClient(token);
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async get(url) {
    const cached = this.cache.get(url);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const response = await this.client.makeRequest(url);
    const data = await response.json();

    this.cache.set(url, {
      data,
      timestamp: Date.now()
    });

    return data;
  }
}
```

### Security Considerations

**Sanitize File Names:**
```javascript
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9.-]/gi, '-') // Replace invalid characters
    .replace(/-+/g, '-')           // Remove duplicate dashes
    .replace(/^-|-$/g, '')         // Remove leading/trailing dashes
    .toLowerCase();
}
```

**Validate File Types:**
```javascript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only images are allowed.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Maximum size is 10MB.');
  }

  return true;
}
```

Your GitHub integration provides a robust, scalable backend for your portfolio while teaching you real-world API integration patterns that apply to any web service.
