/**
 * Property Tests: Pattern Compilation
 * Feature: avana-core, Property 11: Pattern Compilation
 * Validates: Requirements 7.4, 7.5
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { PatternValidator, SecretPattern, TestCase } from '../../src/utils/pattern-validator';

describe('Feature: avana-core, Property 11: Pattern Compilation', () => {
  let validator: PatternValidator;

  beforeEach(() => {
    validator = new PatternValidator(false, 500); // 500ms timeout for tests
  });

  it('should compile all valid regex patterns without errors', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Simple patterns
          fc.constantFrom(
            'test',
            '[a-z]+',
            '\\d{3,10}',
            '[A-Za-z0-9_-]+',
            '(api|key|token)',
            '\\b\\w+\\b'
          ),
          // More complex but safe patterns
          fc.constantFrom(
            '(?:api[_-]?key|apikey)\\s*[:=]\\s*["\']?([a-zA-Z0-9_-]{20,})["\']?',
            '(?:password|pwd|pass)\\s*[:=]\\s*["\']?([^\\s"\']{4,})["\']?',
            '(?:token|access[_-]?token)\\s*[:=]\\s*["\']?([a-zA-Z0-9._-]{10,})["\']?',
            'sk_[a-z]+_[a-zA-Z0-9]{24,}',
            'ghp_[a-zA-Z0-9]{36}',
            'xoxb-[0-9]{11,12}-[0-9]{11,12}-[a-zA-Z0-9]{24}'
          )
        ),
        (patternStr) => {
          const pattern: SecretPattern = {
            id: 'test-pattern',
            name: 'Test Pattern',
            pattern: patternStr,
          };

          const result = validator.validatePattern(pattern);
          
          // Pattern should compile successfully
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
          
          // Compilation time should be reasonable
          expect(result.compilationTime).toBeDefined();
          expect(result.compilationTime!).toBeLessThan(1000);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should detect invalid regex patterns', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '[',          // Unclosed character class
          '(',          // Unclosed group
          '*',          // Invalid quantifier
          '+',          // Invalid quantifier
          '?',          // Invalid quantifier
          '\\',         // Trailing backslash
          '[z-a]',      // Invalid range
          '(?P<name>)', // Invalid named group syntax
          '\\k<name>',  // Invalid backreference
          '(?<=.*)',    // Lookbehind with variable length
        ),
        (invalidPattern) => {
          const pattern: SecretPattern = {
            id: 'invalid-pattern',
            name: 'Invalid Pattern',
            pattern: invalidPattern,
          };

          const result = validator.validatePattern(pattern);
          
          // Pattern should be invalid
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
          expect(result.errors[0]).toContain('compilation failed');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should detect catastrophic backtracking patterns', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          // Known backtracking patterns
          '(a+)+b',
          '(a*)*b',
          '(a|a)*b',
          '(a+)+$',
          '(.*)*$',
          '([a-zA-Z]+)*$',
          '(a|a|a)*b',
          '(a+a+)+b',
          '(a*a*)*b'
        ),
        (backtrackingPattern) => {
          const pattern: SecretPattern = {
            id: 'backtracking-pattern',
            name: 'Backtracking Pattern',
            pattern: backtrackingPattern,
          };

          const result = validator.validatePattern(pattern);
          
          // Pattern should be flagged as having backtracking issues
          expect(result.isValid).toBe(false);
          expect(result.errors.some(error => 
            error.includes('backtracking') || error.includes('execution time')
          )).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate patterns with test cases correctly', () => {
    fc.assert(
      fc.property(
        fc.record({
          pattern: fc.constantFrom('test', 'hello', 'world', '[0-9]+', '[a-z]+'),
          positiveInput: fc.string({ minLength: 1, maxLength: 20 }),
          negativeInput: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        ({ pattern: patternStr, positiveInput, negativeInput }) => {
          // Create test cases
          const testCases: TestCase[] = [];
          
          // Add positive test case if input matches pattern
          try {
            const regex = new RegExp(patternStr, 'gi');
            if (regex.test(positiveInput)) {
              testCases.push({
                input: positiveInput,
                shouldMatch: true,
                description: 'Should match',
              });
            }
            
            // Reset regex
            regex.lastIndex = 0;
            if (!regex.test(negativeInput)) {
              testCases.push({
                input: negativeInput,
                shouldMatch: false,
                description: 'Should not match',
              });
            }
          } catch {
            // Skip invalid patterns
            return;
          }

          if (testCases.length === 0) {
            return; // Skip if no valid test cases
          }

          const pattern: SecretPattern = {
            id: 'test-with-cases',
            name: 'Test With Cases',
            pattern: patternStr,
            testCases,
          };

          const result = validator.validatePattern(pattern);
          
          // Should not throw during validation
          expect(result).toBeDefined();
          expect(result.testResults).toBeDefined();
          expect(result.testResults!.length).toBe(testCases.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty and whitespace patterns gracefully', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('', '   ', '\t', '\n', '  \t\n  '),
        (emptyPattern) => {
          const pattern: SecretPattern = {
            id: 'empty-pattern',
            name: 'Empty Pattern',
            pattern: emptyPattern,
          };

          // Should not throw
          expect(() => {
            const result = validator.validatePattern(pattern);
            expect(result).toBeDefined();
          }).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate patterns with different flags consistently', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('test', 'hello', '[a-z]+', '\\d+', 'api[_-]?key'),
        (patternStr) => {
          const pattern1: SecretPattern = {
            id: 'pattern-1',
            name: 'Pattern 1',
            pattern: patternStr,
          };

          const pattern2: SecretPattern = {
            id: 'pattern-2',
            name: 'Pattern 2',
            pattern: new RegExp(patternStr, 'gi'),
          };

          const result1 = validator.validatePattern(pattern1);
          const result2 = validator.validatePattern(pattern2);
          
          // Both should have same validity (both valid or both invalid)
          expect(result1.isValid).toBe(result2.isValid);
          
          // If invalid, both should have errors
          if (!result1.isValid) {
            expect(result1.errors.length).toBeGreaterThan(0);
            expect(result2.errors.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should detect performance issues in pattern compilation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          // Patterns that might be slow to compile
          '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
          '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
          '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
          '(?:api[_-]?key|apikey|api[_-]?secret|apisecret)\\s*[:=]\\s*["\']?([a-zA-Z0-9_-]{10,})["\']?',
          '(?:password|pwd|pass|secret)\\s*[:=]\\s*["\']?([^\\s"\'\\n\\r]{4,})["\']?'
        ),
        (complexPattern) => {
          const pattern: SecretPattern = {
            id: 'complex-pattern',
            name: 'Complex Pattern',
            pattern: complexPattern,
          };

          const result = validator.validatePattern(pattern);
          
          // Should compile successfully
          expect(result.isValid).toBe(true);
          
          // Should track compilation time
          expect(result.compilationTime).toBeDefined();
          expect(result.compilationTime!).toBeGreaterThanOrEqual(0);
          
          // Should warn if compilation is slow
          if (result.compilationTime! > 100) {
            expect(result.warnings.some(warning => 
              warning.includes('compilation took') && warning.includes('slow')
            )).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate multiple patterns without interference', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            pattern: fc.constantFrom('test', '[a-z]+', '\\d+', 'hello', 'world'),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (patternData) => {
          const patterns: SecretPattern[] = patternData.map((data, index) => ({
            id: `pattern-${index}-${data.id}`,
            name: `Pattern ${index}`,
            pattern: data.pattern,
          }));

          const result = validator.validateAllPatterns(patterns);
          
          // Should validate all patterns
          expect(result.results.size).toBe(patterns.length);
          expect(result.validCount + result.invalidCount).toBe(patterns.length);
          
          // Each pattern should have a result
          patterns.forEach(pattern => {
            expect(result.results.has(pattern.id)).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});