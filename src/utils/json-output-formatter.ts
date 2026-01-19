/**
 * JSON Output Formatter
 * Production-ready JSON formatter for CI/CD integration
 */

/**
 * Security issue severity levels
 */
export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Security issue interface
 */
export interface SecurityIssue {
  id: string;
  type: string;
  severity: Severity;
  message: string;
  filePath: string;
  lineNumber: number;
  columnNumber?: number;
  match: string;
  context?: string;
  confidence: number;
  ruleId: string;
  ruleName: string;
}

/**
 * Issue summary statistics
 */
export interface IssueSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  byType: Record<string, number>;
  byFile: Record<string, number>;
}

/**
 * Scan metadata
 */
export interface ScanMetadata {
  avanaVersion: string;
  scanId: string;
  startTime: string;
  endTime: string;
  duration: number;
  filesScanned: number;
  filesSkipped: number;
  filesIgnored: number;
  totalFiles: number;
  scanOptions: ScanOptions;
  environment: EnvironmentInfo;
}

/**
 * Scan options used
 */
export interface ScanOptions {
  verbose: boolean;
  debug: boolean;
  quiet: boolean;
  patterns: string[];
  ignorePatterns: string[];
  maxFileSize: number;
  parallel: boolean;
  workerCount?: number;
}

/**
 * Environment information
 */
export interface EnvironmentInfo {
  nodeVersion: string;
  platform: string;
  arch: string;
  cwd: string;
  user?: string;
  ci?: boolean;
  ciProvider?: string;
}

/**
 * Debug information
 */
export interface DebugInfo {
  memoryUsage: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  performanceMetrics: {
    avgFileProcessingTime: number;
    slowestFile: {
      path: string;
      duration: number;
    };
    fastestFile: {
      path: string;
      duration: number;
    };
    patternMatchingTime: number;
    fileReadingTime: number;
  };
  cacheStats?: {
    hitRate: number;
    totalRequests: number;
    cacheHits: number;
    cacheMisses: number;
  };
  errorStats: {
    totalErrors: number;
    errorsByType: Record<string, number>;
  };
}

/**
 * Complete scan result
 */
export interface ScanResult {
  success: boolean;
  issues: SecurityIssue[];
  summary: IssueSummary;
  securityScore: number;
  metadata: ScanMetadata;
  debug?: DebugInfo;
}

/**
 * JSON formatting options
 */
export interface JSONOptions {
  pretty: boolean;
  includeMetadata: boolean;
  includeDebugInfo: boolean;
  includeContext: boolean;
  sortIssues: boolean;
  sortBy: 'severity' | 'file' | 'line' | 'type';
}

/**
 * JSON output structure
 */
export interface JSONScanResult {
  success: boolean;
  timestamp: string;
  duration: number;
  filesScanned: number;
  securityScore: number;
  issues: JSONSecurityIssue[];
  summary: IssueSummary;
  metadata?: ScanMetadata;
  debug?: DebugInfo;
}

/**
 * JSON security issue (optimized for CI/CD)
 */
export interface JSONSecurityIssue {
  id: string;
  type: string;
  severity: Severity;
  message: string;
  file: string;
  line: number;
  column?: number;
  match: string;
  context?: string;
  confidence: number;
  rule: {
    id: string;
    name: string;
  };
}

/**
 * Production-ready JSON Output Formatter
 * Formats scan results as structured JSON for CI/CD integration
 */
export class JSONOutputFormatter {
  private readonly version: string;

  constructor(version: string = '1.0.0') {
    this.version = version;
  }

  /**
   * Format scan result as JSON string
   */
  public format(result: ScanResult, options: Partial<JSONOptions> = {}): string {
    const opts: JSONOptions = {
      pretty: false,
      includeMetadata: true,
      includeDebugInfo: false,
      includeContext: true,
      sortIssues: true,
      sortBy: 'severity',
      ...options
    };

    try {
      const jsonResult = this.buildJSONResult(result, opts);
      
      if (opts.pretty) {
        return JSON.stringify(jsonResult, null, 2);
      } else {
        return JSON.stringify(jsonResult);
      }
    } catch (error) {
      // Fallback to minimal JSON on formatting error
      return this.formatErrorFallback(error, result);
    }
  }

