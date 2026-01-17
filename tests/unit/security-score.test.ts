/**
 * Unit Tests: Security Score Calculation
 * Tests specific examples and edge cases for security score calculation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Avana } from '../../src/index';
import type { ScanResult } from '../../src/types';

describe('Security Score Calculation', () => {
  let avana: Avana;

  beforeEach(() => {
    avana = new Avana();
  });

  describe('Score Calculation Formula', () => {
    it('should calculate perfect score for no issues', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 5,
        issues: [],
        summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      expect(score).toBe(100);
      expect(breakdown.baseScore).toBe(100);
      expect(breakdown.criticalDeduction).toBe(0);
      expect(breakdown.highDeduction).toBe(0);
      expect(breakdown.mediumDeduction).toBe(0);
      expect(breakdown.lowDeduction).toBe(0);
      expect(breakdown.finalScore).toBe(100);
    });

    it('should deduct 20 points per critical issue', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 5,
        issues: [],
        summary: { critical: 2, high: 0, medium: 0, low: 0, info: 0 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      expect(score).toBe(60); // 100 - (2 * 20)
      expect(breakdown.criticalDeduction).toBe(40);
      expect(breakdown.finalScore).toBe(60);
    });

    it('should deduct 10 points per high severity issue', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 5,
        issues: [],
        summary: { critical: 0, high: 3, medium: 0, low: 0, info: 0 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      expect(score).toBe(70); // 100 - (3 * 10)
      expect(breakdown.highDeduction).toBe(30);
      expect(breakdown.finalScore).toBe(70);
    });

    it('should deduct 5 points per medium severity issue', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 5,
        issues: [],
        summary: { critical: 0, high: 0, medium: 4, low: 0, info: 0 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      expect(score).toBe(80); // 100 - (4 * 5)
      expect(breakdown.mediumDeduction).toBe(20);
      expect(breakdown.finalScore).toBe(80);
    });

    it('should deduct 2 points per low severity issue', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 5,
        issues: [],
        summary: { critical: 0, high: 0, medium: 0, low: 5, info: 0 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      expect(score).toBe(90); // 100 - (5 * 2)
      expect(breakdown.lowDeduction).toBe(10);
      expect(breakdown.finalScore).toBe(90);
    });

    it('should not deduct points for info severity issues', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 5,
        issues: [],
        summary: { critical: 0, high: 0, medium: 0, low: 0, info: 10 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      expect(score).toBe(100); // Info issues don't affect score
      expect(breakdown.finalScore).toBe(100);
    });
  });

  describe('Mixed Severity Scenarios', () => {
    it('should calculate score correctly with mixed severities', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 5,
        issues: [],
        summary: { critical: 1, high: 2, medium: 3, low: 4, info: 5 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      // Expected: 100 - (1*20 + 2*10 + 3*5 + 4*2) = 100 - (20 + 20 + 15 + 8) = 37
      expect(score).toBe(37);
      expect(breakdown.criticalDeduction).toBe(20);
      expect(breakdown.highDeduction).toBe(20);
      expect(breakdown.mediumDeduction).toBe(15);
      expect(breakdown.lowDeduction).toBe(8);
      expect(breakdown.finalScore).toBe(37);
    });

    it('should handle realistic security scan results', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 50,
        issues: [],
        summary: { critical: 0, high: 1, medium: 3, low: 8, info: 2 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      // Expected: 100 - (0*20 + 1*10 + 3*5 + 8*2) = 100 - (0 + 10 + 15 + 16) = 59
      expect(score).toBe(59);
      expect(breakdown.criticalDeduction).toBe(0);
      expect(breakdown.highDeduction).toBe(10);
      expect(breakdown.mediumDeduction).toBe(15);
      expect(breakdown.lowDeduction).toBe(16);
      expect(breakdown.finalScore).toBe(59);
    });
  });

  describe('Edge Cases', () => {
    it('should clamp score to 0 when deductions exceed 100', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 5,
        issues: [],
        summary: { critical: 10, high: 5, medium: 0, low: 0, info: 0 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      // Expected deduction: 10*20 + 5*10 = 250, but score should be clamped to 0
      expect(score).toBe(0);
      expect(breakdown.criticalDeduction).toBe(200);
      expect(breakdown.highDeduction).toBe(50);
      expect(breakdown.finalScore).toBe(0);
    });

    it('should handle zero issues correctly', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 0,
        issues: [],
        summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      expect(score).toBe(100);
      expect(breakdown.baseScore).toBe(100);
      expect(breakdown.finalScore).toBe(100);
    });

    it('should handle large numbers of issues', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 1000,
        issues: [],
        summary: { critical: 0, high: 0, medium: 0, low: 100, info: 200 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      // Expected: 100 - (100 * 2) = -100, clamped to 0
      expect(score).toBe(0);
      expect(breakdown.lowDeduction).toBe(200);
      expect(breakdown.finalScore).toBe(0);
    });
  });

  describe('Score Determinism', () => {
    it('should produce identical scores for identical inputs', () => {
      const createResult = () => ({
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 5,
        issues: [],
        summary: { critical: 2, high: 1, medium: 3, low: 2, info: 1 }
      });

      const result1 = createResult();
      const result2 = createResult();

      const { score: score1, breakdown: breakdown1 } = avana.calculateSecurityScore(result1);
      const { score: score2, breakdown: breakdown2 } = avana.calculateSecurityScore(result2);

      expect(score1).toBe(score2);
      expect(breakdown1).toEqual(breakdown2);
    });

    it('should be independent of timestamp and duration', () => {
      const baseResult = {
        success: true,
        filesScanned: 5,
        issues: [],
        summary: { critical: 1, high: 1, medium: 1, low: 1, info: 1 }
      };

      const result1: ScanResult = {
        ...baseResult,
        timestamp: '2024-01-01T00:00:00.000Z',
        duration: 100
      };

      const result2: ScanResult = {
        ...baseResult,
        timestamp: '2024-12-31T23:59:59.999Z',
        duration: 5000
      };

      const { score: score1 } = avana.calculateSecurityScore(result1);
      const { score: score2 } = avana.calculateSecurityScore(result2);

      expect(score1).toBe(score2);
    });
  });

  describe('Score Breakdown Display', () => {
    it('should provide detailed breakdown for debugging', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 5,
        issues: [],
        summary: { critical: 1, high: 2, medium: 1, low: 3, info: 0 }
      };

      const { score, breakdown } = avana.calculateSecurityScore(result);

      expect(breakdown).toEqual({
        baseScore: 100,
        criticalDeduction: 20,  // 1 * 20
        highDeduction: 20,      // 2 * 10
        mediumDeduction: 5,     // 1 * 5
        lowDeduction: 6,        // 3 * 2
        finalScore: 49          // 100 - 51
      });

      expect(score).toBe(49);
    });

    it('should show zero deductions when no issues of that severity exist', () => {
      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration: 100,
        filesScanned: 5,
        issues: [],
        summary: { critical: 0, high: 1, medium: 0, low: 0, info: 5 }
      };

      const { breakdown } = avana.calculateSecurityScore(result);

      expect(breakdown.criticalDeduction).toBe(0);
      expect(breakdown.highDeduction).toBe(10);
      expect(breakdown.mediumDeduction).toBe(0);
      expect(breakdown.lowDeduction).toBe(0);
      expect(breakdown.finalScore).toBe(90);
    });
  });
});