/**
 * Logger
 * Production-ready logging system with verbosity levels
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Log levels in order of verbosity
 */
export enum LogLevel {
  QUIET = 0,    // Only critical errors and final results
  NORMAL = 1,   // Standard output
  VERBOSE = 2,  // Detailed information
  DEBUG = 3     // Maximum detail for debugging
}

/**
 * Log entry interface
 */
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  enableTimestamps: boolean;
  enableColors: boolean;
  logToFile?: string;
  maxLogFileSize?: number; // in bytes
  maxLogFiles?: number;
}

/**
 * ANSI color codes for terminal output
 */
const Colors = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  GRAY: '\x1b[90m'
} as const;

/**
 * Production-ready Logger class
 * Supports multiple verbosity levels, file logging, and structured output
 */
export class Logger {
  private config: LoggerConfig;
  private logEntries: LogEntry[] = [];
  private fileHandle?: fs.WriteStream;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.NORMAL,
      enableTimestamps: true,
      enableColors: process.stdout.isTTY, // Auto-detect terminal support
      maxLogFileSize: 10 * 1024 * 1024, // 10MB
      maxLogFiles: 5,
      ...config
    };

    if (this.config.logToFile) {
      this.initializeFileLogging();
    }
  }

  /**
   * Initialize file logging with rotation
   */
  private initializeFileLogging(): void {
    if (!this.config.logToFile) return;

    try {
      // Ensure log directory exists
      const logDir = path.dirname(this.config.logToFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      // Rotate log file if it's too large
      this.rotateLogFileIfNeeded();

      // Open file for appending (synchronously for tests)
      this.fileHandle = fs.createWriteStream(this.config.logToFile, { flags: 'a' });
      
      this.fileHandle.on('error', (error) => {
        console.error(`Logger: Failed to write to log file: ${error.message}`);
        this.fileHandle = undefined; // Disable file logging on error
      });
    } catch (error) {
      console.error(`Logger: Failed to initialize file logging: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Rotate log file if it exceeds size limit
   */
  private rotateLogFileIfNeeded(): void {
    if (!this.config.logToFile || !this.config.maxLogFileSize) return;

    try {
      if (fs.existsSync(this.config.logToFile)) {
        const stats = fs.statSync(this.config.logToFile);
        if (stats.size >= this.config.maxLogFileSize) {
          this.rotateLogFiles();
        }
      }
    } catch (error) {
      // Ignore rotation errors, continue with logging
    }
  }

  /**
   * Rotate log files (keep maxLogFiles)
   */
  private rotateLogFiles(): void {
    if (!this.config.logToFile || !this.config.maxLogFiles) return;

    try {
      const logFile = this.config.logToFile;
      const maxFiles = this.config.maxLogFiles;

      // Remove oldest log file
      const oldestLog = `${logFile}.${maxFiles}`;
      if (fs.existsSync(oldestLog)) {
        fs.unlinkSync(oldestLog);
      }

      // Shift all log files
      for (let i = maxFiles - 1; i >= 1; i--) {
        const currentLog = i === 1 ? logFile : `${logFile}.${i}`;
        const nextLog = `${logFile}.${i + 1}`;
        
        if (fs.existsSync(currentLog)) {
          fs.renameSync(currentLog, nextLog);
        }
      }
    } catch (error) {
      // Ignore rotation errors, continue with logging
    }
  }

  /**
   * Set log level
   */
  public setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Get current log level
   */
  public getLevel(): LogLevel {
    return this.config.level;
  }

  /**
   * Check if a log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }

  /**
   * Format timestamp
   */
  private formatTimestamp(): string {
    if (!this.config.enableTimestamps) return '';
    
    const now = new Date();
    return `[${now.toISOString()}] `;
  }

  /**
   * Apply color to text if colors are enabled
   */
  private colorize(text: string, color: string): string {
    if (!this.config.enableColors) return text;
    return `${color}${text}${Colors.RESET}`;
  }

  /**
   * Get color for log level
   */
  private getLevelColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.QUIET: return Colors.RED;
      case LogLevel.NORMAL: return Colors.WHITE;
      case LogLevel.VERBOSE: return Colors.CYAN;
      case LogLevel.DEBUG: return Colors.GRAY;
      default: return Colors.WHITE;
    }
  }

  /**
   * Get level name
   */
  private getLevelName(level: LogLevel): string {
    switch (level) {
      case LogLevel.QUIET: return 'ERROR';
      case LogLevel.NORMAL: return 'INFO';
      case LogLevel.VERBOSE: return 'VERBOSE';
      case LogLevel.DEBUG: return 'DEBUG';
      default: return 'INFO';
    }
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, category: string, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      data
    };

    // Store entry for retrieval
    this.logEntries.push(entry);

    // Format for console output
    const timestamp = this.formatTimestamp();
    const levelName = this.colorize(`[${this.getLevelName(level)}]`, this.getLevelColor(level));
    const categoryText = this.colorize(`[${category}]`, Colors.BLUE);
    const messageText = message;
    
    const consoleOutput = `${timestamp}${levelName} ${categoryText} ${messageText}`;
    
    // Output to console
    if (level === LogLevel.QUIET) {
      console.error(consoleOutput);
    } else {
      console.log(consoleOutput);
    }

    // Output to file (without colors)
    if (this.fileHandle && !this.fileHandle.destroyed) {
      const fileOutput = `${timestamp}[${this.getLevelName(level)}] [${category}] ${message}`;
      this.fileHandle.write(fileOutput + '\n');
      
      if (data) {
        this.fileHandle.write(`  Data: ${JSON.stringify(data, null, 2)}\n`);
      }
    }
  }

  /**
   * Critical error logging (always shown)
   */
  public error(category: string, message: string, data?: any): void {
    this.log(LogLevel.QUIET, category, this.colorize(message, Colors.RED), data);
  }

  /**
   * Standard information logging
   */
  public info(category: string, message: string, data?: any): void {
    this.log(LogLevel.NORMAL, category, message, data);
  }

  /**
   * Success message logging
   */
  public success(category: string, message: string, data?: any): void {
    this.log(LogLevel.NORMAL, category, this.colorize(message, Colors.GREEN), data);
  }

  /**
   * Warning message logging
   */
  public warn(category: string, message: string, data?: any): void {
    this.log(LogLevel.NORMAL, category, this.colorize(message, Colors.YELLOW), data);
  }

  /**
   * Verbose logging (--verbose flag)
   */
  public verbose(category: string, message: string, data?: any): void {
    this.log(LogLevel.VERBOSE, category, message, data);
  }

  /**
   * Debug logging (--debug flag)
   */
  public debug(category: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  /**
   * Log file scanning activity
   */
  public logFileScanning(filePath: string, action: 'scanning' | 'skipped' | 'ignored', reason?: string): void {
    const message = reason ? `${action} ${filePath} (${reason})` : `${action} ${filePath}`;
    
    if (action === 'scanning') {
      this.verbose('SCAN', message);
    } else if (action === 'skipped') {
      this.verbose('SKIP', message);
    } else if (action === 'ignored') {
      this.verbose('IGNORE', message);
    }
  }

  /**
   * Log pattern checking activity
   */
  public logPatternCheck(filePath: string, patternName: string, matched: boolean): void {
    const status = matched ? 'MATCH' : 'NO_MATCH';
    this.debug('PATTERN', `${status} ${patternName} in ${filePath}`);
  }

  /**
   * Log scan progress
   */
  public logProgress(filesScanned: number, totalFiles: number, currentFile?: string): void {
    const percentage = Math.round((filesScanned / totalFiles) * 100);
    const message = currentFile 
      ? `Progress: ${filesScanned}/${totalFiles} (${percentage}%) - ${currentFile}`
      : `Progress: ${filesScanned}/${totalFiles} (${percentage}%)`;
    
    this.verbose('PROGRESS', message);
  }

  /**
   * Log scan summary
   */
  public logSummary(summary: {
    filesScanned: number;
    issuesFound: number;
    duration: number;
    securityScore: number;
  }): void {
    this.info('SUMMARY', `Scanned ${summary.filesScanned} files in ${summary.duration}ms`);
    this.info('SUMMARY', `Found ${summary.issuesFound} security issues`);
    this.info('SUMMARY', `Security score: ${summary.securityScore}/100`);
  }

  /**
   * Get all log entries
   */
  public getLogEntries(): LogEntry[] {
    return [...this.logEntries];
  }

  /**
   * Get log entries by level
   */
  public getLogEntriesByLevel(level: LogLevel): LogEntry[] {
    return this.logEntries.filter(entry => entry.level === level);
  }

  /**
   * Clear log entries (keep file logging)
   */
  public clearEntries(): void {
    this.logEntries = [];
  }

  /**
   * Get log statistics
   */
  public getStats(): {
    totalEntries: number;
    entriesByLevel: Record<LogLevel, number>;
  } {
    const entriesByLevel = {
      [LogLevel.QUIET]: 0,
      [LogLevel.NORMAL]: 0,
      [LogLevel.VERBOSE]: 0,
      [LogLevel.DEBUG]: 0
    };

    this.logEntries.forEach(entry => {
      entriesByLevel[entry.level]++;
    });

    return {
      totalEntries: this.logEntries.length,
      entriesByLevel
    };
  }

  /**
   * Close file handle and cleanup
   */
  public close(): void {
    if (this.fileHandle && !this.fileHandle.destroyed) {
      this.fileHandle.end();
      this.fileHandle = undefined;
    }
  }

  /**
   * Create logger from CLI flags
   */
  public static fromFlags(flags: {
    verbose?: boolean;
    debug?: boolean;
    quiet?: boolean;
    logFile?: string;
  }): Logger {
    let level = LogLevel.NORMAL;
    
    if (flags.quiet) {
      level = LogLevel.QUIET;
    } else if (flags.debug) {
      level = LogLevel.DEBUG;
    } else if (flags.verbose) {
      level = LogLevel.VERBOSE;
    }

    return new Logger({
      level,
      logToFile: flags.logFile,
      enableColors: !flags.quiet // Disable colors in quiet mode
    });
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Convenience functions for common logging patterns
 */
export const log = {
  error: (message: string, data?: any) => logger.error('APP', message, data),
  info: (message: string, data?: any) => logger.info('APP', message, data),
  success: (message: string, data?: any) => logger.success('APP', message, data),
  warn: (message: string, data?: any) => logger.warn('APP', message, data),
  verbose: (message: string, data?: any) => logger.verbose('APP', message, data),
  debug: (message: string, data?: any) => logger.debug('APP', message, data),
};