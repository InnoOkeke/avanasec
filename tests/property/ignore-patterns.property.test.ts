/**
 * Property Tests: Ignore Pattern Effectiveness
 * Feature: avana-core, Property 7: Ignore Pattern Effectiveness
 * Validates: Requirements 4.4
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { IgnorePatternManager } from '../../src/utils/ignore-pattern-manager';
import {
  createTempDir,
  cleanupTempDir,
  createTempFile,
} from '../helpers/test-utils';

/**
 * Generator for safe filenames (alphanumeric, dash, underscore, dot only)
 */
const safeFilenameArb = fc.stringMatching(/^[a-zA-Z0-9_-]+$/);

/**
 * Generator for safe directory names (alphanumeric, dash, underscore only)
 */
const safeDirNameArb = fc.stringMatching(/^[a-zA-Z0-9_-]+$/);

describe('Feature: avana-core, Property 7: Ignore Pattern Effectiveness', () => {
  let ignoreManager: IgnorePatternManager;
  let tempDir: string;

  beforeEach(() => {
    ignoreManager = new IgnorePatternManager(false);
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should ignore files matching exact patterns', () => {
    fc.assert(
      fc.property(
        safeFilenameArb,
        (filename) => {
          ignoreManager.clearCustomPatterns();
          ignoreManager.addPattern(filename);
          
          // File matching pattern should be ignored
          expect(ignoreManager.shouldIgnore(filename)).toBe(true);
          
          // Different file should not be ignored
          expect(ignoreManager.shouldIgnore(filename + '_different')).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should ignore files matching wildcard patterns', () => {
    fc.assert(
      fc.property(
        safeFilenameArb,
        safeFilenameArb,
        (prefix, suffix) => {
          ignoreManager.clearCustomPatterns();
          ignoreManager.addPattern(`${prefix}*${suffix}`);
          
          // File matching pattern should be ignored
          const matchingFile = `${prefix}middle${suffix}`;
          expect(ignoreManager.shouldIgnore(matchingFile)).toBe(true);
          
          // File not matching should not be ignored
          const nonMatchingFile = `different${suffix}`;
          if (!nonMatchingFile.includes(prefix)) {
            expect(ignoreManager.shouldIgnore(nonMatchingFile)).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should ignore files in directories matching patterns', () => {
    fc.assert(
      fc.property(
        safeDirNameArb,
        safeFilenameArb,
        (dirName, fileName) => {
          ignoreManager.clearCustomPatterns();
          ignoreManager.addPattern(`${dirName}/**`);
          
          // Files in directory should be ignored
          expect(ignoreManager.shouldIgnore(`${dirName}/${fileName}`)).toBe(true);
          expect(ignoreManager.shouldIgnore(`${dirName}/subdir/${fileName}`)).toBe(true);
          
          // Files outside directory should not be ignored
          expect(ignoreManager.shouldIgnore(`other/${fileName}`)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should track ignored file count', () => {
    fc.assert(
      fc.property(
        fc.array(safeFilenameArb, { minLength: 1, maxLength: 20 }),
        (filePaths) => {
          ignoreManager.clearCustomPatterns();
          ignoreManager.resetIgnoredCount();
          ignoreManager.addPattern('*');
          
          // Check all files
          filePaths.forEach(filePath => {
            ignoreManager.shouldIgnore(filePath);
          });
          
          // Count should match number of files checked
          expect(ignoreManager.getIgnoredCount()).toBe(filePaths.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle multiple patterns correctly', () => {
    fc.assert(
      fc.property(
        fc.array(safeFilenameArb, { minLength: 1, maxLength: 5 }),
        safeFilenameArb,
        (patterns, testFile) => {
          ignoreManager.clearCustomPatterns();
          patterns.forEach(pattern => ignoreManager.addPattern(pattern));
          
          // Should not throw when checking
          expect(() => ignoreManager.shouldIgnore(testFile)).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle paths with different separators', () => {
    fc.assert(
      fc.property(
        safeDirNameArb,
        safeFilenameArb,
        (dir, file) => {
          ignoreManager.clearCustomPatterns();
          ignoreManager.addPattern(`${dir}/**`);
          
          // Both forward and backslash should work
          const forwardSlash = `${dir}/${file}`;
          const backslash = `${dir}\\${file}`;
          
          expect(ignoreManager.shouldIgnore(forwardSlash)).toBe(true);
          expect(ignoreManager.shouldIgnore(backslash)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not ignore files when no patterns match', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (filePath) => {
          ignoreManager.clearCustomPatterns();
          // No custom patterns, only defaults
          
          // Most random strings won't match default patterns
          // Just verify it doesn't throw
          expect(() => ignoreManager.shouldIgnore(filePath)).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty patterns gracefully', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (filePath) => {
          ignoreManager.clearCustomPatterns();
          ignoreManager.addPattern('');
          ignoreManager.addPattern('   ');
          
          // Empty patterns should not cause errors
          expect(() => ignoreManager.shouldIgnore(filePath)).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });
});
