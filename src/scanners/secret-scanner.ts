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
      console.error(`Error scanning file ${filePath}:`, error);
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
    
    // Initialize ignore patterns
    this.ignoreManager = new IgnorePatternManager(options?.verbose);
    this.ignoreManager.loadPatterns(dirPath);
    
    // Add CLI ignore patterns if provided
    if (options?.config?.ignore) {
      this.ignoreManager.addPatterns(options.config.ignore);
    }

    const scanDir = (currentPath: string) => {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      entries.forEach(entry => {
        const fullPath = path.join(currentPath, entry.name);
        const relativePath = path.relative(dirPath, fullPath);

        // Check if path should be ignored using IgnorePatternManager
        if (this.ignoreManager.shouldIgnore(relativePath)) {
          return;
        }

        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile()) {
          const fileIssues = this.scanFile(fullPath);
          issues.push(...fileIssues);
        }
      });
    };

    scanDir(dirPath);
    return issues;
  }

  /**
   * Get total pattern count
   */
  public getPatternCount(): number {
    return getAllSecretPatterns().length + getAdditionalSecretPatterns().length;
  }
}
