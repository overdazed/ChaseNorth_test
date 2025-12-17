#!/bin/bash
cd N:/Programming/Website/E-Commerce-2/adventure/  # your project path

git add .
git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')" || echo "Nothing to commit"
git push origin main # replace 'main' with your branch
