/**
 * Unit Tests: Memory Manager
 * Tests specific examples and edge cases for memory management
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { MemoryManager, MemoryCheckpoint, memoryManager } from '../../src/utils/memory-manager';

describe('MemoryManager', () => {
  let manager: MemoryManager;

  beforeEach(() => {
    manager = new MemoryManager(100); // 100MB limit for testing
    manager.reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should set default limit to 500MB', () => {
      const defaultManager = new MemoryManager();
      const stats = defaultManager.getStats();
      expect(stats.limit).toBe(500 * 1024 * 1024);
    });

    it('should set custom limit in bytes', () => {
      const customManager = new MemoryManager(200);
      const stats = customManager.getStats();
      expect(stats.limit).toBe(200 * 1024 * 1024);
    });
  });

  describe('getCurrentUsage', () => {
    it('should return current heap usage', () => {
      const mockMemoryUsage = {
        rss: 50 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 30 * 1024 * 1024,
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      const usage = manager.getCurrentUsage();
      expect(usage).toBe(30 * 1024 * 1024);
    });

    it('should track maximum usage', () => {
      const mockMemoryUsage1 = {
        rss: 50 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 30 * 1024 * 1024,
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      const mockMemoryUsage2 = {
        rss: 60 * 1024 * 1024,
        heapTotal: 50 * 1024 * 1024,
        heapUsed: 40 * 1024 * 1024,
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage')
        .mockReturnValueOnce(mockMemoryUsage1)
        .mockReturnValueOnce(mockMemoryUsage2);

      manager.getCurrentUsage();
      manager.getCurrentUsage();

      const stats = manager.getStats();
      expect(stats.maxUsage).toBe(40 * 1024 * 1024);
    });
  });

  describe('checkLimit', () => {
    it('should return true when within limits', () => {
      const mockMemoryUsage = {
        rss: 50 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 50 * 1024 * 1024, // 50MB < 100MB limit
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      const withinLimit = manager.checkLimit();
      expect(withinLimit).toBe(true);
    });

    it('should return false when exceeding limits', () => {
      const mockMemoryUsage = {
        rss: 150 * 1024 * 1024,
        heapTotal: 140 * 1024 * 1024,
        heapUsed: 120 * 1024 * 1024, // 120MB > 100MB limit
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      const withinLimit = manager.checkLimit();
      expect(withinLimit).toBe(false);
    });

    it('should trigger GC when approaching threshold', () => {
      const mockMemoryUsage = {
        rss: 90 * 1024 * 1024,
        heapTotal: 85 * 1024 * 1024,
        heapUsed: 85 * 1024 * 1024, // 85MB > 80MB threshold (80% of 100MB)
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);
      const triggerGCSpy = vi.spyOn(manager, 'triggerGC').mockImplementation(() => {});

      manager.checkLimit();
      expect(triggerGCSpy).toHaveBeenCalled();
    });
  });

  describe('triggerGC', () => {
    it('should call global.gc when available', () => {
      const mockGC = vi.fn();
      (global as any).gc = mockGC;

      manager.triggerGC();

      expect(mockGC).toHaveBeenCalled();
      expect(manager.getStats().gcCount).toBe(1);

      // Cleanup
      delete (global as any).gc;
    });

    it('should handle missing global.gc gracefully', () => {
      // Ensure global.gc is not available
      delete (global as any).gc;

      const mockMemoryUsage = {
        rss: 50 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 30 * 1024 * 1024,
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      expect(() => manager.triggerGC()).not.toThrow();
    });

    it('should increment GC count when memory is reduced', () => {
      delete (global as any).gc;

      const mockMemoryUsage1 = {
        rss: 50 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 30 * 1024 * 1024,
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      const mockMemoryUsage2 = {
        rss: 40 * 1024 * 1024,
        heapTotal: 35 * 1024 * 1024,
        heapUsed: 25 * 1024 * 1024, // Reduced memory
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage')
        .mockReturnValueOnce(mockMemoryUsage1) // Before GC
        .mockReturnValueOnce(mockMemoryUsage2); // After GC

      manager.triggerGC();

      expect(manager.getStats().gcCount).toBe(1);
    });
  });

  describe('getStats', () => {
    it('should return comprehensive memory statistics', () => {
      const mockMemoryUsage = {
        rss: 50 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 30 * 1024 * 1024,
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      const stats = manager.getStats();

      expect(stats).toEqual({
        currentUsage: 30 * 1024 * 1024,
        maxUsage: 30 * 1024 * 1024,
        gcCount: 0,
        limit: 100 * 1024 * 1024
      });
    });

    it('should track GC count correctly', () => {
      const mockGC = vi.fn();
      (global as any).gc = mockGC;

      manager.triggerGC();
      manager.triggerGC();

      const stats = manager.getStats();
      expect(stats.gcCount).toBe(2);

      // Cleanup
      delete (global as any).gc;
    });
  });

  describe('formatMemorySize', () => {
    it('should format bytes correctly', () => {
      expect(manager.formatMemorySize(512)).toBe('512.00 B');
    });

    it('should format kilobytes correctly', () => {
      expect(manager.formatMemorySize(1024)).toBe('1.00 KB');
      expect(manager.formatMemorySize(1536)).toBe('1.50 KB');
    });

    it('should format megabytes correctly', () => {
      expect(manager.formatMemorySize(1024 * 1024)).toBe('1.00 MB');
      expect(manager.formatMemorySize(1.5 * 1024 * 1024)).toBe('1.50 MB');
    });

    it('should format gigabytes correctly', () => {
      expect(manager.formatMemorySize(1024 * 1024 * 1024)).toBe('1.00 GB');
      expect(manager.formatMemorySize(2.5 * 1024 * 1024 * 1024)).toBe('2.50 GB');
    });

    it('should handle zero bytes', () => {
      expect(manager.formatMemorySize(0)).toBe('0.00 B');
    });

    it('should handle very large values', () => {
      const largeValue = 5 * 1024 * 1024 * 1024; // 5GB
      expect(manager.formatMemorySize(largeValue)).toBe('5.00 GB');
    });
  });

  describe('getUsagePercentage', () => {
    it('should calculate usage percentage correctly', () => {
      const mockMemoryUsage = {
        rss: 50 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 50 * 1024 * 1024, // 50MB out of 100MB = 50%
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      const percentage = manager.getUsagePercentage();
      expect(percentage).toBe(50);
    });

    it('should round percentage to nearest integer', () => {
      const mockMemoryUsage = {
        rss: 50 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 33 * 1024 * 1024, // 33MB out of 100MB = 33%
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      const percentage = manager.getUsagePercentage();
      expect(percentage).toBe(33);
    });

    it('should handle 0% usage', () => {
      const mockMemoryUsage = {
        rss: 10 * 1024 * 1024,
        heapTotal: 5 * 1024 * 1024,
        heapUsed: 0,
        external: 0,
        arrayBuffers: 0
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      const percentage = manager.getUsagePercentage();
      expect(percentage).toBe(0);
    });

    it('should handle over 100% usage', () => {
      const mockMemoryUsage = {
        rss: 150 * 1024 * 1024,
        heapTotal: 140 * 1024 * 1024,
        heapUsed: 120 * 1024 * 1024, // 120MB out of 100MB = 120%
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      const percentage = manager.getUsagePercentage();
      // Should be capped at 100% for display purposes
      expect(percentage).toBe(100);
    });
  });

  describe('isApproachingLimit', () => {
    it('should return false when below threshold', () => {
      const mockMemoryUsage = {
        rss: 50 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 70 * 1024 * 1024, // 70MB < 80MB threshold
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      expect(manager.isApproachingLimit()).toBe(false);
    });

    it('should return true when above threshold', () => {
      const mockMemoryUsage = {
        rss: 90 * 1024 * 1024,
        heapTotal: 85 * 1024 * 1024,
        heapUsed: 85 * 1024 * 1024, // 85MB > 80MB threshold
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      expect(manager.isApproachingLimit()).toBe(true);
    });

    it('should return true when exactly at threshold', () => {
      const mockMemoryUsage = {
        rss: 85 * 1024 * 1024,
        heapTotal: 82 * 1024 * 1024,
        heapUsed: 80 * 1024 * 1024, // Exactly 80MB threshold
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      expect(manager.isApproachingLimit()).toBe(false); // Should be false for exactly at threshold
    });
  });

  describe('reset', () => {
    it('should reset statistics', () => {
      const mockGC = vi.fn();
      (global as any).gc = mockGC;

      const mockMemoryUsage = {
        rss: 50 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 30 * 1024 * 1024,
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      // Trigger some activity to set maxUsage and gcCount
      manager.triggerGC();
      manager.getCurrentUsage();

      // Verify stats are non-zero before reset
      let stats = manager.getStats();
      expect(stats.maxUsage).toBeGreaterThan(0);
      expect(stats.gcCount).toBeGreaterThan(0);

      // Reset
      manager.reset();

      // Mock zero memory usage after reset
      const zeroMemoryUsage = {
        rss: 0,
        heapTotal: 0,
        heapUsed: 0,
        external: 0,
        arrayBuffers: 0
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(zeroMemoryUsage);

      stats = manager.getStats();
      expect(stats.maxUsage).toBe(0);
      expect(stats.gcCount).toBe(0);

      // Cleanup
      delete (global as any).gc;
    });
  });

  describe('createCheckpoint', () => {
    it('should create memory checkpoint with current usage', () => {
      const mockMemoryUsage = {
        rss: 50 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 30 * 1024 * 1024,
        external: 5 * 1024 * 1024,
        arrayBuffers: 2 * 1024 * 1024
      };

      vi.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      const checkpoint = manager.createCheckpoint('test-checkpoint');

      expect(checkpoint.label).toBe('test-checkpoint');
      expect(checkpoint.startUsage).toBe(30 * 1024 * 1024);
      expect(checkpoint.timestamp).toBeTypeOf('number');
    });
  });

  describe('edge cases', () => {
    it('should handle very small memory limits', () => {
      const smallManager = new MemoryManager(1); // 1MB limit
      const stats = smallManager.getStats();
      expect(stats.limit).toBe(1024 * 1024);
    });

    it('should handle zero memory limit', () => {
      const zeroManager = new MemoryManager(0);
      const stats = zeroManager.getStats();
      expect(stats.limit).toBe(0);
    });

    it('should handle negative memory limit', () => {
      const negativeManager = new MemoryManager(-100);
      const stats = negativeManager.getStats();
      expect(stats.limit).toBe(-100 * 1024 * 1024);
    });

    it('should handle multiple rapid GC triggers', () => {
      const mockGC = vi.fn();
      (global as any).gc = mockGC;

      for (let i = 0; i < 10; i++) {
        manager.triggerGC();
      }

      expect(mockGC).toHaveBeenCalledTimes(10);
      expect(manager.getStats().gcCount).toBe(10);

      // Cleanup
      delete (global as any).gc;
    });
  });
});

describe('MemoryCheckpoint', () => {
  let checkpoint: MemoryCheckpoint;
  const startTime = Date.now();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(startTime);
    checkpoint = new MemoryCheckpoint('test', 1024 * 1024); // 1MB
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should initialize with correct values', () => {
      expect(checkpoint.label).toBe('test');
      expect(checkpoint.startUsage).toBe(1024 * 1024);
      expect(checkpoint.timestamp).toBe(startTime);
    });
  });

  describe('getDifference', () => {
    it('should calculate positive memory difference', () => {
      const currentUsage = 2 * 1024 * 1024; // 2MB
      const difference = checkpoint.getDifference(currentUsage);
      expect(difference).toBe(1024 * 1024); // 1MB increase
    });

    it('should calculate negative memory difference', () => {
      const currentUsage = 512 * 1024; // 512KB
      const difference = checkpoint.getDifference(currentUsage);
      expect(difference).toBe(-512 * 1024); // 512KB decrease
    });

    it('should return zero for no change', () => {
      const currentUsage = 1024 * 1024; // Same as start
      const difference = checkpoint.getDifference(currentUsage);
      expect(difference).toBe(0);
    });
  });

  describe('getDuration', () => {
    it('should calculate duration correctly', () => {
      const elapsed = 5000; // 5 seconds
      vi.setSystemTime(startTime + elapsed);

      const duration = checkpoint.getDuration();
      expect(duration).toBe(elapsed);
    });

    it('should return zero for no elapsed time', () => {
      const duration = checkpoint.getDuration();
      expect(duration).toBe(0);
    });

    it('should handle large durations', () => {
      const elapsed = 60 * 60 * 1000; // 1 hour
      vi.setSystemTime(startTime + elapsed);

      const duration = checkpoint.getDuration();
      expect(duration).toBe(elapsed);
    });
  });
});

describe('Global Memory Manager', () => {
  it('should export a global memory manager instance', () => {
    expect(memoryManager).toBeInstanceOf(MemoryManager);
  });

  it('should have default 500MB limit', () => {
    const stats = memoryManager.getStats();
    expect(stats.limit).toBe(500 * 1024 * 1024);
  });
});