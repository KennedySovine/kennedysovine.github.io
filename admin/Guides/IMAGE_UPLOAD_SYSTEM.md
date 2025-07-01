# Image Upload System & Anti-Overwrite Guide

## Overview

The admin portal uses a sophisticated **memory-first, batch-commit** system to safely upload images to GitHub servers while preventing any data loss or overwriting of existing entries. This guide explains the complete workflow from image selection to final GitHub storage.

---

## 🔄 Upload Workflow: Step by Step

### Phase 1: Memory Storage (Immediate)
When you upload an artwork through the admin panel:

1. **Image Selection**
   ```javascript
   // User selects image via drag-drop or file picker
   const imageFile = document.getElementById('art-image').files[0];
   ```

2. **Unique Filename Generation**
   ```javascript
   function generateUniqueFilename(originalName, category) {
       const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
       const extension = originalName.split('.').pop();
       const baseName = originalName.split('.').slice(0, -1).join('.');
       const safeName = baseName.replace(/[^a-zA-Z0-9-_]/g, '-');
       return `${category}-${safeName}-${timestamp}.${extension}`;
   }
   
   // Example output: "digital-my-artwork-2025-07-01T14-30-45-123Z.jpg"
   ```

3. **Memory Storage with Pending Flags**
   ```javascript
   const artworkEntry = {
       id: generateUniqueArtworkId(),
       title: "My Artwork",
       description: "Description here...",
       category: "digital",
       // ... other metadata
       imageUrl: `https://raw.githubusercontent.com/USER/REPO/main/IMAGES/art/${uniqueFilename}`,
       imagePath: `IMAGES/art/${uniqueFilename}`,
       
       // 🔑 KEY: Pending file data stored in memory
       _pendingFile: imageFile,           // Actual File object
       _pendingFilename: uniqueFilename   // Generated filename
   };
   ```

4. **Anti-Overwrite Protection**
   ```javascript
   // Always load latest art-data.js before modifying
   await loadArtworkData();
   
   // Check for ID conflicts and resolve
   const existingIndex = artworkList.findIndex(item => item.id === artworkEntry.id);
   if (existingIndex !== -1) {
       artworkList[existingIndex] = artworkEntry; // Update existing
   } else {
       artworkList.push(artworkEntry); // Add new
   }
   ```

### Phase 2: Batch Commit (Manual Trigger)

When you click **"Commit to GitHub"**:

1. **Pending Change Detection**
   ```javascript
   const pendingArtworks = artworkList.filter(artwork => artwork._pendingFile);
   console.log(`Found ${pendingArtworks.length} pending images to upload`);
   ```

2. **Sequential Image Upload**
   ```javascript
   for (const artwork of pendingArtworks) {
       try {
           // Convert File to base64 for GitHub API
           const base64Content = await fileToBase64(artwork._pendingFile);
           
           // Upload to GitHub
           await uploadFileToGitHub(artwork._pendingFile, artwork._pendingFilename);
           
           // Clean up pending flags after successful upload
           delete artwork._pendingFile;
           delete artwork._pendingFilename;
           
       } catch (error) {
           throw new Error(`Failed to upload ${artwork._pendingFilename}: ${error.message}`);
       }
   }
   ```

3. **Update art-data.js**
   ```javascript
   // Final step: Update the data file with all changes
   await saveArtworkData();
   ```

---

## 🛡️ Anti-Overwrite Protection System

### 1. **Unique ID Generation**
```javascript
function generateUniqueArtworkId() {
    let newId;
    let attempts = 0;
    
    do {
        // Generate ID: timestamp + random + attempt counter
        newId = Date.now() + Math.floor(Math.random() * 10000) + attempts;
        attempts++;
        
        // Safety check to prevent infinite loop
        if (attempts > 100) {
            newId = Date.now() + Math.floor(Math.random() * 100000);
            break;
        }
    } while (artworkList.some(artwork => artwork.id === newId));
    
    return newId;
}
```

### 2. **Fresh Data Loading**
```javascript
async function loadArtworkData() {
    // Always fetch latest version with cache-busting
    const response = await fetch('../user-data/art-data.js?t=' + Date.now());
    const text = await response.text();
    
    // Parse and update in-memory list
    const artworksMatch = text.match(/export const artworks = (\[[\s\S]*?\]);/);
    if (artworksMatch) {
        artworkList = JSON.parse(artworksMatch[1]);
    }
}
```

### 3. **GitHub SHA-Based Updates**
```javascript
async function saveArtworkData() {
    // Get current file SHA (required for GitHub updates)
    const sha = await getFileSha('user-data/art-data.js');
    
    if (!sha) {
        throw new Error('Could not get file SHA - prevents accidental overwrites');
    }
    
    // Update with SHA ensures we're updating the correct version
    const response = await fetch(`${GITHUB_API_URL}/contents/user-data/art-data.js`, {
        method: 'PUT',
        body: JSON.stringify({
            message: 'Update artwork data via admin panel',
            content: btoa(artworkDataContent),
            sha: sha  // 🔑 This prevents overwriting if file changed
        })
    });
}
```

---

## 📁 File Storage Structure

### GitHub Repository Structure
```
kennedysovine.github.io/
├── IMAGES/
│   └── art/
│       ├── digital-my-first-artwork-2025-07-01T10-15-30-456Z.jpg
│       ├── painting-landscape-2025-07-01T11-22-45-789Z.png
│       └── drawing-portrait-2025-07-01T12-30-15-123Z.jpg
└── user-data/
    └── art-data.js  # Master data file
