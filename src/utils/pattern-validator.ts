/**
 * Pattern Validator
 * Validates and tests all detection patterns for correctness and performance
 */

/**
 * Validation result for a pattern
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  compilationTime?: number;
  testResults?: TestResult[];
}

/**
 * Test case for pattern validation
 */
export interface TestCase {
  input: string;
  shouldMatch: boolean;
  description: string;
  expectedMatch?: string; // Expected matched text
}

/**
 * Result of running test cases against a pattern
 */
export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualMatch: string | null;
  error?: string;
}

/**
 * Pattern definition for validation
 */
export interface SecretPattern {
  id: string;
  name: string;
  pattern: string | RegExp;
  description?: string;
  testCases?: TestCase[];
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Backtracking detection result
 */
export interface BacktrackingResult {
  hasBacktracking: boolean;
  executionTime: number;
  timedOut: boolean;
  testInput?: string;
}

/**
 * Pattern Validator class
 * Validates regex patterns for correctness, performance, and security
 */
export class PatternValidator {
  private debugMode: boolean = false;
  private backtrackingTimeout: number = 1000; // 1 second timeout

  constructor(debugMode: boolean = false, backtrackingTimeout: number = 1000) {
    this.debugMode = debugMode;
    this.backtrackingTimeout = backtrackingTimeout;
  }

