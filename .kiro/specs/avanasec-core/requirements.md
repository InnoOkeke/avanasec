# Requirements Document: avanasec Core

## Introduction

avanasec is a production-ready CLI tool for detecting hardcoded secrets, API keys, and credentials in codebases. This specification focuses on making avanasec robust, performant, and ready for npm publication.

## Glossary

- **avanasec**: The complete secret scanning CLI tool
- **Secret**: API keys, tokens, passwords, or credentials hardcoded in source code
- **Pattern**: Regular expression used to detect specific types of secrets
- **Security_Score**: 0-100 metric indicating codebase security health
- **Scanner**: Component that traverses files and detects secrets
- **Binary_File**: Non-text file that should be skipped during scanning
- **Streaming**: Reading large files in chunks to avoid memory issues
- **CI_CD**: Continuous Integration/Continuous Deployment pipelines
- **Pattern_Analyzer**: Component that detects insecure coding patterns
- **Code_Pattern**: Insecure coding practice that could lead to vulnerabilities
- **SQL_Injection**: Security vulnerability where malicious SQL code is injected
- **Command_Injection**: Security vulnerability where malicious commands are executed
- **Path_Traversal**: Security vulnerability allowing access to unauthorized files
- **Pre_Commit_Hook**: Git hook that runs before commits to block secrets
- **Husky**: Tool for managing Git hooks in Node.js projects
- **Staged_Files**: Files that have been added to Git staging area with `git add`

## Requirements

### Requirement 1: Robust File Handling

**User Story:** As a developer, I want avanasec to handle all types of files gracefully, so that scanning never crashes or produces incorrect results.

#### Acceptance Criteria

1. WHEN scanning a binary file, THE Scanner SHALL detect it and skip scanning
2. WHEN scanning a file larger than 10MB, THE Scanner SHALL use streaming to avoid memory issues
3. WHEN encountering a file with invalid UTF-8 encoding, THE Scanner SHALL handle it gracefully and log a warning
4. WHEN a file cannot be read due to permissions, THE Scanner SHALL log an error and continue scanning other files
5. WHEN scanning a symbolic link, THE Scanner SHALL follow it only if it points to a file within the scan directory
6. WHEN scanning encounters a circular symbolic link, THE Scanner SHALL detect it and skip to prevent infinite loops

### Requirement 2: Performance Optimization

**User Story:** As a developer with large codebases, I want fast scanning, so that I don't wait long for results.

#### Acceptance Criteria

1. THE Scanner SHALL complete scanning 10,000 files in under 10 seconds on modern hardware
2. WHEN scanning files, THE Scanner SHALL process them in parallel using worker threads
3. WHEN scanning the same directory twice, THE Scanner SHALL cache results for unchanged files
4. THE Scanner SHALL provide progress reporting showing percentage complete and files scanned
5. WHEN scanning is interrupted, THE Scanner SHALL clean up resources and exit gracefully

### Requirement 3: Comprehensive Error Handling

**User Story:** As a developer, I want clear error messages, so that I can understand and fix issues quickly.

#### Acceptance Criteria

1. WHEN an error occurs, THE Scanner SHALL provide a descriptive error message with context
2. WHEN a file cannot be scanned, THE Scanner SHALL log the file path and reason
3. WHEN invalid options are provided, THE CLI SHALL display helpful error messages with examples
4. WHEN scanning fails, THE CLI SHALL exit with appropriate error codes (1 for errors, 2 for invalid usage)
5. THE Scanner SHALL never crash without logging the error and stack trace

### Requirement 4: Configurable Ignore Patterns

**User Story:** As a developer, I want to customize which files are scanned, so that I can focus on relevant code.

#### Acceptance Criteria

1. THE Scanner SHALL support a `.avanasecignore` file with glob patterns
2. WHEN `.avanasecignore` exists, THE Scanner SHALL merge it with default ignore patterns
3. THE Scanner SHALL support command-line ignore patterns via `--ignore` flag
4. WHEN a file matches any ignore pattern, THE Scanner SHALL skip it and not report it in statistics
5. THE Scanner SHALL log ignored files when `--verbose` flag is used

