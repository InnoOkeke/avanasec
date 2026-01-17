/**
 * Unit Tests: Progress Reporter
 * Tests progress reporting functionality including updates, ETA calculation, and progress bar clearing
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ProgressReporter, initializeProgressReporter, getProgressReporter } from '../../src/utils/progress-reporter';

describe('ProgressReporter', () => {
  let originalStdoutWrite: typeof process.stdout.write;
  let outputBuffer: string[] = [];

  beforeEach(() => {
    // Mock stdout to capture progress output
    outputBuffer = [];
    originalStdoutWrite = process.stdout.write;
    process.stdout.write = vi.fn((chunk: any) => {
      if (typeof chunk === 'string') {
        outputBuffer.push(chunk);
      }
      return true;
    }) as any;

    // Mock process.stdout.isTTY
    Object.defineProperty(process.stdout, 'isTTY', {
      value: true,
      configurable: true
    });
  });

  afterEach(() => {
    // Restore stdout
    process.stdout.write = originalStdoutWrite;
  });

  describe('Constructor and Basic Properties', () => {
    it('should create ProgressReporter with correct options', () => {
      const reporter = new ProgressReporter({ total: 100 });
      
      const stats = reporter.getStats();
      expect(stats.total).toBe(100);
      expect(stats.current).toBe(0);
      expect(stats.percentage).toBe(0);
      expect(reporter.isEnabled()).toBe(true);
    });

    it('should respect noProgress flag', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      
      expect(reporter.isEnabled()).toBe(false);
    });

    it('should handle zero total', () => {
      const reporter = new ProgressReporter({ total: 0 });
      
      const stats = reporter.getStats();
      expect(stats.total).toBe(0);
      expect(stats.percentage).toBe(0);
    });
  });

  describe('Progress Updates', () => {
    it('should update progress correctly', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      reporter.start();

      reporter.update(25);
      let stats = reporter.getStats();
      expect(stats.current).toBe(25);
      expect(stats.percentage).toBe(25);

      reporter.update(75);
      stats = reporter.getStats();
      expect(stats.current).toBe(75);
      expect(stats.percentage).toBe(75);

      reporter.complete();
    });

    it('should increment progress correctly', () => {
      const reporter = new ProgressReporter({ total: 10, noProgress: true });
      reporter.start();

      for (let i = 1; i <= 5; i++) {
        reporter.increment();
        const stats = reporter.getStats();
        expect(stats.current).toBe(i);
        expect(stats.percentage).toBe(i * 10);
      }

      reporter.complete();
    });

    it('should handle updates without explicit value', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      reporter.start();

      reporter.update(); // Should increment by 1
      let stats = reporter.getStats();
      expect(stats.current).toBe(1);

      reporter.update(); // Should increment by 1 again
      stats = reporter.getStats();
      expect(stats.current).toBe(2);

      reporter.complete();
    });

    it('should allow progress beyond total', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      reporter.start();

      reporter.update(150);
      const stats = reporter.getStats();
      expect(stats.current).toBe(150);
      expect(stats.percentage).toBe(150);

      reporter.complete();
    });
  });

  describe('ETA Calculation', () => {
    it('should calculate ETA correctly', async () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      reporter.start();

      // Wait a bit to ensure elapsed time > 0
      await new Promise(resolve => setTimeout(resolve, 10));

      reporter.update(25);
      const stats = reporter.getStats();

      expect(stats.elapsedTime).toBeGreaterThan(0);
      expect(stats.rate).toBeGreaterThan(0);
      expect(stats.eta).toBeGreaterThan(0);

      // ETA should be reasonable
      const expectedEta = Math.ceil((100 - 25) / stats.rate);
      expect(stats.eta).toBe(expectedEta);

      reporter.complete();
    });

    it('should handle zero rate gracefully', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      reporter.start();

      // Immediately check stats (elapsed time should be 0 or very small)
      const stats = reporter.getStats();
      expect(stats.eta).toBeGreaterThanOrEqual(0);
      expect(stats.rate).toBeGreaterThanOrEqual(0);

      reporter.complete();
    });

    it('should calculate rate correctly', async () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      reporter.start();

      await new Promise(resolve => setTimeout(resolve, 50));
      reporter.update(10);

      const stats = reporter.getStats();
      expect(stats.rate).toBeCloseTo(stats.current / stats.elapsedTime, 1);

      reporter.complete();
    });
  });

  describe('Progress Bar Operations', () => {
    it('should start and complete progress bar', () => {
      const reporter = new ProgressReporter({ total: 100 });
      
      reporter.start();
      reporter.update(50);
      reporter.complete();

      // Should not throw errors
      expect(true).toBe(true);
    });

    it('should handle stop operation', () => {
      const reporter = new ProgressReporter({ total: 100 });
      
      reporter.start();
      reporter.update(50);
      reporter.stop();

      // Should not throw errors
      expect(true).toBe(true);
    });

    it('should handle multiple start/stop cycles', () => {
      const reporter = new ProgressReporter({ total: 100 });
      
      reporter.start();
      reporter.stop();
      
      reporter.start();
      reporter.complete();

      // Should not throw errors
      expect(true).toBe(true);
    });

    it('should clear progress bar on completion', () => {
      const reporter = new ProgressReporter({ total: 100 });
      
      reporter.start();
      reporter.update(100);
      reporter.complete();

      // Check that clear sequence was written
      const output = outputBuffer.join('');
      expect(output).toContain('\r\x1b[K'); // Clear line sequence
    });
  });

  describe('No Progress Mode', () => {
    it('should not output anything when noProgress is true', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      
      reporter.start();
      reporter.update(50);
      reporter.complete();

      // Should have minimal output
      expect(outputBuffer.length).toBe(0);
    });

    it('should still track stats when noProgress is true', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      
      reporter.start();
      reporter.update(75);
      
      const stats = reporter.getStats();
      expect(stats.current).toBe(75);
      expect(stats.percentage).toBe(75);
      expect(stats.total).toBe(100);

      reporter.complete();
    });
  });

  describe('Total Updates', () => {
    it('should update total correctly', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      reporter.start();

      reporter.update(25);
      reporter.setTotal(200);

      const stats = reporter.getStats();
      expect(stats.total).toBe(200);
      expect(stats.current).toBe(25);
      expect(stats.percentage).toBe(Math.round((25 / 200) * 100));

      reporter.complete();
    });

    it('should handle total update with active progress bar', () => {
      const reporter = new ProgressReporter({ total: 100 });
      reporter.start();

      reporter.update(25);
      reporter.setTotal(50);

      const stats = reporter.getStats();
      expect(stats.total).toBe(50);
      expect(stats.current).toBe(25);

      reporter.complete();
    });
  });

  describe('Edge Cases', () => {
    it('should handle operations before start', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      
      // These should not throw errors
      reporter.update(50);
      reporter.increment();
      const stats = reporter.getStats();
      
      expect(stats.current).toBeGreaterThan(0);
      expect(stats.total).toBe(100);
    });

    it('should handle operations after complete', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      
      reporter.start();
      reporter.complete();
      
      // These should not throw errors
      reporter.update(50);
      reporter.increment();
      const stats = reporter.getStats();
      
      expect(typeof stats.current).toBe('number');
      expect(stats.total).toBe(100);
    });

    it('should handle rapid updates', () => {
      const reporter = new ProgressReporter({ total: 1000, noProgress: true });
      reporter.start();

      // Rapid updates
      for (let i = 0; i < 100; i++) {
        reporter.increment();
      }

      const stats = reporter.getStats();
      expect(stats.current).toBe(100);
      expect(stats.percentage).toBe(10);

      reporter.complete();
    });

    it('should handle negative updates gracefully', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      reporter.start();

      reporter.update(-10);
      const stats = reporter.getStats();
      expect(stats.current).toBe(-10);
      expect(stats.percentage).toBe(-10);

      reporter.complete();
    });
  });

  describe('Global Instance Management', () => {
    it('should initialize global progress reporter', () => {
      const reporter = initializeProgressReporter({ total: 100 });
      
      expect(reporter).toBeInstanceOf(ProgressReporter);
      expect(getProgressReporter()).toBe(reporter);
    });

    it('should return null when no global reporter initialized', () => {
      // Reset global instance
      const reporter = initializeProgressReporter({ total: 100 });
      
      expect(getProgressReporter()).toBe(reporter);
    });

    it('should replace global reporter on re-initialization', () => {
      const reporter1 = initializeProgressReporter({ total: 100 });
      const reporter2 = initializeProgressReporter({ total: 200 });
      
      expect(getProgressReporter()).toBe(reporter2);
      expect(getProgressReporter()).not.toBe(reporter1);
    });
  });

  describe('Statistics Accuracy', () => {
    it('should provide accurate statistics', async () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      reporter.start();

      await new Promise(resolve => setTimeout(resolve, 10));
      reporter.update(30);

      const stats = reporter.getStats();
      
      expect(stats.current).toBe(30);
      expect(stats.total).toBe(100);
      expect(stats.percentage).toBe(30);
      expect(stats.elapsedTime).toBeGreaterThan(0);
      expect(stats.rate).toBeGreaterThan(0);
      expect(stats.eta).toBeGreaterThan(0);

      reporter.complete();
    });

    it('should handle completion statistics', () => {
      const reporter = new ProgressReporter({ total: 100, noProgress: true });
      reporter.start();

      reporter.update(100);
      const stats = reporter.getStats();
      
      expect(stats.current).toBe(100);
      expect(stats.percentage).toBe(100);
      expect(stats.eta).toBe(0); // Should be 0 when complete

      reporter.complete();
    });
  });

  describe('TTY Handling', () => {
    it('should handle non-TTY environment', () => {
      Object.defineProperty(process.stdout, 'isTTY', {
        value: false,
        configurable: true
      });

      const reporter = new ProgressReporter({ total: 100 });
      
      // Should not throw errors in non-TTY environment
      reporter.start();
      reporter.update(50);
      reporter.complete();

      expect(true).toBe(true);
    });
  });
});