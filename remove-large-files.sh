#!/bin/bash

# Create a backup branch
git branch backup-main

# Remove the large file from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch public/videos/Sample2.mp4" \
  --prune-empty --tag-name-filter cat -- --all

# Force garbage collection
git for-each-ref --format="delete %(refname)" refs/original/ | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Push changes to remote
git push origin --force --all
