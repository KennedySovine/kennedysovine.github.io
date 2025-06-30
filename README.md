# Portfolio Website

A modern, responsive portfolio website built with JavaScript and lit-html templating.

![Portfolio Preview](assets/preview.png)

## ⚠️ First Time Setup

**Important:** This repository excludes sensitive configuration files for security. Before running:

1. **Copy configuration templates:**
   ```bash
   cp user-data/config.example.js user-data/config.js
   cp admin/config.example.js admin/config.js  # (if using admin panel)
   ```

2. **Configure your tokens:**
   - Edit `user-data/config.js` with your GitHub token and LinkedIn info
   - Edit `admin/config.js` with admin credentials (if needed)
   - See `SETUP.md` for detailed instructions

3. **Never commit your config.js files** - they contain sensitive data

## Features

- 📱 Responsive Design
- 🚀 Dynamic Content Loading
- 📊 GitHub Repository Stats
- 📝 Medium Blog Integration
- 🏔️ Trekking Adventures Section
- 💼 Work Experience Timeline
- 🎓 Education History
- 🔗 Social Media Integration

## Tech Stack

- JavaScript (ES6+)
- lit-html for templating
- CSS3 with Flexbox/Grid
- GitHub API Integration
- Medium RSS Feed Integration

## Installation

```bash
# Clone the repository
git clone https://github.com/vinaysomawat/vinaysomawat.github.io.git

# Navigate to project directory
cd vinaysomawat.github.io

# Open with live server or similar
python -m http.server 8000
```

**If you enjoy this project, please consider [supporting me](https://www.paypal.me/vinaysomawat) to continue developing and maintaining it.**

[![Support via PayPal](https://cdn.rawgit.com/twolfson/paypal-github-button/1.0.0/dist/button.svg)](https://www.paypal.me/vinaysomawat)
