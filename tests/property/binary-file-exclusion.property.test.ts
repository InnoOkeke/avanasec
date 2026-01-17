/**
 * Property Test: Binary File Exclusion
 * Validates: Requirements 1.1
 * 
 * Property 1: Binary File Exclusion
 * For any file path, if the file is detected as binary, then it should not be 
 * scanned for secrets and should not appear in the issues list.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { FileTypeDetector } from '../../src/utils/file-type-detector';
import { Avana } from '../../src/index';
import { 
  createTempDir, 
  cleanupTempDir, 
  createBinaryFile,
  createTempFile 
} from '../helpers/test-utils';
import { binaryContentArb, filePathArb } from '../helpers/generators';

describe('Feature: avana-core, Property 1: Binary File Exclusion', () => {
  let tempDir: string;
  let detector: FileTypeDetector;

  beforeEach(() => {
    tempDir = createTempDir();
    detector = new FileTypeDetector();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should detect binary files by extension', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('.png', '.jpg', '.pdf', '.exe', '.zip', '.mp4', '.dll'),
        (ext) => {
          const filename = `test${ext}`;
          const filePath = createBinaryFile(tempDir, filename);
          
          const isBinary = detector.isBinary(filePath);
          
          // Binary files should be detected
          expect(isBinary).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should detect binary files by content (null bytes)', () => {
    fc.assert(
      fc.property(
        binaryContentArb,
        (binaryContent) => {
          const filePath = createTempFile(tempDir, 'test.bin', Buffer.from(binaryContent).toString('binary'));
          
          const isBinary = detector.isBinary(filePath);
          
          // Files with null bytes should be detected as binary
          const hasNullByte = binaryContent.some(byte => byte === 0);
          if (hasNullByte) {
            expect(isBinary).toBe(true);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not detect text files as binary', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 1000 }).filter(s => !s.includes('\0')),
        (textContent) => {
          const filePath = createTempFile(tempDir, 'test.txt', textContent);
          
          const isBinary = detector.isBinary(filePath);
          
          // Pure text files should not be detected as binary
          expect(isBinary).toBe(false);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should exclude binary files from scan results', async () => {
    // Create a dedicated temp dir for this test
    const testDir = createTempDir();
    
    try {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('.png', '.jpg', '.pdf', '.exe'),
          async (ext) => {
            const filename = `binary${ext}`;
            const filePath = createBinaryFile(testDir, filename);
            
            // Add a secret to a text file for comparison
            createTempFile(testDir, 'secret.txt', 'const key = "sk-proj-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop";');
            
            const avana = new Avana();
            const result = await avana.scan({ path: testDir });
            
            // Binary file should not appear in issues
            const binaryFileIssues = result.issues.filter(issue => issue.file.includes(filename));
            expect(binaryFileIssues.length).toBe(0);
            
            // But text file with secret should appear
            const textFileIssues = result.issues.filter(issue => issue.file.includes('secret.txt'));
            expect(textFileIssues.length).toBeGreaterThan(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    } finally {
      cleanupTempDir(testDir);
    }
  });

  it('should handle files with mixed content correctly', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({ minLength: 100, maxLength: 500 }),
          fc.uint8Array({ minLength: 10, maxLength: 50 })
        ),
        ([textPart, binaryPart]) => {
          // Create file with text followed by binary content
          const mixedContent = Buffer.concat([
            Buffer.from(textPart, 'utf-8'),
            Buffer.from(binaryPart)
          ]);
          
          const filePath = createTempFile(tempDir, 'mixed.dat', mixedContent.toString('binary'));
          
          const isBinary = detector.isBinary(filePath);
          
          // Files with null bytes should be detected as binary
          const hasNullByte = binaryPart.some(byte => byte === 0);
          if (hasNullByte) {
            expect(isBinary).toBe(true);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should consistently detect the same file as binary', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('.png', '.exe', '.zip'),
        (ext) => {
          const filename = `consistent${ext}`;
          const filePath = createBinaryFile(tempDir, filename);
          
          // Detect multiple times
          const result1 = detector.isBinary(filePath);
          const result2 = detector.isBinary(filePath);
          const result3 = detector.isBinary(filePath);
          
          // Results should be consistent
          expect(result1).toBe(result2);
          expect(result2).toBe(result3);
          expect(result1).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty files gracefully', () => {
    const filePath = createTempFile(tempDir, 'empty.txt', '');
    
    const isBinary = detector.isBinary(filePath);
    
    // Empty files should not be detected as binary
    expect(isBinary).toBe(false);
  });

  it('should handle very small files correctly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 10 }),
        (content) => {
          const filePath = createTempFile(tempDir, 'small.txt', content);
          
          const isBinary = detector.isBinary(filePath);
          
          // Small text files should not be binary
          if (!content.includes('\0')) {
            expect(isBinary).toBe(false);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
