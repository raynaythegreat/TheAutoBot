#!/bin/bash

# PocketOption AI Signals Generator - GitHub Deployment Script
# This script helps you deploy to GitHub Pages

echo "🚀 PocketOption AI Signals Generator - GitHub Deployment"
echo "========================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Run 'git init' first."
    exit 1
fi

# Check if files are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected. Committing them now..."
    git add .
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 🌐 Go to GitHub.com and create a new repository:"
echo "   - Repository name: pocketoption-signals (or your choice)"
echo "   - Make it PUBLIC (required for free GitHub Pages)"
echo "   - Don't initialize with README (we already have files)"
echo ""
echo "2. 🔗 Connect your local repository to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/pocketoption-signals.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. 📄 Enable GitHub Pages:"
echo "   - Go to repository Settings"
echo "   - Scroll to 'Pages' section"
echo "   - Source: 'Deploy from a branch'"
echo "   - Branch: 'main' and '/ (root)'"
echo "   - Click Save"
echo ""
echo "4. 🎉 Your app will be live at:"
echo "   https://YOUR_USERNAME.github.io/pocketoption-signals"
echo ""
echo "📱 Test your deployed app:"
echo "   - Open URL in Safari on iPhone"
echo "   - Test camera functionality"
echo "   - Install as PWA (Share → Add to Home Screen)"
echo ""
echo "📖 For detailed instructions, see: GITHUB_DEPLOYMENT.md"
echo ""
echo "✅ Repository is ready for GitHub deployment!"
echo ""

# Show current git status
echo "📊 Current Git Status:"
echo "====================="
git status --short
echo ""
echo "📈 Recent Commits:"
echo "=================="
git log --oneline -5
echo ""
echo "🎯 Ready to push to GitHub!"
