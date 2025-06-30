# 🎨 Art Portfolio Admin Panel

**Production-Ready Upload System for Your Portfolio**

This secure admin panel allows you to upload artwork to your GitHub portfolio with full metadata management, drag & drop interface, and automatic organization.

## ✅ Current Status: PRODUCTION READY

All test functions removed, full upload system operational, comprehensive error handling implemented.

## 🚀 Quick Start

1. **Navigate to admin panel:** Open `admin/index.html` in your browser
2. **Login:** Use password `@rtPortfolio` (already configured)
3. **Upload artwork:** Drag & drop images or click to select
4. **Done!** Your artwork is automatically uploaded to GitHub and organized

## 🔧 Setup Instructions

### 1. GitHub Token Configuration
- Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
- Click "Generate new token (classic)"
- Give it a descriptive name like "Art Portfolio Admin"
- Select scope: `repo` (full repository access)
- Copy the generated token and update `config.js`

### 2. Security Configuration
Your admin panel is already configured with:
- ✅ **Password:** `@rtPortfolio` (SHA-256 hashed)
- ✅ **GitHub Token:** Updated in `config.js`
- ✅ **Rate Limiting:** 5 attempts, 5-minute lockout
- ✅ **Session Timeout:** 30 minutes auto-logout

## Usage

1. Open `admin/index.html` in your browser
2. Enter the admin password
3. Upload artwork with tags, categories, and project links
4. GitHub repositories will be automatically loaded for project linking

## 🎯 Features

### 🔐 Security & Authentication
- **Secure Login:** SHA-256 password hashing with rate limiting
- **Session Management:** 30-minute timeout with activity tracking
- **Automatic Logout:** Security-first approach

### 🖼️ Upload System
- **Drag & Drop Interface:** Modern, intuitive file upload
- **Image Preview:** Real-time preview before submission
- **Progress Tracking:** Visual progress bar with detailed status
- **Error Handling:** Comprehensive error recovery

### 🏷️ Content Management
- **Tag System:** Dynamic tag creation with visual bubbles
- **Categories:** Predefined art categories (Digital, Traditional, 3D, Photography, etc.)
- **Project Linking:** Connect artwork to GitHub repositories or create custom projects
- **Flexible Dating:** Support for both full dates and month/year entries

### 🔗 GitHub Integration
- **Automatic Upload:** Images go directly to your GitHub repository
- **Repository Search:** Search and link to your existing GitHub projects
- **Metadata Management:** All artwork data stored in `user-data/art-data.js`
- **File Organization:** Automatic organization by category in `IMAGES/` directory

## 📁 File Structure

```
admin/
├── index.html                 # Main admin interface (production-ready)
├── admin.js                   # Core functionality (no test code)
├── admin.css                  # Complete styling with drag & drop
├── config.js                  # Secure configuration (your GitHub token)
├── config.example.js          # Configuration template
├── admin-projects.js          # Project management utilities
├── README.md                  # This documentation
├── PRODUCTION_READINESS.md    # Production status checklist
└── Guides/
    ├── SYSTEM_OVERVIEW.md     # Technical documentation
    └── DRAG_DROP_GUIDE.md     # Drag & drop implementation guide
```

## 🔧 Usage Instructions

### Basic Upload Process
1. **Login:** Navigate to `/admin/` and enter password `@rtPortfolio`
2. **Select Image:** Drag & drop or click to browse files
3. **Add Details:** Fill in title, description, tags, category
4. **Link Project (Optional):** Search for GitHub repos or create new project
5. **Set Date:** Choose full date or month/year precision
6. **Upload:** Click "Upload Artwork" - progress bar shows status
7. **Done!** Image uploaded to GitHub, metadata saved automatically

### Advanced Features
- **Tag Management:** Press Enter or comma to add tags, click × to remove
- **Project Search:** Type to search GitHub repositories or existing projects
- **Date Flexibility:** Choose between full date precision or month/year only
- **Category Organization:** Files automatically organized by category
- **Error Recovery:** Detailed error messages with recovery suggestions

## ⚠️ Troubleshooting

### Common Issues
- **"ReferenceError: initializeProjectSearch"** ✅ **FIXED** - All functions now properly defined
- **"Configuration not loaded":** Verify `config.js` exists and contains valid GitHub token
- **"403 Forbidden":** GitHub token may lack proper permissions - needs `repo` scope
- **"401 Unauthorized":** GitHub token may be expired - generate new token
- **Account locked:** Wait 5 minutes after failed login attempts
- **Session expired:** Normal security feature - just log in again

### GitHub API Issues
- **No repositories loaded:** Check token permissions and network connection
- **Upload fails:** Verify repository exists and token has write access
- **Rate limiting:** GitHub API limits apply - wait a few minutes if rate limited

### Browser Issues
- **JavaScript errors:** Ensure JavaScript is enabled in browser
- **File upload fails:** Check file size (GitHub has 100MB limit for single files)
- **Preview not working:** Ensure browser supports modern JavaScript features

## 🛡️ Security Best Practices

- ✅ **Password Security:** Uses SHA-256 hashing (no plain text storage)
- ✅ **Token Safety:** GitHub token stored securely in config.js (excluded from git)
- ✅ **Session Management:** Automatic timeout prevents unauthorized access
- ✅ **Rate Limiting:** Prevents brute force attacks
- ✅ **Error Handling:** No sensitive data exposed in error messages

### Maintenance
- **Rotate GitHub tokens** every 6-12 months
- **Monitor console** for any security warnings during use
- **Keep backups** of your art-data.js file
- **Update documentation** when making changes to the system

---

## 📚 Additional Documentation

- **[SYSTEM_OVERVIEW.md](Guides/SYSTEM_OVERVIEW.md)** - Complete technical documentation
- **[DRAG_DROP_GUIDE.md](Guides/DRAG_DROP_GUIDE.md)** - Drag & drop implementation details
- **[PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)** - Production status and checklist

**Last Updated:** December 2024  
**Status:** ✅ PRODUCTION READY - All test code removed, fully functional upload system
