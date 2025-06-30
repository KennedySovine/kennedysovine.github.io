# Art Portfolio Admin Panel

This admin panel allows you to upload artwork to your portfolio with GitHub integration.

## Setup Instructions

1. **Copy the configuration file:**
   ```
   cp config.example.js config.js
   ```

2. **Get a GitHub Personal Access Token:**
   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Give it a descriptive name like "Art Portfolio Admin"
   - Select the following scopes:
     - For public repositories: `public_repo`
     - For private repositories: `repo` (full control)
   - Copy the generated token

3. **Update config.js:**
   - Open `config.js` in a text editor
   - Replace `your_github_token_here` with your actual token
   - **Generate a secure password hash:**
     - Open the admin panel in your browser
     - Open browser console (F12)
     - Run: `generatePasswordHash('your_new_password')`
     - Copy the generated hash to `ADMIN_PASSWORD_HASH` in config.js
   - Update the username if needed

4. **Security Features:**
   - Passwords are hashed using SHA-256 (no plain text storage)
   - Rate limiting: 5 failed attempts = 5-minute lockout
   - Session timeout: 30 minutes of inactivity
   - Automatic logout and data clearing
   - `config.js` is excluded from git commits for security

## Usage

1. Open `admin/index.html` in your browser
2. Enter the admin password
3. Upload artwork with tags, categories, and project links
4. GitHub repositories will be automatically loaded for project linking

## Features

- **Secure Authentication:** SHA-256 hashed passwords with rate limiting
- **Session Management:** 30-minute timeout with activity tracking
- **Image Preview:** See uploaded images before submission
- **Tag Management:** Add/remove tags with a bubble interface
- **Category Selection:** Choose from predefined art categories
- **Date Formatting:** Smart date display (Month Year or Day Month Year)
- **Project Linking:** Link artwork to GitHub repositories or manual projects
- **GitHub Integration:** Automatically loads your repositories for easy linking

## File Structure

```
admin/
├── index.html          # Main admin interface
├── admin.js           # Admin functionality
├── admin.css          # Admin styling
├── config.example.js  # Configuration template
├── config.js          # Your actual config (not in git)
├── admin-projects.js  # Temporary projects storage
└── README.md          # This file
```

## Troubleshooting

- **"Configuration not loaded" error:** Make sure `config.js` exists and is properly formatted
- **GitHub API errors:** Check your token permissions and expiration
- **No repositories loaded:** Verify your token has the correct scopes
- **Login issues:** Use browser console to generate a new password hash
- **Account locked:** Wait 5 minutes after too many failed attempts
- **Session expired:** Normal security feature - just log in again

## Security Best Practices

- Never commit `config.js` to version control
- Use a strong, unique password for the admin panel
- Regularly rotate your GitHub token
- Monitor the browser console for any security warnings
- Log out when finished using the admin panel
