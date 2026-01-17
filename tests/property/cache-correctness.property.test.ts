/**
 * Property-Based Tests: Cache Correctness
 * Feature: avana-core, Property 14: Cache Correctness
 * **Validates: Requirements 2.3**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';
import { ResultCache } from '../../src/utils/result-cache';

describe('Feature: avana-core, Property 14: Cache Correctness', () => {
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

  it('should maintain cache consistency across get/set operations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({
          content: fc.string({ minLength: 0, maxLength: 1000 }),
          results: fc.array(fc.record({
            type: fc.constantFrom('secret', 'warning', 'info'),
            message: fc.string({ minLength: 1, maxLength: 100 }),
            line: fc.integer({ min: 1, max: 100 })
          }), { maxLength: 10 })
        }), { minLength: 1, maxLength: 20 }),
        async (testData) => {
          const cacheDir = path.join(tempDir, `cache-${Date.now()}`);
          const cache = new ResultCache(cacheDir, 1); // 1 hour expiry

          const files: string[] = [];
          
          // Create test files and cache their results
          for (let i = 0; i < testData.length; i++) {
            const { content, results } = testData[i];
            const filePath = createTestFile(content, `file-${i}.txt`);
            files.push(filePath);
            
            // Set cache entry
            cache.set(filePath, results);
            
            // Immediately verify we can get it back
            const cachedResults = cache.get(filePath);
            expect(cachedResults).toEqual(results);
          }

          // Verify all cached results are still accessible
          for (let i = 0; i < files.length; i++) {
            const cachedResults = cache.get(files[i]);
            expect(cachedResults).toEqual(testData[i].results);
          }

          // Save and reload cache
          cache.save();
          const newCache = new ResultCache(cacheDir, 1);

          // Verify all results are still accessible after reload
          for (let i = 0; i < files.length; i++) {
            const cachedResults = newCache.get(files[i]);
            expect(cachedResults).toEqual(testData[i].results);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should invalidate cache when files are modified', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }),
        fc.string({ minLength: 1, maxLength: 500 }),
        fc.array(fc.record({
          type: fc.constantFrom('secret', 'warning'),
          message: fc.string({ minLength: 1, maxLength: 50 })
        }), { maxLength: 5 }),
        async (originalContent, modifiedContent, results) => {
          // Skip if contents are the same
          if (originalContent === modifiedContent) {
            return;
          }

          const cacheDir = path.join(tempDir, `cache-${Date.now()}`);
          const cache = new ResultCache(cacheDir, 1);

          // Create file with original content
          const filePath = createTestFile(originalContent);
          
          // Cache results
          cache.set(filePath, results);
          
          // Verify cache hit
          let cachedResults = cache.get(filePath);
          expect(cachedResults).toEqual(results);

          // Wait a bit to ensure different modification time
          await new Promise(resolve => setTimeout(resolve, 10));

          // Modify file content
          fs.writeFileSync(filePath, modifiedContent, 'utf8');

          // Cache should now miss (file was modified)
          cachedResults = cache.get(filePath);
          expect(cachedResults).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle cache expiration correctly', async () => {
    const cacheDir = path.join(tempDir, `cache-${Date.now()}`);
    // Very short expiry time for testing (0.0001 hours = 0.36 seconds)
    const cache = new ResultCache(cacheDir, 0.0001);

    const filePath = createTestFile('test content');
    const results = [{ type: 'secret', message: 'test' }];
    
    // Cache results
    cache.set(filePath, results);
    
    // Should be cached immediately
    let cachedResults = cache.get(filePath);
    expect(cachedResults).toEqual(results);

    // Wait for expiration (wait longer than expiry time)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Should be expired now
    cachedResults = cache.get(filePath);
    expect(cachedResults).toBeNull();
  }, 15000); // 15 second timeout

  it('should track cache statistics accurately', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({
          content: fc.string({ minLength: 0, maxLength: 100 }),
          results: fc.array(fc.record({
            type: fc.constantFrom('secret', 'warning'),
            message: fc.string({ minLength: 1, maxLength: 50 })
          }), { maxLength: 3 })
        }), { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 1, max: 5 }), // Number of additional gets
        async (testData, additionalGets) => {
          const cacheDir = path.join(tempDir, `cache-${Date.now()}`);
          const cache = new ResultCache(cacheDir, 1);

          let expectedHits = 0;
          let expectedMisses = 0;
          const files: string[] = [];

          // Create files and cache results
          for (let i = 0; i < testData.length; i++) {
            const { content, results } = testData[i];
            const filePath = createTestFile(content, `stats-file-${i}.txt`);
            files.push(filePath);
            
            cache.set(filePath, results);
            
            // First get should be a hit
            const cachedResults = cache.get(filePath);
            expect(cachedResults).toEqual(results);
            expectedHits++;
          }

          // Additional gets should all be hits
          for (let i = 0; i < additionalGets; i++) {
            const randomFile = files[i % files.length];
            const cachedResults = cache.get(randomFile);
            expect(cachedResults).toEqual(testData[i % testData.length].results);
            expectedHits++;
          }

          // Try to get non-existent file (should be miss)
          const nonExistentFile = path.join(tempDir, 'non-existent.txt');
          const missResult = cache.get(nonExistentFile);
          expect(missResult).toBeNull();
          expectedMisses++;

          // Verify statistics
          const stats = cache.getStats();
          expect(stats.hitCount).toBe(expectedHits);
          expect(stats.missCount).toBe(expectedMisses);
          expect(stats.totalEntries).toBe(testData.length);
          
          const expectedHitRate = (expectedHits / (expectedHits + expectedMisses)) * 100;
          expect(Math.abs(stats.hitRate - expectedHitRate)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle file deletion correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 200 }),
        fc.array(fc.record({
          type: fc.constantFrom('secret', 'warning'),
          message: fc.string({ minLength: 1, maxLength: 50 })
        }), { maxLength: 5 }),
        async (content, results) => {
          const cacheDir = path.join(tempDir, `cache-${Date.now()}`);
          const cache = new ResultCache(cacheDir, 1);

          const filePath = createTestFile(content);
          
          // Cache results
          cache.set(filePath, results);
          
          // Verify cache hit
          let cachedResults = cache.get(filePath);
          expect(cachedResults).toEqual(results);

          // Delete the file
          fs.unlinkSync(filePath);

          // Cache should now miss (file doesn't exist)
          cachedResults = cache.get(filePath);
          expect(cachedResults).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle cache cleanup correctly', async () => {
    const cacheDir = path.join(tempDir, `cache-${Date.now()}`);
    // Very short expiry for testing (0.0001 hours = 0.36 seconds)
    const cache = new ResultCache(cacheDir, 0.0001);

    // Add some entries
    const filePath1 = createTestFile('content1');
    const filePath2 = createTestFile('content2');
    
    cache.set(filePath1, [{ type: 'secret', message: 'test1' }]);
    cache.set(filePath2, [{ type: 'secret', message: 'test2' }]);

    // Verify entries exist
    expect(cache.getStats().totalEntries).toBe(2);

    // Wait for expiration (wait longer than expiry time)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Cleanup should remove expired entries
    const removedCount = cache.cleanup();
    expect(removedCount).toBeGreaterThan(0);
    expect(cache.getStats().totalEntries).toBe(0);
  });

  it('should persist cache across instances', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({
          content: fc.string({ minLength: 1, maxLength: 100 }),
          results: fc.array(fc.record({
            type: fc.constantFrom('secret', 'info'),
            message: fc.string({ minLength: 1, maxLength: 30 })
          }), { maxLength: 3 })
        }), { minLength: 1, maxLength: 5 }),
        async (testData) => {
          const cacheDir = path.join(tempDir, `cache-${Date.now()}`);
          
          // First cache instance
          const cache1 = new ResultCache(cacheDir, 1);
          const files: string[] = [];

          // Cache some results
          for (let i = 0; i < testData.length; i++) {
            const { content, results } = testData[i];
            const filePath = createTestFile(content, `persist-${i}.txt`);
            files.push(filePath);
            cache1.set(filePath, results);
          }

          // Save cache
          cache1.save();

          // Create new cache instance (should load from disk)
          const cache2 = new ResultCache(cacheDir, 1);

          // Verify all results are accessible from new instance
          for (let i = 0; i < files.length; i++) {
            const cachedResults = cache2.get(files[i]);
            expect(cachedResults).toEqual(testData[i].results);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});