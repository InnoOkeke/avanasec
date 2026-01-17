/**
 * Property-Based Tests: Exit Code Correctness
 * Feature: avana-core, Property 12: Exit Code Correctness
 * 
 * Tests that exit codes are correctly determined based on scan results and options.
 * **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { determineExitCode, ExitCode } from '../../src/utils/exit-codes';

describe('Property 12: Exit Code Correctness', () => {
  it('should return SUCCESS (0) when no critical or high issues found', () => {
    fc.assert(
      fc.property(
        fc.record({
          critical: fc.constant(0),
          high: fc.constant(0),
          medium: fc.integer({ min: 0, max: 100 }),
          low: fc.integer({ min: 0, max: 100 })
        }),
        fc.record({
          failOnHigh: fc.boolean()
        }),
        (summary, options) => {
          const result = { summary };
          const exitCode = determineExitCode(result, options);
          expect(exitCode).toBe(ExitCode.SUCCESS);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return ISSUES_FOUND (1) when critical issues exist regardless of options', () => {
    fc.assert(
      fc.property(
        fc.record({
          critical: fc.integer({ min: 1, max: 100 }),
          high: fc.integer({ min: 0, max: 100 }),
          medium: fc.integer({ min: 0, max: 100 }),
          low: fc.integer({ min: 0, max: 100 })
        }),
        fc.record({
          failOnHigh: fc.boolean()
        }),
        (summary, options) => {
          const result = { summary };
          const exitCode = determineExitCode(result, options);
          expect(exitCode).toBe(ExitCode.ISSUES_FOUND);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return ISSUES_FOUND (1) when high issues exist and failOnHigh is true', () => {
    fc.assert(
      fc.property(
        fc.record({
          critical: fc.constant(0),
          high: fc.integer({ min: 1, max: 100 }),
          medium: fc.integer({ min: 0, max: 100 }),
          low: fc.integer({ min: 0, max: 100 })
        }),
        (summary) => {
          const result = { summary };
          const exitCode = determineExitCode(result, { failOnHigh: true });
          expect(exitCode).toBe(ExitCode.ISSUES_FOUND);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return ISSUES_FOUND (1) when high issues exist by default (without failOnHigh)', () => {
    fc.assert(
      fc.property(
        fc.record({
          critical: fc.constant(0),
          high: fc.integer({ min: 1, max: 100 }),
          medium: fc.integer({ min: 0, max: 100 }),
          low: fc.integer({ min: 0, max: 100 })
        }),
        (summary) => {
          const result = { summary };
          const exitCode = determineExitCode(result, { failOnHigh: false });
          expect(exitCode).toBe(ExitCode.ISSUES_FOUND);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be deterministic - same input produces same output', () => {
    fc.assert(
      fc.property(
        fc.record({
          critical: fc.integer({ min: 0, max: 100 }),
          high: fc.integer({ min: 0, max: 100 }),
          medium: fc.integer({ min: 0, max: 100 }),
          low: fc.integer({ min: 0, max: 100 })
        }),
        fc.record({
          failOnHigh: fc.boolean()
        }),
        (summary, options) => {
          const result = { summary };
          const exitCode1 = determineExitCode(result, options);
          const exitCode2 = determineExitCode(result, options);
          expect(exitCode1).toBe(exitCode2);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should only return valid exit codes', () => {
    fc.assert(
      fc.property(
        fc.record({
          critical: fc.integer({ min: 0, max: 100 }),
          high: fc.integer({ min: 0, max: 100 }),
          medium: fc.integer({ min: 0, max: 100 }),
          low: fc.integer({ min: 0, max: 100 })
        }),
        fc.record({
          failOnHigh: fc.boolean()
        }),
        (summary, options) => {
          const result = { summary };
          const exitCode = determineExitCode(result, options);
          expect([ExitCode.SUCCESS, ExitCode.ISSUES_FOUND]).toContain(exitCode);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should prioritize critical issues over high issues', () => {
    fc.assert(
      fc.property(
        fc.record({
          critical: fc.integer({ min: 1, max: 100 }),
          high: fc.integer({ min: 1, max: 100 }),
          medium: fc.integer({ min: 0, max: 100 }),
          low: fc.integer({ min: 0, max: 100 })
        }),
        fc.record({
          failOnHigh: fc.boolean()
        }),
        (summary, options) => {
          const result = { summary };
          const exitCode = determineExitCode(result, options);
          // Should return ISSUES_FOUND due to critical issues, regardless of failOnHigh setting
          expect(exitCode).toBe(ExitCode.ISSUES_FOUND);
        }
      ),
      { numRuns: 100 }
    );
  });
});