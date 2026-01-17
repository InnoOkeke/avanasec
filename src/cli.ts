#!/usr/bin/env node

/**
 * Avana CLI
 * Command-line interface for security scanning
 */

import { scanCommand } from './commands/scan';
import { installCommand } from './commands/install';
import { uninstallCommand } from './commands/uninstall';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  if (!command || command === 'scan') {
    const verbose = args.includes('--verbose') || args.includes('-v');
    const staged = args.includes('--staged');
    const outputJson = args.includes('--output-json');
    const outputMd = args.includes('--output-md');
    const pathIndex = args.indexOf('--path');
    const path = pathIndex >= 0 ? args[pathIndex + 1] : undefined;
    
    // Parse ignore patterns
    const ignorePatterns: string[] = [];
    let i = 0;
    while (i < args.length) {
      if (args[i] === '--ignore' && i + 1 < args.length) {
        ignorePatterns.push(args[i + 1]);
        i += 2;
      } else {
        i++;
      }
    }

    await scanCommand({ path, verbose, staged, outputJson, outputMd, ignorePatterns });
  } else if (command === 'install') {
    await installCommand();
  } else if (command === 'uninstall') {
    await uninstallCommand();
  } else if (command === '--help' || command === '-h') {
    console.log(`
🔒 Avana CLI

Usage:
  avana scan [options]     Scan project for security issues
  avana install            Install Git pre-commit hooks
  avana uninstall          Remove Git pre-commit hooks
  avana --help             Show this help message

Scan Options:
  --path <path>            Path to scan (default: current directory)
  --staged                 Scan only Git staged files (for pre-commit hooks)
  --verbose, -v            Show detailed output
  --output-json            Save results to JSON file
  --output-md              Save results to Markdown file
  --ignore <pattern>       Ignore files matching pattern (can be used multiple times)

Examples:
  avana scan
  avana scan --path ./my-project
  avana scan --staged
  avana scan --verbose
  avana scan --output-json --output-md
  avana scan --ignore "**/*.md" --ignore "tests/**"
  avana install
  avana uninstall
    `);
  } else {
    console.error(`Unknown command: ${command}`);
    console.log('Run "avana --help" for usage information');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
