/**
 * Unit Tests: Result Cache
 * Tests the ResultCache class functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ResultCache, initializeResultCache, getResultCache } from '../../src/utils/result-cache';

describe('ResultCache', () => {
  let tempDir: string;
  let testFiles: string[] = [];

  beforeEach(() => {
    // Create temporary directory for testing
    tempDir = path.join(__dirname, '..', 'temp', `cache-test-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    testFiles = [];
  });

  afterEach(() => {
    // Clean up test files and directory
    for (const file of testFiles) {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  function createTestFile(content: string, fileName?: string): string {
    const filePath = path.join(tempDir, fileName || `test-${Date.now()}-${Math.random()}.txt`);
    fs.writeFileSync(filePath, content, 'utf8');
    testFiles.push(filePath);
    return filePath;
  }

  describe('constructor', () => {
    it('should create cache with default settings', () => {
      const cache = new ResultCache();
      expect(cache).toBeDefined();
      expect(cache.getCacheDir()).toContain('.avana-cache');
    });

    it('should create cache with custom directory', () => {
      const customDir = path.join(tempDir, 'custom-cache');
      const cache = new ResultCache(customDir);
      expect(cache.getCacheDir()).toBe(path.resolve(customDir));
    });

    it('should create cache with custom max age', () => {
      const cache = new ResultCache(undefined, 12); // 12 hours
      expect(cache).toBeDefined();
    });

    it('should create cache directory if it does not exist', () => {
      const cacheDir = path.join(tempDir, 'new-cache-dir');
      expect(fs.existsSync(cacheDir)).toBe(false);
      
      new ResultCache(cacheDir);
      expect(fs.existsSync(cacheDir)).toBe(true);
    });
  });

  describe('get and set operations', () => {
    it('should return null for non-existent cache entry', () => {
      const cache = new ResultCache(path.join(tempDir, 'cache1'));
      const filePath = createTestFile('content');
      
      const result = cache.get(filePath);
      expect(result).toBeNull();
    });

    it('should cache and retrieve results', () => {
      const cache = new ResultCache(path.join(tempDir, 'cache2'));
      const filePath = createTestFile('test content');
      const results = [
        { type: 'secret', message: 'API key found', line: 1 },
        { type: 'warning', message: 'Suspicious pattern', line: 5 }
      ];

      cache.set(filePath, results);
      const cachedResults = cache.get(filePath);
      
      expect(cachedResults).toEqual(results);
    });

    it('should handle empty results array', () => {
      const cache = new ResultCache(path.join(tempDir, 'cache3'));
      const filePath = createTestFile('clean content');
      const results: any[] = [];

      cache.set(filePath, results);
      const cachedResults = cache.get(filePath);
      
      expect(cachedResults).toEqual([]);
    });

    it('should handle multiple files', () => {
      const cache = new ResultCache(path.join(tempDir, 'cache4'));
      const file1 = createTestFile('content1');
      const file2 = createTestFile('content2');
      const results1 = [{ type: 'secret', message: 'secret1' }];
      const results2 = [{ type: 'warning', message: 'warning1' }];

      cache.set(file1, results1);
      cache.set(file2, results2);

      expect(cache.get(file1)).toEqual(results1);
      expect(cache.get(file2)).toEqual(results2);
    });

    it('should return null for non-existent file', () => {
      const cache = new ResultCache(path.join(tempDir, 'cache5'));
      const nonExistentFile = path.join(tempDir, 'does-not-exist.txt');
      
      const result = cache.get(nonExistentFile);
      expect(result).toBeNull();
    });

    it('should handle file path normalization', () => {
      const cache = new ResultCache(path.join(tempDir, 'cache6'));
      const filePath = createTestFile('content');
      const results = [{ type: 'info', message: 'test' }];

      // Set with relative path
      const relativePath = path.relative(process.cwd(), filePath);
      cache.set(relativePath, results);

      // Get with absolute path
      const cachedResults = cache.get(filePath);
      expect(cachedResults).toEqual(results);
    });
  });

  describe('file modification detection', () => {
    it('should invalidate cache when file is modified', async () => {
      const cache = new ResultCache(path.join(tempDir, 'cache7'));
      const filePath = createTestFile('original content');
      const results = [{ type: 'secret', message: 'original' }];

      cache.set(filePath, results);
      expect(cache.get(filePath)).toEqual(results);

      // Wait a bit to ensure different modification time
      await new Promise(resolve => setTimeout(resolve, 10));

      // Modify file
      fs.writeFileSync(filePath, 'modified content', 'utf8');

      // Cache should miss now
      expect(cache.get(filePath)).toBeNull();
    });

    it('should invalidate cache when file is deleted', () => {
      const cache = new ResultCache(path.join(tempDir, 'cache8'));
      const filePath = createTestFile('content');
      const results = [{ type: 'warning', message: 'test' }];

      cache.set(filePath, results);
      expect(cache.get(filePath)).toEqual(results);

      // Delete file
      fs.unlinkSync(filePath);

      // Cache should miss now
      expect(cache.get(filePath)).toBeNull();
    });

    it('should handle file size changes', async () => {
      const cache = new ResultCache(path.join(tempDir, 'cache9'));
      const filePath = createTestFile('short');
      const results = [{ type: 'info', message: 'short file' }];

      cache.set(filePath, results);
      expect(cache.get(filePath)).toEqual(results);

      // Wait a bit to ensure different modification time
      await new Promise(resolve => setTimeout(resolve, 10));

      // Change file size
      fs.writeFileSync(filePath, 'much longer content that changes the file size significantly', 'utf8');

      // Cache should miss now
      expect(cache.get(filePath)).toBeNull();
    });
  });

  describe('cache expiration', () => {
    it('should expire entries after max age', async () => {
      // Very short expiry for testing (0.0001 hours = 0.36 seconds)
      const cache = new ResultCache(path.join(tempDir, 'cache10'), 0.0001);
      const filePath = createTestFile('content');
      const results = [{ type: 'secret', message: 'expires soon' }];

      cache.set(filePath, results);
      expect(cache.get(filePath)).toEqual(results);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 500));

      // Should be expired
      expect(cache.get(filePath)).toBeNull();
    });

    it('should not expire entries before max age', () => {
      // Long expiry (24 hours)
      const cache = new ResultCache(path.join(tempDir, 'cache11'), 24);
      const filePath = createTestFile('content');
      const results = [{ type: 'warning', message: 'should not expire' }];

      cache.set(filePath, results);
      expect(cache.get(filePath)).toEqual(results);

      // Should still be cached
      expect(cache.get(filePath)).toEqual(results);
    });
  });

  describe('statistics tracking', () => {
    it('should track cache hits and misses', () => {
      const cache = new ResultCache(path.join(tempDir, 'cache12'));
      const filePath = createTestFile('content');
      const results = [{ type: 'info', message: 'test' }];

      // Initial stats
      let stats = cache.getStats();
      expect(stats.hitCount).toBe(0);
      expect(stats.missCount).toBe(0);
      expect(stats.totalEntries).toBe(0);

      // Miss
      cache.get(filePath);
      stats = cache.getStats();
      expect(stats.hitCount).toBe(0);
      expect(stats.missCount).toBe(1);

      // Set and hit
      cache.set(filePath, results);
      cache.get(filePath);
      stats = cache.getStats();
      expect(stats.hitCount).toBe(1);
      expect(stats.missCount).toBe(1);
      expect(stats.totalEntries).toBe(1);
    });

    it('should calculate hit rate correctly', () => {
      const cache = new ResultCache(path.join(tempDir, 'cache13'));
      const filePath = createTestFile('content');
      const results = [{ type: 'secret', message: 'test' }];

      cache.set(filePath, results);
      
      // 3 hits, 1 miss = 75% hit rate
      cache.get(filePath); // hit
      cache.get(filePath); // hit
      cache.get(filePath); // hit
      cache.get('non-existent.txt'); // miss

      const stats = cache.getStats();
      expect(stats.hitCount).toBe(3);
      expect(stats.missCount).toBe(1);
      expect(stats.hitRate).toBe(75);
    });

    it('should handle zero requests for hit rate', () => {
      const cache = new ResultCache(path.join(tempDir, 'cache14'));
      const stats = cache.getStats();
      expect(stats.hitRate).toBe(0);
    });

    it('should track cache size', () => {
      const cache = new ResultCache(path.join(tempDir, 'cache15'));
      const filePath = createTestFile('content');
      const results = [{ type: 'warning', message: 'test message' }];

      let stats = cache.getStats();
      expect(stats.cacheSize).toBe(0);

      cache.set(filePath, results);
      stats = cache.getStats();
      expect(stats.cacheSize).toBeGreaterThan(0);
    });

    it('should count expired entries', async () => {
      const cache = new ResultCache(path.join(tempDir, 'cache16'), 0.0001);
      const filePath = createTestFile('content');
      const results = [{ type: 'info', message: 'expires' }];

      cache.set(filePath, results);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 500));

      const stats = cache.getStats();
      expect(stats.expiredEntries).toBeGreaterThan(0);
    });
  });

  describe('cache persistence', () => {
    it('should save and load cache from disk', () => {
      const cacheDir = path.join(tempDir, 'persistent-cache');
      const filePath = createTestFile('persistent content');
      const results = [{ type: 'secret', message: 'persistent secret' }];

      // First cache instance
      const cache1 = new ResultCache(cacheDir);
      cache1.set(filePath, results);
      cache1.save();

      // Second cache instance should load from disk
      const cache2 = new ResultCache(cacheDir);
      const cachedResults = cache2.get(filePath);
      expect(cachedResults).toEqual(results);
    });

    it('should handle missing cache file gracefully', () => {
      const cacheDir = path.join(tempDir, 'empty-cache');
      const cache = new ResultCache(cacheDir);
      
      // Should not throw error
      expect(cache.getStats().totalEntries).toBe(0);
    });

    it('should handle corrupted cache file gracefully', () => {
      const cacheDir = path.join(tempDir, 'corrupted-cache');
      fs.mkdirSync(cacheDir, { recursive: true });
      
      // Write corrupted cache file
      const cacheFile = path.join(cacheDir, 'scan-results.json');
      fs.writeFileSync(cacheFile, 'invalid json content', 'utf8');

      // Should not throw error and start with empty cache
      const cache = new ResultCache(cacheDir);
      expect(cache.getStats().totalEntries).toBe(0);
    });

    it('should not save if cache is not dirty', () => {
      const cacheDir = path.join(tempDir, 'clean-cache');
      const cache = new ResultCache(cacheDir);
      
      // Save without any changes
      cache.save();
      
      // Cache file should not exist
      const cacheFile = path.join(cacheDir, 'scan-results.json');
      expect(fs.existsSync(cacheFile)).toBe(false);
    });
  });

  describe('cache cleanup', () => {
    it('should remove expired entries', async () => {
      const cache = new ResultCache(path.join(tempDir, 'cleanup-cache'), 0.0001);
      const filePath1 = createTestFile('content1');
      const filePath2 = createTestFile('content2');

      cache.set(filePath1, [{ type: 'secret', message: 'test1' }]);
      cache.set(filePath2, [{ type: 'warning', message: 'test2' }]);

      expect(cache.getStats().totalEntries).toBe(2);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 500));

      const removedCount = cache.cleanup();
      expect(removedCount).toBeGreaterThan(0);
      expect(cache.getStats().totalEntries).toBe(0);
    });

    it('should not remove non-expired entries', () => {
      const cache = new ResultCache(path.join(tempDir, 'no-cleanup-cache'), 24);
      const filePath = createTestFile('content');

      cache.set(filePath, [{ type: 'info', message: 'should stay' }]);
      expect(cache.getStats().totalEntries).toBe(1);

      const removedCount = cache.cleanup();
      expect(removedCount).toBe(0);
      expect(cache.getStats().totalEntries).toBe(1);
    });
  });

  describe('cache operations', () => {
    it('should clear all cache entries', () => {
      const cache = new ResultCache(path.join(tempDir, 'clear-cache'));
      const filePath1 = createTestFile('content1');
      const filePath2 = createTestFile('content2');

      cache.set(filePath1, [{ type: 'secret', message: 'test1' }]);
      cache.set(filePath2, [{ type: 'warning', message: 'test2' }]);

      expect(cache.getStats().totalEntries).toBe(2);

      cache.clear();

      expect(cache.getStats().totalEntries).toBe(0);
      expect(cache.getStats().hitCount).toBe(0);
      expect(cache.getStats().missCount).toBe(0);
    });

    it('should check if cache is enabled', () => {
      const cache = new ResultCache(path.join(tempDir, 'enabled-cache'));
      expect(cache.isEnabled()).toBe(true);
    });

    it('should get cache file size', () => {
      const cache = new ResultCache(path.join(tempDir, 'size-cache'));
      const filePath = createTestFile('content');

      // Initially no cache file
      expect(cache.getCacheFileSize()).toBe(0);

      // After saving, should have size
      cache.set(filePath, [{ type: 'info', message: 'test' }]);
      cache.save();
      expect(cache.getCacheFileSize()).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('should handle file access errors gracefully', () => {
      const cache = new ResultCache(path.join(tempDir, 'error-cache'));
      
      // Try to get cache for a path that will cause an error
      const invalidPath = '\0invalid\0path';
      
      // Should not throw and return null
      expect(() => cache.get(invalidPath)).not.toThrow();
      expect(cache.get(invalidPath)).toBeNull();
    });

    it('should handle set errors gracefully', () => {
      const cache = new ResultCache(path.join(tempDir, 'set-error-cache'));
      const invalidPath = '\0invalid\0path';
      const results = [{ type: 'test', message: 'test' }];
      
      // Should not throw
      expect(() => cache.set(invalidPath, results)).not.toThrow();
    });

    it('should handle save errors gracefully', () => {
      // Create cache in a read-only directory (simulate permission error)
      const readOnlyDir = path.join(tempDir, 'readonly');
      fs.mkdirSync(readOnlyDir, { recursive: true });
      
      const cache = new ResultCache(readOnlyDir);
      const filePath = createTestFile('content');
      
      cache.set(filePath, [{ type: 'test', message: 'test' }]);
      
      // Should not throw even if save fails
      expect(() => cache.save()).not.toThrow();
    });
  });

  describe('global cache functions', () => {
    it('should initialize and get global cache', () => {
      const cache = initializeResultCache(path.join(tempDir, 'global-cache'));
      expect(cache).toBeDefined();
      
      const globalCache = getResultCache();
      expect(globalCache).toBe(cache);
    });

    it('should handle multiple initializations', () => {
      const cache1 = initializeResultCache(path.join(tempDir, 'global-cache-1'));
      const cache2 = initializeResultCache(path.join(tempDir, 'global-cache-2'));
      
      // Second initialization should return new cache
      expect(cache2).toBeDefined();
      expect(cache2).not.toBe(cache1);
      
      // Global cache should be the latest one
      const globalCache = getResultCache();
      expect(globalCache).toBe(cache2);
    });
  });
});