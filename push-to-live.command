#!/bin/bash
# Double-click this file in Finder to push the website to GitHub Pages.
# Or run it from Terminal:  bash push-to-live.command

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

echo ""
echo "Pushing website changes to GitHub..."
echo ""

# Load SSH key into agent (macOS Keychain)
ssh-add --apple-use-keychain ~/.ssh/id_ed25519 2>/dev/null

git pull origin main --no-edit
git add .
git commit -m "Update site - $(date '+%a %m/%d/%Y %T')"
git push origin main

echo ""
echo "Done! Your site will be live at https://www.faisalqayyum.com in ~60 seconds."
echo ""
read -p "Press Enter to close..."