### Requirement 5: Detailed Logging and Verbosity

**User Story:** As a developer debugging scan issues, I want detailed logs, so that I can understand what avanasec is doing.

#### Acceptance Criteria

1. WHEN `--verbose` flag is used, THE Scanner SHALL log each file being scanned
2. WHEN `--verbose` flag is used, THE Scanner SHALL log which patterns are being checked
3. WHEN `--verbose` flag is used, THE Scanner SHALL log files that are skipped and why
4. THE Scanner SHALL support `--debug` flag for even more detailed logging
5. WHEN `--quiet` flag is used, THE Scanner SHALL only output critical errors and final results

### Requirement 6: JSON Output for CI/CD

**User Story:** As a DevOps engineer, I want machine-readable output, so that I can integrate avanasec into CI/CD pipelines.

#### Acceptance Criteria

1. WHEN `--json` flag is used, THE CLI SHALL output results in valid JSON format
2. THE JSON output SHALL include all issues with file paths, line numbers, and severity
3. THE JSON output SHALL include scan metadata (duration, files scanned, timestamp)
4. THE JSON output SHALL include the security score
5. WHEN `--json` is used with `--verbose`, THE CLI SHALL include additional debug information in JSON

### Requirement 7: Pattern Validation and Testing

**User Story:** As a maintainer, I want to ensure all patterns work correctly, so that we don't have false positives or negatives.

#### Acceptance Criteria

1. THE Pattern_Validator SHALL test each pattern against known positive examples
2. THE Pattern_Validator SHALL test each pattern against known negative examples (should not match)
3. WHEN a pattern fails validation, THE Pattern_Validator SHALL report which test cases failed
4. THE Pattern_Validator SHALL ensure no pattern has catastrophic backtracking
5. THE Pattern_Validator SHALL verify all patterns compile without errors

### Requirement 8: Security Score Consistency

**User Story:** As a developer, I want consistent security scores, so that I can track improvements over time.

#### Acceptance Criteria

1. WHEN scanning the same codebase twice, THE Scanner SHALL produce identical security scores
2. THE security score calculation SHALL be deterministic (same inputs → same output)
3. WHEN issues are fixed, THE security score SHALL increase proportionally
4. THE Scanner SHALL document the security score algorithm in the README
5. WHEN displaying the security score, THE CLI SHALL show the score breakdown by severity

### Requirement 9: File Encoding Detection

**User Story:** As a developer working with international teams, I want avanasec to handle different file encodings, so that all files are scanned correctly.

#### Acceptance Criteria

1. THE Scanner SHALL detect file encoding before scanning
2. WHEN a file is UTF-16, THE Scanner SHALL convert it to UTF-8 before scanning
3. WHEN a file has a BOM (Byte Order Mark), THE Scanner SHALL handle it correctly
4. WHEN a file encoding cannot be determined, THE Scanner SHALL attempt UTF-8 and log a warning if it fails
5. THE Scanner SHALL support ASCII, UTF-8, UTF-16, and Latin-1 encodings

### Requirement 10: Memory Management

**User Story:** As a developer scanning large repositories, I want avanasec to use memory efficiently, so that it doesn't crash or slow down my system.

#### Acceptance Criteria

1. THE Scanner SHALL limit memory usage to 500MB maximum
2. WHEN memory usage exceeds 400MB, THE Scanner SHALL trigger garbage collection
3. WHEN scanning large files, THE Scanner SHALL use streaming instead of loading entire file into memory
4. THE Scanner SHALL release file handles immediately after scanning each file
5. WHEN scanning is complete, THE Scanner SHALL clean up all resources before exiting

### Requirement 11: Progress Reporting

**User Story:** As a developer scanning large codebases, I want to see progress, so that I know the scan is working and how long it will take.

#### Acceptance Criteria

1. WHEN scanning more than 100 files, THE CLI SHALL display a progress bar
2. THE progress bar SHALL show percentage complete, files scanned, and estimated time remaining
3. WHEN `--no-progress` flag is used, THE CLI SHALL not display progress information
4. THE progress bar SHALL update at least once per second
5. WHEN scanning completes, THE CLI SHALL clear the progress bar and show final results

