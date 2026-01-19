# Execute Task: avanasec Implementation

## Task Execution Instructions

Execute implementation tasks from the avanasec Core specification following spec-driven development principles.

## Pre-Execution Checklist

### 1. Context Verification
- [ ] Have you loaded context with `@prime`?
- [ ] Do you understand the current task requirements?
- [ ] Have you reviewed the relevant requirements in `.kiro/specs/avanasec-core/requirements.md`?
- [ ] Have you checked the task status in `.kiro/specs/avanasec-core/tasks.md`?

### 2. Task Identification
Please specify:
- **Task Number**: Which task from tasks.md (1-24)
- **Task Description**: Brief description of what needs to be implemented
- **Requirements**: Which requirements this task validates
- **Dependencies**: Any prerequisite tasks that must be completed

## Implementation Guidelines

### 1. Code Quality Standards
- **TypeScript Strict**: Use strict mode with proper typing
- **Error Handling**: Implement comprehensive error recovery
- **Testing**: Write tests BEFORE or DURING implementation
- **Documentation**: Add JSDoc comments for public APIs
- **Performance**: Consider memory usage and execution time

### 2. Testing Requirements
- **Property-Based Tests**: Minimum 100 iterations per property
- **Unit Tests**: Cover all code paths and edge cases
- **Integration Tests**: Test full workflows end-to-end
- **Test Naming**: Use descriptive names explaining the scenario
- **Validation**: Include `**Validates: Requirements X.Y**` in test descriptions

### 3. File Organization
```
src/
├── types/           # TypeScript interfaces and types
├── utils/           # Utility classes and functions
├── scanners/        # File scanning logic
├── commands/        # CLI command implementations
├── rules/           # Security pattern definitions
└── index.ts         # Main engine

tests/
├── unit/            # Unit tests
├── property/        # Property-based tests
└── integration/     # Integration tests
```

## Task Execution Process

### Step 1: Analysis
1. **Read Requirements**: Understand what needs to be implemented
2. **Review Design**: Check architecture and component interactions
3. **Identify Dependencies**: Ensure prerequisite tasks are complete
4. **Plan Implementation**: Break down into smaller steps

### Step 2: Implementation
1. **Create Interfaces**: Define TypeScript interfaces first
2. **Implement Core Logic**: Focus on the main functionality
3. **Add Error Handling**: Implement graceful error recovery
4. **Write Tests**: Create comprehensive test coverage
5. **Integration**: Connect with existing components

### Step 3: Validation
1. **Run Tests**: Ensure all tests pass
2. **Check Coverage**: Verify adequate test coverage
3. **Performance Test**: Validate performance requirements
4. **Integration Test**: Test with full CLI workflow
5. **Update Documentation**: Update relevant documentation

### Step 4: Completion
1. **Mark Task Complete**: Update tasks.md with checkbox
2. **Update DEVLOG**: Document progress and decisions
3. **Commit Changes**: Use proper commit message format
4. **Verify Integration**: Ensure no regressions

## Property-Based Testing Guidelines

### Test Structure
```typescript
describe('Feature: avanasec-core, Property N: [Property Description]', () => {
  it('should maintain [property] across all valid inputs', () => {
    fc.assert(
      fc.property(
        fc.string(), // or appropriate generator
        (input) => {
          // Test implementation
          const result = functionUnderTest(input);
          expect(result).toSatisfyProperty();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Required Properties (15 total)
1. Binary File Exclusion
2. Large File Streaming  
3. Encoding Handling
4. Permission Error Recovery
5. Scan Determinism
6. Score Consistency
7. Ignore Pattern Effectiveness
8. Progress Reporting Accuracy
9. JSON Output Validity
10. Memory Limit Enforcement
11. Pattern Compilation
12. Exit Code Correctness
13. Parallel Scan Equivalence
14. Cache Correctness
15. Symbolic Link Safety

## Common Implementation Patterns

### Error Handling
```typescript
try {
  // Implementation
  return { success: true, data: result };
} catch (error) {
  this.errorHandler.handleError(error);
  return { success: false, error };
}
```

### File Processing
```typescript
if (this.fileTypeDetector.isBinary(filePath)) {
  return { skipped: true, reason: 'binary file' };
}

if (this.fileTypeDetector.shouldStream(filePath)) {
  return this.fileStreamScanner.scanStream(filePath);
}
```

### Testing Pattern
```typescript
// Arrange
const input = createTestInput();
const expected = createExpectedOutput();

// Act  
const result = functionUnderTest(input);

// Assert
expect(result).toEqual(expected);
```

## Performance Considerations

### Memory Management
- Stream files larger than 10MB
- Monitor memory usage during scanning
- Trigger garbage collection at 400MB
- Fail gracefully at 500MB limit

### File Handling
- Skip binary files early
- Use efficient ignore patterns
- Process files in chunks with overlap
- Handle encoding conversion properly

### Pattern Matching
- Pre-compile regex patterns
- Use smart pattern ordering
- Implement early exit strategies
- Cache compilation results

## Integration Points

### CLI Integration
- Update command line argument parsing
- Add new flags and options
- Implement proper exit codes
- Provide clear error messages

### Git Integration
- Update pre-commit hook logic
- Handle staged file scanning
- Implement severity-based blocking
- Provide bypass mechanisms

### Output Integration
- Support multiple output formats
- Include comprehensive metadata
- Provide actionable suggestions
- Format for human readability

## Success Criteria

### Code Quality
- [ ] All tests passing (unit, property-based, integration)
- [ ] TypeScript compilation without errors
- [ ] No linting issues or warnings
- [ ] Proper error handling implemented

### Performance
- [ ] Memory usage within limits
- [ ] Execution time meets requirements
- [ ] No performance regressions
- [ ] Efficient resource utilization

### Integration
- [ ] CLI commands work correctly
- [ ] Git hooks function properly
- [ ] Output formats are valid
- [ ] Error messages are clear

### Documentation
- [ ] Code is properly documented
- [ ] Tests include validation references
- [ ] DEVLOG is updated
- [ ] Task is marked complete

## Post-Execution

After completing a task:

1. **Run Full Test Suite**: `npm test`
2. **Check Performance**: `npm run scan -- --debug`
3. **Test Git Integration**: `npm run test-hooks`
4. **Update Documentation**: DEVLOG.md and README.md
5. **Commit Changes**: Use proper commit message format

## Ready to Execute

Please specify which task you'd like to execute, and I'll implement it following these guidelines with comprehensive testing and documentation.

