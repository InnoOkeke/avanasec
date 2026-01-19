/**
 * Avanasec - Core Engine
 * Main entry point for security scanning functionality
 */

export * from './types';
export * from './scanners/secret-scanner';
export * from './rules/secret-patterns';
export * from './rules/additional-patterns';

import { SecretScanner } from './scanners/secret-scanner';
import type { ScanResult, ScanOptions, SecurityIssue, ScoreBreakdown } from './types';
import { getAllSecretPatterns } from './rules/secret-patterns';
import { getAdditionalSecretPatterns } from './rules/additional-patterns';

// Import robust components
import { FileTypeDetector } from './utils/file-type-detector';
import { FileStreamScanner } from './utils/file-stream-scanner';
import { ErrorHandler } from './utils/error-handler';
import { MemoryManager } from './utils/memory-manager';
import { ProgressReporter } from './utils/progress-reporter';
import { ResultCache } from './utils/result-cache';
import { ParallelScanner } from './utils/parallel-scanner';
import { JSONOutputFormatter } from './utils/json-output-formatter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Main Avana Engine with robust file handling and performance optimization
 */
export class Avana {
  private secretScanner: SecretScanner;
  private fileTypeDetector: FileTypeDetector;
  private fileStreamScanner: FileStreamScanner;
  private errorHandler: ErrorHandler;
  private memoryManager: MemoryManager;
  private resultCache: ResultCache;
  private parallelScanner: ParallelScanner;
  private jsonFormatter: JSONOutputFormatter;

  constructor(options?: {
    debugMode?: boolean;
    maxMemoryMB?: number;
    cacheDir?: string;
    workerCount?: number;
  }) {
    this.secretScanner = new SecretScanner();
    this.fileTypeDetector = new FileTypeDetector();
    this.fileStreamScanner = new FileStreamScanner();
    this.errorHandler = new ErrorHandler(options?.debugMode || false);
    this.memoryManager = new MemoryManager(options?.maxMemoryMB || 500);
    this.resultCache = new ResultCache(options?.cacheDir);
    this.parallelScanner = new ParallelScanner({ workerCount: options?.workerCount });
    this.jsonFormatter = new JSONOutputFormatter();
  }

  /**
   * Perform a complete security scan with robust file handling
   */
  public async scan(options: ScanOptions): Promise<ScanResult> {
    const startTime = Date.now();
    const allIssues: SecurityIssue[] = [];
    let filesScanned = 0;
    let filesSkipped = 0;
    let progressReporter: ProgressReporter | null = null;

    try {
      // Initialize memory monitoring
      const memoryCheckpoint = this.memoryManager.createCheckpoint('scan-start');
      
      // Check .gitignore first (skip if scanning specific files)
      if (!options.includeFiles) {
        const gitignoreIssues = this.secretScanner.checkGitignore(options.path);
        allIssues.push(...gitignoreIssues);
      }

      // Scan for secrets with robust file handling
      if (options.config?.rules.secrets.enabled !== false) {
        let secretIssues: SecurityIssue[];
        
        if (options.includeFiles && options.includeFiles.length > 0) {
          // Scan only specific files (for --staged flag)
          secretIssues = await this.scanSpecificFiles(options.includeFiles, options);
          filesScanned = options.includeFiles.length;
        } else {
          // Scan entire directory with robust handling
          const scanResult = await this.scanDirectoryRobust(options.path, options);
          secretIssues = scanResult.issues;
          filesScanned = scanResult.filesScanned;
          filesSkipped = scanResult.filesSkipped;
        }
        
        allIssues.push(...secretIssues);
      }

      // Check memory usage after scanning
      if (!this.memoryManager.checkLimit()) {
        this.errorHandler.handleCriticalError(
          new Error(`Memory limit exceeded: ${this.memoryManager.formatMemorySize(this.memoryManager.getCurrentUsage())}`)
        );
      }

      // Calculate summary
      const summary = {
        critical: allIssues.filter(i => i.severity === 'critical').length,
        high: allIssues.filter(i => i.severity === 'high').length,
        medium: allIssues.filter(i => i.severity === 'medium').length,
        low: allIssues.filter(i => i.severity === 'low').length,
        info: allIssues.filter(i => i.severity === 'info').length,
      };

      const duration = Date.now() - startTime;

      const result: ScanResult = {
        success: true,
        timestamp: new Date().toISOString(),
        duration,
        filesScanned,
        issues: allIssues,
        summary,
      };

      // Calculate security score and add to result
      const { score, breakdown } = this.calculateSecurityScore(result);
      result.securityScore = score;
      result.scoreBreakdown = breakdown;

      // Save cache results
      this.resultCache.save();

      return result;

    } catch (error) {
      // Handle any unexpected errors during scanning
      this.errorHandler.handleScanError(error as Error);
      
      // Return partial results if available
      const duration = Date.now() - startTime;
      return {
        success: false,
        timestamp: new Date().toISOString(),
        duration,
        filesScanned,
        issues: allIssues,
        summary: {
          critical: allIssues.filter(i => i.severity === 'critical').length,
          high: allIssues.filter(i => i.severity === 'high').length,
          medium: allIssues.filter(i => i.severity === 'medium').length,
          low: allIssues.filter(i => i.severity === 'low').length,
          info: allIssues.filter(i => i.severity === 'info').length,
        },
      };
    }
  }