### Requirement 12: Exit Codes for CI/CD

**User Story:** As a DevOps engineer, I want meaningful exit codes, so that I can configure CI/CD pipelines to fail appropriately.

#### Acceptance Criteria

1. WHEN no issues are found, THE CLI SHALL exit with code 0
2. WHEN critical issues are found, THE CLI SHALL exit with code 1
3. WHEN high severity issues are found and `--fail-on-high` is set, THE CLI SHALL exit with code 1
4. WHEN invalid arguments are provided, THE CLI SHALL exit with code 2
5. WHEN an unexpected error occurs, THE CLI SHALL exit with code 3

### Requirement 13: Insecure Code Pattern Detection

**User Story:** As a developer, I want to detect insecure coding patterns, so that I can prevent vulnerabilities before they reach production.

#### Acceptance Criteria

1. THE Pattern_Analyzer SHALL detect `eval()` usage in JavaScript/TypeScript code
2. THE Pattern_Analyzer SHALL detect SQL string concatenation patterns that could lead to SQL injection
3. THE Pattern_Analyzer SHALL detect weak cryptographic algorithms (MD5, SHA1)
4. THE Pattern_Analyzer SHALL detect insecure random number generation using `Math.random()` for security purposes
5. THE Pattern_Analyzer SHALL detect command injection vulnerabilities (e.g., `exec()` with user input)
6. THE Pattern_Analyzer SHALL detect path traversal vulnerabilities (e.g., `../` in file paths)
7. THE Pattern_Analyzer SHALL detect hardcoded localhost URLs in production code
8. THE Pattern_Analyzer SHALL detect insecure deserialization patterns
9. THE Pattern_Analyzer SHALL detect missing input validation on user-provided data
10. WHEN insecure patterns are found, THE Pattern_Analyzer SHALL provide secure alternatives and fix suggestions
11. THE Pattern_Analyzer SHALL support language-specific patterns (JavaScript, TypeScript, Python, Java, etc.)
12. WHEN `--code-patterns` flag is used, THE CLI SHALL enable code pattern scanning

### Requirement 14: Git Hook Integration (Pre-Commit Protection)

**User Story:** As a developer, I want automatic scanning before commits, so that I cannot accidentally commit secrets or insecure code to GitHub.

#### Acceptance Criteria

1. THE CLI SHALL provide an `install` command to set up Git hooks automatically
2. WHEN `avanasec install` is run, THE CLI SHALL install Husky and configure pre-commit hooks
3. WHEN a developer attempts to commit code, THE Pre_Commit_Hook SHALL automatically run avanasec scan
4. WHEN critical or high severity issues are detected in staged files, THE Pre_Commit_Hook SHALL block the commit with exit code 1
5. WHEN no critical or high severity issues are detected, THE Pre_Commit_Hook SHALL allow the commit to proceed
6. THE Pre_Commit_Hook SHALL complete scanning in under 2 seconds for typical commits
7. WHEN a commit is blocked, THE Pre_Commit_Hook SHALL display clear error messages with file locations and fix suggestions
8. THE Pre_Commit_Hook SHALL scan only staged files (not the entire repository)
9. WHEN `--no-verify` flag is used with git commit, THE Pre_Commit_Hook SHALL be bypassed (Git standard behavior)
10. THE CLI SHALL provide an `uninstall` command to remove Git hooks
11. WHEN hooks are installed, THE CLI SHALL create a `.husky/pre-commit` file with the scan command
12. THE Pre_Commit_Hook SHALL display a summary showing: files scanned, issues found by severity, and security score

---

## Non-Functional Requirements

### Performance
- Scan 10,000 files in under 10 seconds
- Memory usage under 500MB
- Startup time under 100ms

### Reliability
- 99.9% uptime (no crashes)
- Graceful degradation on errors
- Deterministic results

### Usability
- Clear error messages
- Helpful documentation
- Intuitive CLI interface

### Maintainability
- 80%+ test coverage
- Comprehensive documentation
- Modular architecture

### Portability
- Works on Windows, macOS, Linux
- Node.js 18+ support
- No platform-specific dependencies



