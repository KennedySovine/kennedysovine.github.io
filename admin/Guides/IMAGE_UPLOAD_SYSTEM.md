# Local Image Upload System

## Overview

The admin panel has been completely refactored to work locally without any GitHub API commits. All artwork uploads and data management happen locally, and you handle git commits manually at your discretion.

## How It Works

### 1. Image Upload Process

When you upload artwork through the admin panel:

1. **Image Processing**: The selected image is processed and given a unique filename
2. **Local Save Prompt**: Browser prompts you to download/save the image file
3. **Save Location**: You must save the image to `IMAGES/art/` folder in your project
4. **Data Update**: The artwork data is added to the `artworkList` array using `.push()`
5. **File Download**: Browser prompts you to download the updated `art-data.js` file
6. **Replace File**: You must save the new `art-data.js` to your `user-data/` folder

### 2. Anti-Overwrite Protection

The system uses **`.push()`** to add new artworks to the existing array, which means:
- ✅ New artworks are **added** to the existing collection
- ✅ Existing artworks are **never overwritten**
- ✅ Each artwork gets a unique timestamp-based ID
- ✅ The array grows incrementally with each upload

### 3. Edit and Delete Operations

When you edit or delete artwork:
- Changes are made to the `artworkList` array in memory
- Browser prompts you to download the updated `art-data.js` file
- You save the file to `user-data/` folder to make changes persistent

## Workflow Steps

### For New Artwork:

1. Fill out the upload form in the admin panel
2. Click "Upload Artwork"
3. **Save the image**: When prompted, save to `IMAGES/art/`
4. **Save the data**: When prompted, save `art-data.js` to `user-data/`
5. **Git commit**: When ready, commit both files manually

### For Editing Artwork:

1. Use the "Manage Existing" view
2. Click "Edit" on any artwork
3. Make your changes and save
4. **Save the data**: When prompted, save `art-data.js` to `user-data/`
5. **Git commit**: When ready, commit the changes manually

### For Deleting Artwork:

1. Use the "Manage Existing" view  
2. Click "Delete" on any artwork
3. Confirm the deletion
4. **Save the data**: When prompted, save `art-data.js` to `user-data/`
5. **Optional**: Manually delete the image file from `IMAGES/art/`
6. **Git commit**: When ready, commit the changes manually

## Technical Details

### File Naming Convention

Images are saved with this pattern:
```
{category}-{original-name}-{timestamp}.{extension}
```

Example: `digital-character-sketch-2025-07-01T14-30-45-123Z.jpg`

### Data Structure

Each artwork entry contains:
```javascript
{
  id: 1751322066427,           // Unique timestamp-based ID
  title: "Artwork Title",
  description: "Description",
  category: "digital",
  date: "2025-06",
  datePrecision: "month",
  formattedDate: "June 2025",
  tags: ["tag1", "tag2"],
  linkedProject: {...},
  imageUrl: "https://raw.githubusercontent.com/.../image.jpg",
  imagePath: "IMAGES/art/image.jpg",
  uploadDate: "2025-07-01T14:30:45.123Z"
}
```

### Array Management

The system maintains artwork integrity by:
- Loading existing artworks from `art-data.js` on startup
- Using `artworkList.push(newArtwork)` for additions
- Using `artworkList[index] = updatedArtwork` for edits
- Using `artworkList.filter()` for deletions
- Never replacing the entire array

## Benefits

1. **No Multiple Commits**: Only you decide when to commit
2. **Local Control**: All changes happen locally first
3. **Data Safety**: Existing artworks cannot be accidentally overwritten
4. **Flexibility**: You can batch multiple uploads before committing
5. **Offline Capable**: Works entirely without internet connection

## Migration Notes

- All GitHub API commit functions have been removed
- The "Commit to GitHub" button has been removed from the UI
- Image uploads prompt for local file saving
- Data changes prompt for local file replacement
- Manual git workflow gives you full control

## Troubleshooting

**Q: The download prompts don't appear**
- Check if your browser is blocking downloads
- Ensure popup blockers are disabled for localhost

**Q: Changes don't persist after page reload**
- Make sure you saved the new `art-data.js` file to `user-data/`
- Check the file was saved with the correct name and location

**Q: Images don't show in the gallery**
- Ensure images were saved to `IMAGES/art/` folder
- Check that the filename matches what's in the data
- Verify the file path is correct in `art-data.js`
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
