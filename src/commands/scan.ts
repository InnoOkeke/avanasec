/**
 * Avana CLI - Scan Command
 * Scans project for security issues
 */

import { Avana } from '../index';
import type { ScanOptions } from '../types';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Get list of Git staged files
 */
function getStagedFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
    
    return output
      .split('\n')
      .filter(file => file.trim() !== '')
      .map(file => path.resolve(process.cwd(), file))
      .filter(file => fs.existsSync(file) && fs.statSync(file).isFile());
  } catch (error) {
    // Not a git repository or no staged files
    return [];
  }
}

export async function scanCommand(options: { path?: string; verbose?: boolean; staged?: boolean }) {
  const projectPath = options.path || process.cwd();
  
  // Handle --staged flag
  if (options.staged) {
    const stagedFiles = getStagedFiles();
    
    if (stagedFiles.length === 0) {
      console.log('ℹ️  No staged files to scan\n');
      return;
    }
    
    console.log(`🔍 Scanning ${stagedFiles.length} staged file(s)...\n`);
    
    const guardian = new Avana();
    const scanOptions: ScanOptions = {
      path: projectPath,
      verbose: options.verbose,
      includeFiles: stagedFiles,
    };
    
    const result = await guardian.scan(scanOptions);
    const score = guardian.calculateSecurityScore(result);
    
    // Display results for staged files
    displayStagedResults(result, score);
    return;
  }
  
  console.log('🔍 Scanning project for security issues...\n');
  console.log(`📁 Path: ${projectPath}\n`);

  const guardian = new Avana();
  
  const scanOptions: ScanOptions = {
    path: projectPath,
    verbose: options.verbose,
  };

  const result = await guardian.scan(scanOptions);
  const score = guardian.calculateSecurityScore(result);

  // Display results
  console.log(`✅ Scan complete in ${result.duration}ms\n`);
  
  if (result.issues.length === 0) {
    console.log('🎉 No security issues found!\n');
    console.log(`📊 Security Score: ${score}/100 (Excellent)\n`);
    return;
  }

  // Display summary
  console.log('🚨 SECURITY ISSUES FOUND\n');
  console.log(`┌─────────────────────────────────────────┐`);
  console.log(`│ 🔴 Critical: ${result.summary.critical.toString().padEnd(27)}│`);
  console.log(`│ 🟠 High:     ${result.summary.high.toString().padEnd(27)}│`);
  console.log(`│ 🟡 Medium:   ${result.summary.medium.toString().padEnd(27)}│`);
  console.log(`│ 🟢 Low:      ${result.summary.low.toString().padEnd(27)}│`);
  console.log(`└─────────────────────────────────────────┘\n`);

  // Display critical and high issues
  const criticalIssues = result.issues.filter(i => i.severity === 'critical' || i.severity === 'high');
  
  if (criticalIssues.length > 0) {
    console.log('Critical & High Severity Issues:\n');
    
    criticalIssues.slice(0, 10).forEach((issue) => {
      const icon = issue.severity === 'critical' ? '🔴' : '🟠';
      console.log(`${icon} ${issue.title}`);
      console.log(`   File: ${issue.file}:${issue.line}`);
      console.log(`   ${issue.description}`);
      if (issue.suggestion) {
        console.log(`   ✅ Fix: ${issue.suggestion}`);
      }
      console.log('');
    });

    if (criticalIssues.length > 10) {
      console.log(`... and ${criticalIssues.length - 10} more issues\n`);
    }
  }

  console.log(`📊 Security Score: ${score}/100\n`);
  
  if (score < 50) {
    console.log('⚠️  Your security score is low. Please address critical issues immediately.\n');
  } else if (score < 80) {
    console.log('💡 Your security score is moderate. Consider addressing high-priority issues.\n');
  }

  // Exit with error code if critical or high severity issues found
  if (result.summary.critical > 0 || result.summary.high > 0) {
    process.exit(1);
  }
}

/**
 * Display results for staged files (pre-commit hook)
 */
function displayStagedResults(result: any, score: number): void {
  if (result.issues.length === 0) {
    console.log('✅ No security issues found in staged files\n');
    return;
  }

  const criticalCount = result.summary.critical;
  const highCount = result.summary.high;
  
  // Display critical and high issues
  const criticalIssues = result.issues.filter((i: any) => i.severity === 'critical' || i.severity === 'high');
  
  if (criticalIssues.length > 0) {
    console.log('🚨 COMMIT BLOCKED - Security Issues Found\n');
    console.log(`Found ${criticalCount} critical and ${highCount} high severity issue(s):\n`);
    
    criticalIssues.forEach((issue: any) => {
      const icon = issue.severity === 'critical' ? '🔴' : '🟠';
      console.log(`${icon} ${issue.title}`);
      console.log(`   File: ${issue.file}:${issue.line}`);
      console.log(`   ${issue.description}`);
      if (issue.suggestion) {
        console.log(`   ✅ Fix: ${issue.suggestion}`);
      }
      console.log('');
    });

    console.log('❌ Please fix these issues before committing\n');
    console.log('💡 Tips:');
    console.log('   • Fix the issues and try again');
    console.log('   • To bypass (not recommended): git commit --no-verify\n');
    
    process.exit(1);
  } else {
    // Only medium/low issues - allow commit with warning
    console.log('⚠️  Found security issues in staged files:\n');
    console.log(`🟡 Medium: ${result.summary.medium}`);
    console.log(`🟢 Low: ${result.summary.low}\n`);
    console.log('💡 Consider fixing these issues soon\n');
  }
}
