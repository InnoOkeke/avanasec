# Implementation Plan: Avana Core

## Overview

This implementation plan breaks down the Avana Core design into discrete, actionable tasks. Each task builds on previous tasks and includes testing to validate functionality early.

## Tasks

- [x] 1. Set up testing infrastructure
  - Install testing dependencies (vitest, fast-check)
  - Configure test scripts in package.json
  - Create test directory structure
  - Set up test utilities and helpers
  - _Requirements: All (testing foundation)_

- [x] 2. Implement File Type Detector
  - [x] 2.1 Create FileTypeDetector class with interface
    - Implement `isBinary()` method using file extension and content analysis
    - Implement `detectEncoding()` method with BOM detection
    - Implement `shouldStream()` method based on file size (> 10MB)
    - _Requirements: 1.1, 1.2, 9.1, 9.2, 9.3_

  - [x] 2.2 Write property test for binary file detection
    - **Property 1: Binary File Exclusion**
    - **Validates: Requirements 1.1**

  - [x] 2.3 Write unit tests for FileTypeDetector
    - Test binary file detection (images, executables, etc.)
    - Test encoding detection (UTF-8, UTF-16, Latin-1, ASCII)
    - Test BOM handling
    - Test file size thresholds
    - _Requirements: 1.1, 1.2, 9.1, 9.2, 9.3_

- [x] 3. Implement File Stream Scanner
  - [x] 3.1 Create FileStreamScanner class
    - Implement `scanStream()` method with 64KB chunks
    - Handle 1KB overlap between chunks for pattern spanning
    - Track line numbers across chunks
    - Convert encodings to UTF-8 before scanning
    - _Requirements: 1.2, 9.2, 10.3_

  - [x] 3.2 Write property test for large file streaming
    - **Property 2: Large File Streaming**
    - **Validates: Requirements 1.2, 10.3**

  - [x] 3.3 Write unit tests for FileStreamScanner
    - Test chunk reading and overlap
    - Test line number tracking
    - Test encoding conversion
    - Test pattern detection across chunk boundaries
    - _Requirements: 1.2, 9.2, 10.3_

- [x] 4. Implement Error Handling Framework
  - [x] 4.1 Create ErrorHandler class and custom error types
    - Define FilePermissionError, ConfigurationError, OutOfMemoryError
    - Implement `handleFileError()` method
    - Implement `handleScanError()` method
    - Implement `handleValidationError()` method
    - Track error counts and types
    - _Requirements: 1.3, 1.4, 3.1, 3.2, 3.3, 3.5_

  - [x] 4.2 Write property test for error recovery
    - **Property 3: Encoding Handling**
    - **Property 4: Permission Error Recovery**
    - **Validates: Requirements 1.3, 1.4, 3.2, 9.4**

  - [x] 4.3 Write unit tests for ErrorHandler
    - Test file permission errors
    - Test encoding errors
    - Test configuration errors
    - Test error logging and continuation
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement Ignore Pattern Manager
  - [x] 6.1 Create IgnorePatternManager class
    - Implement `.avanaignore` file loading
    - Implement glob pattern matching (*, **, ?)
    - Merge default patterns with custom patterns
    - Cache compiled regex for performance
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.2 Write property test for ignore patterns
    - **Property 7: Ignore Pattern Effectiveness**
    - **Validates: Requirements 4.4**

  - [x] 6.3 Write unit tests for IgnorePatternManager
    - Test `.avanaignore` loading
    - Test glob pattern matching
    - Test pattern merging
    - Test CLI ignore patterns
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 7. Implement Logging System
  - [x] 7.1 Create Logger class with verbosity levels
    - Implement verbose logging (`--verbose`)
    - Implement debug logging (`--debug`)
    - Implement quiet mode (`--quiet`)
    - Log file scanning, pattern checking, and skipped files
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 7.2 Write unit tests for Logger
    - Test verbose output
    - Test debug output
    - Test quiet mode
    - Test log filtering
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8. Implement JSON Output Formatter
  - [x] 8.1 Create JSONOutputFormatter class
    - Implement `format()` method with proper JSON structure
    - Include all issue details, metadata, and summary
    - Support pretty printing
    - Include debug info when verbose
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 8.2 Write property test for JSON validity
    - **Property 9: JSON Output Validity**
    - **Validates: Requirements 6.1, 6.2**

  - [x] 8.3 Write unit tests for JSONOutputFormatter
    - Test JSON structure
    - Test pretty printing
    - Test metadata inclusion
    - Test debug info inclusion
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement Pattern Validator
  - [x] 10.1 Create PatternValidator class
    - Implement `validatePattern()` method
    - Implement `testPattern()` with positive/negative test cases
    - Implement `checkBacktracking()` using timeout detection
    - Validate all existing patterns at startup
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 10.2 Write property test for pattern compilation
    - **Property 11: Pattern Compilation**
    - **Validates: Requirements 7.4, 7.5**

  - [x] 10.3 Write unit tests for PatternValidator
    - Test pattern validation
    - Test positive/negative test cases
    - Test backtracking detection
    - Test pattern compilation errors
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 11. Implement Security Score Consistency
  - [x] 11.1 Update calculateSecurityScore() method
    - Ensure deterministic calculation
    - Document algorithm in code comments
    - Add score breakdown to output
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 11.2 Write property test for score consistency
    - **Property 5: Scan Determinism**
    - **Property 6: Score Consistency**
    - **Validates: Requirements 8.1, 8.2, 8.3**

  - [x] 11.3 Write unit tests for security score
    - Test score calculation formula
    - Test score determinism
    - Test score breakdown display
    - Test edge cases (no issues, all critical, etc.)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 12. Implement Memory Manager
  - [x] 12.1 Create MemoryManager class
    - Implement `getCurrentUsage()` using process.memoryUsage()
    - Implement `checkLimit()` with 500MB threshold
    - Implement `triggerGC()` at 400MB threshold
    - Track memory stats for debugging
    - _Requirements: 10.1, 10.2, 10.4, 10.5_

  - [x] 12.2 Write property test for memory limits
    - **Property 10: Memory Limit Enforcement**
    - **Validates: Requirements 10.1, 10.2**

  - [x] 12.3 Write unit tests for MemoryManager
    - Test memory usage tracking
    - Test GC triggering
    - Test limit enforcement
    - Test memory stats
    - _Requirements: 10.1, 10.2, 10.4, 10.5_

