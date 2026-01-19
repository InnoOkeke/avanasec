/**
 * Property Tests: Error Recovery
 * Feature: avana-core, Property 3: Encoding Handling
 * Feature: avana-core, Property 4: Permission Error Recovery
 * Validates: Requirements 1.3, 1.4, 3.2, 9.4
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { ErrorHandler, FilePermissionError, InvalidEncodingError } from '../../src/utils/error-handler';
import {
  createTempDir,
  cleanupTempDir,
  createTempFile,
} from '../helpers/test-utils';

describe('Feature: avana-core, Property 3: Encoding Handling', () => {
  let errorHandler: ErrorHandler;
  let tempDir: string;

  beforeEach(() => {
    errorHandler = new ErrorHandler(false);
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should handle encoding errors gracefully without crashing', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.constantFrom('utf-8', 'utf-16', 'latin-1', 'ascii', 'unknown'),
        (filePath, encoding) => {
          const error = new InvalidEncodingError(filePath, encoding);
          
          // Should not throw
          expect(() => errorHandler.handleFileError(filePath, error)).not.toThrow();
          
          // Should track the error
          expect(errorHandler.getErrorCount()).toBeGreaterThan(0);
          expect(errorHandler.hasErrors()).toBe(true);
        }
      ),
      { numRuns: 25 }
    );
  });

  it('should continue scanning after encoding errors', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
        (filePaths) => {
          errorHandler.clearErrors();
          
          // Simulate multiple encoding errors
          filePaths.forEach(filePath => {
            const error = new InvalidEncodingError(filePath, 'utf-8');
            errorHandler.handleFileError(filePath, error);
          });
          
          // Should track all errors
          expect(errorHandler.getErrorCount()).toBe(filePaths.length);
          
          // Should be able to get error summary
          const summary = errorHandler.getErrorSummary();
          expect(summary['InvalidEncodingError']).toBe(filePaths.length);
        }
      ),
      { numRuns: 25 }
    );
  });

  it('should log warnings for encoding errors', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (filePath) => {
          const error = new InvalidEncodingError(filePath, 'utf-8');
          
          // Should handle error
          errorHandler.handleFileError(filePath, error);
          
          // Should have error in list
          const errors = errorHandler.getErrors();
          expect(errors.length).toBeGreaterThan(0);
          expect(errors[errors.length - 1].type).toBe('InvalidEncodingError');
        }
      ),
      { numRuns: 25 }
    );
  });
});

describe('Feature: avana-core, Property 4: Permission Error Recovery', () => {
  let errorHandler: ErrorHandler;
  let tempDir: string;

  beforeEach(() => {
    errorHandler = new ErrorHandler(false);
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should handle permission errors gracefully without crashing', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (filePath) => {
          const error = new FilePermissionError(filePath);
          
          // Should not throw
          expect(() => errorHandler.handleFileError(filePath, error)).not.toThrow();
          
          // Should track the error
          expect(errorHandler.getErrorCount()).toBeGreaterThan(0);
          expect(errorHandler.hasErrors()).toBe(true);
        }
      ),
      { numRuns: 25 }
    );
  });

  it('should continue scanning after permission errors', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
        (filePaths) => {
          errorHandler.clearErrors();
          
          // Simulate multiple permission errors
          filePaths.forEach(filePath => {
            const error = new FilePermissionError(filePath);
            errorHandler.handleFileError(filePath, error);
          });
          
          // Should track all errors
          expect(errorHandler.getErrorCount()).toBe(filePaths.length);
          
          // Should be able to get error summary
          const summary = errorHandler.getErrorSummary();
          expect(summary['FilePermissionError']).toBe(filePaths.length);
        }
      ),
      { numRuns: 25 }
    );
  });

  it('should include errors in scan result', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (filePath) => {
          const error = new FilePermissionError(filePath);
          
          // Handle error
          errorHandler.handleFileError(filePath, error);
          
          // Should be retrievable
          const errors = errorHandler.getErrors();
          expect(errors.length).toBeGreaterThan(0);
          
          const lastError = errors[errors.length - 1];
          expect(lastError.type).toBe('FilePermissionError');
          expect(lastError.filePath).toBe(filePath);
          expect(lastError.timestamp).toBeInstanceOf(Date);
        }
      ),
      { numRuns: 25 }
    );
  });

  it('should log errors with context', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (filePath) => {
          const error = new FilePermissionError(filePath, 'Custom error message');
          
          // Handle error
          errorHandler.handleFileError(filePath, error);
          
          // Should store error info
          const errors = errorHandler.getErrors();
          const lastError = errors[errors.length - 1];
          
          expect(lastError.message).toContain('Custom error message');
          expect(lastError.filePath).toBe(filePath);
        }
      ),
      { numRuns: 25 }
    );
  });

  it('should track errors by type', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 1, max: 10 }),
        (permissionErrorCount, encodingErrorCount) => {
          errorHandler.clearErrors();
          
          // Add permission errors
          for (let i = 0; i < permissionErrorCount; i++) {
            const error = new FilePermissionError(`file${i}.txt`);
            errorHandler.handleFileError(`file${i}.txt`, error);
          }
          
          // Add encoding errors
          for (let i = 0; i < encodingErrorCount; i++) {
            const error = new InvalidEncodingError(`file${i}.txt`, 'utf-8');
            errorHandler.handleFileError(`file${i}.txt`, error);
          }
          
          // Should track both types
          const permissionErrors = errorHandler.getErrorsByType('FilePermissionError');
          const encodingErrors = errorHandler.getErrorsByType('InvalidEncodingError');
          
          expect(permissionErrors.length).toBe(permissionErrorCount);
          expect(encodingErrors.length).toBe(encodingErrorCount);
          expect(errorHandler.getErrorCount()).toBe(permissionErrorCount + encodingErrorCount);
        }
      ),
      { numRuns: 25 }
    );
  });
});
