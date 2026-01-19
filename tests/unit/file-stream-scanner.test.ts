/**
 * Unit Tests: FileStreamScanner
 * Tests for streaming large file scanning
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileStreamScanner } from '../../src/utils/file-stream-scanner';
import {
  createTempDir,
  cleanupTempDir,
  createTempFile,
  createLargeFile,
} from '../helpers/test-utils';

describe('FileStreamScanner', () => {
  let scanner: FileStreamScanner;
  let tempDir: string;

  beforeEach(() => {
    scanner = new FileStreamScanner();
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('scanStream', () => {
    it('should scan small files without errors', async () => {
      const content = 'const API_KEY = "sk_test_1234567890abcdef";\n';
      const filePath = createTempFile(tempDir, 'small.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should scan large files without memory issues', async () => {
      // Create a 5MB file (reduced for faster tests)
      const largeFilePath = createLargeFile(tempDir, 'large.txt', 5);

      const issues = await scanner.scanStream(largeFilePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle empty files', async () => {
      const filePath = createTempFile(tempDir, 'empty.txt', '');

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
      expect(issues.length).toBe(0);
    });

    it('should detect secrets in files', async () => {
      const content = 'const key = "sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop";\n';
      const filePath = createTempFile(tempDir, 'secret.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].severity).toBe('critical');
    });

    it('should handle files with multiple secrets', async () => {
      const content = `
const openaiKey = "sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop";
const stripeKey = "sk_test_1234567890abcdef";
const awsKey = "AKIAIOSFODNN7EXAMPLE";
      `;
      const filePath = createTempFile(tempDir, 'multiple.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(issues.length).toBeGreaterThan(2);
    });

    it('should handle files with secrets near chunk boundaries', async () => {
      // Create content that will span chunk boundaries
      const padding = 'a'.repeat(65000); // Just under 64KB
      const secret = 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop';
      const content = padding + secret + padding;
      const filePath = createTempFile(tempDir, 'boundary.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(issues.length).toBeGreaterThan(0);
    });

    it('should not crash on binary-like content', async () => {
      const content = Buffer.from([0x00, 0x01, 0x02, 0x03, 0xFF, 0xFE]).toString('binary');
      const filePath = createTempFile(tempDir, 'binary.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle files with only whitespace', async () => {
      const content = '   \n\t\n   \n';
      const filePath = createTempFile(tempDir, 'whitespace.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
      expect(issues.length).toBe(0);
    });

    it('should handle files with mixed line endings', async () => {
      const content = 'line1\nline2\r\nline3\rline4';
      const filePath = createTempFile(tempDir, 'mixed.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle non-existent files gracefully', async () => {
      const nonExistentPath = tempDir + '/nonexistent.txt';

      await expect(scanner.scanStream(nonExistentPath, 'utf-8')).rejects.toThrow();
    });
  });

  describe('chunk processing', () => {
    it('should process files in chunks', async () => {
      // Create a file larger than default chunk size
      const content = 'a'.repeat(100000); // 100KB
      const filePath = createTempFile(tempDir, 'chunked.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle overlap between chunks', async () => {
      const smallScanner = new FileStreamScanner({ chunkSize: 100, overlap: 20 });
      const content = 'a'.repeat(200) + 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop' + 'b'.repeat(200);
      const filePath = createTempFile(tempDir, 'overlap.txt', content);

      const issues = await smallScanner.scanStream(filePath, 'utf-8');

      expect(issues.length).toBeGreaterThan(0);
    });
  });

  describe('encoding handling', () => {
    it('should handle UTF-8 encoding', async () => {
      const content = 'const key = "sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop";\n';
      const filePath = createTempFile(tempDir, 'utf8.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle ASCII encoding', async () => {
      const content = 'const key = "sk_test_1234567890abcdef";\n';
      const filePath = createTempFile(tempDir, 'ascii.txt', content);

      const issues = await scanner.scanStream(filePath, 'ascii');

      expect(Array.isArray(issues)).toBe(true);
    });
  });
});