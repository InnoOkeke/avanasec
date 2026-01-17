/**
 * Unit Tests: Exit Code System
 * Tests for exit code utilities and functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  ExitCode, 
  EXIT_CODE_DESCRIPTIONS, 
  determineExitCode, 
  exitWithCode, 
  handleUnexpectedError, 
  handleInvalidArguments 
} from '../../src/utils/exit-codes';

// Mock process.exit to prevent actual process termination during tests
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Exit Code System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('ExitCode enum', () => {
    it('should have correct exit code values', () => {
      expect(ExitCode.SUCCESS).toBe(0);
      expect(ExitCode.ISSUES_FOUND).toBe(1);
      expect(ExitCode.INVALID_ARGUMENTS).toBe(2);
      expect(ExitCode.UNEXPECTED_ERROR).toBe(3);
    });
  });

  describe('EXIT_CODE_DESCRIPTIONS', () => {
    it('should have descriptions for all exit codes', () => {
      expect(EXIT_CODE_DESCRIPTIONS[ExitCode.SUCCESS]).toBe('No critical or high severity issues found');
      expect(EXIT_CODE_DESCRIPTIONS[ExitCode.ISSUES_FOUND]).toBe('Critical or high severity issues found');
      expect(EXIT_CODE_DESCRIPTIONS[ExitCode.INVALID_ARGUMENTS]).toBe('Invalid arguments or configuration');
      expect(EXIT_CODE_DESCRIPTIONS[ExitCode.UNEXPECTED_ERROR]).toBe('Unexpected error occurred');
    });
  });

  describe('determineExitCode', () => {
    it('should return SUCCESS when no critical or high issues', () => {
      const result = { summary: { critical: 0, high: 0, medium: 5, low: 10 } };
      expect(determineExitCode(result)).toBe(ExitCode.SUCCESS);
    });

    it('should return ISSUES_FOUND when critical issues exist', () => {
      const result = { summary: { critical: 1, high: 0, medium: 0, low: 0 } };
      expect(determineExitCode(result)).toBe(ExitCode.ISSUES_FOUND);
    });

    it('should return ISSUES_FOUND when high issues exist (default behavior)', () => {
      const result = { summary: { critical: 0, high: 1, medium: 0, low: 0 } };
      expect(determineExitCode(result)).toBe(ExitCode.ISSUES_FOUND);
    });

    it('should return ISSUES_FOUND when high issues exist and failOnHigh is true', () => {
      const result = { summary: { critical: 0, high: 1, medium: 0, low: 0 } };
      expect(determineExitCode(result, { failOnHigh: true })).toBe(ExitCode.ISSUES_FOUND);
    });

    it('should return ISSUES_FOUND when high issues exist and failOnHigh is false (default behavior)', () => {
      const result = { summary: { critical: 0, high: 1, medium: 0, low: 0 } };
      expect(determineExitCode(result, { failOnHigh: false })).toBe(ExitCode.ISSUES_FOUND);
    });

    it('should prioritize critical issues over failOnHigh setting', () => {
      const result = { summary: { critical: 1, high: 1, medium: 0, low: 0 } };
      expect(determineExitCode(result, { failOnHigh: false })).toBe(ExitCode.ISSUES_FOUND);
      expect(determineExitCode(result, { failOnHigh: true })).toBe(ExitCode.ISSUES_FOUND);
    });

    it('should return SUCCESS when only medium and low issues exist', () => {
      const result = { summary: { critical: 0, high: 0, medium: 5, low: 10 } };
      expect(determineExitCode(result, { failOnHigh: true })).toBe(ExitCode.SUCCESS);
      expect(determineExitCode(result, { failOnHigh: false })).toBe(ExitCode.SUCCESS);
    });

    it('should handle empty options object', () => {
      const result = { summary: { critical: 0, high: 1, medium: 0, low: 0 } };
      expect(determineExitCode(result, {})).toBe(ExitCode.ISSUES_FOUND);
    });

    it('should handle undefined options', () => {
      const result = { summary: { critical: 0, high: 0, medium: 1, low: 0 } };
      expect(determineExitCode(result)).toBe(ExitCode.SUCCESS);
    });
  });

  describe('exitWithCode', () => {
    it('should exit with SUCCESS code and log message', () => {
      expect(() => {
        exitWithCode(ExitCode.SUCCESS, 'Test success message');
      }).toThrow('process.exit called');
      
      expect(mockConsoleLog).toHaveBeenCalledWith('Test success message');
      expect(mockExit).toHaveBeenCalledWith(ExitCode.SUCCESS);
    });

    it('should exit with error code and log error message', () => {
      expect(() => {
        exitWithCode(ExitCode.ISSUES_FOUND, 'Test error message');
      }).toThrow('process.exit called');
      
      expect(mockConsoleError).toHaveBeenCalledWith('Test error message');
      expect(mockExit).toHaveBeenCalledWith(ExitCode.ISSUES_FOUND);
    });

    it('should exit without message when none provided', () => {
      expect(() => {
        exitWithCode(ExitCode.SUCCESS);
      }).toThrow('process.exit called');
      
      expect(mockConsoleLog).not.toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(ExitCode.SUCCESS);
    });

    it('should use console.error for non-success exit codes', () => {
      expect(() => {
        exitWithCode(ExitCode.INVALID_ARGUMENTS, 'Invalid args');
      }).toThrow('process.exit called');
      
      expect(mockConsoleError).toHaveBeenCalledWith('Invalid args');
      expect(mockConsoleLog).not.toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(ExitCode.INVALID_ARGUMENTS);
    });
  });

  describe('handleUnexpectedError', () => {
    it('should handle Error objects', () => {
      const error = new Error('Test error message');
      
      expect(() => {
        handleUnexpectedError(error);
      }).toThrow('process.exit called');
      
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Unexpected error occurred:');
      expect(mockConsoleError).toHaveBeenCalledWith('Test error message');
      expect(mockExit).toHaveBeenCalledWith(ExitCode.UNEXPECTED_ERROR);
    });

    it('should show stack trace when DEBUG environment variable is set', () => {
      const originalDebug = process.env.DEBUG;
      process.env.DEBUG = 'true';
      
      const error = new Error('Test error with stack');
      error.stack = 'Error: Test error with stack\n    at test.js:1:1';
      
      expect(() => {
        handleUnexpectedError(error);
      }).toThrow('process.exit called');
      
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Unexpected error occurred:');
      expect(mockConsoleError).toHaveBeenCalledWith('Test error with stack');
      expect(mockConsoleError).toHaveBeenCalledWith('\nStack trace:');
      expect(mockConsoleError).toHaveBeenCalledWith('Error: Test error with stack\n    at test.js:1:1');
      expect(mockExit).toHaveBeenCalledWith(ExitCode.UNEXPECTED_ERROR);
      
      // Restore original DEBUG value
      if (originalDebug !== undefined) {
        process.env.DEBUG = originalDebug;
      } else {
        delete process.env.DEBUG;
      }
    });

    it('should not show stack trace when DEBUG is not set', () => {
      const originalDebug = process.env.DEBUG;
      delete process.env.DEBUG;
      
      const error = new Error('Test error without stack');
      error.stack = 'Error: Test error without stack\n    at test.js:1:1';
      
      expect(() => {
        handleUnexpectedError(error);
      }).toThrow('process.exit called');
      
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Unexpected error occurred:');
      expect(mockConsoleError).toHaveBeenCalledWith('Test error without stack');
      expect(mockConsoleError).not.toHaveBeenCalledWith('\nStack trace:');
      expect(mockExit).toHaveBeenCalledWith(ExitCode.UNEXPECTED_ERROR);
      
      // Restore original DEBUG value
      if (originalDebug !== undefined) {
        process.env.DEBUG = originalDebug;
      }
    });
  });

  describe('handleInvalidArguments', () => {
    it('should handle invalid arguments with proper message', () => {
      expect(() => {
        handleInvalidArguments('Invalid flag provided');
      }).toThrow('process.exit called');
      
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Invalid arguments:');
      expect(mockConsoleError).toHaveBeenCalledWith('Invalid flag provided');
      expect(mockConsoleError).toHaveBeenCalledWith('\nRun "avana --help" for usage information');
      expect(mockExit).toHaveBeenCalledWith(ExitCode.INVALID_ARGUMENTS);
    });

    it('should provide help information', () => {
      expect(() => {
        handleInvalidArguments('Missing required value');
      }).toThrow('process.exit called');
      
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Invalid arguments:');
      expect(mockConsoleError).toHaveBeenCalledWith('Missing required value');
      expect(mockConsoleError).toHaveBeenCalledWith('\nRun "avana --help" for usage information');
      expect(mockExit).toHaveBeenCalledWith(ExitCode.INVALID_ARGUMENTS);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero values in all severity categories', () => {
      const result = { summary: { critical: 0, high: 0, medium: 0, low: 0 } };
      expect(determineExitCode(result)).toBe(ExitCode.SUCCESS);
    });

    it('should handle large numbers of issues', () => {
      const result = { summary: { critical: 1000, high: 2000, medium: 3000, low: 4000 } };
      expect(determineExitCode(result)).toBe(ExitCode.ISSUES_FOUND);
    });

    it('should handle mixed severity levels correctly', () => {
      const result = { summary: { critical: 1, high: 2, medium: 3, low: 4 } };
      expect(determineExitCode(result, { failOnHigh: true })).toBe(ExitCode.ISSUES_FOUND);
      expect(determineExitCode(result, { failOnHigh: false })).toBe(ExitCode.ISSUES_FOUND);
    });
  });
});