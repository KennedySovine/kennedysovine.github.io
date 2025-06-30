# Portfolio Setup Guide

## Security Configuration

Your portfolio requires configuration files that contain sensitive information (like GitHub tokens). These files are excluded from git for security.

### Setup Steps:

1. **Copy the configuration templates:**
   ```bash
   # Copy user data config
   cp user-data/config.example.js user-data/config.js
   
   # Copy admin config (if using admin panel)
   cp admin/config.example.js admin/config.js
   ```

2. **Update user-data/config.js:**
   - Add your GitHub Personal Access Token (optional, for higher API limits)
   - Update LinkedIn profile URL to your actual profile
   - Configure any other settings as needed

3. **Update admin/config.js (if using admin panel):**
   - Add your GitHub Personal Access Token
   - Set your GitHub username
   - Generate and set a secure admin password hash

### Getting a GitHub Token:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo` (for public repos) or `repo` (for private repos)
4. Copy the token and paste it in your config.js files

### Important Security Notes:

- **NEVER commit config.js files to git**
- Keep your tokens secure and never share them
- The .gitignore file excludes these files automatically
- Always use config.example.js as a template for new setups

### For Production Deployment:

- Use environment variables or secure deployment secrets
- Never expose tokens in client-side code
- Consider using a backend service for sensitive operations
