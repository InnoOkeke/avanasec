/**
 * Unit Tests: ErrorHandler
 * Tests for centralized error handling, logging, and tracking
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  ErrorHandler,
  ExitCode,
  FilePermissionError,
  FileNotFoundError,
  InvalidEncodingError,
  ConfigurationError,
  OutOfMemoryError,
  PatternCompilationError,
} from '../../src/utils/error-handler';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;
  let consoleErrorSpy: any;

  beforeEach(() => {
    errorHandler = new ErrorHandler(false);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Custom Error Types', () => {
    it('should create FilePermissionError with correct properties', () => {
      const error = new FilePermissionError('/path/to/file.txt');
      
      expect(error.name).toBe('FilePermissionError');
      expect(error.filePath).toBe('/path/to/file.txt');
      expect(error.message).toContain('Permission denied');
      expect(error.message).toContain('/path/to/file.txt');
    });

    it('should create FilePermissionError with custom message', () => {
      const error = new FilePermissionError('/path/to/file.txt', 'Custom error');
      
      expect(error.message).toBe('Custom error');
    });

    it('should create FileNotFoundError with correct properties', () => {
      const error = new FileNotFoundError('/missing/file.txt');
      
      expect(error.name).toBe('FileNotFoundError');
      expect(error.filePath).toBe('/missing/file.txt');
      expect(error.message).toContain('File not found');
    });

    it('should create InvalidEncodingError with correct properties', () => {
      const error = new InvalidEncodingError('/path/to/file.txt', 'utf-16');
      
      expect(error.name).toBe('InvalidEncodingError');
      expect(error.filePath).toBe('/path/to/file.txt');
      expect(error.encoding).toBe('utf-16');
      expect(error.message).toContain('utf-16');
    });

    it('should create ConfigurationError with correct properties', () => {
      const error = new ConfigurationError('maxMemory');
      
      expect(error.name).toBe('ConfigurationError');
      expect(error.configKey).toBe('maxMemory');
      expect(error.message).toContain('Invalid configuration');
    });

    it('should create OutOfMemoryError with correct properties', () => {
      const error = new OutOfMemoryError(600, 500);
      
      expect(error.name).toBe('OutOfMemoryError');
      expect(error.currentUsage).toBe(600);
      expect(error.limit).toBe(500);
      expect(error.message).toContain('600MB');
      expect(error.message).toContain('500MB');
    });

    it('should create PatternCompilationError with correct properties', () => {
      const error = new PatternCompilationError('aws-key', '[a-z+');
      
      expect(error.name).toBe('PatternCompilationError');
      expect(error.patternId).toBe('aws-key');
      expect(error.pattern).toBe('[a-z+');
      expect(error.message).toContain('aws-key');
    });
  });

  describe('handleFileError', () => {
    it('should handle file permission errors', () => {
      const error = new FilePermissionError('/path/to/file.txt');
      
      errorHandler.handleFileError('/path/to/file.txt', error);
      
      expect(errorHandler.getErrorCount()).toBe(1);
      expect(errorHandler.hasErrors()).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error scanning file')
      );
    });

    it('should handle file not found errors', () => {
      const error = new FileNotFoundError('/missing/file.txt');
      
      errorHandler.handleFileError('/missing/file.txt', error);
      
      expect(errorHandler.getErrorCount()).toBe(1);
      const errors = errorHandler.getErrors();
      expect(errors[0].type).toBe('FileNotFoundError');
      expect(errors[0].filePath).toBe('/missing/file.txt');
    });

    it('should handle encoding errors', () => {
      const error = new InvalidEncodingError('/path/to/file.txt', 'utf-16');
      
      errorHandler.handleFileError('/path/to/file.txt', error);
      
      expect(errorHandler.getErrorCount()).toBe(1);
      const errors = errorHandler.getErrors();
      expect(errors[0].type).toBe('InvalidEncodingError');
    });

    it('should track multiple file errors', () => {
      const error1 = new FilePermissionError('/file1.txt');
      const error2 = new FileNotFoundError('/file2.txt');
      const error3 = new InvalidEncodingError('/file3.txt', 'utf-8');
      
      errorHandler.handleFileError('/file1.txt', error1);
      errorHandler.handleFileError('/file2.txt', error2);
      errorHandler.handleFileError('/file3.txt', error3);
      
      expect(errorHandler.getErrorCount()).toBe(3);
    });

    it('should include timestamp for each error', () => {
      const error = new FilePermissionError('/path/to/file.txt');
      const beforeTime = new Date();
      
      errorHandler.handleFileError('/path/to/file.txt', error);
      
      const afterTime = new Date();
      const errors = errorHandler.getErrors();
      
      expect(errors[0].timestamp).toBeInstanceOf(Date);
      expect(errors[0].timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(errors[0].timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should not include stack trace in non-debug mode', () => {
      const error = new FilePermissionError('/path/to/file.txt');
      
      errorHandler.handleFileError('/path/to/file.txt', error);
      
      const errors = errorHandler.getErrors();
      expect(errors[0].stack).toBeUndefined();
    });

    it('should include stack trace in debug mode', () => {
      const debugHandler = new ErrorHandler(true);
      const error = new FilePermissionError('/path/to/file.txt');
      
      debugHandler.handleFileError('/path/to/file.txt', error);
      
      const errors = debugHandler.getErrors();
      expect(errors[0].stack).toBeDefined();
      expect(typeof errors[0].stack).toBe('string');
    });

    it('should log error message to console', () => {
      const error = new FilePermissionError('/path/to/file.txt');
      
      errorHandler.handleFileError('/path/to/file.txt', error);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('/path/to/file.txt')
      );
    });

    it('should log stack trace in debug mode', () => {
      const debugHandler = new ErrorHandler(true);
      const debugSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new FilePermissionError('/path/to/file.txt');
      
      debugHandler.handleFileError('/path/to/file.txt', error);
      
      expect(debugSpy).toHaveBeenCalledTimes(2); // Error message + stack trace
      debugSpy.mockRestore();
    });
  });

  describe('handleScanError', () => {
    it('should handle generic scan errors', () => {
      const error = new Error('Unexpected scan error');
      
      errorHandler.handleScanError(error);
      
      expect(errorHandler.getErrorCount()).toBe(1);
      expect(errorHandler.hasErrors()).toBe(true);
    });

    it('should track scan error details', () => {
      const error = new Error('Pattern matching failed');
      
      errorHandler.handleScanError(error);
      
      const errors = errorHandler.getErrors();
      expect(errors[0].type).toBe('Error');
      expect(errors[0].message).toBe('Pattern matching failed');
      expect(errors[0].filePath).toBeUndefined();
    });

    it('should log scan error to console', () => {
      const error = new Error('Scan failed');
      
      errorHandler.handleScanError(error);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Scan error')
      );
    });

    it('should handle pattern compilation errors', () => {
      const error = new PatternCompilationError('aws-key', '[a-z+');
      
      errorHandler.handleScanError(error);
      
      const errors = errorHandler.getErrors();
      expect(errors[0].type).toBe('PatternCompilationError');
    });
  });

  describe('Error Tracking', () => {
    it('should return correct error count', () => {
      expect(errorHandler.getErrorCount()).toBe(0);
      
      errorHandler.handleFileError('/file1.txt', new Error('Error 1'));
      expect(errorHandler.getErrorCount()).toBe(1);
      
      errorHandler.handleFileError('/file2.txt', new Error('Error 2'));
      expect(errorHandler.getErrorCount()).toBe(2);
    });

    it('should return all errors', () => {
      const error1 = new FilePermissionError('/file1.txt');
      const error2 = new FileNotFoundError('/file2.txt');
      
      errorHandler.handleFileError('/file1.txt', error1);
      errorHandler.handleFileError('/file2.txt', error2);
      
      const errors = errorHandler.getErrors();
      expect(errors).toHaveLength(2);
      expect(errors[0].type).toBe('FilePermissionError');
      expect(errors[1].type).toBe('FileNotFoundError');
    });

    it('should return errors by type', () => {
      errorHandler.handleFileError('/file1.txt', new FilePermissionError('/file1.txt'));
      errorHandler.handleFileError('/file2.txt', new FilePermissionError('/file2.txt'));
      errorHandler.handleFileError('/file3.txt', new FileNotFoundError('/file3.txt'));
      
      const permissionErrors = errorHandler.getErrorsByType('FilePermissionError');
      const notFoundErrors = errorHandler.getErrorsByType('FileNotFoundError');
      
      expect(permissionErrors).toHaveLength(2);
      expect(notFoundErrors).toHaveLength(1);
    });

    it('should return empty array for non-existent error type', () => {
      errorHandler.handleFileError('/file1.txt', new FilePermissionError('/file1.txt'));
      
      const configErrors = errorHandler.getErrorsByType('ConfigurationError');
      
      expect(configErrors).toHaveLength(0);
    });

    it('should check if errors exist', () => {
      expect(errorHandler.hasErrors()).toBe(false);
      
      errorHandler.handleFileError('/file1.txt', new Error('Error'));
      
      expect(errorHandler.hasErrors()).toBe(true);
    });

    it('should clear all errors', () => {
      errorHandler.handleFileError('/file1.txt', new Error('Error 1'));
      errorHandler.handleFileError('/file2.txt', new Error('Error 2'));
      
      expect(errorHandler.getErrorCount()).toBe(2);
      
      errorHandler.clearErrors();
      
      expect(errorHandler.getErrorCount()).toBe(0);
      expect(errorHandler.hasErrors()).toBe(false);
    });

    it('should generate error summary', () => {
      errorHandler.handleFileError('/file1.txt', new FilePermissionError('/file1.txt'));
      errorHandler.handleFileError('/file2.txt', new FilePermissionError('/file2.txt'));
      errorHandler.handleFileError('/file3.txt', new FileNotFoundError('/file3.txt'));
      errorHandler.handleScanError(new PatternCompilationError('aws-key', '[a-z+'));
      
      const summary = errorHandler.getErrorSummary();
      
      expect(summary['FilePermissionError']).toBe(2);
      expect(summary['FileNotFoundError']).toBe(1);
      expect(summary['PatternCompilationError']).toBe(1);
    });

    it('should return empty summary when no errors', () => {
      const summary = errorHandler.getErrorSummary();
      
      expect(summary).toEqual({});
    });
  });

  describe('Exit Codes', () => {
    it('should have correct exit code values', () => {
      expect(ExitCode.SUCCESS).toBe(0);
      expect(ExitCode.ISSUES_FOUND).toBe(1);
      expect(ExitCode.INVALID_USAGE).toBe(2);
      expect(ExitCode.UNEXPECTED_ERROR).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors with no name property', () => {
      const error = new Error('Generic error');
      // Even after deleting, Error class has a default name
      Object.defineProperty(error, 'name', { value: undefined });
      
      errorHandler.handleFileError('/file.txt', error);
      
      const errors = errorHandler.getErrors();
      expect(errors[0].type).toBe('FileError');
    });

    it('should handle very long error messages', () => {
      const longMessage = 'Error: ' + 'x'.repeat(10000);
      const error = new Error(longMessage);
      
      errorHandler.handleFileError('/file.txt', error);
      
      const errors = errorHandler.getErrors();
      expect(errors[0].message).toBe(longMessage);
    });

    it('should handle special characters in file paths', () => {
      const specialPath = '/path/with spaces/and-special_chars!@#$.txt';
      const error = new FilePermissionError(specialPath);
      
      errorHandler.handleFileError(specialPath, error);
      
      const errors = errorHandler.getErrors();
      expect(errors[0].filePath).toBe(specialPath);
    });

    it('should handle errors with undefined stack', () => {
      const debugHandler = new ErrorHandler(true);
      const error = new Error('Error without stack');
      delete error.stack;
      
      debugHandler.handleFileError('/file.txt', error);
      
      const errors = debugHandler.getErrors();
      expect(errors[0].stack).toBeUndefined();
    });

    it('should handle multiple errors for same file', () => {
      errorHandler.handleFileError('/file.txt', new FilePermissionError('/file.txt'));
      errorHandler.handleFileError('/file.txt', new InvalidEncodingError('/file.txt', 'utf-8'));
      
      expect(errorHandler.getErrorCount()).toBe(2);
      
      const errors = errorHandler.getErrors();
      expect(errors[0].filePath).toBe('/file.txt');
      expect(errors[1].filePath).toBe('/file.txt');
      expect(errors[0].type).not.toBe(errors[1].type);
    });

    it('should return copy of errors array', () => {
      errorHandler.handleFileError('/file.txt', new Error('Error'));
      
      const errors1 = errorHandler.getErrors();
      const errors2 = errorHandler.getErrors();
      
      expect(errors1).not.toBe(errors2); // Different array instances
      expect(errors1).toEqual(errors2); // Same content
    });
  });
});