- [x] 13. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement Progress Reporter
  - [x] 14.1 Create ProgressReporter class using cli-progress
    - Implement `start()`, `update()`, `complete()` methods
    - Calculate ETA based on average scan time
    - Update at most once per 100ms
    - Clear progress bar before final output
    - Support `--no-progress` flag
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 14.2 Write property test for progress accuracy
    - **Property 8: Progress Reporting Accuracy**
    - **Validates: Requirements 11.1, 11.2**

  - [x] 14.3 Write unit tests for ProgressReporter
    - Test progress updates
    - Test ETA calculation
    - Test progress bar clearing
    - Test --no-progress flag
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 15. Implement Result Cache
  - [x] 15.1 Create ResultCache class
    - Implement `get()` and `set()` methods
    - Use file modification time + size as hash
    - Store cache in `.avana-cache` directory
    - Expire cache entries after 24 hours
    - Track cache hit rate
    - _Requirements: 2.3_

  - [x] 15.2 Write property test for cache correctness
    - **Property 14: Cache Correctness**
    - **Validates: Requirements 2.3**

  - [x] 15.3 Write unit tests for ResultCache
    - Test cache get/set
    - Test cache expiration
    - Test cache hit rate tracking
    - Test cache invalidation
    - _Requirements: 2.3_

- [x] 16. Implement Parallel Scanner
  - [x] 16.1 Create ParallelScanner class using worker threads
    - Implement `scanFiles()` with worker pool
    - Distribute files evenly across workers
    - Aggregate results from all workers
    - Handle worker errors gracefully
    - Default to CPU count - 1 workers
    - _Requirements: 2.2_

  - [x] 16.2 Write property test for parallel equivalence
    - **Property 13: Parallel Scan Equivalence**
    - **Validates: Requirements 2.2**

  - [x] 16.3 Write unit tests for ParallelScanner
    - Test worker pool creation
    - Test file distribution
    - Test result aggregation
    - Test worker error handling
    - _Requirements: 2.2_

- [x] 17. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 18. Implement Symbolic Link Handling
  - [x] 18.1 Add symbolic link detection to SecretScanner
    - Detect symbolic links using fs.lstat()
    - Follow links only if target is within scan directory
    - Detect and skip circular symbolic links
    - Log symbolic link handling in verbose mode
    - _Requirements: 1.5, 1.6_

  - [x] 18.2 Write property test for symbolic link safety
    - **Property 15: Symbolic Link Safety**
    - **Validates: Requirements 1.5, 1.6**

  - [x] 18.3 Write unit tests for symbolic link handling
    - Test link following within directory
    - Test link rejection outside directory
    - Test circular link detection
    - _Requirements: 1.5, 1.6_

