# 🚀 Avana - Quick Setup Guide

**Fast setup instructions for developers and evaluators**

## ⚡ Quick Start (2 minutes)

### Prerequisites
- Node.js 18+ ([Download here](https://nodejs.org/))
- Git ([Download here](https://git-scm.com/))

### 1. Clone & Install
```bash
git clone https://github.com/innookeke/avana-cli.git
cd avana-cli
npm install
```

### 2. Build & Test
```bash
# Build the project
npm run build

# Run comprehensive test suite (300+ tests)
npm test

# Verify CLI works
npm run scan -- --help
```

### 3. Try It Out
```bash
# Scan the project itself
npm run scan

# Scan with verbose output
npm run scan -- --verbose

# Install as global CLI (optional)
npm install -g .
avana --help
```

---

## 🎯 Key Features to Explore

### 1. Security Pattern Detection (100+ patterns)
```bash
# Test with a sample file containing secrets
echo 'const apiKey = "sk-1234567890abcdef1234567890abcdef";' > test-secrets.js
npm run scan -- --path test-secrets.js --verbose
rm test-secrets.js
```

### 2. Performance & Robustness
```bash
# Run property-based tests (1,500+ test iterations)
npm run test:property

# Run performance tests
npm run test:integration
```

### 3. Git Hook Integration
```bash
# Install pre-commit hooks
node dist/cli.js install

# Test the hook (will scan staged files)
echo 'const secret = "sk-test123";' > temp.js
git add temp.js
git commit -m "test commit"  # Should be blocked
rm temp.js
```

### 4. Multiple Output Formats
```bash
# JSON output
npm run scan -- --json

# Markdown report (saved to scan-reports/)
npm run scan -- --output-md

# Check generated reports
ls scan-reports/
```

---

## 🔍 Key Files to Review

### Core Implementation
- `src/index.ts` - Main scanning engine
- `src/rules/secret-patterns.ts` - 100+ security patterns
- `src/utils/ignore-pattern-manager.ts` - Smart ignore system
- `src/commands/scan.ts` - CLI command implementation

### Testing (300+ tests)
- `tests/property/` - Property-based tests (15 properties × 100 iterations)
- `tests/unit/` - Unit tests for all components
- `tests/integration/` - End-to-end workflow tests

### Kiro Integration
- `.kiro/specs/avana-core/` - Complete feature specification
- `.kiro/steering/` - Development guidelines and context
- `.kiro/prompts/` - Custom development automation
- `DEVLOG.md` - Detailed development timeline

---

## 🚀 Advanced Testing

### Property-Based Testing
```bash
# Run specific property tests
npm test -- --grep "Binary File Exclusion"
npm test -- --grep "Large File Streaming"
npm test -- --grep "Parallel Scan Equivalence"
```

### Performance Benchmarks
```bash
# Test with different file sizes
npm run test:integration

# Memory usage testing
npm run scan -- --max-memory 100 --verbose
```

### Error Handling
```bash
# Test with invalid paths
npm run scan -- --path /nonexistent/path

# Test with permission errors (Unix/Mac)
chmod 000 temp-file 2>/dev/null || echo "Windows - permission test skipped"
npm run scan -- --path temp-file 2>/dev/null || echo "Expected error handled"
rm -f temp-file 2>/dev/null || del temp-file 2>nul
```

---

## 🛠️ Development Environment

### Project Structure
```
avana-cli/
├── .kiro/                  # Kiro CLI integration
│   ├── specs/              # Feature specifications
│   ├── steering/           # Development guidelines
│   └── prompts/            # Custom automation
├── src/                    # TypeScript source code
├── tests/                  # Comprehensive test suite
├── dist/                   # Compiled JavaScript
├── DEVLOG.md              # Development timeline
└── README.md              # User documentation
```

### Available Scripts
```bash
npm run build              # Compile TypeScript
npm test                   # Run all tests
npm run test:property      # Property-based tests only
npm run test:integration   # Integration tests only
npm run scan               # Run CLI locally
npm run scan:verbose       # Run with verbose output
```

---

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

**Test Failures**
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test tests/unit/secret-scanner.test.ts
```

**CLI Not Working**
```bash
# Verify build
npm run build
ls dist/cli.js

# Test directly
node dist/cli.js --help
```

**Permission Issues (Windows)**
```bash
# Some symbolic link tests may be skipped on Windows
# This is expected and doesn't affect core functionality
npm test 2>&1 | findstr "Skipping symbolic link"
```

---

## 📊 Expected Test Results

### Test Summary
- **Total Tests**: 300+
- **Property-Based Tests**: 15 properties × 100 iterations = 1,500 test cases
- **Unit Tests**: 200+ covering all components
- **Integration Tests**: End-to-end workflows
- **Coverage**: 95%+ (estimated)

### Performance Benchmarks
- **Small Projects** (<100 files): <1 second
- **Medium Projects** (1,000 files): <5 seconds
- **Large Projects** (10,000 files): <10 seconds
- **Memory Usage**: <200MB typical, 500MB limit

---

## 📞 Support

If you encounter any issues during evaluation:

1. **Check DEVLOG.md** for known issues and solutions
2. **Run diagnostics**: `node dist/cli.js troubleshoot`
3. **Review test output** for specific error details
4. **Contact**: inno.okeke@github.com

---

## 🎉 Success Indicators

You'll know Avana is working correctly when:

- ✅ All tests pass (300+ tests)
- ✅ CLI shows help and scans files
- ✅ Security patterns detect secrets in test files
- ✅ Git hooks install and block commits with secrets
- ✅ Multiple output formats work (console, JSON, Markdown)
- ✅ Performance is fast (<10 seconds for large projects)

---