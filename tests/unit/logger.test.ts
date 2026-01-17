/**
 * Unit Tests: Logger
 * Tests for logging system with verbosity levels, file logging, and structured output
 * 
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { Logger, LogLevel, LogEntry } from '../../src/utils/logger';
import {
  createTempDir,
  cleanupTempDir,
} from '../helpers/test-utils';

// Mock console methods
const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();

describe('Logger', () => {
  let logger: Logger;
  let tempDir: string;
  let originalConsoleLog: typeof console.log;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    tempDir = createTempDir();
    
    // Mock console methods
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    console.log = mockConsoleLog;
    console.error = mockConsoleError;
    
    // Clear mocks
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  afterEach(() => {
    // Restore console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    
    if (logger) {
      logger.close();
    }
    cleanupTempDir(tempDir);
  });

  describe('Basic Logging', () => {
    beforeEach(() => {
      logger = new Logger({ level: LogLevel.DEBUG, enableColors: false });
    });

    it('should create logger with default configuration', () => {
      const defaultLogger = new Logger();
      
      expect(defaultLogger.getLevel()).toBe(LogLevel.NORMAL);
    });

    it('should log error messages', () => {
      logger.error('TEST', 'Test error message');
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] [TEST] Test error message')
      );
    });

    it('should log info messages', () => {
      logger.info('TEST', 'Test info message');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] [TEST] Test info message')
      );
    });

    it('should log success messages', () => {
      logger.success('TEST', 'Test success message');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] [TEST] Test success message')
      );
    });

    it('should log warning messages', () => {
      logger.warn('TEST', 'Test warning message');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] [TEST] Test warning message')
      );
    });

    it('should log verbose messages', () => {
      logger.verbose('TEST', 'Test verbose message');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[VERBOSE] [TEST] Test verbose message')
      );
    });

    it('should log debug messages', () => {
      logger.debug('TEST', 'Test debug message');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG] [TEST] Test debug message')
      );
    });
  });

  describe('Log Levels', () => {
    it('should respect QUIET level (only errors)', () => {
      logger = new Logger({ level: LogLevel.QUIET, enableColors: false });
      
      logger.error('TEST', 'Error message');
      logger.info('TEST', 'Info message');
      logger.verbose('TEST', 'Verbose message');
      logger.debug('TEST', 'Debug message');
      
      expect(mockConsoleError).toHaveBeenCalledTimes(1);
      expect(mockConsoleLog).toHaveBeenCalledTimes(0);
    });

    it('should respect NORMAL level (errors and info)', () => {
      logger = new Logger({ level: LogLevel.NORMAL, enableColors: false });
      
      logger.error('TEST', 'Error message');
      logger.info('TEST', 'Info message');
      logger.verbose('TEST', 'Verbose message');
      logger.debug('TEST', 'Debug message');
      
      expect(mockConsoleError).toHaveBeenCalledTimes(1);
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    });

    it('should respect VERBOSE level (errors, info, and verbose)', () => {
      logger = new Logger({ level: LogLevel.VERBOSE, enableColors: false });
      
      logger.error('TEST', 'Error message');
      logger.info('TEST', 'Info message');
      logger.verbose('TEST', 'Verbose message');
      logger.debug('TEST', 'Debug message');
      
      expect(mockConsoleError).toHaveBeenCalledTimes(1);
      expect(mockConsoleLog).toHaveBeenCalledTimes(2);
    });

    it('should respect DEBUG level (all messages)', () => {
      logger = new Logger({ level: LogLevel.DEBUG, enableColors: false });
      
      logger.error('TEST', 'Error message');
      logger.info('TEST', 'Info message');
      logger.verbose('TEST', 'Verbose message');
      logger.debug('TEST', 'Debug message');
      
      expect(mockConsoleError).toHaveBeenCalledTimes(1);
      expect(mockConsoleLog).toHaveBeenCalledTimes(3);
    });

    it('should allow changing log level', () => {
      logger = new Logger({ level: LogLevel.QUIET, enableColors: false });
      
      logger.info('TEST', 'Should not appear');
      expect(mockConsoleLog).toHaveBeenCalledTimes(0);
      
      logger.setLevel(LogLevel.NORMAL);
      logger.info('TEST', 'Should appear');
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    });
  });

  describe('Timestamps', () => {
    it('should include timestamps when enabled', () => {
      logger = new Logger({ 
        level: LogLevel.NORMAL, 
        enableTimestamps: true, 
        enableColors: false 
      });
      
      logger.info('TEST', 'Test message');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
      );
    });

    it('should not include timestamps when disabled', () => {
      logger = new Logger({ 
        level: LogLevel.NORMAL, 
        enableTimestamps: false, 
        enableColors: false 
      });
      
      logger.info('TEST', 'Test message');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.not.stringMatching(/^\[\d{4}-\d{2}-\d{2}T/)
      );
    });
  });

  describe('File Logging', () => {
    let logFilePath: string;

    beforeEach(() => {
      logFilePath = path.join(tempDir, 'test.log');
    });

    it('should write logs to file', async () => {
      logger = new Logger({ 
        level: LogLevel.NORMAL, 
        logToFile: logFilePath,
        enableColors: false 
      });
      
      logger.info('TEST', 'Test message');
      logger.close();
      
      // Wait a bit for file operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(fs.existsSync(logFilePath)).toBe(true);
      const logContent = fs.readFileSync(logFilePath, 'utf-8');
      expect(logContent).toContain('[INFO] [TEST] Test message');
    });

    it('should create log directory if it does not exist', async () => {
      const nestedLogPath = path.join(tempDir, 'logs', 'nested', 'test.log');
      
      logger = new Logger({ 
        level: LogLevel.NORMAL, 
        logToFile: nestedLogPath,
        enableColors: false 
      });
      
      logger.info('TEST', 'Test message');
      logger.close();
      
      // Wait a bit for file operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(fs.existsSync(nestedLogPath)).toBe(true);
    });

    it('should append to existing log file', async () => {
      fs.writeFileSync(logFilePath, 'Existing content\n');
      
      logger = new Logger({ 
        level: LogLevel.NORMAL, 
        logToFile: logFilePath,
        enableColors: false 
      });
      
      logger.info('TEST', 'New message');
      logger.close();
      
      // Wait a bit for file operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const logContent = fs.readFileSync(logFilePath, 'utf-8');
      expect(logContent).toContain('Existing content');
      expect(logContent).toContain('[INFO] [TEST] New message');
    });

    it('should handle file logging errors gracefully', () => {
      const invalidPath = path.join('/invalid/path/test.log');
      
      // Should not throw
      expect(() => {
        logger = new Logger({ 
          level: LogLevel.NORMAL, 
          logToFile: invalidPath,
          enableColors: false 
        });
        logger.info('TEST', 'Test message');
      }).not.toThrow();
    });
  });

  describe('Log Entry Storage', () => {
    beforeEach(() => {
      logger = new Logger({ level: LogLevel.DEBUG, enableColors: false });
    });

    it('should store log entries', () => {
      logger.info('TEST', 'Test message');
      logger.verbose('TEST', 'Verbose message');
      
      const entries = logger.getLogEntries();
      expect(entries).toHaveLength(2);
      expect(entries[0].message).toBe('Test message');
      expect(entries[1].message).toBe('Verbose message');
    });

    it('should filter log entries by level', () => {
      logger.info('TEST', 'Info message');
      logger.verbose('TEST', 'Verbose message');
      logger.debug('TEST', 'Debug message');
      
      const verboseEntries = logger.getLogEntriesByLevel(LogLevel.VERBOSE);
      expect(verboseEntries).toHaveLength(1);
      expect(verboseEntries[0].message).toBe('Verbose message');
    });

    it('should clear log entries', () => {
      logger.info('TEST', 'Test message');
      expect(logger.getLogEntries()).toHaveLength(1);
      
      logger.clearEntries();
      expect(logger.getLogEntries()).toHaveLength(0);
    });

    it('should provide log statistics', () => {
      logger.error('TEST', 'Error message');
      logger.info('TEST', 'Info message');
      logger.verbose('TEST', 'Verbose message');
      logger.debug('TEST', 'Debug message');
      
      const stats = logger.getStats();
      expect(stats.totalEntries).toBe(4);
      expect(stats.entriesByLevel[LogLevel.QUIET]).toBe(1);
      expect(stats.entriesByLevel[LogLevel.NORMAL]).toBe(1);
      expect(stats.entriesByLevel[LogLevel.VERBOSE]).toBe(1);
      expect(stats.entriesByLevel[LogLevel.DEBUG]).toBe(1);
    });
  });

  describe('Specialized Logging Methods', () => {
    beforeEach(() => {
      logger = new Logger({ level: LogLevel.DEBUG, enableColors: false });
    });

    it('should log file scanning activity', () => {
      logger.logFileScanning('test.js', 'scanning');
      logger.logFileScanning('test.png', 'skipped', 'binary file');
      logger.logFileScanning('node_modules/lib.js', 'ignored', 'ignored pattern');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[VERBOSE] [SCAN] scanning test.js')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[VERBOSE] [SKIP] skipped test.png (binary file)')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[VERBOSE] [IGNORE] ignored node_modules/lib.js (ignored pattern)')
      );
    });

    it('should log pattern checking activity', () => {
      logger.logPatternCheck('test.js', 'api-key-pattern', true);
      logger.logPatternCheck('test.js', 'password-pattern', false);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG] [PATTERN] MATCH api-key-pattern in test.js')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG] [PATTERN] NO_MATCH password-pattern in test.js')
      );
    });

    it('should log scan progress', () => {
      logger.logProgress(50, 100);
      logger.logProgress(75, 100, 'current-file.js');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[VERBOSE] [PROGRESS] Progress: 50/100 (50%)')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[VERBOSE] [PROGRESS] Progress: 75/100 (75%) - current-file.js')
      );
    });

    it('should log scan summary', () => {
      const summary = {
        filesScanned: 100,
        issuesFound: 5,
        duration: 1500,
        securityScore: 85
      };
      
      logger.logSummary(summary);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] [SUMMARY] Scanned 100 files in 1500ms')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] [SUMMARY] Found 5 security issues')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] [SUMMARY] Security score: 85/100')
      );
    });
  });

  describe('CLI Flag Integration', () => {
    it('should create logger from verbose flag', () => {
      const verboseLogger = Logger.fromFlags({ verbose: true });
      
      expect(verboseLogger.getLevel()).toBe(LogLevel.VERBOSE);
    });

    it('should create logger from debug flag', () => {
      const debugLogger = Logger.fromFlags({ debug: true });
      
      expect(debugLogger.getLevel()).toBe(LogLevel.DEBUG);
    });

    it('should create logger from quiet flag', () => {
      const quietLogger = Logger.fromFlags({ quiet: true });
      
      expect(quietLogger.getLevel()).toBe(LogLevel.QUIET);
    });

    it('should prioritize debug over verbose', () => {
      const logger = Logger.fromFlags({ verbose: true, debug: true });
      
      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
    });

    it('should prioritize quiet over other flags', () => {
      const logger = Logger.fromFlags({ verbose: true, debug: true, quiet: true });
      
      expect(logger.getLevel()).toBe(LogLevel.QUIET);
    });

    it('should create logger with log file from flags', async () => {
      const logFile = path.join(tempDir, 'cli.log');
      const logger = Logger.fromFlags({ logFile });
      
      logger.info('TEST', 'Test message');
      logger.close();
      
      // Wait a bit for file operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(fs.existsSync(logFile)).toBe(true);
    });
  });

  describe('Color Support', () => {
    it('should include colors when enabled', () => {
      logger = new Logger({ level: LogLevel.NORMAL, enableColors: true });
      
      logger.error('TEST', 'Error message');
      
      // Should contain ANSI color codes
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringMatching(/\x1b\[\d+m/)
      );
    });

    it('should not include colors when disabled', () => {
      logger = new Logger({ level: LogLevel.NORMAL, enableColors: false });
      
      logger.error('TEST', 'Error message');
      
      // Should not contain ANSI color codes
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.not.stringMatching(/\x1b\[\d+m/)
      );
    });
  });

  describe('Data Logging', () => {
    beforeEach(() => {
      logger = new Logger({ level: LogLevel.DEBUG, enableColors: false });
    });

    it('should log additional data objects', () => {
      const testData = { key: 'value', number: 42 };
      
      logger.info('TEST', 'Message with data', testData);
      
      const entries = logger.getLogEntries();
      expect(entries[0].data).toEqual(testData);
    });

    it('should include data in file logs', async () => {
      const logFilePath = path.join(tempDir, 'data.log');
      logger = new Logger({ 
        level: LogLevel.NORMAL, 
        logToFile: logFilePath,
        enableColors: false 
      });
      
      const testData = { key: 'value' };
      logger.info('TEST', 'Message with data', testData);
      logger.close();
      
      // Wait a bit for file operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const logContent = fs.readFileSync(logFilePath, 'utf-8');
      expect(logContent).toContain('Data: {');
      expect(logContent).toContain('"key": "value"');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long messages', () => {
      logger = new Logger({ level: LogLevel.NORMAL, enableColors: false });
      
      const longMessage = 'A'.repeat(10000);
      
      expect(() => {
        logger.info('TEST', longMessage);
      }).not.toThrow();
    });

    it('should handle special characters in messages', () => {
      logger = new Logger({ level: LogLevel.NORMAL, enableColors: false });
      
      const specialMessage = 'Message with 🚀 emojis and \n newlines \t tabs';
      
      expect(() => {
        logger.info('TEST', specialMessage);
      }).not.toThrow();
    });

    it('should handle null and undefined data', () => {
      logger = new Logger({ level: LogLevel.NORMAL, enableColors: false });
      
      expect(() => {
        logger.info('TEST', 'Message', null);
        logger.info('TEST', 'Message', undefined);
      }).not.toThrow();
    });

    it('should handle circular references in data', () => {
      logger = new Logger({ level: LogLevel.NORMAL, enableColors: false });
      
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj;
      
      expect(() => {
        logger.info('TEST', 'Message', circularObj);
      }).not.toThrow();
    });
  });

  describe('Resource Management', () => {
    it('should close file handles properly', () => {
      const logFilePath = path.join(tempDir, 'close-test.log');
      logger = new Logger({ 
        level: LogLevel.NORMAL, 
        logToFile: logFilePath,
        enableColors: false 
      });
      
      logger.info('TEST', 'Before close');
      logger.close();
      
      // Should not throw after closing
      expect(() => {
        logger.info('TEST', 'After close');
      }).not.toThrow();
    });

    it('should handle multiple close calls', () => {
      const logFilePath = path.join(tempDir, 'multi-close.log');
      logger = new Logger({ 
        level: LogLevel.NORMAL, 
        logToFile: logFilePath,
        enableColors: false 
      });
      
      expect(() => {
        logger.close();
        logger.close();
        logger.close();
      }).not.toThrow();
    });
  });
});