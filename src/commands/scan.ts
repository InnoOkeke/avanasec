/**
 * Avana CLI - Scan Command
 * Scans project for security issues
 */

import { Avana } from '../index';
import type { ScanOptions } from '../types';
import { JSONOutputFormatter } from '../utils/json-output-formatter';
import { MarkdownOutputFormatter } from '../utils/markdown-output-formatter';
import { determineExitCode, exitWithCode, ExitCode } from '../utils/exit-codes';
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

/**
 * Save results to file
 */
async function saveResults(
  result: any, 
  score: number, 
  outputJson: boolean, 
  outputMd: boolean, 
  rootPath: string
): Promise<{ jsonPath?: string; mdPath?: string }> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const reportsDir = path.join(rootPath, 'scan-reports');
  
  // Create scan-reports directory if it doesn't exist
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const savedPaths: { jsonPath?: string; mdPath?: string } = {};
  
  if (outputJson) {
    const jsonFormatter = new JSONOutputFormatter();
    const jsonContent = jsonFormatter.format(result, { 
      pretty: true, 
      includeMetadata: true,
      includeDebugInfo: false 
    });
    
    const jsonFilename = `avana-security-report-${timestamp}.json`;
    const jsonPath = path.join(reportsDir, jsonFilename);
    
    try {
      fs.writeFileSync(jsonPath, jsonContent, 'utf-8');
      console.log(`📄 JSON report saved: ${jsonFilename}`);
      savedPaths.jsonPath = jsonPath;
    } catch (error) {
      console.error(`❌ Failed to save JSON report: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  if (outputMd) {
    const mdFormatter = new MarkdownOutputFormatter();
    const mdContent = mdFormatter.format(result, score);
    
    const mdFilename = `avana-security-report-${timestamp}.md`;
    const mdPath = path.join(reportsDir, mdFilename);
    
    try {
      fs.writeFileSync(mdPath, mdContent, 'utf-8');
      console.log(`📝 Markdown report saved: ${mdFilename}`);
      savedPaths.mdPath = mdPath;
    } catch (error) {
      console.error(`❌ Failed to save Markdown report: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  return savedPaths;
}

export async function scanCommand(options: { 
  path?: string; 
  verbose?: boolean; 
  debug?: boolean;
  quiet?: boolean;
  staged?: boolean;
  outputJson?: boolean;
  outputMd?: boolean;
  ignorePatterns?: string[];
  noProgress?: boolean;
  failOnHigh?: boolean;
  maxMemory?: number;
  workers?: number;
}) {
  const projectPath = options.path || process.cwd();
  const rootPath = process.cwd(); // Always save reports to root directory
  
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
      config: {
        enabled: true,
        scanOnCommit: false,
        scanOnPush: false,
        blockOnCritical: false,
        rules: {
          secrets: {
            enabled: true,
            patterns: []
          },
          dependencies: {
            enabled: false,
            checkVulnerabilities: false,
            minSeverity: 'low'
          },
          codePatterns: {
            enabled: false,
            checks: []
          }
        },
        ignore: options.ignorePatterns || [],
        notifications: {
          cli: true,
          web: false,
          email: false
        }
      }
    };
    
    const result = await guardian.scan(scanOptions);
    const scoreResult = guardian.calculateSecurityScore(result);
    
    // Save results to files (always save markdown, optionally save JSON)
    const savedPaths = await saveResults(result, scoreResult.score, options.outputJson || false, true, projectPath);
    
    // Display results for staged files
    displayStagedResults(result, scoreResult.score, savedPaths, options);
    
    // Determine and use proper exit code
    const exitCode = determineExitCode(result, { failOnHigh: options.failOnHigh });
    process.exit(exitCode);
    return;
  }
  
  console.log('🔍 Scanning project for security issues...\n');
  console.log(`📁 Path: ${projectPath}\n`);

  const guardian = new Avana();
  
  const scanOptions: ScanOptions = {
    path: projectPath,
    verbose: options.verbose,
    config: {
      enabled: true,
      scanOnCommit: false,
      scanOnPush: false,
      blockOnCritical: false,
      rules: {
        secrets: {
          enabled: true,
          patterns: []
        },
        dependencies: {
          enabled: false,
          checkVulnerabilities: false,
          minSeverity: 'low'
        },
        codePatterns: {
          enabled: false,
          checks: []
        }
      },
      ignore: options.ignorePatterns || [],
      notifications: {
        cli: true,
        web: false,
        email: false
      }
    }
  };

  const result = await guardian.scan(scanOptions);
  const scoreResult = guardian.calculateSecurityScore(result);

  // Save results to files (always save markdown, optionally save JSON)
  const savedPaths = await saveResults(result, scoreResult.score, options.outputJson || false, true, projectPath);

  // Display results
  console.log(`✅ Scan complete in ${result.duration}ms\n`);
  
  if (result.issues.length === 0) {
    console.log('🎉 No security issues found!\n');
    console.log(`📊 Security Score: ${scoreResult.score}/100 (Excellent)\n`);
    
    // Show file output message with paths
    console.log(`📋 Reports have been saved:`);
    if (savedPaths.jsonPath) {
      console.log(`   📄 JSON: ${savedPaths.jsonPath}`);
    }
    if (savedPaths.mdPath) {
      console.log(`   📝 Markdown: ${savedPaths.mdPath}`);
    }
    console.log('');
    
    // Exit with success code
    process.exit(ExitCode.SUCCESS);
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

  // Display critical, high, and medium issues
  const criticalIssues = result.issues.filter(i => i.severity === 'critical' || i.severity === 'high' || i.severity === 'medium');
  
  if (criticalIssues.length > 0) {
    console.log('Critical, High & Medium Severity Issues:\n');
    
    criticalIssues.slice(0, 10).forEach((issue) => {
      const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'high' ? '🟠' : '🟡';
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

  console.log(`📊 Security Score: ${scoreResult.score}/100\n`);
  
  if (scoreResult.score < 50) {
    console.log('⚠️  Your security score is low. Please address critical issues immediately.\n');
  } else if (scoreResult.score < 80) {
    console.log('💡 Your security score is moderate. Consider addressing high-priority issues.\n');
  }

  // Show file output message with paths
  console.log(`📋 Detailed reports have been saved for easy review:`);
  if (savedPaths.jsonPath) {
    console.log(`   📄 JSON: ${savedPaths.jsonPath}`);
  }
  if (savedPaths.mdPath) {
    console.log(`   📝 Markdown: ${savedPaths.mdPath}`);
  }
  console.log('');

  // Determine and use proper exit code
  const exitCode = determineExitCode(result, { failOnHigh: options.failOnHigh });
  process.exit(exitCode);
}

/**
 * Display results for staged files (pre-commit hook)
 */
function displayStagedResults(
  result: any, 
  score: number, 
  savedPaths: { jsonPath?: string; mdPath?: string },
  options: { outputJson?: boolean; outputMd?: boolean; failOnHigh?: boolean }
): void {
  if (result.issues.length === 0) {
    console.log('✅ No security issues found in staged files\n');
    
    // Show file output message with paths for staged scans
    console.log(`📋 Reports have been saved:`);
    if (savedPaths.jsonPath) {
      console.log(`   📄 JSON: ${savedPaths.jsonPath}`);
    }
    if (savedPaths.mdPath) {
      console.log(`   📝 Markdown: ${savedPaths.mdPath}`);
    }
    console.log('');
    return;
  }

  const criticalCount = result.summary.critical;
  const highCount = result.summary.high;
  const mediumCount = result.summary.medium;
  
  // Display critical, high, and medium issues
  const criticalIssues = result.issues.filter((i: any) => i.severity === 'critical' || i.severity === 'high' || i.severity === 'medium');
  
  if (criticalIssues.length > 0) {
    console.log('🚨 COMMIT BLOCKED - Security Issues Found\n');
    console.log(`Found ${criticalCount} critical, ${highCount} high, and ${mediumCount} medium severity issue(s):\n`);
    
    criticalIssues.forEach((issue: any) => {
      const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'high' ? '🟠' : '🟡';
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
    console.log('   • Check the detailed security report for more information');
    console.log('   • To bypass (not recommended): git commit --no-verify\n');
    
    // Don't exit here - let the caller handle the exit code
    return;
  } else {
    // Only low issues - allow commit with warning
    console.log('⚠️  Found security issues in staged files:\n');
    console.log(`🟢 Low: ${result.summary.low}\n`);
    console.log('💡 Consider fixing these issues soon\n');
    
    // Show file output message with paths for staged scans
    console.log(`📋 Reports have been saved:`);
    if (savedPaths.jsonPath) {
      console.log(`   📄 JSON: ${savedPaths.jsonPath}`);
    }
    if (savedPaths.mdPath) {
      console.log(`   📝 Markdown: ${savedPaths.mdPath}`);
    }
    console.log('');
  }
}
