# Git & GitHub Setup Guide

This guide will help you set up Git and push your code to GitHub repository.

## Prerequisites

- Git installed on your system
- GitHub account and repository created
- Repository URL: `git@github.com:mvn-minhngo-hn/MeetAssist.git`

## Step 1: Initialize Git Repository

If this is your first time using Git in this project:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Make first commit
git commit -m "chore: initial commit - MeetAssist Chrome Extension"
```

## Step 2: Add Remote Repository

Add your GitHub repository as remote:

```bash
# Add remote (replace with your actual repo URL)
git remote add origin git@github.com:mvn-minhngo-hn/MeetAssist.git

# Or update if remote already exists
git remote set-url origin git@github.com:mvn-minhngo-hn/MeetAssist.git

# Verify remote
git remote -v
```

## Step 3: Create Initial Commit

```bash
# Stage all files
git add .

# Commit
git commit -m "chore: implement all 6 phases with linting and formatting"
```

## Step 4: Create and Checkout Main Branch

```bash
# Create main branch (if not exists)
git checkout -b main

# Or rename master to main
git branch -M main
```

## Step 5: Push to GitHub

```bash
# Push to GitHub
git push -u origin main

# Or push with upstream tracking
git push -u origin main --set-upstream
```

## Complete Setup Script

Here's a one-command script to set up everything:

```bash
#!/bin/bash

echo "🚀 Setting up MeetAssist repository..."

# Initialize Git if not already initialized
if [ ! -d ".git" ]; then
  git init
  echo "✅ Git initialized"
else
  echo "✓ Git already initialized"
fi

# Add remote
git remote add origin git@github.com:mvn-minhngo-hn/MeetAssist.git

# Verify remote
echo "📌 Remote configured:"
git remote -v

# Add all files
git add .

# Commit
git commit -m "chore: initial commit - MeetAssist Chrome Extension

- Phase 1: Foundation & Core Communication
- Phase 2: Context-Aware UI & Logic  
- Phase 3: AI Integration & Solution Suggestions
- Phase 4: Multi-Channel Notification & Backend
- Phase 5: Google Meet Optimized UI/UX Design
- Phase 6: Meeting History Management & Cloud Sync

- Linting & formatting configured (ESLint, Prettier, Husky)
- All components use cn() utility for conditional classes"

# Create and checkout main branch
git checkout -b main

echo "✅ Ready to push to GitHub!"
echo "📝 Repository: git@github.com:mvn-minhngo-hn/MeetAssist.git"
echo ""
echo "Next commands:"
echo "  git push -u origin main"
echo ""
echo "Or push to different branch:"
echo "  git push -u origin <branch-name>"
```

Save this script as `setup-git.sh` and run:
```bash
chmod +x setup-git.sh
./setup-git.sh
```

## Common Git Commands

### Check Status
```bash
git status
```

### View Staged Changes
```bash
git diff --cached
```

### View Unstaged Changes
```bash
git diff
```

### View Commit History
```bash
git log --oneline
```

### Create New Branch
```bash
git checkout -b feature/my-feature
```

### Switch Branch
```bash
git checkout main
```

### Pull Latest Changes
```bash
git pull origin main
```

### Undo Last Commit (soft)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (hard - be careful!)
```bash
git reset --hard HEAD~1
```

## Workflow for Development

### Feature Branch Workflow

```bash
# 1. Create feature branch
git checkout -b feature/add-settings

# 2. Make changes and commit
git add .
git commit -m "feat: add settings modal component"

# 3. Push feature branch
git push -u origin feature/add-settings

# 4. Create Pull Request on GitHub
```

### Main Branch Workflow

```bash
# 1. Make changes on main
git checkout main
git pull origin main

# 2. Make changes
git add .
git commit -m "fix: resolve caption parsing issue"

# 3. Push
git push origin main
```

## Best Practices

1. **Commit Messages**: Use conventional commits
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for code style changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

2. **Before Committing**:
   - Run lint: `npm run lint:fix`
   - Run format: `npm run format`
   - Run type-check: `npm run type-check`
   - Build: `npm run build`

3. **Branch Naming**:
   - Use kebab-case: `feature/add-login`
   - Use descriptive names
   - Keep branches short-lived

4. **Never Commit**:
   - `node_modules/`
   - `dist/` or `build/`
   - `.env` files
   - API keys or secrets
   - Compiled files

## Troubleshooting

### Remote Already Exists

If you see error: `remote origin already exists`:

```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin git@github.com:mvn-minhngo-hn/MeetAssist.git
```

### Authentication Issues

If you're prompted for username/password:
- Use GitHub Personal Access Token instead
- Create token at: https://github.com/settings/tokens
- Token should have `repo` and `workflow` scopes

### Push Rejected

If push is rejected:
```bash
# Pull first
git pull origin main --rebase

# Resolve conflicts
# Edit conflicted files
git add .
git commit -m "fix: resolve merge conflicts"

# Push again
git push origin main
```

## GitHub Actions (Optional)

Add CI/CD with GitHub Actions:

`.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run build
```

## Repository Structure on GitHub

```
MeetAssist/
├── .github/           # GitHub Actions and workflows
├── public/            # Extension manifest and assets
├── src/              # Source code
│   ├── background/   # Service worker
│   ├── content/      # Content scripts
│   ├── sidepanel/    # React UI
│   ├── lib/          # Utilities
│   ├── store/        # State management
│   └── components/   # UI components
├── functions/         # Firebase Cloud Functions
├── package.json       # Dependencies
├── vite.config.ts    # Vite configuration
└── README.md         # Documentation
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `git init` | Initialize repository |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Commit with message |
| `git status` | Check repository status |
| `git push origin main` | Push to GitHub |
| `git pull origin main` | Pull latest changes |
| `git checkout -b name` | Create new branch |
| `git remote add origin url` | Add remote repository |

## Next Steps

After completing this setup:

1. ✅ Repository initialized and configured
2. ✅ Remote added to GitHub
3. ✅ Initial commit created
4. ✅ Ready to push

Run `git push -u origin main` to push your code to GitHub!

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guide](https://docs.github.com/en/get-started/quickstart)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Husky Documentation](https://typicode.github.io/husky)

