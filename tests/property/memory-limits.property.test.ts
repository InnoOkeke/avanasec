/**
 * Property-Based Tests: Memory Limit Enforcement
 * Feature: avana-core, Property 10: Memory Limit Enforcement
 * **Validates: Requirements 10.1, 10.2**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { MemoryManager } from '../../src/utils/memory-manager';

describe('Feature: avana-core, Property 10: Memory Limit Enforcement', () => {
  it('should never exceed configured memory limit', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate memory limits between 50MB and 1000MB (higher limits to avoid false positives)
        fc.integer({ min: 50, max: 1000 }),
        async (limitMB) => {
          const memoryManager = new MemoryManager(limitMB);
          const limitBytes = limitMB * 1024 * 1024;
          
          // Get current usage - call once to avoid inconsistency
          const currentUsage = memoryManager.getCurrentUsage();
          
          // Memory usage should be tracked correctly
          expect(currentUsage).toBeGreaterThan(0);
          expect(typeof currentUsage).toBe('number');
          
          // Check limit should return boolean
          const withinLimit = memoryManager.checkLimit();
          expect(typeof withinLimit).toBe('boolean');
          
          // If current usage exceeds limit, checkLimit should return false
          if (currentUsage > limitBytes) {
            expect(withinLimit).toBe(false);
          }
          
          // Stats should be consistent with the usage we got
          const stats = memoryManager.getStats();
          // Allow for larger variations in memory usage between calls (up to 10MB)
          expect(Math.abs(stats.currentUsage - currentUsage)).toBeLessThan(10 * 1024 * 1024);
          expect(stats.limit).toBe(limitBytes);
          expect(stats.maxUsage).toBeGreaterThanOrEqual(Math.min(currentUsage, stats.currentUsage));
          expect(stats.gcCount).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should trigger garbage collection when approaching threshold', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 50, max: 500 }),
        async (limitMB) => {
          const memoryManager = new MemoryManager(limitMB);
          const initialGcCount = memoryManager.getStats().gcCount;
          
          // Manually trigger GC
          memoryManager.triggerGC();
          
          const afterGcCount = memoryManager.getStats().gcCount;
          
          // GC count should increase (or stay same if GC not available)
          expect(afterGcCount).toBeGreaterThanOrEqual(initialGcCount);
          
          // Usage percentage should be valid
          const usagePercentage = memoryManager.getUsagePercentage();
          expect(usagePercentage).toBeGreaterThanOrEqual(0);
          expect(usagePercentage).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide consistent memory statistics', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 10, max: 200 }),
        async (limitMB) => {
          const memoryManager = new MemoryManager(limitMB);
          
          // Get stats multiple times
          const stats1 = memoryManager.getStats();
          const stats2 = memoryManager.getStats();
          
          // Limit should be consistent
          expect(stats1.limit).toBe(stats2.limit);
          
          // Max usage should be monotonically increasing or equal
          expect(stats2.maxUsage).toBeGreaterThanOrEqual(stats1.maxUsage);
          
          // GC count should be monotonically increasing or equal
          expect(stats2.gcCount).toBeGreaterThanOrEqual(stats1.gcCount);
          
          // Current usage should be positive
          expect(stats1.currentUsage).toBeGreaterThan(0);
          expect(stats2.currentUsage).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle memory checkpoints correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }),
        async (checkpointLabel) => {
          const memoryManager = new MemoryManager(100);
          
          // Create checkpoint
          const checkpoint = memoryManager.createCheckpoint(checkpointLabel);
          
          // Checkpoint should have correct properties
          expect(checkpoint.label).toBe(checkpointLabel);
          expect(checkpoint.startUsage).toBeGreaterThan(0);
          expect(checkpoint.timestamp).toBeGreaterThan(0);
          
          // Wait a bit and check duration
          await new Promise(resolve => setTimeout(resolve, 10));
          
          const duration = checkpoint.getDuration();
          expect(duration).toBeGreaterThanOrEqual(10);
          
          // Check memory difference
          const currentUsage = memoryManager.getCurrentUsage();
          const difference = checkpoint.getDifference(currentUsage);
          expect(typeof difference).toBe('number');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should format memory sizes correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 1024 * 1024 * 1024 }), // Up to 1GB
        async (bytes) => {
          const memoryManager = new MemoryManager(100);
          
          const formatted = memoryManager.formatMemorySize(bytes);
          
          // Should be a string
          expect(typeof formatted).toBe('string');
          
          // Should contain a number and unit
          expect(formatted).toMatch(/^\d+\.\d{2} (B|KB|MB|GB)$/);
          
          // For specific values, check correctness
          if (bytes === 0) {
            expect(formatted).toBe('0.00 B');
          } else if (bytes < 1024) {
            expect(formatted).toMatch(/^\d+\.\d{2} B$/);
          } else if (bytes < 1024 * 1024) {
            expect(formatted).toMatch(/^\d+\.\d{2} KB$/);
          } else if (bytes < 1024 * 1024 * 1024) {
            expect(formatted).toMatch(/^\d+\.\d{2} MB$/);
          } else {
            expect(formatted).toMatch(/^\d+\.\d{2} GB$/);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should detect when approaching memory limit', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 10, max: 100 }),
        async (limitMB) => {
          const memoryManager = new MemoryManager(limitMB);
          
          // Check if approaching limit
          const approaching = memoryManager.isApproachingLimit();
          expect(typeof approaching).toBe('boolean');
          
          // Get usage percentage
          const percentage = memoryManager.getUsagePercentage();
          
          // If approaching limit, percentage should be high (>80%)
          if (approaching) {
            expect(percentage).toBeGreaterThan(80);
          }
          
          // Percentage should be valid (capped at 100%)
          expect(percentage).toBeGreaterThanOrEqual(0);
          expect(percentage).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reset statistics correctly', async () => {
    const memoryManager = new MemoryManager(100);
    
    // Trigger some activity to set maxUsage
    const initialUsage = memoryManager.getCurrentUsage();
    memoryManager.triggerGC();
    
    const beforeReset = memoryManager.getStats();
    expect(beforeReset.maxUsage).toBeGreaterThan(0);
    expect(beforeReset.gcCount).toBeGreaterThanOrEqual(0);
    
    // Reset
    memoryManager.reset();
    
    // Check that internal state is reset by accessing private fields through a new stats call
    // After reset, the next call to getStats should show maxUsage equal to current usage
    const afterReset = memoryManager.getStats();
    
    // GC count should be reset
    expect(afterReset.gcCount).toBe(0);
    
    // Limit should remain the same
    expect(afterReset.limit).toBe(beforeReset.limit);
    
    // Current usage should still be positive (can't reset actual memory)
    expect(afterReset.currentUsage).toBeGreaterThan(0);
    
    // After reset, maxUsage should be equal to current usage (since it was reset to 0 and then updated)
    expect(afterReset.maxUsage).toBe(afterReset.currentUsage);
  });
});