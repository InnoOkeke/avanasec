/**
 * Avana - Secret Scanner
 * Scans files for hardcoded secrets, API keys, and credentials
 */

import * as fs from 'fs';
import * as path from 'path';
import type { SecurityIssue, ScanOptions } from '../types';
import { getAllSecretPatterns } from '../rules/secret-patterns';
import { getAdditionalSecretPatterns } from '../rules/additional-patterns';

export class SecretScanner {
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
  public scanFile(filePath: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      // Combine all patterns
      const patterns = [
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
    const ignorePatterns = options?.config?.ignore || [];

    const scanDir = (currentPath: string) => {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      entries.forEach(entry => {
        const fullPath = path.join(currentPath, entry.name);
        const relativePath = path.relative(dirPath, fullPath);

        // Check if path should be ignored
        if (this.shouldIgnore(relativePath, ignorePatterns)) {
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
   * Check if path should be ignored
   */
  private shouldIgnore(relativePath: string, ignorePatterns: string[]): boolean {
    // Always ignore common directories and files
    const defaultIgnore = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'coverage',
      '.vscode',
      '.idea',
      'vendor',
      '__pycache__',
      '.pytest_cache',
      'target',
      'bin',
      'obj',
      '.env',             // Don't scan .env files (they're meant for local secrets)
      '.env.local',       // Don't scan local env files
      '.env.development', // Don't scan development env files
      '.env.production',  // Don't scan production env files
      '.env.example',     // Don't scan example files
      'test',
      'tests',
      '__tests__',
      'spec',
      'specs',
      '.test.',
      '.spec.',
      '.sqlite',          // Don't scan database files
      '.sqlite-wal',      // Don't scan SQLite WAL files
      '.sqlite-shm',      // Don't scan SQLite shared memory files
      '.db',              // Don't scan database files
      'package-lock.json', // Don't scan lock files (integrity hashes)
      'yarn.lock',        // Don't scan lock files
      'pnpm-lock.yaml',   // Don't scan lock files
      'secret-patterns',  // Don't scan our own pattern definitions
      'additional-patterns', // Don't scan our own pattern definitions
    ];

    const allPatterns = [...defaultIgnore, ...ignorePatterns];

    return allPatterns.some(pattern => {
      if (pattern.includes('*')) {
        // Simple glob matching
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(relativePath);
      }
      return relativePath.includes(pattern);
    });
  }

  /**
   * Get total pattern count
   */
  public getPatternCount(): number {
    return getAllSecretPatterns().length + getAdditionalSecretPatterns().length;
  }
}
