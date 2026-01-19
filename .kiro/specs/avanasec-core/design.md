# Design Document: avanasec Core

## Overview

avanasec is a production-ready CLI tool for detecting hardcoded secrets, API keys, credentials, and insecure code patterns in codebases. This design document outlines the architecture, components, and implementation strategy for making avanasec robust, performant, and ready for npm publication.

The design focuses on implementing Requirements 1-12 (robustness features) while maintaining the existing functionality from Requirements 13-14 (insecure code patterns and Git hooks).

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLI Layer                          │
│  • Command parsing and validation                       │
│  • Output formatting (text, JSON)                       │
│  • Progress reporting                                   │
│  • Error handling and exit codes                        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                   Engine Layer                          │
│  • Scan orchestration                                   │
│  • File discovery and filtering                         │
│  • Security score calculation                           │
│  • Result aggregation                                   │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  Scanner Layer                          │
│  • File type detection (binary, text, encoding)         │
│  • File streaming for large files                       │
│  • Pattern matching                                     │
│  • Issue detection and reporting                        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                 Pattern Layer                           │
│  • Secret patterns (80+)                                │
│  • Code patterns (20+)                                  │
│  • Pattern validation                                   │
│  • Pattern testing                                      │
└─────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Fail Gracefully**: Never crash, always provide useful error messages
2. **Performance First**: Optimize for speed without sacrificing accuracy
3. **Memory Efficient**: Stream large files, limit memory usage
4. **Extensible**: Easy to add new patterns and features
5. **Testable**: All components have clear interfaces for testing

## Components and Interfaces

### 1. File Type Detector

**Purpose**: Detect file types and encodings before scanning

**Interface**:
```typescript
interface FileTypeDetector {
  isBinary(filePath: string): boolean;
  detectEncoding(filePath: string): FileEncoding;
  shouldStream(filePath: string): boolean;
}

type FileEncoding = 'utf-8' | 'utf-16' | 'latin-1' | 'ascii' | 'unknown';

interface FileInfo {
  path: string;
  isBinary: boolean;
  encoding: FileEncoding;
  size: number;
  shouldStream: boolean;
}
```

**Implementation Strategy**:
- Check file extension first (fast path)
- Read first 8KB to detect binary content (null bytes, high-bit characters)
- Detect BOM for UTF-16
- Use heuristics for encoding detection
- Files > 10MB should be streamed

### 2. File Stream Scanner

**Purpose**: Scan large files in chunks to avoid memory issues

**Interface**:
```typescript
interface FileStreamScanner {
  scanStream(filePath: string, encoding: FileEncoding): Promise<SecurityIssue[]>;
}

interface StreamOptions {
  chunkSize: number;  // Default: 64KB
  overlap: number;    // Default: 1KB (for patterns spanning chunks)
  maxMemory: number;  // Default: 500MB
}
```

**Implementation Strategy**:
- Read file in 64KB chunks
- Maintain 1KB overlap between chunks to catch patterns spanning boundaries
- Track line numbers across chunks
- Emit issues as they're found (streaming results)

### 3. Ignore Pattern Manager

**Purpose**: Manage file and directory ignore patterns

**Interface**:
```typescript
interface IgnorePatternManager {
  loadPatterns(projectPath: string): void;
  shouldIgnore(relativePath: string): boolean;
  addPattern(pattern: string): void;
  getIgnoredCount(): number;
}

interface IgnoreConfig {
  defaultPatterns: string[];
  avanasecIgnorePatterns: string[];
  cliPatterns: string[];
}
```

**Implementation Strategy**:
- Load `.avanasecignore` file if exists
- Merge with default patterns
- Support glob patterns (*, **, ?)
- Cache compiled regex for performance
- Log ignored files in verbose mode

### 4. Progress Reporter

**Purpose**: Report scan progress for large codebases

**Interface**:
```typescript
interface ProgressReporter {
  start(totalFiles: number): void;
  update(filesScanned: number): void;
  complete(): void;
  setEnabled(enabled: boolean): void;
}

interface ProgressInfo {
  filesScanned: number;
  totalFiles: number;
  percentage: number;
  estimatedTimeRemaining: number;
  currentFile: string;
}
```

**Implementation Strategy**:
- Use terminal progress bar library (e.g., cli-progress)
- Update at most once per 100ms (avoid flickering)
- Calculate ETA based on average scan time
- Clear progress bar before final output
- Disable with `--no-progress` flag

### 5. Result Cache

**Purpose**: Cache scan results for unchanged files

**Interface**:
```typescript
interface ResultCache {
  get(filePath: string, fileHash: string): CachedResult | null;
  set(filePath: string, fileHash: string, result: SecurityIssue[]): void;
  clear(): void;
  getHitRate(): number;
}

interface CachedResult {
  issues: SecurityIssue[];
  timestamp: number;
  fileHash: string;
}
```

