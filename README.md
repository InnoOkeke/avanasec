# Avana 🔒

**A robust, production-ready CLI tool for detecting secrets and credentials in your codebase**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

---

## 🎯 Overview

Avana prevents costly security breaches by detecting hardcoded secrets, API keys, and credentials before they reach your repository. With 80+ detection patterns and a focus on zero false positives, Avana is the security scanner you can trust.

### Why Avana?

- **80+ Detection Patterns**: Comprehensive coverage for all major services (AWS, OpenAI, Stripe, GitHub, and more)
- **Zero Configuration**: Works out of the box with sensible defaults
- **Fast Scanning**: Scans thousands of files in seconds
- **CI/CD Ready**: Exit codes and JSON output for pipeline integration
- **Production-Ready**: Robust error handling, edge case coverage, and extensive testing

---

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g avana

# Or use with npx (no installation required)
npx avana scan
```

### Basic Usage

```bash
# Scan current directory
npm run scan

# Scan with verbose output
npm run scan:verbose

# Scan specific path
avana scan --path ./my-project

# Install Git pre-commit hooks
avana install

# Remove Git hooks
avana uninstall
```

### Git Hook Integration

Avana can automatically scan your code before each commit to prevent secrets from being committed:

```bash
# Install pre-commit hook
avana install

# Now every commit will be scanned automatically
git add .
git commit -m "feat: add new feature"
# 🔒 Running Avana security scan...
# ✅ No security issues found in staged files
```

**What happens:**
- Before each commit, Avana scans only your staged files (fast!)
- Commits with critical or high severity issues are blocked
- You get clear error messages with file locations and fix suggestions
- Scans complete in under 2 seconds

**To bypass** (not recommended):
```bash
git commit --no-verify
```

### Example Output

```
🔍 Scanning project for security issues...
📁 Path: ./my-project

✅ Scan complete in 1234ms

🚨 SECURITY ISSUES FOUND

┌─────────────────────────────────────────┐
│ 🔴 Critical: 2                          │
│ 🟠 High:     1                          │
│ 🟡 Medium:   0                          │
│ 🟢 Low:      0                          │
└─────────────────────────────────────────┘

🔴 OpenAI API Key
   File: src/config.ts:12
   OpenAI API key detected
   ✅ Fix: Move to environment variable: OPENAI_API_KEY

📊 Security Score: 60/100
```

---

## ✨ Features

### Comprehensive Detection

Avana detects 80+ types of secrets across major services:

- **AI/ML APIs**: OpenAI, Anthropic, Hugging Face
- **Cloud Providers**: AWS, Azure, GCP
- **Payment Processors**: Stripe, PayPal, Square
- **Version Control**: GitHub, GitLab, Bitbucket
- **Communication**: Slack, Discord, Telegram, Twilio
- **Email Services**: SendGrid, Mailgun, Mailchimp
- **Databases**: PostgreSQL, MongoDB, Redis connection strings
- **Private Keys**: RSA, SSH, PGP, EC keys
- **And 60+ more patterns**

### Insecure Code Pattern Detection

Avana also detects insecure coding patterns that could lead to vulnerabilities:

- **Code Execution**: `eval()`, Function constructor
- **SQL Injection**: String concatenation in SQL queries
- **Command Injection**: Unsafe `exec()` usage
- **Weak Cryptography**: MD5, SHA1, insecure random
- **Path Traversal**: `../` patterns, unsafe file operations
- **XSS Vulnerabilities**: Unsafe `innerHTML` usage
- **Deserialization**: Unsafe YAML/pickle loading
- **Configuration Issues**: Hardcoded URLs, CORS wildcards
- **And 20+ more patterns**

### Smart Ignore

Automatically skips:
- `node_modules`, `.git`, `dist`, `build`
- Test files and directories
- `.env` files (meant for local secrets)
- Database files (`.sqlite`, `.db`)
- Lock files (`package-lock.json`)

### Security Score

- Starts at 100 (perfect)
- Critical: -20 points each
- High: -10 points each
- Medium: -5 points each
- Low: -2 points each

---

## 📖 Documentation

### Command Line Options

```bash
# Scan command
avana scan [options]

Options:
  --path <path>     Path to scan (default: current directory)
  --staged          Scan only Git staged files (for pre-commit hooks)
  --verbose, -v     Show detailed output
  --help, -h        Show help message

# Git hook commands
avana install       Install Git pre-commit hooks
avana uninstall     Remove Git pre-commit hooks
```

### Exit Codes

- `0`: No critical or high severity issues found
- `1`: Critical or high severity issues detected (blocks CI/CD and commits)

### Git Hook Behavior

When using `avana install`:
- **Blocks commits** with critical or high severity issues
- **Allows commits** with only medium or low severity issues (with warning)
- Scans only staged files for speed (< 2 seconds)
- Provides clear error messages with fix suggestions

### CI/CD Integration

#### GitHub Actions

```yaml
name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx avana scan
```

#### GitLab CI

```yaml
security_scan:
  stage: test
  script:
    - npx avana scan
  only:
    - merge_requests
    - main
```

---

## 🏗️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/avana.git
cd avana

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### Project Structure

```
avana/
├── src/
│   ├── types/              # TypeScript type definitions
│   ├── rules/              # Secret detection patterns
│   ├── scanners/           # File scanning logic
│   ├── commands/           # CLI commands
│   ├── index.ts            # Main engine
│   └── cli.ts              # CLI entry point
├── tests/                  # Test files
├── .kiro/                  # Kiro CLI configuration
│   ├── specs/              # Feature specifications
│   ├── steering/           # Development guidelines
│   └── DEVLOG.md           # Development log
├── README.md
├── LICENSE
└── package.json
```

---

## 🧪 Testing

Avana includes comprehensive testing:

- **Unit Tests**: Core functionality
- **Property-Based Tests**: Edge cases with fast-check
- **Integration Tests**: End-to-end workflows

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write tests
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Kiro CLI](https://kiro.dev) - AI-powered development assistant
- Inspired by security best practices from the developer community
- Pattern database curated from real-world security incidents

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/avana/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/avana/discussions)
- **Email**: inno.okeke@github.com

---

<div align="center">

**Prevent security breaches before they happen**

*Built with ❤️ for developers who care about security*

</div>