  /**
   * Scan specific files with robust handling
   */
  private async scanSpecificFiles(filePaths: string[], options: ScanOptions): Promise<SecurityIssue[]> {
    const allIssues: SecurityIssue[] = [];
    let processedFiles = 0;

    // Initialize progress reporter if not in quiet mode
    const progressReporter = new ProgressReporter({
      total: filePaths.length,
      noProgress: options.verbose === false // Show progress unless explicitly quiet
    });
    progressReporter.start();

    try {
      for (const filePath of filePaths) {
        try {
          // Check cache first
          const cachedResults = this.resultCache.get(filePath);
          if (cachedResults) {
            allIssues.push(...cachedResults);
            progressReporter.increment();
            processedFiles++;
            continue;
          }

          // Check if file should be scanned
          const fileInfo = this.fileTypeDetector.getFileInfo(filePath);
          
          if (fileInfo.isBinary) {
            if (options.verbose) {
              console.log(`⏭️  Skipping binary file: ${filePath}`);
            }
            progressReporter.increment();
            continue;
          }

          // Check memory before processing
          if (!this.memoryManager.checkLimit()) {
            this.errorHandler.handleCriticalError(
              new Error(`Memory limit exceeded while scanning: ${filePath}`)
            );
          }

          let fileIssues: SecurityIssue[];

          // Use streaming for large files
          if (fileInfo.shouldStream) {
            if (options.verbose) {
              console.log(`📄 Streaming large file: ${filePath} (${this.memoryManager.formatMemorySize(fileInfo.size)})`);
            }
            fileIssues = await this.fileStreamScanner.scanStream(filePath, fileInfo.encoding);
          } else {
            // Use regular scanning for smaller files
            fileIssues = this.secretScanner.scanFile(filePath);
          }

          // Cache the results
          this.resultCache.set(filePath, fileIssues);
          allIssues.push(...fileIssues);
          
        } catch (error) {
          // Handle file-specific errors gracefully
          this.errorHandler.handleFileError(filePath, error as Error);
        }

        progressReporter.increment();
        processedFiles++;
      }

    } finally {
      progressReporter.complete();
    }

    return allIssues;
  }

  /**
   * Collect all files to scan from a directory
   */
  private collectFiles(dirPath: string, options: ScanOptions): string[] {
    const files: string[] = [];
    const visitedPaths = new Set<string>();
    const ignoreManager = new (require('./utils/ignore-pattern-manager').IgnorePatternManager)(options.verbose);
    
    // Load ignore patterns
    ignoreManager.loadPatterns(dirPath);
    if (options.config?.ignore) {
      ignoreManager.addPatterns(options.config.ignore);
    }

    const collectDir = (currentPath: string) => {
      // Get real path to detect circular links
      let realPath: string;
      try {
        realPath = fs.realpathSync(currentPath);
      } catch (error) {
        return;
      }

      // Check for circular symbolic links
      if (visitedPaths.has(realPath)) {
        return;
      }
      visitedPaths.add(realPath);

      let entries: fs.Dirent[];
      try {
        entries = fs.readdirSync(currentPath, { withFileTypes: true });
      } catch (error) {
        return;
      }

      entries.forEach(entry => {
        const fullPath = path.join(currentPath, entry.name);
        const relativePath = path.relative(dirPath, fullPath);

        // Check if path should be ignored
        if (ignoreManager.shouldIgnore(relativePath)) {
          return;
        }

        try {
          const stats = fs.lstatSync(fullPath);

          if (stats.isSymbolicLink()) {
            // Skip symbolic links for file collection
            return;
          } else if (stats.isDirectory()) {
            collectDir(fullPath);
          } else if (stats.isFile()) {
            files.push(fullPath);
          }
        } catch (error) {
          // Skip files we can't access
        }
      });

      visitedPaths.delete(realPath);
    };

    collectDir(dirPath);
    return files;
  }

