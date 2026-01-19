# Testing Git Hook Integration

## Quick Test Guide

Follow these steps to test the Git hook integration:

### 1. Build avanasec

```bash
cd avanasec
npm install
npm run build
```

### 2. Test Install Command

```bash
# Install the Git hook
node dist/cli.js install

# Verify .husky directory was created
ls .husky/

# Verify pre-commit hook exists
cat .husky/pre-commit
```

Expected output:
```
✅ avanasec Git hooks installed successfully!

📋 What happens now:
   • Before each commit, avanasec will scan your staged files
   • Commits with critical/high severity issues will be blocked
   • You'll see clear error messages with fix suggestions
```

### 3. Test Blocking Behavior

```bash
# Create a test file with a secret
echo "const apiKey = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret.js

# Stage the file
git add test-secret.js

# Try to commit (should be blocked)
git commit -m "test: add secret"
```

Expected output:
```
🔒 Running avanasec security scan...
🔍 Scanning 1 staged file(s)...

🚨 COMMIT BLOCKED - Security Issues Found

Found 1 critical and 0 high severity issue(s):

🔴 OpenAI API Key
   File: test-secret.js:1
   OpenAI API key detected
   ✅ Fix: Move to environment variable: OPENAI_API_KEY

❌ Please fix these issues before committing

💡 Tips:
   • Fix the issues and try again
   • To bypass (not recommended): git commit --no-verify
```

### 4. Test Allowing Clean Code

```bash
# Fix the file
echo "const apiKey = process.env.OPENAI_API_KEY;" > test-secret.js

# Stage the fixed file
git add test-secret.js

# Try to commit (should succeed)
git commit -m "test: use environment variable"
```

Expected output:
```
🔒 Running avanasec security scan...
🔍 Scanning 1 staged file(s)...

✅ No security issues found in staged files

[main abc1234] test: use environment variable
 1 file changed, 1 insertion(+), 1 deletion(-)
```

### 5. Test Uninstall Command

```bash
# Remove the Git hook
node dist/cli.js uninstall

# Verify hook was removed
ls .husky/pre-commit
```

Expected output:
```
✅ Removed pre-commit hook

✅ avanasec Git hooks uninstalled successfully!

💡 To reinstall: avanasec install
```

### 6. Test --staged Flag Directly

```bash
# Create and stage a file with secrets
echo "const secret = 'AKIAIOSFODNN7EXAMPLE';" > test-aws.js
git add test-aws.js

# Run scan with --staged flag
node dist/cli.js scan --staged
```

Expected output:
```
🔍 Scanning 1 staged file(s)...

🚨 COMMIT BLOCKED - Security Issues Found

Found 0 critical and 1 high severity issue(s):

🟠 AWS Access Key
   File: test-aws.js:1
   AWS access key detected
   ✅ Fix: Move to environment variable: AWS_ACCESS_KEY_ID
```

## Automated Test Script

Save this as `test-git-hooks.sh`:

```bash
#!/bin/bash

echo "🧪 Testing avanasec Git Hook Integration"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function
test_command() {
    local description=$1
    local command=$2
    local expected_exit_code=$3
    
    echo -n "Testing: $description... "
    
    eval "$command" > /dev/null 2>&1
    local exit_code=$?
    
    if [ $exit_code -eq $expected_exit_code ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (expected exit code $expected_exit_code, got $exit_code)"
        ((TESTS_FAILED++))
    fi
}

# Build
echo "📦 Building avanasec..."
npm run build > /dev/null 2>&1

# Test 1: Install command
test_command "Install Git hooks" "node dist/cli.js install" 0

# Test 2: Hook file exists
test_command "Pre-commit hook created" "test -f .husky/pre-commit" 0

# Test 3: Scan with secret (should fail)
echo "const key = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';" > test-secret-temp.js
git add test-secret-temp.js 2>/dev/null
test_command "Scan detects secret in staged file" "node dist/cli.js scan --staged" 1
git reset HEAD test-secret-temp.js 2>/dev/null
rm test-secret-temp.js

# Test 4: Scan without secret (should pass)
echo "const key = process.env.API_KEY;" > test-clean-temp.js
git add test-clean-temp.js 2>/dev/null
test_command "Scan allows clean staged file" "node dist/cli.js scan --staged" 0
git reset HEAD test-clean-temp.js 2>/dev/null
rm test-clean-temp.js

# Test 5: Uninstall command
test_command "Uninstall Git hooks" "node dist/cli.js uninstall" 0

# Summary
echo ""
echo "======================================"
echo "Test Results:"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
```

Make it executable and run:
```bash
chmod +x test-git-hooks.sh
./test-git-hooks.sh
```

## Manual Verification Checklist

- [ ] `avanasec install` creates `.husky/pre-commit` file
- [ ] Pre-commit hook contains `avanasec scan --staged`
- [ ] Committing file with critical issue blocks commit
- [ ] Committing file with high severity issue blocks commit
- [ ] Committing clean file allows commit
- [ ] Committing file with only medium/low issues shows warning but allows commit
- [ ] Error messages show file path and line number
- [ ] Error messages include fix suggestions
- [ ] `git commit --no-verify` bypasses the hook
- [ ] `avanasec uninstall` removes the hook
- [ ] Uninstall preserves custom hooks (if any)
- [ ] `--staged` flag scans only staged files
- [ ] Scan completes in under 2 seconds for typical commits

## Troubleshooting

### Hook not running
```bash
# Check if hook is executable
ls -la .husky/pre-commit

# Make it executable (Unix/Mac)
chmod +x .husky/pre-commit

# Verify Husky is initialized
cat .husky/_/husky.sh
```

### Hook running but not blocking
```bash
# Check exit code manually
node dist/cli.js scan --staged
echo $?  # Should be 1 if issues found, 0 if clean
```

### No staged files detected
```bash
# Verify files are staged
git diff --cached --name-only

# Check if in Git repository
git status
```

## Performance Testing

Test with different commit sizes:

```bash
# Small commit (1-5 files)
for i in {1..5}; do echo "console.log('test');" > test$i.js; done
git add test*.js
time node dist/cli.js scan --staged

# Medium commit (10-20 files)
for i in {1..20}; do echo "console.log('test');" > test$i.js; done
git add test*.js
time node dist/cli.js scan --staged

# Large commit (50+ files)
for i in {1..50}; do echo "console.log('test');" > test$i.js; done
git add test*.js
time node dist/cli.js scan --staged
```

All should complete in under 2 seconds.

## Cleanup

```bash
# Remove test files
rm -f test*.js test-*.js

# Unstage all
git reset HEAD .

# Remove hooks
node dist/cli.js uninstall
```

---

**Status**: Ready for testing  
**Date**: January 16, 2026


