/**
 * File Stream Scanner
 * Scans large files in chunks to avoid memory issues
 */

import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import type { SecurityIssue, FileEncoding } from '../types';
import { getAllSecretPatterns } from '../rules/secret-patterns';
import { getAdditionalSecretPatterns } from '../rules/additional-patterns';

/**
 * Default chunk size: 64KB
 */
const DEFAULT_CHUNK_SIZE = 64 * 1024;

/**
 * Default overlap between chunks: 1KB
 * This ensures patterns spanning chunk boundaries are detected
 */
const DEFAULT_OVERLAP = 1024;

/**
 * Stream options for file scanning
 */
interface StreamOptions {
  chunkSize: number;
  overlap: number;
  maxMemory: number;
}

/**
 * FileStreamScanner class
 * Scans large files in chunks to avoid memory issues
 */
export class FileStreamScanner {
  private options: StreamOptions;

  constructor(options?: Partial<StreamOptions>) {
    this.options = {
      chunkSize: DEFAULT_CHUNK_SIZE,
      overlap: DEFAULT_OVERLAP,
      maxMemory: 500 * 1024 * 1024, // 500MB
      ...options,
    };
  }

  /**
   * Scan a large file using streaming
   */
  public async scanStream(
    filePath: string,
    encoding: FileEncoding = 'utf-8'
  ): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];
    const fd = fs.openSync(filePath, 'r');

    try {
      const stats = fs.fstatSync(fd);
      const fileSize = stats.size;

      // Get all patterns
      const patterns = [
        ...getAllSecretPatterns(),
        ...getAdditionalSecretPatterns()
      ];

      let position = 0;
      let lineNumber = 1;
      let previousOverlap = '';

      while (position < fileSize) {
        // Read chunk
        const chunkSize = Math.min(this.options.chunkSize, fileSize - position);
        const buffer = Buffer.alloc(chunkSize);
        const bytesRead = fs.readSync(fd, buffer, 0, chunkSize, position);

        if (bytesRead === 0) {
          break;
        }

        // Convert encoding to UTF-8
        const chunkText = this.decodeBuffer(buffer.slice(0, bytesRead), encoding);

        // Combine with previous overlap
        const textToScan = previousOverlap + chunkText;
        const lines = textToScan.split('\n');

        // Scan the chunk for patterns
        patterns.forEach(pattern => {
          lines.forEach((line, lineIndex) => {
            const matches = line.matchAll(pattern.pattern);
            
            for (const match of matches) {
              const actualLineNumber = lineNumber + lineIndex;
              
              // Only add if not a duplicate from overlap region
              const issueKey = `${pattern.id}-${actualLineNumber}-${match.index}`;
              const isDuplicate = issues.some(
                existing => 
                  existing.id === `${pattern.id}-${filePath}-${actualLineNumber - 1}` ||
                  existing.id === issueKey
              );

              if (!isDuplicate) {
                issues.push({
                  id: `${pattern.id}-${filePath}-${actualLineNumber - 1}`,
                  type: 'secret',
                  severity: pattern.severity,
                  title: pattern.name,
                  description: pattern.description,
                  file: filePath,
                  line: actualLineNumber,
                  column: match.index,
                  code: line.trim(),
                  suggestion: pattern.suggestion,
                });
              }
            }
          });
        });

        // Update line number for next chunk
        lineNumber += chunkText.split('\n').length - 1;

        // Save overlap for next iteration
        const overlapSize = Math.min(this.options.overlap, chunkText.length);
        previousOverlap = chunkText.slice(-overlapSize);

        // Move position forward
        position += bytesRead;
      }
    } finally {
      fs.closeSync(fd);
    }

    return issues;
  }

  /**
   * Decode buffer to string using specified encoding
   */
  private decodeBuffer(buffer: Buffer, encoding: FileEncoding): string {
    switch (encoding) {
      case 'utf-8':
        return buffer.toString('utf-8');
      case 'utf-16':
        return iconv.decode(buffer, 'utf-16le');
      case 'latin-1':
        return iconv.decode(buffer, 'latin1');
      case 'ascii':
        return buffer.toString('ascii');
      default:
        // Default to UTF-8
        return buffer.toString('utf-8');
    }
  }

}
