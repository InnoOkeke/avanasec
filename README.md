# avanasec 🔒

**A robust, production-ready CLI tool for detecting secrets and credentials in your codebase**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

---

## 🎯 Overview

avanasec prevents costly security breaches by detecting hardcoded secrets, API keys, and credentials before they reach your repository. With 100+ detection patterns, robust file handling, and comprehensive testing, avanasec is the security scanner you can trust.

### Why avanasec?

- **100+ Detection Patterns**: Comprehensive coverage for all major services (AWS, OpenAI, Stripe, GitHub, Web3, and more)
- **High Performance**: Scans 10,000+ files in under 10 seconds with parallel processing
- **Robust File Handling**: Binary detection, encoding support, large file streaming (>10MB)
- **Smart Ignore System**: Respects .gitignore, .avana-cliignore, and custom patterns
- **Multiple Output Formats**: Console, JSON, and Markdown reports
- **CI/CD Ready**: Standard exit codes and structured output for pipeline integration
- **Production-Ready**: Comprehensive error handling, memory management, and property-based testing

---

## 🚀 Quick Start

### Installation

```bash
# Install globally (recommended)
npm install -g avanasec

# Verify installation (after global install)
avanasec --help

# Or use with npx (no installation required)
npx avanasec scan
npx avanasec --help
```

### Troubleshooting Installation

If you encounter issues after installation:

```bash
# Run diagnostics (after global install)
avanasec troubleshoot

# Or use the alias (after global install)
avanasec doctor

# Or with npx (no installation required)
npx avanasec troubleshoot
npx avanasec doctor
```

**Common Issues:**

- **Command not found**: Ensure npm global bin directory is in your PATH
- **Permission errors**: Try using `sudo` on Unix systems or run as administrator on Windows
- **Module errors**: Run `npm install -g avana-cli` to reinstall dependencies

**Manual Installation Steps:**

1. Install the package: `npm install -g avanasec`
2. Verify installation: `avanasec --help` (after global install)
3. If command not found, check your PATH: `npm config get prefix`
4. Add npm global bin to PATH if needed

**Getting Help:**

