/**
 * Test Setup Verification
 * Verifies that the testing infrastructure is working correctly
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createTempDir, cleanupTempDir, createTempFile } from '../helpers/test-utils';
import { filePathArb, severityArb } from '../helpers/generators';

describe('Testing Infrastructure', () => {
  describe('Vitest Setup', () => {
    it('should run basic assertions', () => {
      expect(true).toBe(true);
      expect(1 + 1).toBe(2);
      expect('hello').toBe('hello');
    });

    it('should handle async tests', async () => {
      const result = await Promise.resolve(42);
      expect(result).toBe(42);
    });

    it('should handle errors', () => {
      expect(() => {
        throw new Error('Test error');
      }).toThrow('Test error');
    });
  });

  describe('Fast-check Setup', () => {
    it('should run property-based tests', () => {
      fc.assert(
        fc.property(fc.integer(), (n) => {
          return n + 0 === n;
        }),
        { numRuns: 100 }
      );
    });

    it('should use custom generators', () => {
      fc.assert(
        fc.property(filePathArb, (path) => {
          return typeof path === 'string' && path.length > 0;
        }),
        { numRuns: 100 }
      );
    });

    it('should use severity generator', () => {
      fc.assert(
        fc.property(severityArb, (severity) => {
          return ['critical', 'high', 'medium', 'low', 'info'].includes(severity);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Test Utilities', () => {
    it('should create and cleanup temp directories', () => {
      const tempDir = createTempDir();
      expect(tempDir).toBeTruthy();
      
      cleanupTempDir(tempDir);
    });

    it('should create temp files', () => {
      const tempDir = createTempDir();
      const filePath = createTempFile(tempDir, 'test.txt', 'Hello, World!');
      
      expect(filePath).toContain('test.txt');
      
      cleanupTempDir(tempDir);
    });
  });

  describe('TypeScript Configuration', () => {
    it('should have proper type checking', () => {
      const num: number = 42;
      const str: string = 'hello';
      const bool: boolean = true;
      
      expect(typeof num).toBe('number');
      expect(typeof str).toBe('string');
      expect(typeof bool).toBe('boolean');
    });
  });
});
