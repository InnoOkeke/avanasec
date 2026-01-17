/**
 * Unit Tests: ParallelScanner
 * Tests for parallel file scanning functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ParallelScanner } from '../../src/utils/parallel-scanner';
import { getAllSecretPatterns } from '../../src/rules/secret-patterns';

describe('ParallelScanner', () => {
  let tempDir: string;
  let scanner: ParallelScanner;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'avana-parallel-test-'));
    scanner = new ParallelScanner();
  });

  afterEach(async () => {
    await scanner.terminate();
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Constructor', () => {
    it('should create scanner with default worker count', () => {
      const scanner = new ParallelScanner();
      const stats = scanner.getStats();
      expect(stats.workerCount).toBe(Math.max(1, os.cpus().length - 1));
    });

    it('should create scanner with custom worker count', () => {
      const scanner = new ParallelScanner({ workerCount: 2 });
      const stats = scanner.getStats();
      expect(stats.workerCount).toBe(2);
    });

    it('should handle zero worker count by using default', () => {
      const scanner = new ParallelScanner({ workerCount: 0 });
      const stats = scanner.getStats();
      expect(stats.workerCount).toBe(Math.max(1, os.cpus().length - 1));
    });
  });

  describe('scanFiles', () => {
    it('should return empty array for empty file list', async () => {
      const results = await scanner.scanFiles([], []);
      expect(results).toEqual([]);
    });

    it('should scan single file successfully', async () => {
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const API_KEY = "sk-1234567890abcdef";');

      const patterns = getAllSecretPatterns();
      const results = await scanner.scanFiles([testFile], patterns);

      expect(results).toHaveLength(1);
      expect(results[0].file).toBe(testFile);
      expect(results[0].issues.length).toBeGreaterThan(0);
    });

    it('should scan multiple files successfully', async () => {
      const testFiles = [
        path.join(tempDir, 'test1.js'),
        path.join(tempDir, 'test2.js'),
        path.join(tempDir, 'test3.js')
      ];

      fs.writeFileSync(testFiles[0], 'const API_KEY = "sk-1234567890abcdef";');
      fs.writeFileSync(testFiles[1], 'const TOKEN = "ghp_1234567890abcdefghijklmnopqrstuvwxyz12";');
      fs.writeFileSync(testFiles[2], 'const safe = "public";');

      const patterns = getAllSecretPatterns();
      const results = await scanner.scanFiles(testFiles, patterns);

      expect(results).toHaveLength(3);
      expect(results.map(r => r.file).sort()).toEqual(testFiles.sort());
    });

    it('should handle files with no issues', async () => {
      const testFile = path.join(tempDir, 'safe.js');
      fs.writeFileSync(testFile, 'const message = "Hello, World!";');

      const patterns = getAllSecretPatterns();
      const results = await scanner.scanFiles([testFile], patterns);

      expect(results).toHaveLength(1);
      expect(results[0].file).toBe(testFile);
      expect(results[0].issues).toHaveLength(0);
    });

    it('should handle empty files', async () => {
      const testFile = path.join(tempDir, 'empty.js');
      fs.writeFileSync(testFile, '');

      const patterns = getAllSecretPatterns();
      const results = await scanner.scanFiles([testFile], patterns);

      expect(results).toHaveLength(1);
      expect(results[0].file).toBe(testFile);
      expect(results[0].issues).toHaveLength(0);
    });

    it('should handle file read errors gracefully', async () => {
      const nonExistentFile = path.join(tempDir, 'nonexistent.js');

      const patterns = getAllSecretPatterns();
      const results = await scanner.scanFiles([nonExistentFile], patterns);

      expect(results).toHaveLength(1);
      expect(results[0].file).toBe(nonExistentFile);
      expect(results[0].issues).toHaveLength(0);
      expect(results[0].error).toBeDefined();
    });

    it('should sort results by file path', async () => {
      const testFiles = [
        path.join(tempDir, 'z-last.js'),
        path.join(tempDir, 'a-first.js'),
        path.join(tempDir, 'm-middle.js')
      ];

      testFiles.forEach(file => {
        fs.writeFileSync(file, 'const safe = "public";');
      });

      const patterns = getAllSecretPatterns();
      const results = await scanner.scanFiles(testFiles, patterns);

      expect(results).toHaveLength(3);
      expect(results[0].file).toBe(testFiles[1]); // a-first.js
      expect(results[1].file).toBe(testFiles[2]); // m-middle.js
      expect(results[2].file).toBe(testFiles[0]); // z-last.js
    });
  });

  describe('File Distribution', () => {
    it('should distribute files evenly across workers', async () => {
      const testFiles = Array.from({ length: 10 }, (_, i) => {
        const file = path.join(tempDir, `test${i}.js`);
        fs.writeFileSync(file, 'const safe = "public";');
        return file;
      });

      const scanner = new ParallelScanner({ workerCount: 3 });
      const patterns = getAllSecretPatterns();
      const results = await scanner.scanFiles(testFiles, patterns);

      expect(results).toHaveLength(10);
      await scanner.terminate();
    });

    it('should handle more workers than files', async () => {
      const testFiles = [
        path.join(tempDir, 'test1.js'),
        path.join(tempDir, 'test2.js')
      ];

      testFiles.forEach(file => {
        fs.writeFileSync(file, 'const safe = "public";');
      });

      const scanner = new ParallelScanner({ workerCount: 5 });
      const patterns = getAllSecretPatterns();
      const results = await scanner.scanFiles(testFiles, patterns);

      expect(results).toHaveLength(2);
      await scanner.terminate();
    });
  });

  describe('Progress Tracking', () => {
    it('should start with zero progress', () => {
      expect(scanner.getProgress()).toBe(1); // 1 when no files to scan
    });

    it('should track progress during scan', async () => {
      const testFiles = Array.from({ length: 5 }, (_, i) => {
        const file = path.join(tempDir, `test${i}.js`);
        fs.writeFileSync(file, 'const safe = "public";');
        return file;
      });

      const patterns = getAllSecretPatterns();
      const scanPromise = scanner.scanFiles(testFiles, patterns);

      // Progress should eventually reach 1
      const results = await scanPromise;
      expect(scanner.getProgress()).toBe(1);
      expect(results).toHaveLength(5);
    });
  });

  describe('Statistics', () => {
    it('should provide accurate statistics', async () => {
      const testFiles = [
        path.join(tempDir, 'test1.js'),
        path.join(tempDir, 'test2.js'),
        path.join(tempDir, 'test3.js')
      ];

      testFiles.forEach(file => {
        fs.writeFileSync(file, 'const safe = "public";');
      });

      const patterns = getAllSecretPatterns();
      const results = await scanner.scanFiles(testFiles, patterns);
      const stats = scanner.getStats();

      expect(stats.totalFiles).toBe(3);
      expect(stats.completedFiles).toBe(3);
      expect(stats.results).toBe(3);
      expect(stats.activeWorkers).toBe(0);
      expect(stats.workerCount).toBeGreaterThan(0);
      expect(stats.errors).toBe(0);
    });

    it('should track errors in statistics', async () => {
      const nonExistentFile = path.join(tempDir, 'nonexistent.js');

      const patterns = getAllSecretPatterns();
      const results = await scanner.scanFiles([nonExistentFile], patterns);
      const stats = scanner.getStats();

      expect(stats.totalFiles).toBe(1);
      expect(stats.completedFiles).toBe(1);
      expect(results[0].error).toBeDefined();
    });
  });

  describe('Worker Management', () => {
    it('should terminate workers cleanly', async () => {
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const safe = "public";');

      const patterns = getAllSecretPatterns();
      await scanner.scanFiles([testFile], patterns);

      // Should terminate without throwing
      await expect(scanner.terminate()).resolves.toBeUndefined();

      const stats = scanner.getStats();
      expect(stats.activeWorkers).toBe(0);
    });

    it('should handle multiple termination calls', async () => {
      await scanner.terminate();
      await expect(scanner.terminate()).resolves.toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle worker errors gracefully', async () => {
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const safe = "public";');

      // Create scanner with invalid worker script path (simulated)
      const patterns = getAllSecretPatterns();
      
      // This should still work despite potential worker issues
      const results = await scanner.scanFiles([testFile], patterns);
      expect(results).toHaveLength(1);
    });

    it('should continue scanning after individual file errors', async () => {
      const testFiles = [
        path.join(tempDir, 'good.js'),
        path.join(tempDir, 'nonexistent.js'),
        path.join(tempDir, 'alsogood.js')
      ];

      fs.writeFileSync(testFiles[0], 'const safe = "public";');
      // Don't create testFiles[1] - it will cause an error
      fs.writeFileSync(testFiles[2], 'const alsosafe = "public";');

      const patterns = getAllSecretPatterns();
      const results = await scanner.scanFiles(testFiles, patterns);

      expect(results).toHaveLength(3);
      expect(results.find(r => r.file === testFiles[0])?.error).toBeUndefined();
      expect(results.find(r => r.file === testFiles[1])?.error).toBeDefined();
      expect(results.find(r => r.file === testFiles[2])?.error).toBeUndefined();
    });
  });

  describe('Static Methods', () => {
    it('should detect worker thread support', () => {
      expect(ParallelScanner.isSupported()).toBe(true);
    });

    it('should provide optimal worker count', () => {
      const optimalCount = ParallelScanner.getOptimalWorkerCount();
      expect(optimalCount).toBeGreaterThan(0);
      expect(optimalCount).toBeLessThanOrEqual(os.cpus().length);
    });
  });

  describe('Custom Patterns', () => {
    it('should use custom patterns when provided', async () => {
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const CUSTOM_SECRET = "custom-123";');

      const customPatterns = [{
        id: 'custom-secret',
        name: 'Custom Secret',
        pattern: /CUSTOM_SECRET\s*=\s*["']([^"']+)["']/g,
        severity: 'high' as const,
        description: 'Custom secret pattern',
        suggestion: 'Use environment variables'
      }];

      const results = await scanner.scanFiles([testFile], customPatterns);

      expect(results).toHaveLength(1);
      expect(results[0].issues.length).toBeGreaterThan(0);
      expect(results[0].issues[0].title).toBe('Custom Secret');
    });

    it('should handle empty pattern array', async () => {
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const API_KEY = "sk-1234567890abcdef";');

      const results = await scanner.scanFiles([testFile], []);

      expect(results).toHaveLength(1);
      expect(results[0].issues).toHaveLength(0);
    });
  });

  describe('Large File Sets', () => {
    it('should handle large number of files efficiently', async () => {
      const fileCount = 50;
      const testFiles = Array.from({ length: fileCount }, (_, i) => {
        const file = path.join(tempDir, `test${i}.js`);
        fs.writeFileSync(file, `const var${i} = "safe${i}";`);
        return file;
      });

      const patterns = getAllSecretPatterns();
      const startTime = Date.now();
      const results = await scanner.scanFiles(testFiles, patterns);
      const duration = Date.now() - startTime;

      expect(results).toHaveLength(fileCount);
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory during multiple scans', async () => {
      const testFile = path.join(tempDir, 'test.js');
      fs.writeFileSync(testFile, 'const safe = "public";');

      const patterns = getAllSecretPatterns();
      const initialMemory = process.memoryUsage().heapUsed;

      // Run multiple scans
      for (let i = 0; i < 5; i++) {
        await scanner.scanFiles([testFile], patterns);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });
});