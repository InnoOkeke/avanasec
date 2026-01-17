/**
 * Exit Code Utilities
 * Standard exit codes for CI/CD integration
 */

/**
 * Standard exit codes for Avana CLI
 */
export enum ExitCode {
  /** No critical or high severity issues found */
  SUCCESS = 0,
  
  /** Critical or high severity issues found */
  ISSUES_FOUND = 1,
  
  /** Invalid arguments or configuration */
  INVALID_ARGUMENTS = 2,
  
  /** Unexpected error occurred */
  UNEXPECTED_ERROR = 3
}

/**
 * Exit code descriptions for documentation
 */
export const EXIT_CODE_DESCRIPTIONS = {
  [ExitCode.SUCCESS]: 'No critical or high severity issues found',
  [ExitCode.ISSUES_FOUND]: 'Critical or high severity issues found',
  [ExitCode.INVALID_ARGUMENTS]: 'Invalid arguments or configuration',
  [ExitCode.UNEXPECTED_ERROR]: 'Unexpected error occurred'
} as const;

/**
 * Determine exit code based on scan results and options
 */
export function determineExitCode(
  result: { summary: { critical: number; high: number; medium: number; low: number } },
  options: { failOnHigh?: boolean } = {}
): ExitCode {
  const { critical, high } = result.summary;
  
  // Always exit with error code if critical issues found
  if (critical > 0) {
    return ExitCode.ISSUES_FOUND;
  }
  
  // Exit with error code if high issues found and --fail-on-high is set
  if (high > 0 && options.failOnHigh) {
    return ExitCode.ISSUES_FOUND;
  }
  
  // Exit with error code if high issues found (default behavior)
  if (high > 0) {
    return ExitCode.ISSUES_FOUND;
  }
  
  return ExitCode.SUCCESS;
}

/**
 * Exit the process with the appropriate code and message
 */
export function exitWithCode(code: ExitCode, message?: string): never {
  if (message) {
    if (code === ExitCode.SUCCESS) {
      console.log(message);
    } else {
      console.error(message);
    }
  }
  
  process.exit(code);
}

/**
 * Handle unexpected errors with proper exit code
 */
export function handleUnexpectedError(error: Error): never {
  console.error('❌ Unexpected error occurred:');
  console.error(error.message);
  
  if (process.env.DEBUG) {
    console.error('\nStack trace:');
    console.error(error.stack);
  }
  
  process.exit(ExitCode.UNEXPECTED_ERROR);
}

/**
 * Handle invalid arguments with proper exit code
 */
export function handleInvalidArguments(message: string): never {
  console.error('❌ Invalid arguments:');
  console.error(message);
  console.error('\nRun "avana --help" for usage information');
  
  process.exit(ExitCode.INVALID_ARGUMENTS);
}