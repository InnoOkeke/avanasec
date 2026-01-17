#!/usr/bin/env node

/**
 * Avana CLI
 * Command-line interface for security scanning
 */

import { scanCommand } from './commands/scan';
import { installCommand } from './commands/install';
import { uninstallCommand } from './commands/uninstall';
import { handleUnexpectedError, handleInvalidArguments, ExitCode } from './utils/exit-codes';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  try {
    if (!command || command === 'scan') {
      // Parse CLI arguments
      const verbose = args.includes('--verbose') || args.includes('-v');
      const debug = args.includes('--debug');
      const quiet = args.includes('--quiet');
      const staged = args.includes('--staged');
      const outputJson = args.includes('--output-json') || args.includes('--json');
      const outputMd = args.includes('--output-md');
      const noProgress = args.includes('--no-progress');
      const failOnHigh = args.includes('--fail-on-high');
      
      // Parse path argument
      const pathIndex = args.indexOf('--path');
      const path = pathIndex >= 0 ? args[pathIndex + 1] : undefined;
      
      // Validate path argument
      if (pathIndex >= 0 && !path) {
        handleInvalidArguments('--path flag requires a value');
      }
      
      // Parse max-memory argument
      const maxMemoryIndex = args.indexOf('--max-memory');
      let maxMemory: number | undefined;
      if (maxMemoryIndex >= 0) {
        const maxMemoryStr = args[maxMemoryIndex + 1];
        if (!maxMemoryStr) {
          handleInvalidArguments('--max-memory flag requires a value');
        }
        maxMemory = parseInt(maxMemoryStr, 10);
        if (isNaN(maxMemory) || maxMemory <= 0) {
          handleInvalidArguments('--max-memory must be a positive number');
        }
      }
      
      // Parse workers argument
      const workersIndex = args.indexOf('--workers');
      let workers: number | undefined;
      if (workersIndex >= 0) {
        const workersStr = args[workersIndex + 1];
        if (!workersStr) {
          handleInvalidArguments('--workers flag requires a value');
        }
        workers = parseInt(workersStr, 10);
        if (isNaN(workers) || workers <= 0) {
          handleInvalidArguments('--workers must be a positive number');
        }
      }
      
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

      await scanCommand({ 
        path, 
        verbose, 
        debug,
        quiet,
        staged, 
        outputJson, 
        outputMd, 
        ignorePatterns,
        noProgress,
        failOnHigh,
        maxMemory,
        workers
      });
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
  --debug                  Show debug information
  --quiet                  Show minimal output
  --json                   Save results to JSON file
  --output-json            Save results to JSON file (alias for --json)
  --output-md              Save results to Markdown file
  --no-progress            Disable progress bar
  --fail-on-high           Exit with code 1 on high severity issues
  --max-memory <mb>        Set memory limit in MB (default: 500)
  --workers <count>        Set number of worker threads (default: CPU count - 1)
  --ignore <pattern>       Ignore files matching pattern (can be used multiple times)

Exit Codes:
  0                        No critical or high severity issues found
  1                        Critical or high severity issues found
  2                        Invalid arguments or configuration
  3                        Unexpected error occurred

Examples:
  avana scan
  avana scan --path ./my-project
  avana scan --staged
  avana scan --verbose --debug
  avana scan --json --output-md
  avana scan --fail-on-high
  avana scan --max-memory 1000 --workers 4
  avana scan --ignore "**/*.md" --ignore "tests/**"
  avana install
  avana uninstall
    `);
      process.exit(ExitCode.SUCCESS);
    } else {
      handleInvalidArguments(`Unknown command: ${command}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      handleUnexpectedError(error);
    } else {
      handleUnexpectedError(new Error(String(error)));
    }
  }
}

main().catch(error => {
  handleUnexpectedError(error instanceof Error ? error : new Error(String(error)));
});
