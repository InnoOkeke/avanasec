# Troubleshooting Guide: Avanasec CLI

This guide helps you resolve common issues with Avanasec CLI installation and usage.

## Quick Diagnostics

Run the built-in diagnostics tool first:

```bash
avanasec troubleshoot
# or
avanasec doctor
```

This will check your system configuration and identify common issues automatically.

## Installation Issues

### Command Not Found

**Problem**: `avanasec: command not found` or `'avanasec' is not recognized`

**Solutions**:

1. **Verify Installation**:
   ```bash
   npm list -g avanasec
   ```

2. **Check npm Global Path**:
   ```bash
   npm config get prefix
   ```

3. **Add to PATH** (if needed):
   - **Windows**: Add `%APPDATA%\npm` to your PATH environment variable
   - **macOS/Linux**: Add `$(npm config get prefix)/bin` to your PATH

4. **Reinstall Globally**:
   ```bash
   npm uninstall -g avanasec
   npm install -g avanasec
   ```

### Permission Errors

**Problem**: `EACCES` or permission denied errors during installation

**Solutions**:

1. **Use sudo** (macOS/Linux):
   ```bash
   sudo npm install -g avanasec
   ```

2. **Run as Administrator** (Windows):
   - Open Command Prompt as Administrator
   - Run: `npm install -g avanasec`

3. **Configure npm for Global Installs** (Recommended):
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
   source ~/.profile
   npm install -g avanasec
   ```

### Module Loading Errors

**Problem**: `Cannot find module 'chardet'` or similar dependency errors

**Solutions**:

1. **Reinstall Dependencies**:
   ```bash
   npm uninstall -g avanasec
   npm cache clean --force
   npm install -g avanasec
   ```

2. **Manual Dependency Installation**:
   ```bash
   npm install -g chardet cli-progress iconv-lite minimatch
   npm install -g avanasec
   ```

3. **Check Node.js Version**:
   ```bash
   node --version
   ```
   Ensure you're using Node.js 18 or higher.

4. **Rebuild Native Modules**:
   ```bash
   npm rebuild -g
   ```

## Runtime Issues

### Encoding Detection Errors

**Problem**: Errors related to character encoding detection

**Solutions**:

1. **Check chardet Module**:
   ```bash
   avanasec troubleshoot
   ```

2. **Reinstall chardet**:
   ```bash
   npm install -g chardet
   ```

3. **Use Fallback Mode**: Avanasec automatically falls back to basic encoding detection if chardet fails.

### Memory Issues

**Problem**: Out of memory errors when scanning large codebases

**Solutions**:

1. **Increase Memory Limit**:
   ```bash
   avanasec scan --max-memory 1000  # 1GB limit
   ```

2. **Use Ignore Patterns**:
   ```bash
   avanasec scan --ignore "node_modules/**" --ignore "dist/**"
   ```

3. **Scan Smaller Directories**:
   ```bash
   avanasec scan --path ./src
   ```

### Performance Issues

**Problem**: Slow scanning performance

**Solutions**:

1. **Use More Workers**:
   ```bash
   avanasec scan --workers 8
   ```

2. **Add Ignore Patterns**:
   ```bash
   avanasec scan --ignore "**/*.log" --ignore "**/*.tmp"
   ```

3. **Check .avanaignore File**: Create a `.avanaignore` file with patterns to exclude:
   ```
   node_modules/
   dist/
   build/
   *.log
   *.tmp
   ```

## Platform-Specific Issues

### Windows

**Problem**: Path-related issues or command not recognized

**Solutions**:

1. **Use PowerShell**: Run commands in PowerShell instead of Command Prompt
2. **Check PATH**: Ensure `%APPDATA%\npm` is in your PATH
3. **Use Full Path**: `%APPDATA%\npm\avanasec.cmd scan`

### macOS

**Problem**: Permission issues or command not found

**Solutions**:

1. **Use Homebrew Node**: `brew install node`
2. **Fix npm Permissions**: Follow the npm permission guide
3. **Use nvm**: Install Node.js via nvm for better permission handling

### Linux

**Problem**: Permission or path issues

**Solutions**:

1. **Use Package Manager**: Install Node.js via your distribution's package manager
2. **Fix Global npm Directory**: Configure npm to use a user directory
3. **Check Shell Profile**: Ensure PATH is set in `.bashrc` or `.zshrc`

## Development Issues

### Git Hooks Not Working

**Problem**: Pre-commit hooks not triggering or failing

**Solutions**:

1. **Install Hooks**:
   ```bash
   avanasec install
   ```

2. **Check Hook Files**: Verify `.husky/pre-commit` exists and is executable

3. **Test Manually**:
   ```bash
   avanasec scan --staged
   ```

4. **Bypass for Testing**:
   ```bash
   git commit --no-verify -m "test commit"
   ```

### CI/CD Integration Issues

**Problem**: Avanasec failing in CI/CD pipelines

**Solutions**:

1. **Use Specific Exit Codes**:
   ```bash
   avanasec scan --fail-on-high
   ```

2. **Generate Reports**:
   ```bash
   avanasec scan --json --output-md
   ```

3. **Set Memory Limits**:
   ```bash
   avanasec scan --max-memory 512
   ```

## Getting Additional Help

### Built-in Diagnostics

Always start with the built-in diagnostics:

```bash
avanasec troubleshoot
```

This provides:
- System information
- Dependency status
- Configuration validation
- Common troubleshooting steps

### Reporting Issues

When reporting issues, please include:

1. **System Information**:
   - Operating system and version
   - Node.js version (`node --version`)
   - npm version (`npm --version`)

2. **Error Details**:
   - Complete error message
   - Command that caused the error
   - Steps to reproduce

3. **Diagnostic Output**:
   ```bash
   avanasec troubleshoot > diagnostics.txt
   ```

### Support Channels

- **Documentation**: [GitHub Repository](https://github.com/innookeke/avanasec#readme)
- **Issues**: [GitHub Issues](https://github.com/innookeke/avanasec/issues)
- **Discussions**: [GitHub Discussions](https://github.com/innookeke/avanasec/discussions)

### Quick Reference

| Issue | Command | Description |
|-------|---------|-------------|
| Installation check | `npm list -g avanasec` | Verify global installation |
| Diagnostics | `avanasec troubleshoot` | Run system diagnostics |
| Reinstall | `npm uninstall -g avanasec && npm install -g avanasec` | Clean reinstall |
| Clear cache | `npm cache clean --force` | Clear npm cache |
| Check PATH | `echo $PATH` (Unix) / `echo %PATH%` (Windows) | Verify PATH configuration |
| Test command | `avanasec --help` | Verify command works |

## Advanced Troubleshooting

### Debug Mode

Enable debug output for detailed information:

```bash
avanasec scan --debug
```

### Verbose Logging

Get detailed scan information:

```bash
avanasec scan --verbose
```

### Manual Testing

Test individual components:

```bash
# Test file detection
avanasec scan --path ./test-file.js --verbose

# Test pattern matching
avanasec scan --debug | grep "Pattern"

# Test memory usage
avanasec scan --verbose | grep "Memory"
```

### Environment Variables

Set environment variables for debugging:

```bash
# Enable debug logging
export DEBUG=avanasec:*
avanasec scan

# Set memory limit
export NODE_OPTIONS="--max-old-space-size=2048"
avanasec scan
```

---

**Need more help?** Run `avanasec troubleshoot` for automated diagnostics and solutions.
