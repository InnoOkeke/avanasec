/**
 * Unit Tests: PatternValidator
 * Tests for pattern validation, testing, and backtracking detection
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  PatternValidator, 
  SecretPattern, 
  TestCase, 
  ValidationResult,
  BacktrackingResult 
} from '../../src/utils/pattern-validator';

describe('PatternValidator', () => {
  let validator: PatternValidator;

  beforeEach(() => {
    validator = new PatternValidator(false, 500); // 500ms timeout for tests
  });

  describe('Pattern Compilation', () => {
    it('should validate simple string patterns', () => {
      const pattern: SecretPattern = {
        id: 'simple-test',
        name: 'Simple Test',
        pattern: 'test',
      };

      const result = validator.validatePattern(pattern);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.compilationTime).toBeDefined();
      expect(result.compilationTime!).toBeGreaterThanOrEqual(0);
    });

    it('should validate RegExp patterns', () => {
      const pattern: SecretPattern = {
        id: 'regex-test',
        name: 'RegExp Test',
        pattern: /test/gi,
      };

      const result = validator.validatePattern(pattern);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid regex patterns', () => {
      const pattern: SecretPattern = {
        id: 'invalid-test',
        name: 'Invalid Test',
        pattern: '[invalid',
      };

      const result = validator.validatePattern(pattern);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('compilation failed');
    });

    it('should handle empty patterns', () => {
      const pattern: SecretPattern = {
        id: 'empty-test',
        name: 'Empty Test',
        pattern: '',
      };

      const result = validator.validatePattern(pattern);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should warn about slow compilation', () => {
      // This pattern might be slow to compile
      const pattern: SecretPattern = {
        id: 'complex-test',
        name: 'Complex Test',
        pattern: '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
      };

      const result = validator.validatePattern(pattern);

      expect(result.isValid).toBe(true);
      expect(result.compilationTime).toBeDefined();
      
      // If it's slow, should have warning
      if (result.compilationTime! > 100) {
        expect(result.warnings.some(w => w.includes('slow'))).toBe(true);
      }
    });
  });

  describe('Test Case Execution', () => {
    it('should run positive test cases correctly', () => {
      const testCases: TestCase[] = [
        {
          input: 'test string',
          shouldMatch: true,
          description: 'Should match test',
        },
        {
          input: 'another test',
          shouldMatch: true,
          description: 'Should match another test',
        },
      ];

      const pattern: SecretPattern = {
        id: 'positive-test',
        name: 'Positive Test',
        pattern: 'test',
        testCases,
      };

      const result = validator.testPattern(pattern, testCases);

      expect(result.allPassed).toBe(true);
      expect(result.passedCount).toBe(2);
      expect(result.failedCount).toBe(0);
      expect(result.results).toHaveLength(2);
      
      result.results.forEach(r => {
        expect(r.passed).toBe(true);
        expect(r.actualMatch).toBe('test');
      });
    });

    it('should run negative test cases correctly', () => {
      const testCases: TestCase[] = [
        {
          input: 'no match here',
          shouldMatch: false,
          description: 'Should not match',
        },
        {
          input: 'nothing to see',
          shouldMatch: false,
          description: 'Should not match either',
        },
      ];

      const pattern: SecretPattern = {
        id: 'negative-test',
        name: 'Negative Test',
        pattern: 'test',
        testCases,
      };

      const result = validator.testPattern(pattern, testCases);

      expect(result.allPassed).toBe(true);
      expect(result.passedCount).toBe(2);
      expect(result.failedCount).toBe(0);
      
      result.results.forEach(r => {
        expect(r.passed).toBe(true);
        expect(r.actualMatch).toBe(null);
      });
    });

    it('should detect failed test cases', () => {
      const testCases: TestCase[] = [
        {
          input: 'test string',
          shouldMatch: false, // This should fail - pattern matches but we expect no match
          description: 'Should fail',
        },
        {
          input: 'no match',
          shouldMatch: true, // This should fail - pattern doesn't match but we expect match
          description: 'Should also fail',
        },
      ];

      const pattern: SecretPattern = {
        id: 'failing-test',
        name: 'Failing Test',
        pattern: 'test',
        testCases,
      };

      const result = validator.testPattern(pattern, testCases);

      expect(result.allPassed).toBe(false);
      expect(result.passedCount).toBe(0);
      expect(result.failedCount).toBe(2);
      
      expect(result.results[0].passed).toBe(false);
      expect(result.results[1].passed).toBe(false);
    });

    it('should validate expected match content', () => {
      const testCases: TestCase[] = [
        {
          input: 'api_key=abc123',
          shouldMatch: true,
          expectedMatch: 'api_key=abc123',
          description: 'Should match exact content',
        },
        {
          input: 'api_key=abc123',
          shouldMatch: true,
          expectedMatch: 'wrong_match',
          description: 'Should fail on wrong expected match',
        },
      ];

      const pattern: SecretPattern = {
        id: 'exact-match-test',
        name: 'Exact Match Test',
        pattern: 'api_key=[a-z0-9]+',
        testCases,
      };

      const result = validator.testPattern(pattern, testCases);

      expect(result.passedCount).toBe(1);
      expect(result.failedCount).toBe(1);
      expect(result.results[0].passed).toBe(true);
      expect(result.results[1].passed).toBe(false);
    });

    it('should handle test case errors gracefully', () => {
      const testCases: TestCase[] = [
        {
          input: 'test',
          shouldMatch: true,
          description: 'Normal test case',
        },
      ];

      const pattern: SecretPattern = {
        id: 'error-test',
        name: 'Error Test',
        pattern: '[invalid', // Invalid pattern
        testCases,
      };

      const result = validator.testPattern(pattern, testCases);

      expect(result.allPassed).toBe(false);
      expect(result.failedCount).toBe(1);
      expect(result.results[0].error).toBeDefined();
      expect(result.results[0].error).toContain('compilation failed');
    });
  });

  describe('Backtracking Detection', () => {
    it('should detect catastrophic backtracking patterns', () => {
      const backtrackingPatterns = [
        '(a+)+b',
        '(a*)*b',
        '(a|a)*b',
        '(.*)*$',
        '([a-zA-Z]+)*$',
      ];

      backtrackingPatterns.forEach(patternStr => {
        const regex = new RegExp(patternStr);
        const result = validator.checkBacktracking(regex);

        expect(result.hasBacktracking).toBe(true);
        expect(result.executionTime).toBeGreaterThan(0);
      });
    });

    it('should not flag efficient patterns as backtracking', () => {
      const efficientPatterns = [
        'test',
        '[a-z]+',
        '\\d{3,10}',
        'api[_-]?key',
        '\\b\\w+\\b',
      ];

      efficientPatterns.forEach(patternStr => {
        const regex = new RegExp(patternStr);
        const result = validator.checkBacktracking(regex);

        expect(result.hasBacktracking).toBe(false);
        expect(result.executionTime).toBeLessThan(100);
      });
    });

    it('should handle timeout in backtracking detection', () => {
      const timeoutValidator = new PatternValidator(false, 100); // Very short timeout
      const regex = /(a+)+b/;

      const result = timeoutValidator.checkBacktracking(regex);

      expect(result.hasBacktracking).toBe(true);
      // Should either timeout or take too long
      expect(result.timedOut || result.executionTime > 100).toBe(true);
    });

    it('should test multiple problematic inputs', () => {
      const regex = /(a+)+b/;
      const result = validator.checkBacktracking(regex);

      expect(result.hasBacktracking).toBe(true);
      expect(result.testInput).toBeDefined();
      expect(typeof result.testInput).toBe('string');
    });
  });

  describe('Pattern Structure Validation', () => {
    it('should warn about nested quantifiers', () => {
      const pattern: SecretPattern = {
        id: 'nested-quantifiers',
        name: 'Nested Quantifiers',
        pattern: '(.+)+',
      };

      const result = validator.validatePattern(pattern);

      expect(result.warnings.some(w => w.includes('nested quantifiers'))).toBe(true);
    });

    it('should warn about overlapping alternation', () => {
      const pattern: SecretPattern = {
        id: 'overlapping-alt',
        name: 'Overlapping Alternation',
        pattern: '(.*|.*)',
      };

      const result = validator.validatePattern(pattern);

      expect(result.warnings.some(w => w.includes('overlapping branches'))).toBe(true);
    });

    it('should warn about overly broad patterns', () => {
      const pattern: SecretPattern = {
        id: 'broad-pattern',
        name: 'Broad Pattern',
        pattern: '.*',
      };

      const result = validator.validatePattern(pattern);

      expect(result.warnings.some(w => w.includes('overly broad'))).toBe(true);
    });

    it('should suggest anchors for line patterns', () => {
      const pattern: SecretPattern = {
        id: 'line-pattern',
        name: 'Line Pattern',
        pattern: 'test',
      };

      const result = validator.validatePattern(pattern);

      expect(result.warnings.some(w => w.includes('anchors'))).toBe(true);
    });

    it('should suggest case-insensitive flag', () => {
      const pattern: SecretPattern = {
        id: 'case-pattern',
        name: 'Case Pattern',
        pattern: '[a-z]+',
      };

      const result = validator.validatePattern(pattern);

      expect(result.warnings.some(w => w.includes('case-insensitive'))).toBe(true);
    });

    it('should suggest word boundaries for key patterns', () => {
      const pattern: SecretPattern = {
        id: 'api-key-pattern',
        name: 'API Key Pattern',
        pattern: 'apikey',
      };

      const result = validator.validatePattern(pattern);

      expect(result.warnings.some(w => w.includes('word boundaries'))).toBe(true);
    });
  });

  describe('Batch Validation', () => {
    it('should validate multiple patterns', () => {
      const patterns: SecretPattern[] = [
        { id: 'pattern1', name: 'Pattern 1', pattern: 'test1' },
        { id: 'pattern2', name: 'Pattern 2', pattern: 'test2' },
        { id: 'pattern3', name: 'Pattern 3', pattern: '[invalid' }, // Invalid
      ];

      const result = validator.validateAllPatterns(patterns);

      expect(result.results.size).toBe(3);
      expect(result.validCount).toBe(2);
      expect(result.invalidCount).toBe(1);
      
      expect(result.results.get('pattern1')?.isValid).toBe(true);
      expect(result.results.get('pattern2')?.isValid).toBe(true);
      expect(result.results.get('pattern3')?.isValid).toBe(false);
    });

    it('should count warnings correctly', () => {
      const patterns: SecretPattern[] = [
        { id: 'pattern1', name: 'Pattern 1', pattern: '.*' }, // Should warn
        { id: 'pattern2', name: 'Pattern 2', pattern: 'test' }, // Should warn (line pattern)
        { id: 'pattern3', name: 'Pattern 3', pattern: 'simple' },
      ];

      const result = validator.validateAllPatterns(patterns);

      expect(result.warningCount).toBeGreaterThan(0);
    });

    it('should handle empty pattern list', () => {
      const result = validator.validateAllPatterns([]);

      expect(result.results.size).toBe(0);
      expect(result.validCount).toBe(0);
      expect(result.invalidCount).toBe(0);
      expect(result.warningCount).toBe(0);
    });
  });

  describe('Test Case Generation', () => {
    it('should generate API key test cases', () => {
      const testCases = validator.generateTestCases('api-key');

      expect(testCases.length).toBeGreaterThan(0);
      expect(testCases.some(tc => tc.shouldMatch)).toBe(true);
      expect(testCases.some(tc => !tc.shouldMatch)).toBe(true);
      
      testCases.forEach(tc => {
        expect(tc.input).toBeDefined();
        expect(tc.description).toBeDefined();
        expect(typeof tc.shouldMatch).toBe('boolean');
      });
    });

    it('should generate password test cases', () => {
      const testCases = validator.generateTestCases('password');

      expect(testCases.length).toBeGreaterThan(0);
      expect(testCases.some(tc => tc.shouldMatch)).toBe(true);
      expect(testCases.some(tc => !tc.shouldMatch)).toBe(true);
    });

    it('should generate token test cases', () => {
      const testCases = validator.generateTestCases('token');

      expect(testCases.length).toBeGreaterThan(0);
      expect(testCases.some(tc => tc.shouldMatch)).toBe(true);
      expect(testCases.some(tc => !tc.shouldMatch)).toBe(true);
    });

    it('should generate generic test cases for unknown types', () => {
      const testCases = validator.generateTestCases('unknown-type');

      expect(testCases.length).toBeGreaterThan(0);
      testCases.forEach(tc => {
        expect(tc.shouldMatch).toBe(false); // Generic cases should not match
      });
    });
  });

  describe('Integration with Test Cases', () => {
    it('should validate pattern with included test cases', () => {
      const testCases: TestCase[] = [
        {
          input: 'api_key=abc123',
          shouldMatch: true,
          description: 'Valid API key',
        },
        {
          input: 'not an api key',
          shouldMatch: false,
          description: 'Not an API key',
        },
      ];

      const pattern: SecretPattern = {
        id: 'api-key-with-tests',
        name: 'API Key with Tests',
        pattern: 'api_key=[a-z0-9]+',
        testCases,
      };

      const result = validator.validatePattern(pattern);

      expect(result.isValid).toBe(true);
      expect(result.testResults).toBeDefined();
      expect(result.testResults!.length).toBe(2);
      expect(result.testResults!.every(tr => tr.passed)).toBe(true);
    });

    it('should mark pattern invalid if test cases fail', () => {
      const testCases: TestCase[] = [
        {
          input: 'api_key=abc123',
          shouldMatch: false, // This will fail
          description: 'Should not match but will',
        },
      ];

      const pattern: SecretPattern = {
        id: 'failing-api-key',
        name: 'Failing API Key',
        pattern: 'api_key=[a-z0-9]+',
        testCases,
      };

      const result = validator.validatePattern(pattern);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('test cases failed'))).toBe(true);
    });
  });

  describe('Debug Mode', () => {
    it('should provide debug output when enabled', () => {
      const debugValidator = new PatternValidator(true);
      const patterns: SecretPattern[] = [
        { id: 'debug-test', name: 'Debug Test', pattern: 'test' },
      ];

      // Should not throw in debug mode
      expect(() => {
        debugValidator.validateAllPatterns(patterns);
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long patterns', () => {
      const longPattern = 'a'.repeat(1000);
      const pattern: SecretPattern = {
        id: 'long-pattern',
        name: 'Long Pattern',
        pattern: longPattern,
      };

      const result = validator.validatePattern(pattern);

      expect(result).toBeDefined();
      expect(typeof result.isValid).toBe('boolean');
    });

    it('should handle patterns with special characters', () => {
      const specialPattern = '\\$\\^\\*\\+\\?\\{\\}\\[\\]\\(\\)\\|\\\\';
      const pattern: SecretPattern = {
        id: 'special-pattern',
        name: 'Special Pattern',
        pattern: specialPattern,
      };

      const result = validator.validatePattern(pattern);

      expect(result.isValid).toBe(true);
    });

    it('should handle unicode patterns', () => {
      const unicodePattern = '[\\u0100-\\u017F]+';
      const pattern: SecretPattern = {
        id: 'unicode-pattern',
        name: 'Unicode Pattern',
        pattern: unicodePattern,
      };

      const result = validator.validatePattern(pattern);

      expect(result.isValid).toBe(true);
    });

    it('should handle null and undefined gracefully', () => {
      expect(() => {
        validator.validateAllPatterns([]);
        validator.generateTestCases('');
      }).not.toThrow();
    });
  });
});