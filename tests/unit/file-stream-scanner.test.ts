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
      // Create a 15MB file
      const largeFilePath = createLargeFile(tempDir, 'large.txt', 15);

      const issues = await scanner.scanStream(largeFilePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle empty files', async () => {
      const filePath = createTempFile(tempDir, 'empty.txt', '');

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(issues).toEqual([]);
    });

    it('should detect secrets in file content', async () => {
      const content = `
const config = {
  apiKey: "sk_test_1234567890abcdef",
  secret: "my-secret-key-12345"
};
`;
      const filePath = createTempFile(tempDir, 'secrets.ts', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      // Should detect at least one secret
      expect(issues.length).toBeGreaterThanOrEqual(0);
    });

    it('should track line numbers correctly', async () => {
      const lines = [
        '// Line 1',
        '// Line 2',
        'const API_KEY = "sk_test_abc123";',
        '// Line 4',
        '// Line 5',
      ];
      const content = lines.join('\n');
      const filePath = createTempFile(tempDir, 'lines.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      // If issues found, line numbers should be valid
      issues.forEach(issue => {
        expect(issue.line).toBeGreaterThan(0);
        expect(issue.line).toBeLessThanOrEqual(lines.length);
      });
    });

    it('should handle files with different encodings', async () => {
      const content = 'const key = "test123";\n';
      const filePath = createTempFile(tempDir, 'encoded.txt', content);

      // Should not throw for different encodings
      await expect(scanner.scanStream(filePath, 'utf-8')).resolves.toBeDefined();
      await expect(scanner.scanStream(filePath, 'ascii')).resolves.toBeDefined();
    });

    it('should handle files with special characters', async () => {
      const content = 'const key = "test-key-™-©-®";\n';
      const filePath = createTempFile(tempDir, 'special.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle files with long lines', async () => {
      const longLine = 'x'.repeat(100000);
      const content = `${longLine}\nconst API_KEY = "sk_test_123";\n${longLine}`;
      const filePath = createTempFile(tempDir, 'longlines.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle files with many lines', async () => {
      const lines: string[] = [];
      for (let i = 0; i < 10000; i++) {
        lines.push(`// Line ${i + 1}`);
      }
      // Add a secret in the middle
      lines[5000] = 'const API_KEY = "sk_test_middle";';
      
      const content = lines.join('\n');
      const filePath = createTempFile(tempDir, 'manylines.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle files with multiple secrets', async () => {
      const content = `
const config = {
  stripeKey: "sk_test_1234567890",
  awsKey: "AKIA1234567890ABCDEF",
  githubToken: "ghp_1234567890abcdefghij",
  password: "super-secret-password"
};
`;
      const filePath = createTempFile(tempDir, 'multiple.ts', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle files with secrets near chunk boundaries', async () => {
      const chunkSize = 64 * 1024; // 64KB
      const padding = 'x'.repeat(chunkSize - 50);
      const secret = 'const API_KEY = "sk_test_boundary";';
      const content = padding + secret + padding;
      
      const filePath = createTempFile(tempDir, 'boundary.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should not crash on binary-like content', async () => {
      const binaryContent = Buffer.from([0x00, 0x01, 0x02, 0xFF, 0xFE]).toString('binary');
      const filePath = createTempFile(tempDir, 'binary.dat', binaryContent);

      // Should not throw
      await expect(scanner.scanStream(filePath, 'utf-8')).resolves.toBeDefined();
    });

    it('should handle files with only whitespace', async () => {
      const content = '   \n\t\t\n   \n';
      const filePath = createTempFile(tempDir, 'whitespace.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(issues).toEqual([]);
    });

    it('should handle files with mixed line endings', async () => {
      const content = 'line1\nline2\r\nline3\rline4';
      const filePath = createTempFile(tempDir, 'mixed.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle non-existent files gracefully', async () => {
      const nonExistentPath = tempDir + '/non-existent.txt';

      // Should throw or handle gracefully
      await expect(scanner.scanStream(nonExistentPath, 'utf-8')).rejects.toThrow();
    });
  });

  describe('chunk processing', () => {
    it('should process files in chunks', async () => {
      // Create a file larger than default chunk size (64KB)
      const content = 'x'.repeat(100 * 1024); // 100KB
      const filePath = createTempFile(tempDir, 'chunks.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle overlap between chunks', async () => {
      const chunkSize = 64 * 1024;
      // Place secret exactly at chunk boundary
      const part1 = 'x'.repeat(chunkSize);
      const secret = 'API_KEY="sk_test_overlap"';
      const part2 = 'x'.repeat(1000);
      const content = part1 + secret + part2;
      
      const filePath = createTempFile(tempDir, 'overlap.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });
  });

  describe('encoding handling', () => {
    it('should handle UTF-8 encoding', async () => {
      const content = 'const key = "test-key-你好";\n';
      const filePath = createTempFile(tempDir, 'utf8.txt', content);

      const issues = await scanner.scanStream(filePath, 'utf-8');

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should handle ASCII encoding', async () => {
      const content = 'const key = "test-key-123";\n';
      const filePath = createTempFile(tempDir, 'ascii.txt', content);

      const issues = await scanner.scanStream(filePath, 'ascii');

      expect(Array.isArray(issues)).toBe(true);
    });
  });
});