  /**
   * Scan directory with robust handling and parallel processing
   */
  private async scanDirectoryRobust(dirPath: string, options: ScanOptions): Promise<{
    issues: SecurityIssue[];
    filesScanned: number;
    filesSkipped: number;
  }> {
    const allIssues: SecurityIssue[] = [];
    let filesScanned = 0;
    let filesSkipped = 0;

    try {
      // Collect all files to scan first
      const filePaths = this.collectFiles(dirPath, options);
      
      if (filePaths.length === 0) {
        return { issues: [], filesScanned: 0, filesSkipped: 0 };
      }

      // Initialize progress reporter
      const progressReporter = new ProgressReporter({
        total: filePaths.length,
        noProgress: options.verbose === false
      });
      progressReporter.start();

      try {
        // Check if parallel scanning is beneficial (>10 files)
        if (filePaths.length > 10 && ParallelScanner.isSupported()) {
          if (options.verbose) {
            console.log(`🚀 Using parallel scanning with ${this.parallelScanner.getStats().workerCount} workers`);
          }

          // Use parallel scanning
          const patterns = [
            ...getAllSecretPatterns(),
            ...getAdditionalSecretPatterns()
          ];

          const results = await this.parallelScanner.scanFiles(filePaths, patterns, options.config?.ignore || []);
          
          for (const result of results) {
            if (result.error) {
              this.errorHandler.handleFileError(result.file, new Error(result.error));
              filesSkipped++;
            } else {
              // Cache the results
              this.resultCache.set(result.file, result.issues);
              allIssues.push(...result.issues);
              filesScanned++;
            }
            progressReporter.increment();
          }

        } else {
          // Use sequential scanning with robust handling
          for (const filePath of filePaths) {
            try {
              // Check cache first
              const cachedResults = this.resultCache.get(filePath);
              if (cachedResults) {
                allIssues.push(...cachedResults);
                filesScanned++;
                progressReporter.increment();
                continue;
              }

              // Check file type and handle appropriately
              const fileInfo = this.fileTypeDetector.getFileInfo(filePath);
              
              if (fileInfo.isBinary) {
                if (options.verbose) {
                  console.log(`⏭️  Skipping binary file: ${filePath}`);
                }
                filesSkipped++;
                progressReporter.increment();
                continue;
              }

              // Check memory before processing
              if (!this.memoryManager.checkLimit()) {
                if (options.verbose) {
                  console.log(`⚠️  Memory limit approaching, triggering GC`);
                }
                this.memoryManager.triggerGC();
              }

              let fileIssues: SecurityIssue[];

              // Use streaming for large files
              if (fileInfo.shouldStream) {
                if (options.verbose) {
                  console.log(`📄 Streaming large file: ${filePath} (${this.memoryManager.formatMemorySize(fileInfo.size)})`);
                }
                fileIssues = await this.fileStreamScanner.scanStream(filePath, fileInfo.encoding);
              } else {
                // Use regular scanning for smaller files
                fileIssues = this.secretScanner.scanFile(filePath);
              }

              // Cache the results
              this.resultCache.set(filePath, fileIssues);
              allIssues.push(...fileIssues);
              filesScanned++;
              
            } catch (error) {
              // Handle file-specific errors gracefully
              this.errorHandler.handleFileError(filePath, error as Error);
              filesSkipped++;
            }

            progressReporter.increment();
          }
        }

      } finally {
        progressReporter.complete();
      }

      return { issues: allIssues, filesScanned, filesSkipped };

    } catch (error) {
      this.errorHandler.handleScanError(error as Error);
      return { issues: allIssues, filesScanned, filesSkipped };
    }
  }

