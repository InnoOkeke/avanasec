# Avana Test Suite

This directory contains the comprehensive test suite for Avana, including unit tests, property-based tests, integration tests, and performance benchmarks.

## Directory Structure

```
tests/
├── unit/                   # Unit tests for individual components
├── property/               # Property-based tests using fast-check
├── integration/            # Integration tests for workflows
├── performance/            # Performance benchmarks
├── fixtures/               # Test fixtures and sample files
└── helpers/                # Test utilities and generators
    ├── test-utils.ts       # Helper functions for testing
    └── generators.ts       # Property test generators
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test tests/unit/file-type-detector.test.ts

# Run tests matching pattern
npm test -- --grep "Binary"
```

## Test Types

### Unit Tests

Unit tests verify individual components and functions in isolation.

**Location**: `tests/unit/`

**Example**:
```typescript
describe('FileTypeDetector', () => {
  it('should detect binary files', () => {
    const detector = new FileTypeDetector();
    expect(detector.isBinary('image.png')).toBe(true);
  });
});
```

### Property-Based Tests

Property-based tests verify universal properties across many generated inputs.

**Location**: `tests/property/`

**Requirements**:
- Minimum 100 iterations per test
- Tagged with feature and property reference
- Use smart generators from `helpers/generators.ts`

**Example**:
```typescript
describe('Feature: avana-core, Property 1: Binary File Exclusion', () => {
  it('should exclude binary files from scanning', () => {
    fc.assert(
      fc.property(binaryContentArb, (content) => {
        // Test that binary files are excluded
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
```

### Integration Tests

Integration tests verify end-to-end workflows and component interactions.

**Location**: `tests/integration/`

**Example**:
```typescript
describe('Full Scan Workflow', () => {
  it('should scan project and report issues', async () => {
    const avana = new Avana();
    const result = await avana.scan({ path: './test-project' });
    expect(result.success).toBe(true);
  });
});
```

### Performance Tests

Performance tests verify that Avana meets performance requirements.

**Location**: `tests/performance/`

**Requirements**:
- 10,000 files in < 10 seconds
- Memory usage < 500MB
- Startup time < 100ms
- Cache hit rate > 80%

**Example**:
```typescript
describe('Performance Benchmarks', () => {
  it('should scan 10,000 files in under 10 seconds', async () => {
    const start = Date.now();
    await avana.scan({ path: './large-project' });
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(10000);
  });
});
```

## Test Utilities

### Helper Functions

Located in `helpers/test-utils.ts`:

- `createTempDir()` - Create temporary directory
- `createTempFile()` - Create temporary file with content
- `createBinaryFile()` - Create binary file for testing
- `createLargeFile()` - Create large file for streaming tests
- `createEncodedFile()` - Create file with specific encoding
- `cleanupTempDir()` - Clean up temporary directory
- `assertHasIssue()` - Assert scan result contains issue
- `assertNoIssue()` - Assert scan result doesn't contain issue

### Generators

Located in `helpers/generators.ts`:

- `filePathArb` - Generate valid file paths
- `fileContentArb` - Generate file content
- `binaryContentArb` - Generate binary content
- `severityArb` - Generate severity levels
- `securityIssueArb` - Generate security issues
- `secretArb` - Generate valid secrets for testing
- `cleanFileContentArb` - Generate clean file content

## Writing Tests

### Unit Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { ComponentName } from '../../src/path/to/component';

describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something', () => {
      // Arrange
      const component = new ComponentName();
      
      // Act
      const result = component.methodName();
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Property Test Template

```typescript
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { generatorArb } from '../helpers/generators';

describe('Feature: avana-core, Property N: Property Name', () => {
  it('should maintain property across all inputs', () => {
    fc.assert(
      fc.property(generatorArb, (input) => {
        // Test property
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
```

## Coverage Goals

- **Overall**: 80%+ code coverage
- **Unit Tests**: Cover all public methods
- **Property Tests**: Cover all correctness properties
- **Integration Tests**: Cover all workflows
- **Performance Tests**: Validate all benchmarks

## Continuous Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Every pull request (GitHub Actions)
- Before npm publish

## Troubleshooting

### Tests Failing

```bash
# Run tests with verbose output
npm test -- --reporter=verbose

# Run specific test file
npm test tests/unit/failing-test.test.ts

# Run tests in watch mode for debugging
npm run test:watch
```

### Coverage Issues

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html
```

### Property Test Failures

When a property test fails, fast-check provides a counterexample:

```
Property failed after 42 tests
Counterexample: ["input that caused failure"]
```

Use this counterexample to:
1. Understand why the property failed
2. Fix the bug or adjust the property
3. Add a unit test for the specific case

## Best Practices

1. **Write tests first** (TDD approach)
2. **Keep tests focused** (one assertion per test when possible)
3. **Use descriptive names** (explain what is being tested)
4. **Clean up resources** (temp files, directories)
5. **Mock external dependencies** (file system, network)
6. **Use generators wisely** (constrain to valid input space)
7. **Run tests frequently** (catch issues early)
8. **Maintain high coverage** (aim for 80%+)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [fast-check Documentation](https://fast-check.dev/)
- [Property-Based Testing Guide](https://fast-check.dev/docs/introduction/)
- [Testing Best Practices](https://testingjavascript.com/)