**Implementation Strategy**:
- Use file modification time + size as quick hash
- Store cache in `.avanasec-cache` directory
- Expire cache entries after 24 hours
- Clear cache on pattern updates
- Track cache hit rate for metrics

### 6. Error Handler

**Purpose**: Centralized error handling with proper exit codes

**Interface**:
```typescript
interface ErrorHandler {
  handleFileError(filePath: string, error: Error): void;
  handleScanError(error: Error): void;
  handleValidationError(message: string): void;
  getErrorCount(): number;
}

enum ExitCode {
  SUCCESS = 0,
  ISSUES_FOUND = 1,
  INVALID_USAGE = 2,
  UNEXPECTED_ERROR = 3
}
```

**Implementation Strategy**:
- Log all errors with context
- Continue scanning on file errors
- Exit immediately on critical errors
- Provide helpful error messages
- Include stack traces in debug mode

### 7. JSON Output Formatter

**Purpose**: Format scan results as JSON for CI/CD integration

**Interface**:
```typescript
interface JSONOutputFormatter {
  format(result: ScanResult, options: JSONOptions): string;
}

interface JSONOptions {
  pretty: boolean;
  includeMetadata: boolean;
  includeDebugInfo: boolean;
}

interface JSONScanResult {
  success: boolean;
  timestamp: string;
  duration: number;
  filesScanned: number;
  securityScore: number;
  issues: JSONSecurityIssue[];
  summary: IssueSummary;
  metadata?: ScanMetadata;
  debug?: DebugInfo;
}
```

**Implementation Strategy**:
- Use `JSON.stringify()` with proper formatting
- Include all issue details
- Add metadata (avanasec version, scan options, etc.)
- Include debug info when `--verbose` is used
- Validate JSON output in tests

### 8. Pattern Validator

**Purpose**: Validate and test all detection patterns

**Interface**:
```typescript
interface PatternValidator {
  validatePattern(pattern: SecretPattern): ValidationResult;
  testPattern(pattern: SecretPattern, testCases: TestCase[]): TestResult;
  checkBacktracking(pattern: RegExp): boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface TestCase {
  input: string;
  shouldMatch: boolean;
  description: string;
}
```

**Implementation Strategy**:
- Compile all patterns at startup
- Test against known positive/negative examples
- Detect catastrophic backtracking using timeout
- Report validation errors clearly
- Run validation in CI/CD

### 9. Memory Manager

**Purpose**: Monitor and limit memory usage

**Interface**:
```typescript
interface MemoryManager {
  getCurrentUsage(): number;
  checkLimit(): boolean;
  triggerGC(): void;
  getStats(): MemoryStats;
}

interface MemoryStats {
  currentUsage: number;
  maxUsage: number;
  gcCount: number;
  limit: number;
}
```

**Implementation Strategy**:
- Monitor `process.memoryUsage()`
- Trigger GC when usage > 400MB
- Fail gracefully if limit (500MB) exceeded
- Log memory stats in debug mode
- Release resources immediately after use

### 10. Parallel Scanner

**Purpose**: Scan files in parallel using worker threads

**Interface**:
```typescript
interface ParallelScanner {
  scanFiles(files: string[], options: ScanOptions): Promise<SecurityIssue[]>;
  setWorkerCount(count: number): void;
}

interface WorkerPool {
  workers: Worker[];
  queue: ScanTask[];
  results: Map<string, SecurityIssue[]>;
}
```

**Implementation Strategy**:
- Use Node.js worker threads
- Default to CPU count - 1 workers
- Distribute files evenly across workers
- Aggregate results from all workers
- Handle worker errors gracefully

## Data Models

### Enhanced ScanOptions

```typescript
interface ScanOptions {
  path: string;
  config?: SecurityConfig;
  stagedOnly?: boolean;
  includeFiles?: string[];
  verbose?: boolean;
  debug?: boolean;
  quiet?: boolean;
  json?: boolean;
  noProgress?: boolean;
  ignorePatterns?: string[];
  failOnHigh?: boolean;
  maxMemory?: number;
  workerCount?: number;
  useCache?: boolean;
}
```

### Enhanced ScanResult