  /**
   * Build the JSON result object
   */
  private buildJSONResult(result: ScanResult, options: JSONOptions): JSONScanResult {
    const issues = this.formatIssues(result.issues, options);
    
    const jsonResult: JSONScanResult = {
      success: result.success,
      timestamp: result.metadata.endTime,
      duration: result.metadata.duration,
      filesScanned: result.metadata.filesScanned,
      securityScore: result.securityScore,
      issues,
      summary: this.formatSummary(result.summary)
    };

    // Add metadata if requested
    if (options.includeMetadata) {
      jsonResult.metadata = this.formatMetadata(result.metadata);
    }

    // Add debug info if requested and available
    if (options.includeDebugInfo && result.debug) {
      jsonResult.debug = this.formatDebugInfo(result.debug);
    }

    return jsonResult;
  }

  /**
   * Format security issues for JSON output
   */
  private formatIssues(issues: SecurityIssue[], options: JSONOptions): JSONSecurityIssue[] {
    let formattedIssues = issues.map(issue => this.formatIssue(issue, options));

    // Sort issues if requested
    if (options.sortIssues) {
      formattedIssues = this.sortIssues(formattedIssues, options.sortBy);
    }

    return formattedIssues;
  }

  /**
   * Format a single security issue
   */
  private formatIssue(issue: SecurityIssue, options: JSONOptions): JSONSecurityIssue {
    const jsonIssue: JSONSecurityIssue = {
      id: issue.id,
      type: issue.type,
      severity: issue.severity,
      message: issue.message,
      file: issue.filePath,
      line: issue.lineNumber,
      match: issue.match,
      confidence: issue.confidence,
      rule: {
        id: issue.ruleId,
        name: issue.ruleName
      }
    };

    // Add optional fields
    if (issue.columnNumber !== undefined) {
      jsonIssue.column = issue.columnNumber;
    }

    if (options.includeContext && issue.context) {
      jsonIssue.context = issue.context;
    }

    return jsonIssue;
  }

  /**
   * Sort issues by specified criteria
   */
  private sortIssues(issues: JSONSecurityIssue[], sortBy: JSONOptions['sortBy']): JSONSecurityIssue[] {
    const severityOrder = {
      [Severity.CRITICAL]: 0,
      [Severity.HIGH]: 1,
      [Severity.MEDIUM]: 2,
      [Severity.LOW]: 3
    };

    return issues.sort((a, b) => {
      switch (sortBy) {
        case 'severity':
          const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
          if (severityDiff !== 0) return severityDiff;
          // Secondary sort by file (with null safety)
          const aFile = a.file || '';
          const bFile = b.file || '';
          return aFile.localeCompare(bFile);

        case 'file':
          const aFileForFile = a.file || '';
          const bFileForFile = b.file || '';
          const fileDiff = aFileForFile.localeCompare(bFileForFile);
          if (fileDiff !== 0) return fileDiff;
          // Secondary sort by line number
          return a.line - b.line;

        case 'line':
          const lineDiff = a.line - b.line;
          if (lineDiff !== 0) return lineDiff;
          // Secondary sort by file (with null safety)
          const aFileForLine = a.file || '';
          const bFileForLine = b.file || '';
          return aFileForLine.localeCompare(bFileForLine);

        case 'type':
          const aType = a.type || '';
          const bType = b.type || '';
          const typeDiff = aType.localeCompare(bType);
          if (typeDiff !== 0) return typeDiff;
          // Secondary sort by severity
          return severityOrder[a.severity] - severityOrder[b.severity];

        default:
          return 0;
      }
    });
  }

  /**
   * Format issue summary
   */
  private formatSummary(summary: IssueSummary): IssueSummary {
    // Return a clean copy to avoid mutations
    return {
      total: summary.total,
      critical: summary.critical,
      high: summary.high,
      medium: summary.medium,
      low: summary.low,
      byType: { ...summary.byType },
      byFile: { ...summary.byFile }
    };
  }

  /**
   * Format metadata for JSON output
   */
  private formatMetadata(metadata: ScanMetadata): ScanMetadata {
    return {
      avanaVersion: metadata.avanaVersion,
      scanId: metadata.scanId,
      startTime: metadata.startTime,
      endTime: metadata.endTime,
      duration: metadata.duration,
      filesScanned: metadata.filesScanned,
      filesSkipped: metadata.filesSkipped,
      filesIgnored: metadata.filesIgnored,
      totalFiles: metadata.totalFiles,
      scanOptions: { ...metadata.scanOptions },
      environment: { ...metadata.environment }
    };
  }

