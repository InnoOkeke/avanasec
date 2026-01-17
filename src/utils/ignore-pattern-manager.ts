/**
 * Ignore Pattern Manager
 * Manages file and directory ignore patterns from .avanaignore and CLI
 */

import * as fs from 'fs';
import * as path from 'path';
import { minimatch } from 'minimatch';

/**
 * Configuration for ignore patterns
 */
export interface IgnoreConfig {
  defaultPatterns: string[];
  avanaIgnorePatterns: string[];
  cliPatterns: string[];
}

/**
 * Default patterns that should always be ignored
 */
const DEFAULT_IGNORE_PATTERNS = [
  // Dependencies
  'node_modules/**',
  'vendor/**',
  'bower_components/**',
  
  // Build outputs
  'dist/**',
  'build/**',
  'out/**',
  '.next/**',
  'target/**',
  
  // Version control
  '.git/**',
  '.svn/**',
  '.hg/**',
  
  // IDE and editor files
  '.vscode/**',
  '.idea/**',
  '*.swp',
  '*.swo',
  '*~',
  
  // Test coverage
  'coverage/**',
  '.nyc_output/**',
  
  // Lock files
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'Gemfile.lock',
  'Cargo.lock',
  
  // Binary and media files
  '*.png',
  '*.jpg',
  '*.jpeg',
  '*.gif',
  '*.ico',
  '*.pdf',
  '*.zip',
  '*.tar',
  '*.gz',
  '*.exe',
  '*.dll',
  '*.so',
  '*.dylib',
  
  // Cache directories
  '.cache/**',
  'tmp/**',
  'temp/**',
  
  // Avana scan reports (avoid scanning own output)
  'scan-reports/**',
];

/**
 * Ignore Pattern Manager class
 * Manages file and directory ignore patterns
 */
export class IgnorePatternManager {
  private patterns: string[] = [];
  private ignoredCount: number = 0;
  private verbose: boolean = false;

  constructor(verbose: boolean = false) {
    this.verbose = verbose;
    // Always include default patterns
    this.patterns = [...DEFAULT_IGNORE_PATTERNS];
  }

  /**
   * Load patterns from .avanaignore file if it exists
   */
  public loadPatterns(projectPath: string): void {
    const avanaIgnorePath = path.join(projectPath, '.avanaignore');
    
    if (fs.existsSync(avanaIgnorePath)) {
      try {
        const content = fs.readFileSync(avanaIgnorePath, 'utf-8');
        const filePatterns = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#')); // Remove empty lines and comments
        
        this.patterns.push(...filePatterns);
        
        if (this.verbose) {
          console.log(`Loaded ${filePatterns.length} patterns from .avanaignore`);
        }
      } catch (error) {
        if (this.verbose) {
          console.warn(`Warning: Could not read .avanaignore: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }
  }

  /**
   * Add a pattern from CLI
   */
  public addPattern(pattern: string): void {
    if (pattern && pattern.trim()) {
      this.patterns.push(pattern.trim());
    }
  }

  /**
   * Add multiple patterns from CLI
   */
  public addPatterns(patterns: string[]): void {
    patterns.forEach(pattern => this.addPattern(pattern));
  }

  /**
   * Check if a file path should be ignored
   * @param relativePath - Path relative to project root
   * @returns true if file should be ignored
   */
  public shouldIgnore(relativePath: string): boolean {
    // Normalize path separators to forward slashes for consistent matching
    const normalizedPath = relativePath.replace(/\\/g, '/');
    
    for (const pattern of this.patterns) {
      if (minimatch(normalizedPath, pattern, { dot: true })) {
        this.ignoredCount++;
        
        if (this.verbose) {
          console.log(`Ignoring ${relativePath} (matched pattern: ${pattern})`);
        }
        
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get the count of ignored files
   */
  public getIgnoredCount(): number {
    return this.ignoredCount;
  }

  /**
   * Reset the ignored count
   */
  public resetIgnoredCount(): void {
    this.ignoredCount = 0;
  }

  /**
   * Get all active patterns
   */
  public getPatterns(): string[] {
    return [...this.patterns];
  }

  /**
   * Get configuration breakdown
   */
  public getConfig(): IgnoreConfig {
    return {
      defaultPatterns: DEFAULT_IGNORE_PATTERNS,
      avanaIgnorePatterns: this.patterns.filter(p => !DEFAULT_IGNORE_PATTERNS.includes(p)),
      cliPatterns: [], // Would need to track separately if needed
    };
  }

  /**
   * Clear all non-default patterns
   */
  public clearCustomPatterns(): void {
    this.patterns = [...DEFAULT_IGNORE_PATTERNS];
  }
}
