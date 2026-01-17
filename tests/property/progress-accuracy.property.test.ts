/**
 * Property-Based Tests: Progress Reporting Accuracy
 * Feature: avana-core, Property 8: Progress Reporting Accuracy
 * **Validates: Requirements 11.1, 11.2**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { ProgressReporter } from '../../src/utils/progress-reporter';

describe('Feature: avana-core, Property 8: Progress Reporting Accuracy', () => {
  let originalStdoutWrite: typeof process.stdout.write;
  let outputBuffer: string[] = [];

  beforeEach(() => {
    // Mock stdout to capture progress output
    outputBuffer = [];
    originalStdoutWrite = process.stdout.write;
    process.stdout.write = ((chunk: any) => {
      if (typeof chunk === 'string') {
        outputBuffer.push(chunk);
      }
      return true;
    }) as any;
  });

  afterEach(() => {
    // Restore stdout
    process.stdout.write = originalStdoutWrite;
  });

  it('should accurately track progress through all updates', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 1000 }), // total files
        fc.array(fc.integer({ min: 0, max: 1000 }), { minLength: 1, maxLength: 50 }), // update sequence
        async (total, updates) => {
          const progressReporter = new ProgressReporter({ 
            total, 
            noProgress: true // Disable visual progress for testing
          });

          progressReporter.start();

          let expectedCurrent = 0;
          
          // Apply updates and verify stats
          for (const update of updates) {
            const clampedUpdate = Math.min(update, total);
            progressReporter.update(clampedUpdate);
            expectedCurrent = clampedUpdate;

            const stats = progressReporter.getStats();
            
            // Progress should be accurate
            expect(stats.current).toBe(expectedCurrent);
            expect(stats.total).toBe(total);
            expect(stats.percentage).toBe(Math.round((expectedCurrent / total) * 100));
            
            // Stats should be consistent
            expect(stats.current).toBeGreaterThanOrEqual(0);
            expect(stats.current).toBeLessThanOrEqual(total);
            expect(stats.percentage).toBeGreaterThanOrEqual(0);
            expect(stats.percentage).toBeLessThanOrEqual(100);
            expect(stats.elapsedTime).toBeGreaterThanOrEqual(0);
            expect(stats.rate).toBeGreaterThanOrEqual(0);
            expect(stats.eta).toBeGreaterThanOrEqual(0);
          }

          progressReporter.complete();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle increment operations correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }), // total files
        fc.integer({ min: 1, max: 100 }), // number of increments
        async (total, increments) => {
          const progressReporter = new ProgressReporter({ 
            total, 
            noProgress: true 
          });

          progressReporter.start();

          // Perform increments
          for (let i = 0; i < increments; i++) {
            progressReporter.increment();
            
            const stats = progressReporter.getStats();
            const expectedCurrent = i + 1; // Not clamped to total
            
            expect(stats.current).toBe(expectedCurrent);
            expect(stats.total).toBe(total);
            expect(stats.percentage).toBe(Math.round((expectedCurrent / total) * 100));
          }

          progressReporter.complete();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should calculate ETA and rate accurately', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 10, max: 100 }), // total files
        async (total) => {
          const progressReporter = new ProgressReporter({ 
            total, 
            noProgress: true 
          });

          progressReporter.start();

          // Wait a bit to ensure elapsed time > 0
          await new Promise(resolve => setTimeout(resolve, 10));

          // Update to halfway point
          const halfway = Math.floor(total / 2);
          progressReporter.update(halfway);

          const stats = progressReporter.getStats();

          // Rate should be positive when progress is made
          if (stats.elapsedTime > 0 && stats.current > 0) {
            expect(stats.rate).toBeGreaterThan(0);
            expect(stats.rate).toBe(stats.current / stats.elapsedTime);
          }

          // ETA should be reasonable
          if (stats.rate > 0 && stats.current < total) {
            const expectedEta = Math.ceil((total - stats.current) / stats.rate);
            expect(stats.eta).toBe(expectedEta);
          }

          progressReporter.complete();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle total updates correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }), // initial total
        fc.integer({ min: 1, max: 200 }), // new total
        async (initialTotal, newTotal) => {
          const progressReporter = new ProgressReporter({ 
            total: initialTotal, 
            noProgress: true 
          });

          progressReporter.start();

          // Update some progress
          const progress = Math.min(5, initialTotal);
          progressReporter.update(progress);

          // Change total
          progressReporter.setTotal(newTotal);

          const stats = progressReporter.getStats();
          expect(stats.total).toBe(newTotal);
          expect(stats.current).toBe(progress);
          expect(stats.percentage).toBe(Math.round((progress / newTotal) * 100));

          progressReporter.complete();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge cases correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 50 }),
        async (total) => {
          const progressReporter = new ProgressReporter({ 
            total, 
            noProgress: true 
          });

          progressReporter.start();

          // Test updating beyond total
          progressReporter.update(total + 10);
          let stats = progressReporter.getStats();
          expect(stats.current).toBe(total + 10); // Should allow over-progress
          expect(stats.percentage).toBeGreaterThan(100); // Percentage can exceed 100%

          // Test updating to 0
          progressReporter.update(0);
          stats = progressReporter.getStats();
          expect(stats.current).toBe(0);
          expect(stats.percentage).toBe(0);

          // Test completing
          progressReporter.complete();
          
          // Should be able to get stats after completion
          stats = progressReporter.getStats();
          expect(typeof stats.current).toBe('number');
          expect(typeof stats.total).toBe('number');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should respect noProgress flag', async () => {
    const progressReporter = new ProgressReporter({ 
      total: 100, 
      noProgress: true 
    });

    expect(progressReporter.isEnabled()).toBe(false);

    // Should not throw errors when disabled
    progressReporter.start();
    progressReporter.update(50);
    progressReporter.increment();
    progressReporter.complete();

    // Stats should still work
    const stats = progressReporter.getStats();
    expect(stats.current).toBeGreaterThanOrEqual(0);
    expect(stats.total).toBe(100);
  });

  it('should handle rapid updates correctly', async () => {
    const progressReporter = new ProgressReporter({ 
      total: 1000, 
      noProgress: true 
    });

    progressReporter.start();

    // Rapid updates (should be throttled internally)
    for (let i = 0; i < 100; i++) {
      progressReporter.increment();
    }

    const stats = progressReporter.getStats();
    expect(stats.current).toBe(100);
    expect(stats.total).toBe(1000);
    expect(stats.percentage).toBe(10);

    progressReporter.complete();
  });
});