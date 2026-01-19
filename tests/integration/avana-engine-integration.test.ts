/**
 * Avana Engine Integration Tests
 * Tests the complete integrated Avana engine with all robust components
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { Avana } from '../../src/index';
import type { ScanOptions } from '../../src/types';

describe('Avana Engine Integration', () => {
  let avana: Avana;
  let testDir: string;

  beforeEach(() => {
    avana = new Avana({
      debugMode: false,
      maxMemoryMB: 100, // Lower limit for testing
      cacheDir: path.join(__dirname, '../temp/integration-cache'),
      workerCount: 1 // Use single worker to avoid complexity
    });
    
    // Create test directory
    testDir = path.join(__dirname, '../temp/integration-test');
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Cleanup
    try {
      await avana.cleanup();
    } catch (error) {
      // Ignore cleanup errors in tests
    }
    
    // Remove test directory
    if (fs.existsSync(testDir)) {
      try {
        fs.rmSync(testDir, { recursive: true, force: true });
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  describe('Full Scan Workflow', () => {
    it('should perform complete scan with all components integrated', async () => {
      // Create test files with various characteristics
      const files = {
        'config.env': 'API_KEY=sk_test_1234567890abcdef\nDATABASE_URL=postgres://user:pass@localhost/db',
        'normal-file.js': 'const config = { apiKey: "test" };',
        '.gitignore': 'node_modules/\n*.log'
      };

      // Write test files
      for (const [filePath, content] of Object.entries(files)) {
        const fullPath = path.join(testDir, filePath);
        const dir = path.dirname(fullPath);
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, content, 'utf8');
      }

      // Perform scan
      const options: ScanOptions = {
        path: testDir,
        verbose: false, // Reduce noise in tests
        config: {
          enabled: true,
          scanOnCommit: false,
          scanOnPush: false,
          blockOnCritical: false,
          rules: {
            secrets: { enabled: true, patterns: [] },
            dependencies: { enabled: false, checkVulnerabilities: false, minSeverity: 'low' },
            codePatterns: { enabled: false, checks: [] }
          },
          ignore: ['*.log'],
          notifications: { cli: true, web: false, email: false }
        }
      };

      const result = await avana.scan(options);

      // Verify scan results
      expect(result.success).toBe(true);
      expect(result.filesScanned).toBeGreaterThan(0);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.securityScore).toBeDefined();
      expect(result.scoreBreakdown).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);

      // Verify issues were found
      const secretIssues = result.issues.filter(issue => issue.type === 'secret');
      expect(secretIssues.length).toBeGreaterThan(0);

      // Verify config.env file was scanned and secrets found
      const configIssues = result.issues.filter(issue => issue.file.includes('config.env'));
      expect(configIssues.length).toBeGreaterThan(0);
    });

    it('should handle binary file exclusion', async () => {
      // Create binary file
      const binaryFile = path.join(testDir, 'binary-file.png');
      const binaryContent = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]); // PNG header
      fs.writeFileSync(binaryFile, binaryContent);

      // Create text file with secret
      const textFile = path.join(testDir, 'text-file.txt');
      fs.writeFileSync(textFile, 'API_KEY=sk_test_binary_exclusion', 'utf8');

      const options: ScanOptions = {
        path: testDir,
        verbose: false
      };

      const result = await avana.scan(options);

      // Verify scan completed
      expect(result.success).toBe(true);
      
      // Verify binary files were skipped
      const binaryIssues = result.issues.filter(issue => issue.file.includes('binary-file.png'));
      expect(binaryIssues.length).toBe(0);

      // Verify text file was scanned
      const textIssues = result.issues.filter(issue => issue.file.includes('text-file.txt'));
      expect(textIssues.length).toBeGreaterThan(0);
    });

    it('should handle large file streaming', async () => {
      // Create a moderately large file (1MB) with secrets
      const largeContent = 'normal content\n'.repeat(50000) + 
                          'API_KEY=sk_test_large_file_secret\n' +
                          'normal content\n'.repeat(50000);
      
      const largeFilePath = path.join(testDir, 'large-file.txt');
      fs.writeFileSync(largeFilePath, largeContent, 'utf8');

      const options: ScanOptions = {
        path: testDir,
        verbose: false
      };

      const result = await avana.scan(options);

      // Verify large file was processed
      expect(result.success).toBe(true);
      expect(result.filesScanned).toBeGreaterThan(0);
      
      // Verify secret was found in large file
      const largeFileIssues = result.issues.filter(issue => 
        issue.file.includes('large-file.txt') && 
        issue.code?.includes('sk_test_large_file_secret')
      );
      expect(largeFileIssues.length).toBeGreaterThan(0);
    });
  });

  describe('Error Recovery', () => {
    it('should handle corrupted files gracefully', async () => {
      // Create a file that looks like text but has some invalid content
      const corruptedFile = path.join(testDir, 'corrupted.txt');
      const corruptedContent = 'API_KEY=sk_test_corrupted\x00\x01\x02invalid_bytes';
      fs.writeFileSync(corruptedFile, corruptedContent, 'utf8');

      const options: ScanOptions = {
        path: testDir,
        verbose: false
      };

      const result = await avana.scan(options);

      // Scan should still succeed
      expect(result.success).toBe(true);
      expect(result.filesScanned).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Caching', () => {
    it('should cache and reuse scan results', async () => {
      // Create test file
      const testFile = path.join(testDir, 'cached-file.txt');
      fs.writeFileSync(testFile, 'API_KEY=sk_test_cached_secret', 'utf8');

      const options: ScanOptions = {
        path: testDir,
        verbose: false
      };

      // First scan
      const result1 = await avana.scan(options);
      expect(result1.success).toBe(true);
      expect(result1.issues.length).toBeGreaterThan(0);

      // Get cache stats after first scan
      const cacheStats1 = avana.getCacheStats();
      expect(cacheStats1.totalEntries).toBeGreaterThan(0);

      // Second scan (should use cache)
      const result2 = await avana.scan(options);
      expect(result2.success).toBe(true);
      expect(result2.issues.length).toBe(result1.issues.length);

      // Cache hit rate should be > 0
      const cacheStats2 = avana.getCacheStats();
      expect(cacheStats2.hitRate).toBeGreaterThan(0);
    });
  });

  describe('Memory Management', () => {
    it('should monitor memory usage during scan', async () => {
      // Create several files to trigger memory monitoring
      for (let i = 0; i < 3; i++) {
        const filePath = path.join(testDir, `memory-test-${i}.txt`);
        const content = 'API_KEY=sk_test_memory\n'.repeat(100); // Small size for testing
        fs.writeFileSync(filePath, content, 'utf8');
      }

      const options: ScanOptions = {
        path: testDir,
        verbose: false
      };

      const result = await avana.scan(options);

      // Verify scan completed
      expect(result.success).toBe(true);

      // Check memory statistics
      const memoryStats = avana.getMemoryStats();
      expect(memoryStats.currentUsage).toBeGreaterThan(0);
      expect(memoryStats.maxUsage).toBeGreaterThanOrEqual(memoryStats.currentUsage);
      expect(memoryStats.limit).toBe(100 * 1024 * 1024); // 100MB as set in beforeEach
    });
  });

  describe('JSON Output', () => {
    it('should format results as valid JSON', async () => {
      // Create test file with secret
      const testFile = path.join(testDir, 'json-test.txt');
      fs.writeFileSync(testFile, 'API_KEY=sk_test_json_output', 'utf8');

      const options: ScanOptions = {
        path: testDir,
        verbose: false
      };

      const result = await avana.scan(options);
      expect(result.success).toBe(true);

      // Format as JSON
      const jsonOutput = avana.formatAsJSON(result, {
        pretty: true,
        includeMetadata: true,
        includeDebugInfo: false
      });

      // Verify JSON is valid
      expect(() => JSON.parse(jsonOutput)).not.toThrow();

      const parsed = JSON.parse(jsonOutput);
      expect(parsed.success).toBe(true);
      expect(parsed.issues).toBeDefined();
      expect(parsed.summary).toBeDefined();
      expect(parsed.securityScore).toBeDefined();
      expect(parsed.metadata).toBeDefined();
    });
  });

  describe('Statistics and Monitoring', () => {
    it('should provide comprehensive statistics', async () => {
      // Create test files
      const testFile = path.join(testDir, 'stats-test.txt');
      fs.writeFileSync(testFile, 'API_KEY=sk_test_statistics', 'utf8');

      const options: ScanOptions = {
        path: testDir,
        verbose: false
      };

      const result = await avana.scan(options);
      expect(result.success).toBe(true);

      // Get all statistics
      const memoryStats = avana.getMemoryStats();
      const cacheStats = avana.getCacheStats();
      const errorStats = avana.getErrorStats();

      // Verify statistics are available
      expect(memoryStats).toBeDefined();
      expect(memoryStats.currentUsage).toBeGreaterThan(0);

      expect(cacheStats).toBeDefined();
      expect(cacheStats.totalEntries).toBeGreaterThanOrEqual(0);

      expect(errorStats).toBeDefined();
      expect(errorStats.totalErrors).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Cleanup and Resource Management', () => {
    it('should cleanup resources properly', async () => {
      // Create test file
      const testFile = path.join(testDir, 'cleanup-test.txt');
      fs.writeFileSync(testFile, 'API_KEY=sk_test_cleanup', 'utf8');

      const options: ScanOptions = {
        path: testDir,
        verbose: false
      };

      // Perform scan
      const result = await avana.scan(options);
      expect(result.success).toBe(true);

      // Cleanup should not throw
      await expect(avana.cleanup()).resolves.not.toThrow();

      // Clear cache should not throw
      expect(() => avana.clearCache()).not.toThrow();
    });
  });
});