```typescript
interface ScanResult {
  success: boolean;
  timestamp: string;
  duration: number;
  filesScanned: number;
  filesSkipped: number;
  filesErrored: number;
  issues: SecurityIssue[];
  summary: IssueSummary;
  metadata: ScanMetadata;
  errors: ScanError[];
}

interface ScanMetadata {
  avanasecVersion: string;
  scanOptions: ScanOptions;
  systemInfo: SystemInfo;
  cacheHitRate?: number;
  memoryUsage?: MemoryStats;
}

interface ScanError {
  file: string;
  error: string;
  timestamp: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Binary File Exclusion
*For any* file path, if the file is detected as binary, then it should not be scanned for secrets and should not appear in the issues list.

**Validates: Requirements 1.1**

### Property 2: Large File Streaming
*For any* file larger than 10MB, the scanner should use streaming (not load entire file into memory) and memory usage should not exceed 500MB.

**Validates: Requirements 1.2, 10.3**

### Property 3: Encoding Handling
*For any* file with invalid UTF-8 encoding, the scanner should handle it gracefully, log a warning, and continue scanning other files without crashing.

**Validates: Requirements 1.3, 9.4**

### Property 4: Permission Error Recovery
*For any* file that cannot be read due to permissions, the scanner should log an error, continue scanning other files, and include the error in the scan result.

**Validates: Requirements 1.4, 3.2**

### Property 5: Scan Determinism
*For any* codebase, scanning it twice with the same options should produce identical results (same issues, same security score, same order).

**Validates: Requirements 8.1, 8.2**

### Property 6: Score Consistency
*For any* scan result, the security score should be calculated deterministically: score = 100 - (critical×20 + high×10 + medium×5 + low×2), with minimum 0.

**Validates: Requirements 8.2, 8.3**

### Property 7: Ignore Pattern Effectiveness
*For any* file matching an ignore pattern (from `.avanasecignore` or CLI), the file should not be scanned and should not appear in filesScanned count.

**Validates: Requirements 4.4**

### Property 8: Progress Reporting Accuracy
*For any* scan with more than 100 files, the progress percentage should monotonically increase from 0% to 100%, and filesScanned should equal totalFiles at completion.

**Validates: Requirements 11.1, 11.2**

### Property 9: JSON Output Validity
*For any* scan result with `--json` flag, the output should be valid JSON that can be parsed without errors and contains all required fields.

**Validates: Requirements 6.1, 6.2**

### Property 10: Memory Limit Enforcement
*For any* scan, memory usage should never exceed 500MB, and if it approaches 400MB, garbage collection should be triggered.

**Validates: Requirements 10.1, 10.2**

### Property 11: Pattern Compilation
*For all* secret and code patterns, they should compile without errors and not cause catastrophic backtracking on any input.

**Validates: Requirements 7.4, 7.5**

### Property 12: Error Code Correctness
*For any* scan result, the exit code should be: 0 if no critical/high issues, 1 if critical/high issues found, 2 if invalid arguments, 3 if unexpected error.

**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

### Property 13: Parallel Scan Equivalence
*For any* set of files, scanning them in parallel should produce the same issues as scanning them sequentially (order may differ).

**Validates: Requirements 2.2**

### Property 14: Cache Correctness
*For any* file, if the file hasn't changed (same modification time and size), the cached result should be identical to a fresh scan result.

**Validates: Requirements 2.3**

### Property 15: Symbolic Link Safety
*For any* symbolic link, it should only be followed if it points to a file within the scan directory, and circular links should be detected and skipped.

**Validates: Requirements 1.5, 1.6**

## Error Handling

### Error Categories

1. **File Errors** (Continue scanning)
   - Permission denied
   - File not found
   - Invalid encoding
   - Binary file (not an error, just skip)

2. **Configuration Errors** (Exit immediately)
   - Invalid command-line arguments
   - Invalid `.avanasecignore` syntax
   - Invalid pattern configuration

3. **System Errors** (Exit immediately)
   - Out of memory
   - Disk full
   - Worker thread crash

4. **Pattern Errors** (Log warning, continue)
   - Pattern compilation failure
   - Catastrophic backtracking detected

### Error Handling Strategy

```typescript
try {
  // Scan operation
} catch (error) {
  if (error instanceof FilePermissionError) {
    // Log error, continue scanning
    errorHandler.handleFileError(file, error);
    continue;
  } else if (error instanceof ConfigurationError) {
    // Exit with code 2
    console.error(error.message);
    process.exit(ExitCode.INVALID_USAGE);
  } else if (error instanceof OutOfMemoryError) {
    // Exit with code 3
    console.error('Out of memory');
    process.exit(ExitCode.UNEXPECTED_ERROR);
  } else {
    // Unexpected error, exit with code 3
    console.error('Unexpected error:', error);
    if (options.debug) {
      console.error(error.stack);
    }
    process.exit(ExitCode.UNEXPECTED_ERROR);
  }
}
```

## Testing Strategy

### Dual Testing Approach

avanasec will use both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs, while property tests verify general correctness.

### Unit Testing

**Test Structure**:
```
tests/
├── unit/
│   ├── file-type-detector.test.ts
│   ├── stream-scanner.test.ts
│   ├── ignore-manager.test.ts
│   ├── progress-reporter.test.ts
│   ├── result-cache.test.ts
│   ├── error-handler.test.ts
│   ├── json-formatter.test.ts
│   ├── pattern-validator.test.ts
│   ├── memory-manager.test.ts
│   └── parallel-scanner.test.ts
```

**Test Coverage Goals**:
- 80%+ code coverage
- All error paths tested
- All edge cases covered
- Mock external dependencies (file system, worker threads)

### Property-Based Testing

**Framework**: fast-check (TypeScript property-based testing library)

**Test Structure**:
```
tests/
├── property/
│   ├── scan-determinism.property.test.ts
│   ├── score-consistency.property.test.ts
│   ├── binary-exclusion.property.test.ts
│   ├── encoding-handling.property.test.ts
│   ├── ignore-patterns.property.test.ts
│   ├── json-validity.property.test.ts
│   ├── memory-limits.property.test.ts
│   ├── pattern-compilation.property.test.ts
│   ├── exit-codes.property.test.ts
│   └── cache-correctness.property.test.ts
```

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: `Feature: avanasec-core, Property N: [property text]`
- Use smart generators that constrain to valid input space

**Example Property Test**:
```typescript
describe('Feature: avanasec-core, Property 5: Scan Determinism', () => {
  it('should produce identical results for repeated scans', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
        async (fileContents) => {
          // Create temporary files
          const tempDir = await createTempFiles(fileContents);
          
          // Scan twice
          const result1 = await avanasec.scan({ path: tempDir });
          const result2 = await avanasec.scan({ path: tempDir });
          
          // Results should be identical
          expect(result1.issues).toEqual(result2.issues);
          expect(result1.summary).toEqual(result2.summary);
          
          // Cleanup
          await cleanupTempFiles(tempDir);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Test Structure**:
```
tests/
├── integration/
│   ├── cli-scan.test.ts
│   ├── cli-install.test.ts
│   ├── git-hooks.test.ts
│   ├── large-files.test.ts
│   ├── binary-files.test.ts
│   ├── encoding-files.test.ts
│   └── ci-cd-integration.test.ts
```

**Test Scenarios**:
- Full CLI workflows
- Git hook integration
- Large file handling (> 10MB)
- Binary file detection
- Various file encodings
- CI/CD pipeline integration

### Performance Testing

**Benchmarks**:
- 10,000 files in < 10 seconds
- Memory usage < 500MB
- Startup time < 100ms
- Cache hit rate > 80% on repeated scans

**Test Files**:
```
tests/
├── performance/
│   ├── large-codebase.bench.ts
│   ├── memory-usage.bench.ts
│   ├── parallel-scanning.bench.ts
│   └── cache-performance.bench.ts
```

## Implementation Plan

### Phase 1: Core Robustness (Requirements 1, 3, 9)
1. File type detector
2. Encoding detection
3. Error handling framework
4. Graceful failure handling

### Phase 2: Performance (Requirements 2, 10, 11)
5. File streaming for large files
6. Memory management
7. Progress reporting
8. Parallel scanning with worker threads

### Phase 3: Configuration (Requirements 4, 5, 6)
9. Ignore pattern manager
10. Verbose/debug/quiet logging
11. JSON output formatter

### Phase 4: Quality (Requirements 7, 8, 12)
12. Pattern validator
13. Result caching
14. Security score consistency
15. Exit code handling

### Phase 5: Testing
16. Unit tests for all components
17. Property-based tests for all properties
18. Integration tests for workflows
19. Performance benchmarks

## Dependencies

### New Dependencies

```json
{
  "dependencies": {
    "cli-progress": "^3.12.0",      // Progress bar
    "iconv-lite": "^0.6.3",         // Encoding conversion
    "chardet": "^2.0.0"             // Encoding detection
  },
  "devDependencies": {
    "fast-check": "^3.15.0",        // Property-based testing
    "vitest": "^1.2.0",             // Unit testing
    "@types/cli-progress": "^3.11.5"
  }
}
```

### Existing Dependencies

- TypeScript (strict mode)
- Node.js 18+ (for worker threads)
- Husky (Git hooks)

## Deployment Strategy

### npm Publication

1. **Version**: Start at 1.0.0 (major release)
2. **Package Name**: `avanasec`
3. **Registry**: npm public registry
4. **License**: MIT

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm test
      - run: npm run test:coverage
```

### Release Process

1. Update CHANGELOG.md
2. Bump version in package.json
3. Run all tests
4. Build distribution
5. Publish to npm
6. Create GitHub release
7. Announce on social media

## Conclusion

This design provides a comprehensive architecture for making avanasec robust, performant, and production-ready. The modular design allows for incremental implementation and testing, while the correctness properties ensure that all requirements are validated through property-based testing.

The implementation will follow the spec-driven development workflow, with each component implemented, tested, and validated before moving to the next. The result will be a high-quality, well-tested CLI tool that developers can trust to protect their codebases from security vulnerabilities.



