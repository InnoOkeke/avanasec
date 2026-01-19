/**
 * Test Utilities
 * Helper functions for testing Avana
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { SecurityIssue, ScanResult } from '../../src/types';

/**
 * Create a temporary directory for testing
 */
export function createTempDir(prefix: string = 'avana-test-'): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

/**
 * Create a temporary file with content
 */
export function createTempFile(dir: string, filename: string, content: string | Buffer): string {
  const filePath = path.join(dir, filename);
  
  try {
    if (Buffer.isBuffer(content)) {
      fs.writeFileSync(filePath, content);
    } else {
      // Ensure the content is valid UTF-8
      fs.writeFileSync(filePath, content, 'utf-8');
    }
    return filePath;
  } catch (error) {
    // If UTF-8 fails, try binary mode
    if (typeof content === 'string') {
      try {
        fs.writeFileSync(filePath, content, 'binary');
        return filePath;
      } catch {
        // If all else fails, create an empty file
        fs.writeFileSync(filePath, '');
        return filePath;
      }
    }
    throw error;
  }
}

/**
 * Create multiple temporary files
 */
export function createTempFiles(dir: string, files: Record<string, string>): string[] {
  const filePaths: string[] = [];
  for (const [filename, content] of Object.entries(files)) {
    filePaths.push(createTempFile(dir, filename, content));
  }
  return filePaths;
}

/**
 * Clean up temporary directory with retry logic for Windows
 */
export function cleanupTempDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    return;
  }

  // Try multiple times with delays for Windows file locking issues
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      // First, try to make all files writable
      try {
        const files = fs.readdirSync(dir, { recursive: true });
        for (const file of files) {
          const filePath = path.join(dir, file.toString());
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            try {
              fs.chmodSync(filePath, 0o666);
            } catch {
              // Ignore chmod errors
            }
          }
        }
      } catch {
        // Ignore directory reading errors
      }

      // Try to remove the directory
      fs.rmSync(dir, { recursive: true, force: true });
      return; // Success
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        // Final attempt failed, log but don't throw
        console.warn(`Failed to cleanup temp directory ${dir}:`, error);
        return;
      }
      
      // Wait before retry
      const delay = attempts * 100;
      const start = Date.now();
      while (Date.now() - start < delay) {
        // Busy wait
      }
    }
  }
}

/**
 * Create a binary file for testing
 */
export function createBinaryFile(dir: string, filename: string): string {
  const filePath = path.join(dir, filename);
  const buffer = Buffer.from([0x00, 0x01, 0x02, 0x03, 0xFF, 0xFE, 0xFD]);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

/**
 * Create a large file for testing streaming
 */
export function createLargeFile(dir: string, filename: string, sizeMB: number): string {
  const filePath = path.join(dir, filename);
  const chunkSize = 1024 * 1024; // 1MB
  const content = 'a'.repeat(chunkSize);
  
  // Write synchronously to ensure file is created before returning
  const fd = fs.openSync(filePath, 'w');
  try {
    for (let i = 0; i < sizeMB; i++) {
      fs.writeSync(fd, content);
    }
  } finally {
    fs.closeSync(fd);
  }
  
  return filePath;
}

/**
 * Create a file with specific encoding
 */
export function createEncodedFile(
  dir: string,
  filename: string,
  content: string,
  encoding: BufferEncoding
): string {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content, encoding);
  return filePath;
}

/**
 * Create a file with UTF-16 BOM
 */
export function createUTF16File(dir: string, filename: string, content: string): string {
  const filePath = path.join(dir, filename);
  const bom = Buffer.from([0xFF, 0xFE]); // UTF-16 LE BOM
  const contentBuffer = Buffer.from(content, 'utf16le');
  fs.writeFileSync(filePath, Buffer.concat([bom, contentBuffer]));
  return filePath;
}

/**
 * Assert that a scan result contains an issue
 */
export function assertHasIssue(
  result: ScanResult,
  predicate: (issue: SecurityIssue) => boolean
): void {
  const found = result.issues.some(predicate);
  if (!found) {
    throw new Error('Expected issue not found in scan result');
  }
}

/**
 * Assert that a scan result does not contain an issue
 */
export function assertNoIssue(
  result: ScanResult,
  predicate: (issue: SecurityIssue) => boolean
): void {
  const found = result.issues.some(predicate);
  if (found) {
    throw new Error('Unexpected issue found in scan result');
  }
}

/**
 * Get issues by severity
 */
export function getIssuesBySeverity(
  result: ScanResult,
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
): SecurityIssue[] {
  return result.issues.filter(issue => issue.severity === severity);
}

/**
 * Create a mock scan result for testing
 */
export function createMockScanResult(overrides?: Partial<ScanResult>): ScanResult {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    duration: 100,
    filesScanned: 10,
    issues: [],
    summary: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    },
    ...overrides,
  };
}

/**
 * Create a mock security issue for testing
 */
export function createMockIssue(overrides?: Partial<SecurityIssue>): SecurityIssue {
  return {
    id: 'test-issue-1',
    type: 'secret',
    severity: 'high',
    title: 'Test Issue',
    description: 'This is a test issue',
    file: '/test/file.ts',
    line: 1,
    column: 0,
    code: 'const secret = "test";',
    suggestion: 'Remove the hardcoded secret',
    ...overrides,
  };
}

/**
 * Wait for a specified time (for async tests)
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a symbolic link for testing
 */
export function createSymlink(target: string, linkPath: string): void {
  fs.symlinkSync(target, linkPath);
}

/**
 * Check if a file is a symbolic link
 */
export function isSymlink(filePath: string): boolean {
  try {
    const stats = fs.lstatSync(filePath);
    return stats.isSymbolicLink();
  } catch {
    return false;
  }
}
