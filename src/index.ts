/**
 * Avana - Core Engine
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

/**
 * Main Avana Engine
 */
export class Avana {
  private secretScanner: SecretScanner;

  constructor() {
    this.secretScanner = new SecretScanner();
  }

  /**
   * Perform a complete security scan
   */
  public async scan(options: ScanOptions): Promise<ScanResult> {
    const startTime = Date.now();
    const allIssues: SecurityIssue[] = [];
    let filesScanned = 0;

    // Check .gitignore first (skip if scanning specific files)
    if (!options.includeFiles) {
      const gitignoreIssues = this.secretScanner.checkGitignore(options.path);
      allIssues.push(...gitignoreIssues);
    }

    // Scan for secrets
    if (options.config?.rules.secrets.enabled !== false) {
      let secretIssues: SecurityIssue[];
      
      if (options.includeFiles && options.includeFiles.length > 0) {
        // Scan only specific files (for --staged flag)
        secretIssues = this.secretScanner.scanFiles(options.includeFiles);
        filesScanned = options.includeFiles.length;
      } else {
        // Scan entire directory
        secretIssues = this.secretScanner.scanDirectory(options.path, options);
        filesScanned = secretIssues.length; // Approximate
      }
      
      allIssues.push(...secretIssues);
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

    return result;
  }

  /**
   * Calculate security score (0-100) with detailed breakdown
   * 
   * Algorithm:
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
}