  /**
   * Validate a pattern for correctness and compilation
   */
  public validatePattern(pattern: SecretPattern): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    try {
      // Measure compilation time
      const startTime = Date.now();
      const regex = this.compilePattern(pattern);
      const compilationTime = Date.now() - startTime;
      result.compilationTime = compilationTime;

      // Warn about slow compilation
      if (compilationTime > 100) {
        result.warnings.push(`Pattern compilation took ${compilationTime}ms (slow)`);
      }

      // Check for catastrophic backtracking
      const backtrackingResult = this.checkBacktracking(regex);
      if (backtrackingResult.hasBacktracking) {
        result.errors.push(
          `Pattern has catastrophic backtracking (execution time: ${backtrackingResult.executionTime}ms)`
        );
        result.isValid = false;
      }

      // Run test cases if provided
      if (pattern.testCases && pattern.testCases.length > 0) {
        const testResults = this.testPattern(pattern, pattern.testCases);
        result.testResults = testResults.results;
        
        if (!testResults.allPassed) {
          result.errors.push(`${testResults.failedCount} test cases failed`);
          result.isValid = false;
        }
      }

      // Validate pattern structure
      this.validatePatternStructure(pattern, regex, result);

    } catch (error) {
      result.isValid = false;
      result.errors.push(`Pattern compilation failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Test a pattern against positive and negative test cases
   */
  public testPattern(pattern: SecretPattern, testCases: TestCase[]): {
    results: TestResult[];
    allPassed: boolean;
    passedCount: number;
    failedCount: number;
  } {
    const results: TestResult[] = [];
    let passedCount = 0;
    let failedCount = 0;

    try {
      const regex = this.compilePattern(pattern);

      for (const testCase of testCases) {
        const result = this.runTestCase(regex, testCase);
        results.push(result);

        if (result.passed) {
          passedCount++;
        } else {
          failedCount++;
        }
      }
    } catch (error) {
      // If pattern doesn't compile, all tests fail
      for (const testCase of testCases) {
        results.push({
          testCase,
          passed: false,
          actualMatch: null,
          error: `Pattern compilation failed: ${error instanceof Error ? error.message : String(error)}`,
        });
        failedCount++;
      }
    }

    return {
      results,
      allPassed: failedCount === 0,
      passedCount,
      failedCount,
    };
  }

  /**
   * Check if a pattern has catastrophic backtracking
   */
  public checkBacktracking(pattern: RegExp): BacktrackingResult {
    // Test inputs that commonly cause backtracking
    const problematicInputs = [
      'a'.repeat(100) + 'X', // Long string that doesn't match
      'a'.repeat(50) + 'b'.repeat(50) + 'X',
      '1'.repeat(100) + 'X',
      'x'.repeat(30) + 'y'.repeat(30) + 'z'.repeat(30) + 'X',
      // Nested quantifiers test
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaX',
      // Alternation test
      'abcdefghijklmnopqrstuvwxyzX',
    ];

    for (const testInput of problematicInputs) {
      const result = this.testPatternPerformance(pattern, testInput);
      
      if (result.hasBacktracking) {
        return {
          ...result,
          testInput,
        };
      }
    }

    return {
      hasBacktracking: false,
      executionTime: 0,
      timedOut: false,
    };
  }

  /**
   * Compile a pattern from string or RegExp
   */
  private compilePattern(pattern: SecretPattern): RegExp {
    if (pattern.pattern instanceof RegExp) {
      return pattern.pattern;
    }

    if (typeof pattern.pattern === 'string') {
      try {
        // Try to create regex with global and case-insensitive flags
        return new RegExp(pattern.pattern, 'gi');
      } catch (error) {
        throw new Error(`Invalid regex pattern: ${pattern.pattern}`);
      }
    }

    throw new Error('Pattern must be a string or RegExp');
  }

  /**
   * Run a single test case against a regex
   */
  private runTestCase(regex: RegExp, testCase: TestCase): TestResult {
    try {
      // Reset regex state
      regex.lastIndex = 0;
      
      const match = regex.exec(testCase.input);
      const actualMatch = match ? match[0] : null;

      let passed = false;

      if (testCase.shouldMatch) {
        // Should match - check if we got a match
        passed = actualMatch !== null;
        
        // If expected match is specified, check it matches
        if (passed && testCase.expectedMatch) {
          passed = actualMatch === testCase.expectedMatch;
        }
      } else {
        // Should not match - check if we got no match
        passed = actualMatch === null;
      }

      return {
        testCase,
        passed,
        actualMatch,
      };
    } catch (error) {
      return {
        testCase,
        passed: false,
        actualMatch: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Test pattern performance to detect backtracking
   */
  private testPatternPerformance(pattern: RegExp, testInput: string): BacktrackingResult {
    const startTime = Date.now();
    let timedOut = false;
    let executionTime = 0;

    try {
      // Set up timeout
      const timeoutId = setTimeout(() => {
        timedOut = true;
      }, this.backtrackingTimeout);

      // Reset regex state
      pattern.lastIndex = 0;
      
      // Test the pattern
      pattern.test(testInput);
      
      clearTimeout(timeoutId);
      executionTime = Date.now() - startTime;

      // Consider it backtracking if it took more than 100ms
      const hasBacktracking = timedOut || executionTime > 100;

      return {
        hasBacktracking,
        executionTime,
        timedOut,
      };
    } catch (error) {
      executionTime = Date.now() - startTime;
      
      return {
        hasBacktracking: timedOut || executionTime > 100,
        executionTime,
        timedOut,
      };
    }
  }

  /**
   * Validate pattern structure and provide warnings
   */
  private validatePatternStructure(
    pattern: SecretPattern,
    regex: RegExp,
    result: ValidationResult
  ): void {
    const patternStr = pattern.pattern.toString();

    // Check for common issues
    if (patternStr.includes('.*.*')) {
      result.warnings.push('Pattern contains nested .* quantifiers which may cause performance issues');
    }

    if (patternStr.includes('(.+)+') || patternStr.includes('(.*)+')) {
      result.warnings.push('Pattern contains nested quantifiers which may cause catastrophic backtracking');
    }

    if (patternStr.includes('(.*|.*)')) {
      result.warnings.push('Pattern contains alternation with overlapping branches');
    }

    // Check for overly broad patterns
    if (patternStr === '.*' || patternStr === '.+') {
      result.warnings.push('Pattern is overly broad and may cause false positives');
    }

    // Check for missing anchors in patterns that should be anchored
    if (pattern.id.includes('line') && !patternStr.includes('^') && !patternStr.includes('$')) {
      result.warnings.push('Line-based pattern should consider using anchors (^ or $)');
    }

    // Check for case sensitivity issues
    if (!regex.ignoreCase && patternStr.includes('[a-z]') && !patternStr.includes('[A-Z]')) {
      result.warnings.push('Pattern may miss uppercase variants - consider case-insensitive flag');
    }

    // Check for missing word boundaries
    if (pattern.id.includes('key') || pattern.id.includes('token')) {
      if (!patternStr.includes('\\b') && !patternStr.includes('(?:^|\\W)')) {
        result.warnings.push('Key/token pattern should consider word boundaries to avoid false positives');
      }
    }
  }

  /**
   * Validate all patterns in a collection
   */
  public validateAllPatterns(patterns: SecretPattern[]): {
    results: Map<string, ValidationResult>;
    validCount: number;
    invalidCount: number;
    warningCount: number;
  } {
    const results = new Map<string, ValidationResult>();
    let validCount = 0;
    let invalidCount = 0;
    let warningCount = 0;

    for (const pattern of patterns) {
      const result = this.validatePattern(pattern);
      results.set(pattern.id, result);

      if (result.isValid) {
        validCount++;
      } else {
        invalidCount++;
      }

      if (result.warnings.length > 0) {
        warningCount++;
      }

      if (this.debugMode) {
        console.log(`Validated pattern ${pattern.id}: ${result.isValid ? 'VALID' : 'INVALID'}`);
        if (result.errors.length > 0) {
          console.log(`  Errors: ${result.errors.join(', ')}`);
        }
        if (result.warnings.length > 0) {
          console.log(`  Warnings: ${result.warnings.join(', ')}`);
        }
      }
    }

    return {
      results,
      validCount,
      invalidCount,
      warningCount,
    };
  }

  /**
   * Generate test cases for common secret patterns
   */
  public generateTestCases(patternType: string): TestCase[] {
    const testCases: TestCase[] = [];

    switch (patternType.toLowerCase()) {
      case 'api-key':
        testCases.push(
          { input: 'api_key=abc123def456', shouldMatch: true, description: 'Basic API key' },
          { input: 'API_KEY="xyz789"', shouldMatch: true, description: 'Quoted API key' },
          { input: 'apikey: sk_test_123456789', shouldMatch: true, description: 'Stripe-style key' },
          { input: 'const message = "api key is secret"', shouldMatch: false, description: 'False positive text' },
          { input: 'api_key_length = 32', shouldMatch: false, description: 'Variable name only' }
        );
        break;

      case 'password':
        testCases.push(
          { input: 'password=secret123', shouldMatch: true, description: 'Basic password' },
          { input: 'PASSWORD: "mypassword"', shouldMatch: true, description: 'Quoted password' },
          { input: 'pwd=admin', shouldMatch: true, description: 'Short password' },
          { input: 'password_field = input', shouldMatch: false, description: 'Field reference' },
          { input: 'password validation failed', shouldMatch: false, description: 'Error message' }
        );
        break;

      case 'token':
        testCases.push(
          { input: 'token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9', shouldMatch: true, description: 'JWT token' },
          { input: 'access_token: "ghp_1234567890abcdef"', shouldMatch: true, description: 'GitHub token' },
          { input: 'bearer_token = "sk_live_123"', shouldMatch: true, description: 'Bearer token' },
          { input: 'token_type = "bearer"', shouldMatch: false, description: 'Token type only' },
          { input: 'tokenize the string', shouldMatch: false, description: 'Verb usage' }
        );
        break;

      default:
        // Generic test cases
        testCases.push(
          { input: 'test_string_123', shouldMatch: false, description: 'Generic test string' },
          { input: '', shouldMatch: false, description: 'Empty string' },
          { input: 'a'.repeat(1000), shouldMatch: false, description: 'Very long string' }
        );
    }

    return testCases;
  }
}