- Documentation: [GitHub Repository](https://github.com/innookeke/avanasec#readme)
- Report Issues: [GitHub Issues](https://github.com/innookeke/avanasec/issues)
- Run diagnostics: `avanasec troubleshoot` (after global install) or `npx avanasec troubleshoot`

### Basic Usage

**With Global Installation:**
```bash
# Scan current directory
avanasec scan

# Scan with verbose output
avanasec scan --verbose

# Scan specific path
avanasec scan --path ./my-project

# Scan with custom ignore patterns
avanasec scan --ignore "**/*.md" --ignore "tests/**"

# Scan with memory and worker limits
avanasec scan --max-memory 1000 --workers 4

# Scan and fail on high severity issues (for CI/CD)
avanasec scan --fail-on-high

# Scan only Git staged files (for pre-commit hooks)
avanasec scan --staged

# Scan with debug information
avanasec scan --debug

# Install Git pre-commit hooks
avanasec install

# Remove Git hooks
avanasec uninstall

# Run diagnostics
avanasec troubleshoot

# Show help
avanasec --help
```

**With NPX (no installation required):**
```bash
# Scan current directory
npx avanasec scan

# Scan with verbose output
npx avanasec scan --verbose

# Scan specific path
npx avanasec scan --path ./my-project

# Scan with custom ignore patterns
npx avanasec scan --ignore "**/*.md" --ignore "tests/**"

# Scan with memory and worker limits
npx avanasec scan --max-memory 1000 --workers 4

# Scan and fail on high severity issues (for CI/CD)
npx avanasec scan --fail-on-high

# Scan only Git staged files
npx avanasec scan --staged

# Scan with debug information
npx avanasec scan --debug

# Install Git pre-commit hooks
npx avanasec install

# Remove Git hooks
npx avanasec uninstall

# Run diagnostics
npx avanasec troubleshoot

# Show help
npx avanasec --help
```

### Git Hook Integration

Avana can automatically scan your code before each commit to prevent secrets from being committed:

```bash
# Install pre-commit hook (after global install)
avanasec install

# Or with npx
npx avanasec install

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

avana-cli detects 100+ types of secrets across major services:

- **AI/ML APIs**: OpenAI, Anthropic, Hugging Face, Cohere
- **Cloud Providers**: AWS, Azure, GCP, DigitalOcean
- **Payment Processors**: Stripe, PayPal, Square, Adyen
- **Web3/Blockchain**: Ethereum, Bitcoin, Solana, Polygon, DeFi protocols
- **Version Control**: GitHub, GitLab, Bitbucket tokens
- **Communication**: Slack, Discord, Telegram, Twilio, WhatsApp
- **Email Services**: SendGrid, Mailgun, Mailchimp, Postmark
- **Databases**: PostgreSQL, MongoDB, Redis connection strings
- **Private Keys**: RSA, SSH, PGP, EC keys, JWT secrets
- **OAuth Providers**: Google, Microsoft, Apple, Facebook, Twitter
- **And 70+ more patterns**

### Insecure Code Pattern Detection

avana-cli also detects insecure coding patterns that could lead to vulnerabilities:

- **Code Execution**: `eval()`, Function constructor
- **SQL Injection**: String concatenation in SQL queries
- **Command Injection**: Unsafe `exec()` usage
- **Weak Cryptography**: MD5, SHA1, insecure random
- **Path Traversal**: `../` patterns, unsafe file operations
- **XSS Vulnerabilities**: Unsafe `innerHTML` usage
- **Deserialization**: Unsafe YAML/pickle loading
- **Configuration Issues**: Hardcoded URLs, CORS wildcards
- **And 20+ more patterns**

### Smart Ignore System

Automatically skips:
- **Dependencies**: `node_modules`, `vendor`, `bower_components`
- **Build outputs**: `dist`, `build`, `out`, `.next`, `target`
- **Version control**: `.git`, `.svn`, `.hg`
- **IDE files**: `.vscode`, `.idea`, `*.swp`
- **Test coverage**: `coverage`, `.nyc_output`
- **Lock files**: `package-lock.json`, `yarn.lock`, `Cargo.lock`
- **Binary files**: Images, executables, archives
- **Cache directories**: `.cache`, `tmp`, `temp`

### Custom Ignore Patterns

Create a `.avana-cliignore` file in your project root:

```gitignore
# Custom ignore patterns
docs/**
*.md
test-fixtures/**
legacy-code/**

# Comments are supported
# Glob patterns work: *, **, ?
**/*.backup
temp-*
```

### Performance Features

- **Parallel Processing**: Multi-threaded scanning with configurable worker count
- **Memory Management**: Automatic garbage collection and configurable memory limits
- **Large File Streaming**: Efficient handling of files >10MB with chunked processing
- **Result Caching**: 24-hour cache with file modification tracking
- **Binary Detection**: Smart binary file exclusion to avoid false positives
- **Progress Reporting**: Real-time progress with ETA calculation

### Security Score

- Starts at 100 (perfect)
- Critical: -20 points each
- High: -10 points each
- Medium: -5 points each
- Low: -2 points each

### 🔒 Security Protection

**Automatic .gitignore Protection**: When avanasec creates the `scan-reports/` directory, it automatically adds it to your `.gitignore` file to prevent accidentally committing security reports (which contain detected secrets) to version control.

**Manual Protection**: If you already have a `scan-reports/` directory, add this to your `.gitignore`:
```gitignore
# avanasec scan reports (contains detected secrets)
scan-reports/
```

---

## 📖 Documentation

### Command Line Options

```bash
# Usage Syntax
npx avanasec scan [options]      # Using npx
avanasec scan [options]          # After global installation

Options:
  --path <path>            Path to scan (default: current directory)
  --staged                 Scan only Git staged files (for pre-commit hooks)
  --verbose, -v            Show detailed output
  --debug                  Show debug information
  --quiet                  Show minimal output
  --no-progress            Disable progress bar
  --fail-on-high           Exit with code 1 on high severity issues
  --max-memory <mb>        Set memory limit in MB (default: 500)
  --workers <count>        Set number of worker threads (default: CPU count - 1)
  --ignore <pattern>       Ignore files matching pattern (can be used multiple times)
  --help, -h               Show help message

# Git hook commands
npx avanasec install             # Using npx
npx avanasec uninstall           # Using npx
npx avanasec troubleshoot        # Using npx
avanasec install                 # After global installation
avanasec uninstall               # After global installation
avanasec troubleshoot            # After global installation

# Examples with NPX (recommended)
npx avanasec scan
npx avanasec scan --path ./my-project
npx avanasec scan --staged
npx avanasec scan --verbose --debug
npx avanasec scan --fail-on-high
npx avanasec scan --max-memory 1000 --workers 4
npx avanasec scan --ignore "**/*.md" --ignore "tests/**"

# Examples with Global Installation
avanasec scan                  # after npm install -g avanasec
avanasec scan --verbose
avanasec install
```

### Exit Codes

Avana uses standard exit codes for CI/CD integration:

- **0**: No critical or high severity issues found (success)
- **1**: Critical or high severity issues detected (blocks CI/CD and commits)
- **2**: Invalid arguments or configuration error
- **3**: Unexpected error occurred (system error)

### Output Formats

#### Console Output (Default)
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

#### JSON Output (--json)
```json
{
  "success": false,
  "timestamp": "2024-01-17T10:30:00.000Z",
  "duration": 1234,
  "filesScanned": 150,
  "securityScore": 60,
  "issues": [
    {
      "id": "openai-api-key-001",
      "type": "OpenAI API Key",
      "severity": "critical",
      "message": "OpenAI API key detected",
      "file": "src/config.ts",
      "line": 12,
      "match": "sk-1234567890abcdef",
      "confidence": 0.95,
      "rule": {
        "id": "openai-api-key",
        "name": "OpenAI API Key"
      }
    }
  ],
  "summary": {
    "total": 3,
    "critical": 2,
    "high": 1,
    "medium": 0,
    "low": 0,
    "byType": {
      "OpenAI API Key": 2,
      "AWS Access Key": 1
    },
    "byFile": {
      "src/config.ts": 2,
      "src/aws.ts": 1
    }
  }
}
```

#### Markdown Output (--output-md)
Generates a detailed markdown report saved to `scan-reports/avana-cli-security-report-YYYY-MM-DD.md`

### Git Hook Behavior

When using `avanasec install`:
- **Blocks commits** with critical or high severity issues
- **Allows commits** with only medium or low severity issues (with warning)
- Scans only staged files for speed (< 2 seconds)
- Provides clear error messages with fix suggestions
- Uses `--fail-on-high` flag by default for stricter security

### Troubleshooting

#### Common Issues

**Memory Issues**
```bash
# Increase memory limit
npx avanasec scan --max-memory 1000

# Reduce worker count
npx avanasec scan --workers 2
```

**Performance Issues**
```bash
# Add ignore patterns for large directories
npx avanasec scan --ignore "node_modules/**" --ignore "dist/**"

# Use .avana-cliignore file for persistent patterns
echo "large-data/**" >> .avana-cliignore
```

**False Positives**
```bash
# Use ignore patterns for test files
npx avanasec scan --ignore "**/*.test.ts" --ignore "fixtures/**"
```

**Binary File Warnings**
```bash
# Enable debug mode to see file processing details
npx avanasec scan --debug

# Binary files are automatically skipped
```

#### Performance Characteristics

- **Small projects** (< 100 files): < 1 second
- **Medium projects** (100-1,000 files): 1-3 seconds  
- **Large projects** (1,000-10,000 files): 3-10 seconds
- **Very large projects** (> 10,000 files): 10+ seconds

Memory usage typically stays under 200MB for most projects, with a default limit of 500MB.

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
      - name: Run avanasec Security Scan
        run: npx avanasec scan
      - name: Upload scan results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: security-scan-results
          path: scan-reports/
```

#### GitLab CI

```yaml
security_scan:
  stage: test
  script:
    - npx avanasec scan --fail-on-high
  artifacts:
    when: always
    paths:
      - scan-reports/
    reports:
      junit: scan-reports/*.json
  only:
    - merge_requests
    - main
```

#### Jenkins Pipeline

```groovy
pipeline {
    agent any
    stages {
        stage('Security Scan') {
            steps {
                sh 'npx avanasec scan'
                archiveArtifacts artifacts: 'scan-reports/*', allowEmptyArchive: true
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'scan-reports',
                    reportFiles: '*.html',
                    reportName: 'Security Scan Report'
                ])
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
```

---

## 🏗️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/innookeke/avanasec.git
cd avanasec

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
avanasec/
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

avanasec includes comprehensive testing with property-based testing:

- **Unit Tests**: Core functionality and edge cases
- **Property-Based Tests**: 15 properties with 100+ iterations each using fast-check
- **Integration Tests**: End-to-end workflows and CLI integration
- **Performance Tests**: Memory usage and scan speed validation

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run property-based tests only
npm test -- --grep "property"

# Run integration tests only
npm test -- --grep "integration"

# Watch mode for development
npm run test:watch
```

#### Property-Based Testing

avanasec uses property-based testing to validate correctness across thousands of generated inputs:

- **Binary File Exclusion**: Ensures binary files are never scanned
- **Large File Streaming**: Validates chunked processing for files >10MB
- **Encoding Handling**: Tests UTF-8, UTF-16, Latin-1, and ASCII support
- **Memory Limit Enforcement**: Verifies memory usage stays within bounds
- **Parallel Scan Equivalence**: Ensures parallel and sequential scans produce identical results
- **Cache Correctness**: Validates cache hits/misses and expiration
- **Pattern Compilation**: Tests all 100+ regex patterns for correctness
- **And 8 more properties** covering error recovery, progress reporting, and output formatting

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

- **Issues**: [GitHub Issues](https://github.com/yourusername/avanasec/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/avanasec/discussions)
- **Email**: inno.okeke@github.com

---

<div align="center">

**Prevent security breaches before they happen**

*Built with ❤️ for developers who care about security*

</div>
