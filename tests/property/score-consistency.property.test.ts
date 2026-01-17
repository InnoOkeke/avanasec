/**
 * Property-Based Tests: Score Consistency
 * Feature: avana-core, Property 5: Scan Determinism
 * Feature: avana-core, Property 6: Score Consistency
 * **Validates: Requirements 8.1, 8.2, 8.3**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Avana } from '../../src/index';
import type { ScanResult, SecurityIssue, SeverityLevel } from '../../src/types';

describe('Feature: avana-core, Property 5: Scan Determinism', () => {
  it('should produce identical results for repeated scans with same input', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate array of mock security issues
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            type: fc.constantFrom('secret', 'vulnerability', 'insecure-pattern'),
            severity: fc.constantFrom('critical', 'high', 'medium', 'low', 'info'),
            title: fc.string({ minLength: 1, maxLength: 50 }),
            description: fc.string({ minLength: 1, maxLength: 100 }),
            file: fc.string({ minLength: 1, maxLength: 50 }),
            line: fc.integer({ min: 1, max: 1000 }),
            column: fc.integer({ min: 1, max: 100 })
          }),
          { minLength: 0, maxLength: 50 }
        ),
        async (mockIssues) => {
          const avana = new Avana();
          
          // Create mock scan results
          const createMockResult = (): ScanResult => {
            const summary = {
              critical: mockIssues.filter(i => i.severity === 'critical').length,
              high: mockIssues.filter(i => i.severity === 'high').length,
              medium: mockIssues.filter(i => i.severity === 'medium').length,
              low: mockIssues.filter(i => i.severity === 'low').length,
              info: mockIssues.filter(i => i.severity === 'info').length,
            };

            return {
              success: true,
              timestamp: new Date().toISOString(),
              duration: 100,
              filesScanned: 10,
              issues: mockIssues as SecurityIssue[],
              summary
            };
          };

          // Calculate score twice with identical input
          const result1 = createMockResult();
          const result2 = createMockResult();
          
          const { score: score1, breakdown: breakdown1 } = avana.calculateSecurityScore(result1);
          const { score: score2, breakdown: breakdown2 } = avana.calculateSecurityScore(result2);
          
          // Scores should be identical (deterministic)
          expect(score1).toBe(score2);
          expect(breakdown1).toEqual(breakdown2);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: avana-core, Property 6: Score Consistency', () => {
  it('should calculate security score deterministically using documented algorithm', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate counts for each severity level
        fc.record({
          critical: fc.integer({ min: 0, max: 10 }),
          high: fc.integer({ min: 0, max: 10 }),
          medium: fc.integer({ min: 0, max: 10 }),
          low: fc.integer({ min: 0, max: 10 }),
          info: fc.integer({ min: 0, max: 10 })
        }),
        async (severityCounts) => {
          const avana = new Avana();
          
          // Create mock result with specified severity counts
          const mockResult: ScanResult = {
            success: true,
            timestamp: new Date().toISOString(),
            duration: 100,
            filesScanned: 10,
            issues: [], // Issues don't matter for score calculation, only summary counts
            summary: severityCounts
          };

          const { score, breakdown } = avana.calculateSecurityScore(mockResult);
          
          // Verify algorithm: score = 100 - (critical×20 + high×10 + medium×5 + low×2)
          const expectedCriticalDeduction = severityCounts.critical * 20;
          const expectedHighDeduction = severityCounts.high * 10;
          const expectedMediumDeduction = severityCounts.medium * 5;
          const expectedLowDeduction = severityCounts.low * 2;
          
          const expectedTotalDeduction = expectedCriticalDeduction + expectedHighDeduction + 
                                       expectedMediumDeduction + expectedLowDeduction;
          const expectedScore = Math.max(0, 100 - expectedTotalDeduction);
          
          // Verify score calculation
          expect(score).toBe(expectedScore);
          expect(breakdown.baseScore).toBe(100);
          expect(breakdown.criticalDeduction).toBe(expectedCriticalDeduction);
          expect(breakdown.highDeduction).toBe(expectedHighDeduction);
          expect(breakdown.mediumDeduction).toBe(expectedMediumDeduction);
          expect(breakdown.lowDeduction).toBe(expectedLowDeduction);
          expect(breakdown.finalScore).toBe(expectedScore);
          
          // Score should never be negative
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge cases correctly', async () => {
    const avana = new Avana();
    
    // Test perfect score (no issues)
    const perfectResult: ScanResult = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: 100,
      filesScanned: 10,
      issues: [],
      summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
    };
    
    const { score: perfectScore } = avana.calculateSecurityScore(perfectResult);
    expect(perfectScore).toBe(100);
    
    // Test worst case (many critical issues)
    const worstResult: ScanResult = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: 100,
      filesScanned: 10,
      issues: [],
      summary: { critical: 10, high: 10, medium: 10, low: 10, info: 10 }
    };
    
    const { score: worstScore } = avana.calculateSecurityScore(worstResult);
    expect(worstScore).toBe(0); // Should be clamped to 0
    
    // Test score that would go negative
    const negativeResult: ScanResult = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: 100,
      filesScanned: 10,
      issues: [],
      summary: { critical: 20, high: 0, medium: 0, low: 0, info: 0 } // 20 * 20 = 400 deduction
    };
    
    const { score: negativeScore } = avana.calculateSecurityScore(negativeResult);
    expect(negativeScore).toBe(0); // Should be clamped to 0, not negative
  });
});