#!/bin/bash

echo "=========================================="
echo "English Master Pro - GitHub Push Helper"
echo "=========================================="
echo ""

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo "✓ GitHub CLI detected"
    echo ""
    echo "Authenticating with GitHub CLI..."
    gh auth login
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "Setting up remote..."
        git remote add origin https://github.com/MichaelAriasFerreras/english-master-pro.git 2>/dev/null || git remote set-url origin https://github.com/MichaelAriasFerreras/english-master-pro.git
        
        echo "Pushing to GitHub..."
        git push -u origin main
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ SUCCESS! Your code is now on GitHub"
            echo "🔗 Repository: https://github.com/MichaelAriasFerreras/english-master-pro"
        fi
    fi
else
    echo "GitHub CLI not found. Please use one of these methods:"
    echo ""
    echo "Method 1 - Install GitHub CLI:"
    echo "  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg"
    echo "  echo \"deb [arch=\$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main\" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null"
    echo "  sudo apt update && sudo apt install gh -y"
    echo "  Then run this script again"
    echo ""
    echo "Method 2 - Use Personal Access Token:"
    echo "  1. Go to: https://github.com/settings/tokens/new"
    echo "  2. Create token with 'repo' scope"
    echo "  3. Run: git remote add origin https://YOUR_TOKEN@github.com/MichaelAriasFerreras/english-master-pro.git"
    echo "  4. Run: git push -u origin main"
fi