  /**
   * Calculate security score (0-100) with detailed breakdown
   * - Start with base score of 100
   * - Deduct points based on severity:
   *   - Critical: -20 points each
   *   - High: -10 points each  
   *   - Medium: -5 points each
   *   - Low: -2 points each
   * - Minimum score is 0
   * 
   * This calculation is deterministic - same inputs always produce same output
   */
  public calculateSecurityScore(result: ScanResult): { score: number; breakdown: ScoreBreakdown } {
    const { critical, high, medium, low } = result.summary;
    
    // Base score (perfect security)
    const baseScore = 100;
    
    // Calculate deductions
    const criticalDeduction = critical * 20;
    const highDeduction = high * 10;
    const mediumDeduction = medium * 5;
    const lowDeduction = low * 2;
    
    // Calculate final score
    const totalDeduction = criticalDeduction + highDeduction + mediumDeduction + lowDeduction;
    const finalScore = Math.max(0, baseScore - totalDeduction);
    
    const breakdown: ScoreBreakdown = {
      baseScore,
      criticalDeduction,
      highDeduction,
      mediumDeduction,
      lowDeduction,
      finalScore
    };
    
    return {
      score: finalScore,
      breakdown
    };
  }

  /**
   * Get total pattern count
   */
  public getPatternCount(): number {
    return getAllSecretPatterns().length + getAdditionalSecretPatterns().length;
  }

  /**
   * Get memory statistics
   */
  public getMemoryStats() {
    return this.memoryManager.getStats();
  }

  /**
   * Get cache statistics
   */
  public getCacheStats() {
    return this.resultCache.getStats();
  }

  /**
   * Get error statistics
   */
  public getErrorStats() {
    return {
      totalErrors: this.errorHandler.getErrorCount(),
      errorsByType: this.errorHandler.getErrorSummary(),
      hasErrors: this.errorHandler.hasErrors()
    };
  }

  /**
   * Format scan result as JSON
   */
  public formatAsJSON(result: ScanResult, options?: {
    pretty?: boolean;
    includeMetadata?: boolean;
    includeDebugInfo?: boolean;
  }): string {
    // Convert ScanResult to JSONOutputFormatter format
    const formatterResult = this.convertToFormatterResult(result);
    return this.jsonFormatter.format(formatterResult, options);
  }

  /**
   * Clear all caches and reset state
   */
  public clearCache(): void {
    this.resultCache.clear();
    this.errorHandler.clearErrors();
    this.memoryManager.reset();
  }

  /**
   * Cleanup resources
   */
  public async cleanup(): Promise<void> {
    // Save cache before cleanup
    this.resultCache.save();
    
    // Terminate parallel scanner workers
    await this.parallelScanner.terminate();
    
    // Clear errors
    this.errorHandler.clearErrors();
  }

  /**
   * Convert ScanResult to JSONOutputFormatter format
   */
  private convertToFormatterResult(result: ScanResult): any {
    // This is a simplified conversion - in a real implementation,
    // you'd need to properly map all fields
    return {
      success: result.success,
      issues: result.issues.map(issue => ({
        id: issue.id,
        type: issue.type,
        severity: issue.severity,
        message: issue.description,
        filePath: issue.file,
        lineNumber: issue.line || 0,
        columnNumber: issue.column,
        match: issue.code || '',
        context: issue.code,
        confidence: 0.9, // Default confidence
        ruleId: issue.id.split('-')[0],
        ruleName: issue.title
      })),
      summary: {
        total: result.issues.length,
        critical: result.summary.critical,
        high: result.summary.high,
        medium: result.summary.medium,
        low: result.summary.low,
        byType: {},
        byFile: {}
      },
      securityScore: result.securityScore || 0,
      metadata: {
        avanaVersion: '1.0.0',
        scanId: `scan-${Date.now()}`,
        startTime: result.timestamp,
        endTime: result.timestamp,
        duration: result.duration,
        filesScanned: result.filesScanned,
        filesSkipped: 0,
        filesIgnored: 0,
        totalFiles: result.filesScanned,
        scanOptions: {
          verbose: false,
          debug: false,
          quiet: false,
          patterns: [],
          ignorePatterns: [],
          maxFileSize: 10 * 1024 * 1024,
          parallel: true
        },
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          cwd: process.cwd()
        }
      }
    };
  }
}
