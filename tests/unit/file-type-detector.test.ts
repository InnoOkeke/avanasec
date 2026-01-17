/**
 * Unit Tests: FileTypeDetector
 * Tests for file type detection, encoding detection, and streaming decisions
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileTypeDetector } from '../../src/utils/file-type-detector';
import {
  createTempDir,
  cleanupTempDir,
  createTempFile,
  createBinaryFile,
  createLargeFile,
  createEncodedFile,
  createUTF16File,
} from '../helpers/test-utils';

describe('FileTypeDetector', () => {
  let detector: FileTypeDetector;
  let tempDir: string;

  beforeEach(() => {
    detector = new FileTypeDetector();
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('isBinary', () => {
    it('should detect common binary file extensions', () => {
      const binaryExtensions = [
        '.png', '.jpg', '.jpeg', '.gif', '.pdf', '.exe', '.dll',
        '.zip', '.tar', '.gz', '.mp4', '.mp3', '.doc', '.docx'
      ];

      binaryExtensions.forEach(ext => {
        const filePath = createBinaryFile(tempDir, `test${ext}`);
        expect(detector.isBinary(filePath)).toBe(true);
      });
    });

    it('should not detect text file extensions as binary', () => {
      const textExtensions = [
        '.txt', '.js', '.ts', '.json', '.md', '.html', '.css',
        '.xml', '.yaml', '.yml', '.sh', '.py', '.java'
      ];

      textExtensions.forEach(ext => {
        const filePath = createTempFile(tempDir, `test${ext}`, 'Hello, World!');
        expect(detector.isBinary(filePath)).toBe(false);
      });
    });

    it('should detect binary content with null bytes', () => {
      const binaryContent = Buffer.from([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x00, 0x57, 0x6F, 0x72, 0x6C, 0x64]);
      const filePath = createTempFile(tempDir, 'binary.dat', binaryContent.toString('binary'));
      
      expect(detector.isBinary(filePath)).toBe(true);
    });

    it('should not detect pure ASCII text as binary', () => {
      const textContent = 'This is plain ASCII text without any special characters.';
      const filePath = createTempFile(tempDir, 'text.txt', textContent);
      
      expect(detector.isBinary(filePath)).toBe(false);
    });

    it('should detect files with high non-ASCII ratio as binary', () => {
      // Create content with >30% non-ASCII characters
      const nonAscii = Buffer.from([0xFF, 0xFE, 0xFD, 0xFC, 0xFB]);
      const ascii = Buffer.from('Hello');
      const mixedContent = Buffer.concat([nonAscii, ascii]);
      
      const filePath = createTempFile(tempDir, 'mixed.dat', mixedContent.toString('binary'));
      
      expect(detector.isBinary(filePath)).toBe(true);
    });

    it('should handle empty files', () => {
      const filePath = createTempFile(tempDir, 'empty.txt', '');
      
      expect(detector.isBinary(filePath)).toBe(false);
    });

    it('should handle non-existent files gracefully', () => {
      const nonExistentPath = tempDir + '/non-existent.txt';
      
      // Should not throw, should return false
      expect(() => detector.isBinary(nonExistentPath)).not.toThrow();
      expect(detector.isBinary(nonExistentPath)).toBe(false);
    });
  });

  describe('detectEncoding', () => {
    it('should detect UTF-8 encoding', () => {
      const content = 'Hello, World! 你好世界';
      const filePath = createTempFile(tempDir, 'utf8.txt', content);
      
      const encoding = detector.detectEncoding(filePath);
      
      expect(encoding).toBe('utf-8');
    });

    it('should detect UTF-16 BOM', () => {
      const content = 'Hello, World!';
      const filePath = createUTF16File(tempDir, 'utf16.txt', content);
      
      const encoding = detector.detectEncoding(filePath);
      
      expect(encoding).toBe('utf-16');
    });

    it('should detect UTF-8 BOM', () => {
      const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
      const content = Buffer.concat([bom, Buffer.from('Hello, World!', 'utf-8')]);
      const filePath = createTempFile(tempDir, 'utf8-bom.txt', content.toString('binary'));
      
      const encoding = detector.detectEncoding(filePath);
      
      expect(encoding).toBe('utf-8');
    });

    it('should detect ASCII encoding', () => {
      const content = 'Plain ASCII text';
      const filePath = createEncodedFile(tempDir, 'ascii.txt', content, 'ascii');
      
      const encoding = detector.detectEncoding(filePath);
      
      // ASCII is a subset of UTF-8, chardet may return either
      expect(['ascii', 'utf-8']).toContain(encoding);
    });

    it('should default to UTF-8 for unknown encodings', () => {
      const content = 'Some text';
      const filePath = createTempFile(tempDir, 'unknown.txt', content);
      
      const encoding = detector.detectEncoding(filePath);
      
      // Should default to UTF-8 or ASCII (ASCII is subset of UTF-8)
      expect(['ascii', 'utf-8']).toContain(encoding);
    });

    it('should handle empty files', () => {
      const filePath = createTempFile(tempDir, 'empty.txt', '');
      
      const encoding = detector.detectEncoding(filePath);
      
      // Empty files may be detected as ASCII or UTF-8
      expect(['ascii', 'utf-8']).toContain(encoding);
    });

    it('should handle non-existent files gracefully', () => {
      const nonExistentPath = tempDir + '/non-existent.txt';
      
      // Should not throw, should return default encoding
      expect(() => detector.detectEncoding(nonExistentPath)).not.toThrow();
      expect(detector.detectEncoding(nonExistentPath)).toBe('utf-8');
    });
  });

  describe('shouldStream', () => {
    it('should recommend streaming for files larger than 10MB', () => {
      const filePath = createLargeFile(tempDir, 'large.txt', 11);
      
      const shouldStream = detector.shouldStream(filePath);
      
      expect(shouldStream).toBe(true);
    });

    it('should not recommend streaming for files smaller than 10MB', () => {
      const content = 'Small file content';
      const filePath = createTempFile(tempDir, 'small.txt', content);
      
      const shouldStream = detector.shouldStream(filePath);
      
      expect(shouldStream).toBe(false);
    });

    it('should not recommend streaming for empty files', () => {
      const filePath = createTempFile(tempDir, 'empty.txt', '');
      
      const shouldStream = detector.shouldStream(filePath);
      
      expect(shouldStream).toBe(false);
    });

    it('should handle non-existent files gracefully', () => {
      const nonExistentPath = tempDir + '/non-existent.txt';
      
      // Should not throw, should return false
      expect(() => detector.shouldStream(nonExistentPath)).not.toThrow();
      expect(detector.shouldStream(nonExistentPath)).toBe(false);
    });

    it('should handle exactly 10MB files (boundary)', () => {
      const filePath = createLargeFile(tempDir, 'exactly-10mb.txt', 10);
      
      const shouldStream = detector.shouldStream(filePath);
      
      // 10MB exactly should not require streaming
      expect(shouldStream).toBe(false);
    });
  });

  describe('getFileInfo', () => {
    it('should return complete file information for text files', () => {
      const content = 'Hello, World!';
      const filePath = createTempFile(tempDir, 'test.txt', content);
      
      const fileInfo = detector.getFileInfo(filePath);
      
      expect(fileInfo.path).toBe(filePath);
      expect(fileInfo.isBinary).toBe(false);
      expect(['ascii', 'utf-8']).toContain(fileInfo.encoding);
      expect(fileInfo.size).toBeGreaterThan(0);
      expect(fileInfo.shouldStream).toBe(false);
    });

    it('should return complete file information for binary files', () => {
      const filePath = createBinaryFile(tempDir, 'test.png');
      
      const fileInfo = detector.getFileInfo(filePath);
      
      expect(fileInfo.path).toBe(filePath);
      expect(fileInfo.isBinary).toBe(true);
      expect(fileInfo.encoding).toBe('unknown');
      expect(fileInfo.size).toBeGreaterThan(0);
      expect(fileInfo.shouldStream).toBe(false);
    });

    it('should return complete file information for large files', () => {
      const filePath = createLargeFile(tempDir, 'large.txt', 11);
      
      const fileInfo = detector.getFileInfo(filePath);
      
      expect(fileInfo.path).toBe(filePath);
      expect(fileInfo.isBinary).toBe(false);
      expect(fileInfo.size).toBeGreaterThan(10 * 1024 * 1024);
      expect(fileInfo.shouldStream).toBe(true);
    });

    it('should handle empty files', () => {
      const filePath = createTempFile(tempDir, 'empty.txt', '');
      
      const fileInfo = detector.getFileInfo(filePath);
      
      expect(fileInfo.path).toBe(filePath);
      expect(fileInfo.isBinary).toBe(false);
      expect(fileInfo.size).toBe(0);
      expect(fileInfo.shouldStream).toBe(false);
    });

    it('should handle non-existent files gracefully', () => {
      const nonExistentPath = tempDir + '/non-existent.txt';
      
      const fileInfo = detector.getFileInfo(nonExistentPath);
      
      expect(fileInfo.path).toBe(nonExistentPath);
      expect(fileInfo.size).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle files with no extension', () => {
      const content = 'File without extension';
      const filePath = createTempFile(tempDir, 'noext', content);
      
      expect(detector.isBinary(filePath)).toBe(false);
      expect(['ascii', 'utf-8']).toContain(detector.detectEncoding(filePath));
    });

    it('should handle files with multiple dots in name', () => {
      const content = 'File with dots';
      const filePath = createTempFile(tempDir, 'file.test.backup.txt', content);
      
      expect(detector.isBinary(filePath)).toBe(false);
    });

    it('should handle files with uppercase extensions', () => {
      const filePath = createBinaryFile(tempDir, 'test.PNG');
      
      expect(detector.isBinary(filePath)).toBe(true);
    });

    it('should handle very long file names', () => {
      const longName = 'a'.repeat(200) + '.txt';
      const content = 'Content';
      const filePath = createTempFile(tempDir, longName, content);
      
      expect(detector.isBinary(filePath)).toBe(false);
    });

    it('should handle files with special characters in name', () => {
      const content = 'Special chars';
      const filePath = createTempFile(tempDir, 'file-with_special.chars.txt', content);
      
      expect(detector.isBinary(filePath)).toBe(false);
    });
  });
});
