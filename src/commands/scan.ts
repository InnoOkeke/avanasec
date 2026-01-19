/**
 * Avana CLI - Scan Command
 * Scans project for security issues
 */

import { Avana } from '../index';
import type { ScanOptions } from '../types';
// JSON output removed - using Markdown only for reliability
import { MarkdownOutputFormatter } from '../utils/markdown-output-formatter';
import { determineExitCode, exitWithCode, ExitCode } from '../utils/exit-codes';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Format memory size in human-readable format
 */
function formatMemorySize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

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
 * Save results to Markdown file
 */
async function saveResults(
  result: any, 
  score: number, 
  rootPath: string,
  verbose: boolean = false
): Promise<{ mdPath: string }> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const reportsDir = path.join(rootPath, 'scan-reports');
  
  // Create scan-reports directory if it doesn't exist
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
    
    // Automatically add scan-reports and .avana-cache to .gitignore to prevent committing secrets
    const gitignorePath = path.join(rootPath, '.gitignore');
    try {
      let gitignoreContent = '';
      if (fs.existsSync(gitignorePath)) {
        gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      }
      
      let updated = false;
      
      // Check if scan-reports is already in .gitignore
      if (!gitignoreContent.includes('scan-reports')) {
        const newEntry = gitignoreContent.endsWith('\n') || gitignoreContent === '' 
          ? '# Avanasec scan reports (contains detected secrets)\nscan-reports/\n'
          : '\n# Avanasec scan reports (contains detected secrets)\nscan-reports/\n';
        
        gitignoreContent += newEntry;
        updated = true;
      }
      
      // Check if .avana-cache is already in .gitignore
      if (!gitignoreContent.includes('.avana-cache')) {
        const newEntry = gitignoreContent.endsWith('\n') || gitignoreContent === '' 
          ? '# Avanasec cache (scan results cache)\n.avana-cache/\n'
          : '\n# Avanasec cache (scan results cache)\n.avana-cache/\n';
        
        gitignoreContent += newEntry;
        updated = true;
      }
      
      if (updated) {
        fs.writeFileSync(gitignorePath, gitignoreContent);
        
        if (verbose) {
          console.log('📝 Added scan-reports/ and .avana-cache/ to .gitignore');
        }
      }
    } catch (error) {
      // Silently fail if we can't write to .gitignore - don't break the scan
      if (verbose) {
        console.warn('⚠️  Could not update .gitignore - please manually add scan-reports/ and .avana-cache/');
      }
    }
  }
  
  const mdFormatter = new MarkdownOutputFormatter();
  const mdContent = mdFormatter.format(result, score);
  
  const mdFilename = `avana-security-report-${timestamp}.md`;
  const mdPath = path.join(reportsDir, mdFilename);
  
  try {
    fs.writeFileSync(mdPath, mdContent, 'utf-8');
    console.log(`📝 Markdown report saved: ${mdFilename}`);
    return { mdPath };
  } catch (error) {
    console.error(`❌ Failed to save Markdown report: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

export async function scanCommand(options: { 
  path?: string; 
  verbose?: boolean; 
  debug?: boolean;
  quiet?: boolean;
  staged?: boolean;
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
      if (!options.quiet) {
        console.log('ℹ️  No staged files to scan\n');
      }
      return;
    }
    
    if (!options.quiet) {
      console.log(`🔍 Scanning ${stagedFiles.length} staged file(s)...\n`);
    }
    
    // Create Avana instance with robust options
    const avana = new Avana({
      debugMode: options.debug || false,
      maxMemoryMB: options.maxMemory || 500,
      cacheDir: path.join(rootPath, '.avana-cache'),
      workerCount: options.workers
    });
    
    const scanOptions: ScanOptions = {
      path: projectPath,
      verbose: options.verbose && !options.quiet,
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
    
    const result = await avana.scan(scanOptions);
    const scoreResult = avana.calculateSecurityScore(result);
    
    // Save results to Markdown file
    const savedPaths = await saveResults(result, scoreResult.score, projectPath, options.verbose || false);
    
    // Display results for staged files
    displayStagedResults(result, scoreResult.score, savedPaths, options);
    
    // Cleanup resources
    await avana.cleanup();
    
    // Determine and use proper exit code
    const exitCode = determineExitCode(result, { failOnHigh: options.failOnHigh });
    process.exit(exitCode);
    return;
  }
  
  if (!options.quiet) {
    console.log('🔍 Scanning project for security issues...\n');
    console.log(`📁 Path: ${projectPath}\n`);
  }

  // Create Avana instance with robust options
  const avana = new Avana({
    debugMode: options.debug || false,
    maxMemoryMB: options.maxMemory || 500,
    cacheDir: path.join(rootPath, '.avana-cache'),
    workerCount: options.workers
  });
  
  const scanOptions: ScanOptions = {
    path: projectPath,
    verbose: (options.verbose && !options.quiet) || false,
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

  const result = await avana.scan(scanOptions);
  const scoreResult = avana.calculateSecurityScore(result);

  // Save results to Markdown file
  const savedPaths = await saveResults(result, scoreResult.score, projectPath, options.verbose || false);

  // Display results
  if (!options.quiet) {
    console.log(`✅ Scan complete in ${result.duration}ms\n`);
    
    // Show statistics if debug mode
    if (options.debug) {
      const memoryStats = avana.getMemoryStats();
      const cacheStats = avana.getCacheStats();
      const errorStats = avana.getErrorStats();
      
      console.log('🔧 Debug Information:');
      console.log(`   Memory: ${formatMemorySize(memoryStats.currentUsage)} / ${formatMemorySize(memoryStats.limit)}`);
      console.log(`   Cache: ${cacheStats.hitRate.toFixed(1)}% hit rate (${cacheStats.hitCount} hits, ${cacheStats.missCount} misses)`);
      console.log(`   Errors: ${errorStats.totalErrors} total errors`);
      console.log('');
    }
  }
  
  if (result.issues.length === 0) {
    if (!options.quiet) {
      console.log('🎉 No security issues found!\n');
      console.log(`📊 Security Score: ${scoreResult.score}/100 (Excellent)\n`);
      
      // Show file output message with paths
      console.log(`📋 Reports have been saved:`);
      console.log(`   📝 Markdown: ${savedPaths.mdPath}`);
      console.log('');
    }
    
    // Cleanup resources
    await avana.cleanup();
    
    // Exit with success code
    process.exit(ExitCode.SUCCESS);
    return;
  }

  // Display summary
  if (!options.quiet) {
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
    
    // Security reminder about scan reports
    if (savedPaths.mdPath) {
      console.log('🔒 Security Reminder: Scan reports contain detected secrets and are automatically');
      console.log('   added to .gitignore to prevent accidental commits. Never commit scan-reports/\n');
    }

    // Show file output message with paths
    console.log(`📋 Detailed reports have been saved for easy review:`);
    console.log(`   📝 Markdown: ${savedPaths.mdPath}`);
    console.log('');
  }

  // Cleanup resources
  await avana.cleanup();

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
  savedPaths: { mdPath: string },
  options: { failOnHigh?: boolean }
): void {
  if (result.issues.length === 0) {
    console.log('✅ No security issues found in staged files\n');
    
    // Show file output message with paths for staged scans
    console.log(`📋 Reports have been saved:`);
    console.log(`   📝 Markdown: ${savedPaths.mdPath}`);
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
    console.log(`   📝 Markdown: ${savedPaths.mdPath}`);
    console.log('');
  }
}
