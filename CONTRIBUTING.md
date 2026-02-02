# Contribution Guide

## Code Quality Tools

MeetAssist uses ESLint, Prettier, and Husky to maintain code quality and consistency.

## Setup Instructions

### 1. Install Dependencies (Already Done ✅)

Dependencies have been installed:

**Frontend:**
- ESLint
- Prettier
- Prettier plugin for organizing imports
- Husky
- lint-staged

**Backend (Functions):**
- ESLint
- Prettier
- TypeScript ESLint plugin

### 2. Manual Husky Setup (Required)

Due to sandbox restrictions, run these commands in your terminal:

```bash
# Initialize git hooks (run once)
git init
npx husky install
```

If you see permission errors, try:
```bash
# Using git directly
git init
npx husky install --no-verify
```

### 3. Linting Commands

Available scripts:

```bash
# Run ESLint
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format all files
npm run format

# Check if files are formatted
npm run format:check

# Type check (no emit)
npm run type-check
```

### 4. Pre-commit Hook

After Husky is installed, every commit will automatically:

1. Run ESLint with auto-fix
2. Run Prettier to format files

The `.husky/pre-commit` file has been created with:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

## Code Style Guide

### Prettier Configuration

- **Semi-colons**: Disabled (use ASI)
- **Quotes**: Single quotes `'` instead of double
- **Indentation**: 2 spaces
- **Line width**: 100 characters
- **Trailing commas**: ES5 (trailing comma only allowed in objects/arrays)
- **Arrow parens**: Always `foo => (bar)`
- **Line endings**: LF (Unix)

### ESLint Rules

#### TypeScript
- Warn on unused variables (unless prefixed with `_`)
- Warn on `any` types (allow with explicit reason)
- Strict TypeScript checking enabled

#### React
- React in JSX scope detection is disabled (we use functional components)
- Prop-types not required (we use TypeScript)

### Common Patterns

#### ✅ DO: Use `cn()` for conditional classes

```typescript
import { cn } from '@/lib/utils';

// Good
<div className={cn(
  'base-class',
  condition && 'conditional-class'
)}>

// Avoid
<div className={`base-class ${condition ? 'conditional-class' : ''}`}>
```

#### ✅ DO: Use early returns

```typescript
if (!data) {
  return;
}
// Process data here
```

#### ✅ DO: Destructure props

```typescript
interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function Component({ value, onChange }: Props) {
  // Use value and onChange directly
}
```

#### ✅ DO: Use explicit function return types

```typescript
const handleAction = (id: string): void => {
  // Function body
}
```

#### ❌ DON'T: Use template literals for className

```typescript
// Bad
<div className={`flex ${active ? 'text-primary' : 'text-muted'}`}>

// Good
<div className={cn('flex', active ? 'text-primary' : 'text-muted')}>
```

#### ❌ DON'T: Forget to handle errors in async functions

```typescript
try {
  await someAsyncOperation();
} catch (error) {
  console.error('[Component] Error:', error);
  // Handle or show error to user
}
```

### File Organization

#### Import Order (via prettier-plugin-organize-imports)

```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Button } from '@/components/ui/button';
import { useExtensionStore } from '@/store/useExtensionStore';

// 3. Local imports
import type { User } from '@/types';
import { cn } from '@/lib/utils';
```

## Troubleshooting

### Husky Permission Issues

If you encounter permission errors when running `npx husky install`:

1. **Option 1**: Run outside of VS Code/Cursor
   ```bash
   cd /Users/minh.ngo/Documents/MeetAssist
   npx husky install
   ```

2. **Option 2**: Initialize git first
   ```bash
   git init
   npx husky install
   ```

3. **Option 3**: Skip Husky for now (lint manually)
   ```bash
   npm run lint:fix
   npm run format
   git add .
   git commit -m "your message"
   ```

### Prettier Conflicts

If Prettier conflicts with VS Code settings:

1. Disable VS Code Prettier extension (we have CLI version)
2. Set VS Code setting:
   ```json
   {
     "editor.defaultFormatter": "esbenp.prettier-vscode"
   }
   ```
3. Or let Prettier CLI handle it (recommended)

## Testing Your Changes

Before committing:

```bash
# 1. Type check
npm run type-check

# 2. Lint
npm run lint

# 3. Format
npm run format

# 4. Build
npm run build
```

If all pass, commit your changes!

## Pull Request Checklist

Before opening a PR, ensure:

- [ ] Code follows the style guide
- [ ] All tests pass (if tests exist)
- [ ] ESLint shows no errors
- [ ] Prettier formatted files
- [ ] Build succeeds
- [ ] Self-review completed

