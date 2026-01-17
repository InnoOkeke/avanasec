/**
 * Error Handler
 * Centralized error handling with proper exit codes and error tracking
 */

/**
 * Exit codes for the CLI
 */
export enum ExitCode {
  SUCCESS = 0,
  ISSUES_FOUND = 1,
  INVALID_USAGE = 2,
  UNEXPECTED_ERROR = 3,
}

/**
 * Custom error types for different error categories
 */

/**
 * File permission error - thrown when file cannot be read due to permissions
 */
export class FilePermissionError extends Error {
  constructor(
    public filePath: string,
    message?: string
  ) {
    super(message || `Permission denied: ${filePath}`);
    this.name = 'FilePermissionError';
  }
}

/**
 * File not found error - thrown when file doesn't exist
 */
export class FileNotFoundError extends Error {
  constructor(
    public filePath: string,
    message?: string
  ) {
    super(message || `File not found: ${filePath}`);
    this.name = 'FileNotFoundError';
  }
}

/**
 * Invalid encoding error - thrown when file encoding cannot be processed
 */
export class InvalidEncodingError extends Error {
  constructor(
    public filePath: string,
    public encoding: string,
    message?: string
  ) {
    super(message || `Invalid encoding '${encoding}' for file: ${filePath}`);
    this.name = 'InvalidEncodingError';
  }
}

/**
 * Configuration error - thrown when configuration is invalid
 */
export class ConfigurationError extends Error {
  constructor(
    public configKey: string,
    message?: string
  ) {
    super(message || `Invalid configuration: ${configKey}`);
    this.name = 'ConfigurationError';
  }
}

/**
 * Out of memory error - thrown when memory limit is exceeded
 */
export class OutOfMemoryError extends Error {
  constructor(
    public currentUsage: number,
    public limit: number,
    message?: string
  ) {
    super(message || `Out of memory: ${currentUsage}MB exceeds limit of ${limit}MB`);
    this.name = 'OutOfMemoryError';
  }
}

/**
 * Pattern compilation error - thrown when regex pattern fails to compile
 */
export class PatternCompilationError extends Error {
  constructor(
    public patternId: string,
    public pattern: string,
    message?: string
  ) {
    super(message || `Failed to compile pattern '${patternId}': ${pattern}`);
    this.name = 'PatternCompilationError';
  }
}

/**
 * Error information for tracking
 */
interface ErrorInfo {
  type: string;
  message: string;
  filePath?: string;
  timestamp: Date;
  stack?: string;
}

/**
 * Error Handler class
 * Centralized error handling with logging and tracking
 */
export class ErrorHandler {
  private errors: ErrorInfo[] = [];
  private debugMode: boolean = false;

  constructor(debugMode: boolean = false) {
    this.debugMode = debugMode;
  }

  /**
   * Handle file-related errors (permission, not found, encoding)
   * These errors should not stop the scan - log and continue
   */
  public handleFileError(filePath: string, error: Error): void {
    const errorInfo: ErrorInfo = {
      type: error.name || 'FileError',
      message: error.message,
      filePath,
      timestamp: new Date(),
      stack: this.debugMode ? error.stack : undefined,
    };

    this.errors.push(errorInfo);

    // Log error to console
    console.error(`Error scanning file ${filePath}: ${error.message}`);
    
    if (this.debugMode && error.stack) {
      console.error(error.stack);
    }
  }

  /**
   * Handle scan-related errors (unexpected errors during scanning)
   * These errors should not stop the scan - log and continue
   */
  public handleScanError(error: Error): void {
    const errorInfo: ErrorInfo = {
      type: error.name || 'ScanError',
      message: error.message,
      timestamp: new Date(),
      stack: this.debugMode ? error.stack : undefined,
    };

    this.errors.push(errorInfo);

    // Log error to console
    console.error(`Scan error: ${error.message}`);
    
    if (this.debugMode && error.stack) {
      console.error(error.stack);
    }
  }

  /**
   * Handle validation errors (invalid arguments, configuration)
   * These errors should stop execution immediately
   */
  public handleValidationError(message: string): never {
    const errorInfo: ErrorInfo = {
      type: 'ValidationError',
      message,
      timestamp: new Date(),
    };

    this.errors.push(errorInfo);

    // Log error and exit
    console.error(`Validation error: ${message}`);
    process.exit(ExitCode.INVALID_USAGE);
  }

  /**
   * Handle critical errors (out of memory, system errors)
   * These errors should stop execution immediately
   */
  public handleCriticalError(error: Error): never {
    const errorInfo: ErrorInfo = {
      type: error.name || 'CriticalError',
      message: error.message,
      timestamp: new Date(),
      stack: this.debugMode ? error.stack : undefined,
    };

    this.errors.push(errorInfo);

    // Log error and exit
    console.error(`Critical error: ${error.message}`);
    
    if (this.debugMode && error.stack) {
      console.error(error.stack);
    }

    process.exit(ExitCode.UNEXPECTED_ERROR);
  }

  /**
   * Get total error count
   */
  public getErrorCount(): number {
    return this.errors.length;
  }

  /**
   * Get all errors
   */
  public getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  /**
   * Get errors by type
   */
  public getErrorsByType(type: string): ErrorInfo[] {
    return this.errors.filter(error => error.type === type);
  }

  /**
   * Clear all errors
   */
  public clearErrors(): void {
    this.errors = [];
  }

  /**
   * Check if there are any errors
   */
  public hasErrors(): boolean {
    return this.errors.length > 0;
  }

  /**
   * Get error summary
   */
  public getErrorSummary(): Record<string, number> {
    const summary: Record<string, number> = {};
    
    for (const error of this.errors) {
      summary[error.type] = (summary[error.type] || 0) + 1;
    }
    
    return summary;
  }
}