  /**
   * Format debug information
   */
  private formatDebugInfo(debug: DebugInfo): DebugInfo {
    return {
      memoryUsage: { ...debug.memoryUsage },
      performanceMetrics: {
        ...debug.performanceMetrics,
        slowestFile: { ...debug.performanceMetrics.slowestFile },
        fastestFile: { ...debug.performanceMetrics.fastestFile }
      },
      cacheStats: debug.cacheStats ? { ...debug.cacheStats } : undefined,
      errorStats: {
        totalErrors: debug.errorStats.totalErrors,
        errorsByType: { ...debug.errorStats.errorsByType }
      }
    };
  }

  /**
   * Create error fallback JSON when formatting fails
   */
  private formatErrorFallback(error: unknown, result: ScanResult): string {
    const fallback = {
      success: false,
      timestamp: new Date().toISOString(),
      duration: result.metadata?.duration || 0,
      filesScanned: result.metadata?.filesScanned || 0,
      securityScore: 0,
      issues: [],
      summary: {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        byType: {},
        byFile: {}
      },
      error: {
        message: 'Failed to format JSON output',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    };

    return JSON.stringify(fallback);
  }

  /**
   * Validate JSON output structure
   */
  public validate(jsonString: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      const parsed = JSON.parse(jsonString);

      // Check required fields
      const requiredFields = ['success', 'timestamp', 'duration', 'filesScanned', 'securityScore', 'issues', 'summary'];
      
      for (const field of requiredFields) {
        if (!(field in parsed)) {
          errors.push(`Missing required field: ${field}`);
        }
      }

      // Validate issues array
      if (Array.isArray(parsed.issues)) {
        parsed.issues.forEach((issue: any, index: number) => {
          const requiredIssueFields = ['id', 'type', 'severity', 'message', 'file', 'line', 'match', 'rule'];
          
          for (const field of requiredIssueFields) {
            if (!(field in issue)) {
              errors.push(`Issue ${index}: Missing required field: ${field}`);
            }
          }

          // Validate severity
          if (issue.severity && !Object.values(Severity).includes(issue.severity)) {
            errors.push(`Issue ${index}: Invalid severity: ${issue.severity}`);
          }
        });
      } else if (parsed.issues !== undefined) {
        errors.push('Issues field must be an array');
      }

      // Validate summary
      if (parsed.summary) {
        const requiredSummaryFields = ['total', 'critical', 'high', 'medium', 'low'];
        
        for (const field of requiredSummaryFields) {
          if (typeof parsed.summary[field] !== 'number') {
            errors.push(`Summary: ${field} must be a number`);
          }
        }
      }

    } catch (parseError) {
      errors.push(`Invalid JSON: ${parseError instanceof Error ? parseError.message : 'Parse error'}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Create a minimal JSON result for testing
   */
  public static createMinimalResult(): JSONScanResult {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      duration: 1000,
      filesScanned: 10,
      securityScore: 85,
      issues: [],
      summary: {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        byType: {},
        byFile: {}
      }
    };
  }

  /**
   * Get JSON schema for validation
   */
  public getSchema(): object {
    return {
      type: 'object',
      required: ['success', 'timestamp', 'duration', 'filesScanned', 'securityScore', 'issues', 'summary'],
      properties: {
        success: { type: 'boolean' },
        timestamp: { type: 'string', format: 'date-time' },
        duration: { type: 'number', minimum: 0 },
        filesScanned: { type: 'integer', minimum: 0 },
        securityScore: { type: 'number', minimum: 0, maximum: 100 },
        issues: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'type', 'severity', 'message', 'file', 'line', 'match', 'rule'],
            properties: {
              id: { type: 'string' },
              type: { type: 'string' },
              severity: { enum: Object.values(Severity) },
              message: { type: 'string' },
              file: { type: 'string' },
              line: { type: 'integer', minimum: 1 },
              column: { type: 'integer', minimum: 1 },
              match: { type: 'string' },
              context: { type: 'string' },
              confidence: { type: 'number', minimum: 0, maximum: 1 },
              rule: {
                type: 'object',
                required: ['id', 'name'],
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' }
                }
              }
            }
          }
        },
        summary: {
          type: 'object',
          required: ['total', 'critical', 'high', 'medium', 'low'],
          properties: {
            total: { type: 'integer', minimum: 0 },
            critical: { type: 'integer', minimum: 0 },
            high: { type: 'integer', minimum: 0 },
            medium: { type: 'integer', minimum: 0 },
            low: { type: 'integer', minimum: 0 },
            byType: { type: 'object' },
            byFile: { type: 'object' }
          }
        },
        metadata: { type: 'object' },
        debug: { type: 'object' }
      }
    };
  }
}