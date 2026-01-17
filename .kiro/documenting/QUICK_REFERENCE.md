# Avana Quick Reference Card

## Installation

```bash
npm install -g avana
```

## Commands

| Command | Description |
|---------|-------------|
| `avana scan` | Scan current directory |
| `avana scan --path <dir>` | Scan specific directory |
| `avana scan --verbose` | Scan with detailed output |
| `avana scan --staged` | Scan only Git staged files |
| `avana install` | Install Git pre-commit hooks |
| `avana uninstall` | Remove Git pre-commit hooks |
| `avana --help` | Show help message |

## Git Hook Workflow

```bash
# One-time setup
avana install

# Daily usage - just commit normally
git add .
git commit -m "feat: add feature"
# Automatically scanned!

# If blocked
# Fix issues and try again

# To bypass (not recommended)
git commit --no-verify

# To remove hooks
avana uninstall
```

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | No critical/high issues |
| `1` | Critical/high issues found (blocks commit) |

## Severity Levels

| Icon | Level | Points | Blocks Commit? |
|------|-------|--------|----------------|
| 🔴 | Critical | -20 | ✅ Yes |
| 🟠 | High | -10 | ✅ Yes |
| 🟡 | Medium | -5 | ❌ No (warning) |
| 🟢 | Low | -2 | ❌ No (warning) |

## Security Score

- Starts at 100 (perfect)
- Deducts points based on severity
- Score = 100 - (critical×20 + high×10 + medium×5 + low×2)
- Minimum score: 0

## What Gets Detected

### Secrets (80+ patterns)
- API keys (OpenAI, AWS, Stripe, etc.)
- Tokens (GitHub, Slack, Discord, etc.)
- Passwords and credentials
- Private keys (RSA, SSH, PGP)
- Database connection strings

### Insecure Code (20+ patterns)
- Code execution (`eval()`, Function constructor)
- SQL injection (string concatenation)
- Command injection (`exec()` with user input)
- Weak crypto (MD5, SHA1, Math.random)
- Path traversal (`../` patterns)
- XSS vulnerabilities (`innerHTML`)
- Hardcoded URLs and secrets

## Common Use Cases

### Scan Before Commit
```bash
avana scan
```

### Scan Specific Directory
```bash
avana scan --path ./src
```

### Scan with Details
```bash
avana scan --verbose
```

### Install Git Hooks
```bash
avana install
```

### Test Staged Files
```bash
git add .
avana scan --staged
```

## Troubleshooting

### Hook not running?
```bash
# Check if hook exists
ls .husky/pre-commit

# Make executable (Unix/Mac)
chmod +x .husky/pre-commit
```

### Hook running but not blocking?
```bash
# Test exit code
avana scan --staged
echo $?  # Should be 1 if issues found
```

### No staged files detected?
```bash
# Verify files are staged
git diff --cached --name-only
```

## Files Created

```
.husky/
  └── pre-commit    # Git hook that runs avana scan --staged
```

## Bypass Hook

```bash
# Not recommended!
git commit --no-verify -m "message"
```

## Get Help

- GitHub: https://github.com/yourusername/avana
- Issues: https://github.com/yourusername/avana/issues
- Docs: See README.md

---

**Quick Start**: `avana install` → commit with confidence! 🔒