- [x] 19. Implement Exit Code System
  - [x] 19.1 Update CLI to use proper exit codes
    - Exit 0 for no critical/high issues
    - Exit 1 for critical/high issues (or with --fail-on-high)
    - Exit 2 for invalid arguments
    - Exit 3 for unexpected errors
    - Document exit codes in README
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 19.2 Write property test for exit code correctness
    - **Property 12: Exit Code Correctness**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

  - [x] 19.3 Write unit tests for exit codes
    - Test exit code 0 (success)
    - Test exit code 1 (issues found)
    - Test exit code 2 (invalid usage)
    - Test exit code 3 (unexpected error)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [-] 20. Integrate all components into main Avana engine
  - [x] 20.1 Update Avana.scan() method
    - Integrate FileTypeDetector
    - Integrate FileStreamScanner for large files
    - Integrate IgnorePatternManager
    - Integrate ProgressReporter
    - Integrate ResultCache
    - Integrate ParallelScanner
    - Integrate MemoryManager
    - Integrate ErrorHandler
    - _Requirements: All_

  - [-] 20.2 Write integration tests
    - Test full scan workflow
    - Test large file handling
    - Test binary file exclusion
    - Test encoding handling
    - Test error recovery
    - Test progress reporting
    - Test caching
    - Test parallel scanning
    - _Requirements: All_

- [ ] 21. Update CLI commands
  - [ ] 21.1 Add new CLI flags
    - Add `--json` flag for JSON output
    - Add `--debug` flag for debug logging
    - Add `--quiet` flag for minimal output
    - Add `--no-progress` flag to disable progress bar
    - Add `--ignore <pattern>` flag for CLI ignore patterns
    - Add `--fail-on-high` flag to fail on high severity
    - Add `--max-memory <mb>` flag to set memory limit
    - Add `--workers <count>` flag to set worker count
    - Update help text with new flags
    - _Requirements: 4.3, 5.4, 5.5, 6.1, 11.3, 12.3_

  - [ ] 21.2 Write integration tests for CLI
    - Test all new flags
    - Test flag combinations
    - Test invalid flag values
    - Test help text
    - _Requirements: 4.3, 5.4, 5.5, 6.1, 11.3, 12.3_

- [ ] 22. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 23. Update documentation
  - [ ] 23.1 Update README.md
    - Document all new CLI flags
    - Document exit codes
    - Document `.avanaignore` file format
    - Document JSON output format
    - Document performance characteristics
    - Add troubleshooting section
    - _Requirements: All_

  - [ ] 23.2 Update GET_STARTED.md
    - Add examples for new features
    - Add performance tips
    - Add troubleshooting tips
    - _Requirements: All_

  - [ ] 23.3 Update DEVLOG.md
    - Document Milestone 5 completion
    - Document key decisions
    - Document challenges and solutions
    - _Requirements: All_

- [ ] 24. Performance validation
  - [ ] 24.1 Run performance benchmarks
    - Test 10,000 files in < 10 seconds
    - Test memory usage < 500MB
    - Test startup time < 100ms
    - Test cache hit rate > 80%
    - _Requirements: 2.1, 10.1_

  - [ ] 24.2 Optimize if needed
    - Profile slow operations
    - Optimize hot paths
    - Reduce memory allocations
    - _Requirements: 2.1, 10.1_

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end workflows
- Performance tests validate non-functional requirements
- All tests are required for comprehensive quality assurance

## Testing Summary

### Property-Based Tests (15 properties)
1. Binary File Exclusion (Req 1.1)
2. Large File Streaming (Req 1.2, 10.3)
3. Encoding Handling (Req 1.3, 9.4)
4. Permission Error Recovery (Req 1.4, 3.2)
5. Scan Determinism (Req 8.1, 8.2)
6. Score Consistency (Req 8.2, 8.3)
7. Ignore Pattern Effectiveness (Req 4.4)
8. Progress Reporting Accuracy (Req 11.1, 11.2)
9. JSON Output Validity (Req 6.1, 6.2)
10. Memory Limit Enforcement (Req 10.1, 10.2)
11. Pattern Compilation (Req 7.4, 7.5)
12. Exit Code Correctness (Req 12.1-12.5)
13. Parallel Scan Equivalence (Req 2.2)
14. Cache Correctness (Req 2.3)
15. Symbolic Link Safety (Req 1.5, 1.6)

### Unit Tests
- FileTypeDetector (binary, encoding, streaming)
- FileStreamScanner (chunks, overlap, line tracking)
- ErrorHandler (file errors, config errors, system errors)
- IgnorePatternManager (patterns, merging, matching)
- Logger (verbose, debug, quiet)
- JSONOutputFormatter (structure, pretty, metadata)
- PatternValidator (validation, testing, backtracking)
- MemoryManager (usage, limits, GC)
- ProgressReporter (updates, ETA, clearing)
- ResultCache (get/set, expiration, hit rate)
- ParallelScanner (workers, distribution, aggregation)
- Exit codes (0, 1, 2, 3)

### Integration Tests
- Full scan workflow
- Large file handling
- Binary file exclusion
- Encoding handling
- Error recovery
- Progress reporting
- Caching
- Parallel scanning
- CLI flags
- Git hooks

## Success Criteria

- ✅ All 14 requirements implemented
- ✅ All 15 property tests passing (100 iterations each)
- ✅ All unit tests passing (80%+ coverage)
- ✅ All integration tests passing
- ✅ Performance benchmarks met
- ✅ Documentation complete
- ✅ No critical bugs or issues
