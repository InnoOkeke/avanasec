/**
 * Avana - Secret Scanner
 * Scans files for hardcoded secrets, API keys, and credentials
 */

import * as fs from 'fs';
import * as path from 'path';
import type { SecurityIssue, ScanOptions } from '../types';
import { getAllSecretPatterns } from '../rules/secret-patterns';
import { getAdditionalSecretPatterns } from '../rules/additional-patterns';
import { IgnorePatternManager } from '../utils/ignore-pattern-manager';

export class SecretScanner {
  private ignoreManager: IgnorePatternManager;

  constructor() {
    this.ignoreManager = new IgnorePatternManager();
  }
  /**
   * Check if .gitignore properly excludes sensitive files
   */
  public checkGitignore(dirPath: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    const gitignorePath = path.join(dirPath, '.gitignore');

    try {
      if (!fs.existsSync(gitignorePath)) {
        issues.push({
          id: 'missing-gitignore',
          type: 'configuration',
          severity: 'high',
          title: 'Missing .gitignore',
          description: 'No .gitignore file found in project root',
          file: dirPath,
          line: 0,
          code: '',
          suggestion: 'Create a .gitignore file and add .env files to it',
        });
        return issues;
      }

      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      const lines = gitignoreContent.split('\n').map(l => l.trim());

      // Check if .env is in .gitignore
      const hasEnvPattern = lines.some(line => {
        // Check for .env patterns (exact match or starts with .env)
        return line === '.env' || 
               line.startsWith('.env') ||
               line === '.env*';
      });

      if (!hasEnvPattern) {
        issues.push({
          id: 'gitignore-missing-env',
          type: 'configuration',
          severity: 'critical',
          title: '.env Not in .gitignore',
          description: '.env files are not excluded in .gitignore - secrets could be committed to GitHub!',
          file: gitignorePath,
          line: 0,
          code: '',
          suggestion: 'Add these lines to .gitignore:\n.env\n.env.local\n.env.*.local',
        });
      }
    } catch (error) {
      console.error(`Error checking .gitignore:`, error);
    }

    return issues;
  }

  /**
   * Scan a file for secrets
   */
  public scanFile(filePath: string, customPatterns?: any[]): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      // Use custom patterns if provided, otherwise use all patterns
      const patterns = customPatterns || [
        ...getAllSecretPatterns(),
        ...getAdditionalSecretPatterns()
      ];

      patterns.forEach(pattern => {
        lines.forEach((line, lineIndex) => {
          const matches = line.matchAll(pattern.pattern);
          
          for (const match of matches) {
            issues.push({
              id: `${pattern.id}-${filePath}-${lineIndex}`,
              type: 'secret',
              severity: pattern.severity,
              title: pattern.name,
              description: pattern.description,
              file: filePath,
              line: lineIndex + 1,
              column: match.index,
              code: line.trim(),
              suggestion: pattern.suggestion,
            });
          }
        });
      });
    } catch (error) {
      // Re-throw the error so the worker can handle it
      throw error;
    }

    return issues;
  }

  /**
   * Scan multiple files
   */
  public scanFiles(filePaths: string[]): SecurityIssue[] {
    const allIssues: SecurityIssue[] = [];

    filePaths.forEach(filePath => {
      const issues = this.scanFile(filePath);
      allIssues.push(...issues);
    });

    return allIssues;
  }

  /**
   * Scan a directory recursively
   */
  public scanDirectory(dirPath: string, options?: ScanOptions): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    const visitedPaths = new Set<string>(); // Track visited paths to prevent circular links
    
    // Initialize ignore patterns
    this.ignoreManager = new IgnorePatternManager(options?.verbose);
    this.ignoreManager.loadPatterns(dirPath);
    
    // Add CLI ignore patterns if provided
    if (options?.config?.ignore) {
      this.ignoreManager.addPatterns(options.config.ignore);
    }

    const scanDir = (currentPath: string) => {
      // Get real path to detect circular links
      let realPath: string;
      try {
        realPath = fs.realpathSync(currentPath);
      } catch (error) {
        if (options?.verbose) {
          console.log(`⚠️  Cannot resolve path: ${currentPath}`);
        }
        return;
      }

      // Check for circular symbolic links
      if (visitedPaths.has(realPath)) {
        if (options?.verbose) {
          console.log(`🔄 Circular symbolic link detected, skipping: ${currentPath}`);
        }
        return;
      }
      visitedPaths.add(realPath);

      let entries: fs.Dirent[];
      try {
        entries = fs.readdirSync(currentPath, { withFileTypes: true });
      } catch (error) {
        if (options?.verbose) {
          console.log(`⚠️  Cannot read directory: ${currentPath}`);
        }
        return;
      }

      entries.forEach(entry => {
        const fullPath = path.join(currentPath, entry.name);
        const relativePath = path.relative(dirPath, fullPath);

        // Check if path should be ignored using IgnorePatternManager
        if (this.ignoreManager.shouldIgnore(relativePath)) {
          return;
        }

        try {
          // Use lstat to detect symbolic links
          const stats = fs.lstatSync(fullPath);

          if (stats.isSymbolicLink()) {
            // Handle symbolic link
            this.handleSymbolicLink(fullPath, dirPath, options, issues, scanDir);
          } else if (stats.isDirectory()) {
            scanDir(fullPath);
          } else if (stats.isFile()) {
            const fileIssues = this.scanFile(fullPath);
            issues.push(...fileIssues);
          }
        } catch (error) {
          if (options?.verbose) {
            console.log(`⚠️  Cannot access: ${fullPath} - ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      });

      // Remove from visited paths when done with this directory
      visitedPaths.delete(realPath);
    };

    scanDir(dirPath);
    return issues;
  }

  /**
   * Handle symbolic link safely
   */
  private handleSymbolicLink(
    linkPath: string,
    scanRootPath: string,
    options?: ScanOptions,
    issues?: SecurityIssue[],
    scanDir?: (path: string) => void
  ): void {
    try {
      // Get the target of the symbolic link
      const linkTarget = fs.readlinkSync(linkPath);
      const resolvedTarget = path.resolve(path.dirname(linkPath), linkTarget);

      if (options?.verbose) {
        console.log(`🔗 Symbolic link found: ${linkPath} -> ${resolvedTarget}`);
      }

      // Check if the target is within the scan directory
      const scanRootReal = fs.realpathSync(scanRootPath);
      const targetReal = fs.realpathSync(resolvedTarget);

      if (!targetReal.startsWith(scanRootReal)) {
        if (options?.verbose) {
          console.log(`🚫 Symbolic link target outside scan directory, skipping: ${linkPath}`);
        }
        return;
      }

      // Check if target exists and get its stats
      const targetStats = fs.statSync(resolvedTarget);

      if (targetStats.isDirectory()) {
        if (options?.verbose) {
          console.log(`📁 Following symbolic link to directory: ${linkPath}`);
        }
        if (scanDir) {
          scanDir(resolvedTarget);
        }
      } else if (targetStats.isFile()) {
        if (options?.verbose) {
          console.log(`📄 Following symbolic link to file: ${linkPath}`);
        }
        if (issues) {
          const fileIssues = this.scanFile(resolvedTarget);
          issues.push(...fileIssues);
        }
      }
    } catch (error) {
      if (options?.verbose) {
        console.log(`⚠️  Cannot follow symbolic link: ${linkPath} - ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Get total pattern count
   */
  public getPatternCount(): number {
    return getAllSecretPatterns().length + getAdditionalSecretPatterns().length;
  }
}