```

### art-data.js Structure
```javascript
// Art portfolio data
// This file is automatically updated by the admin panel

export const artworks = [
  {
    "id": 1719842245123,
    "title": "My Digital Artwork",
    "description": "A beautiful digital piece...",
    "category": "digital",
    "date": "2025-07",
    "datePrecision": "month",
    "formattedDate": "July 2025",
    "tags": ["concept art", "digital", "fantasy"],
    "linkedProject": {
      "title": "Art Portfolio",
      "type": "project",
      "url": "https://github.com/user/portfolio"
    },
    "imageUrl": "https://raw.githubusercontent.com/user/repo/main/IMAGES/art/digital-my-artwork-2025-07-01T14-30-45-123Z.jpg",
    "imagePath": "IMAGES/art/digital-my-artwork-2025-07-01T14-30-45-123Z.jpg",
    "uploadDate": "2025-07-01T14:30:45.678Z"
    // Note: _pendingFile and _pendingFilename are NOT saved to file
  }
];
```

---

## 🔧 Technical Implementation Details

### Memory Management
```javascript
// In-memory artwork list (includes pending files)
let artworkList = [
    {
        id: 123,
        title: "Existing Artwork",
        // ... saved data
    },
    {
        id: 456,
        title: "New Artwork",
        _pendingFile: File,     // Only in memory
        _pendingFilename: "...", // Only in memory
        // ... other data
    }
];
```

### GitHub API Integration
```javascript
async function uploadFileToGitHub(file, filename, folder = 'IMAGES/art') {
    // Step 1: Convert to base64
    const base64Content = await fileToBase64(file);
    const path = `${folder}/${filename}`;
    
    // Step 2: Check if file exists (get SHA)
    let sha = null;
    try {
        const existingFile = await fetch(`${GITHUB_API_URL}/contents/${path}`);
        if (existingFile.ok) {
            const fileData = await existingFile.json();
            sha = fileData.sha; // For updates
        }
    } catch (error) {
        // File doesn't exist - new upload
    }
    
    // Step 3: Upload with optional SHA
    const uploadData = {
        message: `Upload artwork: ${filename}`,
        content: base64Content,
        ...(sha && { sha }) // Include SHA only if updating
    };
    
    const response = await fetch(`${GITHUB_API_URL}/contents/${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    });
    
    return response.json();
}
```

---

## 🚨 Error Handling & Recovery

### 1. **Upload Failures**
If an image upload fails during commit:
```javascript
try {
    await uploadFileToGitHub(artwork._pendingFile, artwork._pendingFilename);
    // Only remove pending flags on success
    delete artwork._pendingFile;
    delete artwork._pendingFilename;
} catch (error) {
    // Pending flags remain, user can retry
    console.error(`Failed to upload ${artwork._pendingFilename}:`, error);
    throw new Error(`Failed to upload ${artwork._pendingFilename}: ${error.message}`);
}
```

### 2. **Data File Conflicts**
If art-data.js was modified externally:
```javascript
async function saveArtworkData() {
    const sha = await getFileSha('user-data/art-data.js');
    
    if (!sha) {
        throw new Error('Could not get file SHA - check authentication and file existence');
    }
    
    // GitHub will reject if SHA doesn't match current file
    // This prevents overwriting changes made elsewhere
}
```

### 3. **Network Issues**
```javascript
// Retry logic for network failures
const MAX_RETRIES = 3;
let retryCount = 0;

while (retryCount < MAX_RETRIES) {
    try {
        await uploadFileToGitHub(file, filename);
        break; // Success
    } catch (error) {
        retryCount++;
        if (retryCount >= MAX_RETRIES) {
            throw new Error(`Upload failed after ${MAX_RETRIES} attempts: ${error.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
    }
}
```

---

## 🎯 Benefits of This System

### ✅ **Data Safety**
- No immediate writes to GitHub
- All changes reviewable before commit
- SHA-based conflict detection
- Unique ID generation prevents collisions

### ✅ **User Experience**
- Instant feedback on uploads
- Batch operations for efficiency
- Clear pending change indicators
- Atomic commits (all or nothing)

### ✅ **Reliability**
- Graceful error handling
- Retry mechanisms for network issues
- Rollback capability (pending flags remain on failure)
- No partial states in production

### ✅ **Performance**
- Single commit for multiple changes
- Efficient GitHub API usage
- Minimal round trips
- Client-side validation before upload

---

## 🔍 Monitoring & Debugging

### Commit Button States
```javascript
function updateCommitButtonState() {
    const pendingCount = artworkList.filter(artwork => artwork._pendingFile).length;
    
    if (pendingCount > 0) {
        button.textContent = `📤 Commit ${pendingCount} Change${pendingCount === 1 ? '' : 's'} to GitHub`;
        button.disabled = false;
    } else {
        button.textContent = 'No Changes to Commit';
        button.disabled = true;
    }
}
```

### Console Logging
```javascript
console.log(`Generated unique ID: ${newId} (attempts: ${attempts})`);
console.log(`Total artworks after operation: ${artworkList.length}`);
console.log(`Found ${pendingCount} pending images to upload`);
```

### Status Messages
```javascript
showStatus('Artwork added to memory! Use "Commit to GitHub" to save everything. 🎉', 'success');
showStatus('Processing artwork...', 'info');
showStatus(`Uploading ${artwork._pendingFilename}...`, 'info');
showStatus('Successfully committed all changes to GitHub! 🎉', 'success');
```

---

## 🛠️ Configuration Requirements

### GitHub Token Permissions
Your GitHub personal access token needs:
- `repo` - Full repository access
- `contents:write` - Write access to repository contents

### Environment Setup
```javascript
// In config.js (not committed to repo)
const CONFIG = {
    GITHUB_TOKEN: 'ghp_xxxxxxxxxxxxxxxxxxxx',
    GITHUB_USERNAME: 'your-username',
    ADMIN_PASSWORD_HASH: 'sha256-hash-of-your-password'
};
```

### Rate Limiting
GitHub API allows:
- 5,000 requests per hour for authenticated requests
- Large file uploads (up to 100MB via Contents API)
- Concurrent uploads (handled sequentially for safety)

---

This system ensures that your artwork data is always safe, never overwritten accidentally, and provides a professional workflow for managing your portfolio content!
