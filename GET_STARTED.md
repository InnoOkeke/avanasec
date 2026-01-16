# Getting Started with Avana Development

## Quick Start

You now have a complete Avana workspace ready for development! Here's how to get started:

### 1. Navigate to the Avana Directory

```bash
cd avana
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

### 4. Test It Out

```bash
# Scan current directory
npm run scan

# Scan with verbose output
npm run scan:verbose

# Or scan a specific path
node dist/cli.js scan --path ../
```

### 5. Install Git Hooks (Recommended)

Prevent secrets from being committed:

```bash
# Install pre-commit hook
node dist/cli.js install

# Now every commit will be automatically scanned!
git add .
git commit -m "feat: add new feature"
# 🔒 Running Avana security scan...
# ✅ No security issues found in staged files
```

To remove the hooks later:
```bash
node dist/cli.js uninstall
```

## What You Have

### ✅ Complete Project Structure
- Source code copied and refactored from Security Guardian
- All references renamed from `@kiro-studio/security-*` to `avana`
- 80+ secret detection patterns ready to use
- TypeScript configuration with strict mode
- Package.json with proper metadata

### ✅ Documentation
- **README.md**: User-facing documentation
- **DEVLOG.md**: Development timeline and decisions
- **requirements.md**: 12 EARS-compliant requirements with 60+ acceptance criteria
- **SETUP_COMPLETE.md**: Detailed setup summary
- **GET_STARTED.md**: This file!

### ✅ Configuration
- TypeScript strict mode enabled
- Git ignore patterns configured
- npm scripts for build, test, lint
- MIT License included

## Next Steps

### Option A: Continue with Kiro CLI (Recommended)

Kiro CLI can help you create the design and tasks documents:

```bash
# 1. Make sure you're in the avana directory
cd avana

# 2. Use Kiro to create the design document
# In Kiro CLI, say:
"Create the design document for avana-core spec based on the requirements"

# 3. Use Kiro to create the tasks document
# In Kiro CLI, say:
"Create the tasks document for avana-core spec based on the design"

# 4. Execute tasks one by one
# In Kiro CLI, say:
"Execute task 1 from avana-core spec"
```

### Option B: Manual Development

If you prefer to work without Kiro CLI:

1. **Create design.md**:
   - Architecture overview
   - Component interfaces
   - Correctness properties
   - Testing strategy

2. **Create tasks.md**:
   - Break down design into implementation tasks
   - Add testing tasks
   - Include checkpoints

3. **Implement features**:
   - Start with robustness improvements
   - Add comprehensive tests
   - Update documentation

## Development Workflow

### Daily Workflow

```bash
# 1. Make changes in src/
vim src/scanners/secret-scanner.ts

# 2. Build
npm run build

# 3. Test
npm test

# 4. Run locally
npm run scan

# 5. Update DEVLOG
vim .kiro/DEVLOG.md
```

### Before Committing

```bash
# 1. Run linter
npm run lint

# 2. Run tests
npm test

# 3. Check coverage
npm run test:coverage

# 4. Build
npm run build
```

## Key Files to Know

### Source Code
- `src/index.ts` - Main Avana engine class
- `src/cli.ts` - CLI entry point
- `src/commands/scan.ts` - Scan command implementation
- `src/scanners/secret-scanner.ts` - File scanning logic
- `src/rules/secret-patterns.ts` - 50+ secret patterns
- `src/rules/additional-patterns.ts` - 30+ additional patterns
- `src/types/index.ts` - TypeScript type definitions

### Documentation
- `README.md` - User documentation
- `.kiro/DEVLOG.md` - Development log
- `.kiro/specs/avana-core/requirements.md` - Requirements spec
- `.kiro/steering/project-context.md` - Project context

### Configuration
- `package.json` - Package metadata and scripts
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git ignore patterns

## Testing

### Once Tests Are Added

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure (To Be Created)

```
tests/
├── unit/
│   ├── scanners/
│   │   └── secret-scanner.test.ts
│   ├── rules/
│   │   └── secret-patterns.test.ts
│   └── commands/
│       └── scan.test.ts
├── property/
│   ├── scan-determinism.property.test.ts
│   ├── score-consistency.property.test.ts
│   └── pattern-validation.property.test.ts
└── integration/
    ├── cli-scan.test.ts
    └── ci-cd-integration.test.ts
```

## Publishing to npm

### When Ready

```bash
# 1. Ensure all tests pass
npm test

# 2. Build
npm run build

# 3. Update version
npm version patch  # or minor, or major

# 4. Login to npm
npm login

# 5. Publish
npm publish

# 6. Create GitHub release
git tag v1.0.0
git push origin v1.0.0
```

## Moving to GitHub

### Create New Repository

```bash
# 1. Create repository on GitHub (e.g., yourusername/avana)

# 2. Initialize git
git init
git add .
git commit -m "feat: initial commit - avana secret scanner"

# 3. Add remote
git remote add origin https://github.com/yourusername/avana.git

# 4. Push
git branch -M main
git push -u origin main
```

### Update package.json

After creating the GitHub repository, update these fields in `package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/avana.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/avana/issues"
  },
  "homepage": "https://github.com/yourusername/avana#readme"
}
```

## Features to Implement

Based on the requirements, here are the key features to implement:

### High Priority
1. **Binary file detection** - Skip non-text files
2. **Large file streaming** - Handle files > 10MB
3. **Error handling** - Graceful failures with clear messages
4. **Progress reporting** - Show scan progress
5. **JSON output** - Machine-readable format for CI/CD

### Medium Priority
6. **File encoding detection** - Handle UTF-16, Latin-1, etc.
7. **.avanaignore support** - Custom ignore patterns
8. **Verbose logging** - Detailed debug information
9. **Exit codes** - Proper codes for CI/CD integration
10. **Memory management** - Limit memory usage

### Lower Priority
11. **Parallel scanning** - Use worker threads
12. **Result caching** - Cache unchanged files
13. **Pattern validation** - Test all patterns
14. **Security score breakdown** - Show score details

## Getting Help

### Resources
- [Kiro CLI Documentation](https://kiro.dev/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

### Common Issues

**Build fails**:
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

**Tests fail**:
```bash
# Check test files exist
ls tests/

# Run with verbose output
npm test -- --reporter=verbose
```

**CLI doesn't work**:
```bash
# Ensure it's built
npm run build

# Check the file exists
ls dist/cli.js

# Run with node
node dist/cli.js --help
```

## Success Criteria

You'll know Avana is ready for publication when:

- ✅ All tests pass with 80%+ coverage
- ✅ Documentation is complete and accurate
- ✅ Examples work correctly
- ✅ CI/CD pipeline is green
- ✅ No critical bugs or issues
- ✅ Performance meets requirements (10k files in <10s)
- ✅ README is clear and helpful
- ✅ CHANGELOG is up to date

---

**Ready to build something amazing? Let's get started!** 🚀

Run `npm install` and `npm run build` to begin!
