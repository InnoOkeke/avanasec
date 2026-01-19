/**
 * File Type Detector
 * Detects file types, encodings, and determines scanning strategy
 */

import * as fs from 'fs';
import * as path from 'path';
import { safeRequireWithError } from './dependency-checker';
import type { FileEncoding, FileInfo } from '../types';

// Safe require for chardet with error handling
const chardet = safeRequireWithError('chardet', 'File encoding detection');

/**
 * Size threshold for streaming (10MB)
 */
const STREAM_THRESHOLD = 10 * 1024 * 1024;

/**
 * Size of buffer to read for binary detection (8KB)
 */
const DETECTION_BUFFER_SIZE = 8 * 1024;

/**
 * Binary file extensions
 */
const BINARY_EXTENSIONS = new Set([
  // Images
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg', '.webp', '.tiff', '.tif',
  // Videos
  '.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm', '.m4v',
  // Audio
  '.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a',
  // Archives
  '.zip', '.tar', '.gz', '.bz2', '.7z', '.rar', '.xz', '.tgz',
  // Executables
  '.exe', '.dll', '.so', '.dylib', '.bin', '.app', '.deb', '.rpm',
  // Documents (binary formats)
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  // Databases
  '.db', '.sqlite', '.sqlite3', '.mdb',
  // Fonts
  '.ttf', '.otf', '.woff', '.woff2', '.eot',
  // Other
  '.pyc', '.class', '.o', '.a', '.lib', '.jar', '.war',
]);

/**
 * FileTypeDetector class
 * Detects file types and encodings before scanning
 */
export class FileTypeDetector {
  /**
   * Check if a file is binary based on extension and content
   */
  public isBinary(filePath: string): boolean {
    // Check extension first (fast path)
    const ext = path.extname(filePath).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) {
      return true;
    }

    // Check content for binary markers
    try {
      const buffer = this.readFileBuffer(filePath, DETECTION_BUFFER_SIZE);
      return this.isBinaryContent(buffer);
    } catch (error) {
      // If we can't read the file, assume it's not binary
      return false;
    }
  }

  /**
   * Detect file encoding with enhanced error handling
   */
  public detectEncoding(filePath: string): FileEncoding {
    try {
      const buffer = this.readFileBuffer(filePath, DETECTION_BUFFER_SIZE);
      
      // Check for BOM (Byte Order Mark)
      const bom = this.detectBOM(buffer);
      if (bom) {
        return bom;
      }

      // Use chardet for encoding detection with error handling
      try {
        const detected = chardet.detect(buffer);
        if (detected) {
          return this.normalizeEncoding(detected);
        }
      } catch (chardetError) {
        // Log chardet-specific error but continue with fallback
        if (process.env.DEBUG) {
          console.warn(`⚠️  chardet encoding detection failed for ${filePath}: ${chardetError instanceof Error ? chardetError.message : 'Unknown error'}`);
        }
        
        // Fallback to basic encoding detection
        return this.fallbackEncodingDetection(buffer);
      }

      // Default to UTF-8
      return 'utf-8';
    } catch (error) {
      // If detection fails completely, assume UTF-8
      if (process.env.DEBUG) {
        console.warn(`⚠️  Encoding detection failed for ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      return 'utf-8';
    }
  }

  /**
   * Check if file should be streamed (> 10MB)
   */
  public shouldStream(filePath: string): boolean {
    try {
      const stats = fs.statSync(filePath);
      return stats.size > STREAM_THRESHOLD;
    } catch (error) {
      // If we can't get file stats, don't stream
      return false;
    }
  }

  /**
   * Get complete file information
   */
  public getFileInfo(filePath: string): FileInfo {
    const isBinary = this.isBinary(filePath);
    const encoding = isBinary ? 'unknown' : this.detectEncoding(filePath);
    const shouldStream = this.shouldStream(filePath);
    
    let size = 0;
    try {
      const stats = fs.statSync(filePath);
      size = stats.size;
    } catch (error) {
      // Size remains 0 if we can't read stats
    }

    return {
      path: filePath,
      isBinary,
      encoding,
      size,
      shouldStream,
    };
  }

  /**
   * Read file buffer for detection
   */
  private readFileBuffer(filePath: string, maxSize: number): Buffer {
    const fd = fs.openSync(filePath, 'r');
    try {
      const stats = fs.fstatSync(fd);
      const bufferSize = Math.min(stats.size, maxSize);
      const buffer = Buffer.alloc(bufferSize);
      fs.readSync(fd, buffer, 0, bufferSize, 0);
      return buffer;
    } finally {
      fs.closeSync(fd);
    }
  }

  /**
   * Check if buffer contains binary content
   * Binary files typically have null bytes or high-bit characters
   */
  private isBinaryContent(buffer: Buffer): boolean {
    // Check for null bytes (strong indicator of binary)
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === 0) {
        return true;
      }
    }

    // Check for high percentage of non-ASCII characters
    let nonAsciiCount = 0;
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] > 127) {
        nonAsciiCount++;
      }
    }

    // If more than 30% non-ASCII, likely binary
    const nonAsciiRatio = nonAsciiCount / buffer.length;
    return nonAsciiRatio > 0.3;
  }

  /**
   * Detect BOM (Byte Order Mark)
   */
  private detectBOM(buffer: Buffer): FileEncoding | null {
    // UTF-16 LE BOM: FF FE
    if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
      return 'utf-16';
    }

    // UTF-16 BE BOM: FE FF
    if (buffer.length >= 2 && buffer[0] === 0xFE && buffer[1] === 0xFF) {
      return 'utf-16';
    }

    // UTF-8 BOM: EF BB BF
    if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
      return 'utf-8';
    }

    return null;
  }

  /**
   * Fallback encoding detection when chardet fails
   */
  private fallbackEncodingDetection(buffer: Buffer): FileEncoding {
    // Simple heuristic-based encoding detection
    let nullBytes = 0;
    let highBitBytes = 0;
    let validUtf8Sequences = 0;
    
    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer[i];
      
      // Count null bytes (indicator of binary or UTF-16)
      if (byte === 0) {
        nullBytes++;
      }
      
      // Count high-bit bytes (non-ASCII)
      if (byte > 127) {
        highBitBytes++;
        
        // Check for valid UTF-8 sequences
        if (this.isValidUtf8Sequence(buffer, i)) {
          validUtf8Sequences++;
        }
      }
    }
    
    const totalBytes = buffer.length;
    const nullRatio = nullBytes / totalBytes;
    const highBitRatio = highBitBytes / totalBytes;
    
    // If many null bytes, likely UTF-16 or binary
    if (nullRatio > 0.1) {
      return 'utf-16';
    }
    
    // If mostly ASCII, return ASCII
    if (highBitRatio < 0.05) {
      return 'ascii';
    }
    
    // If high-bit bytes with valid UTF-8 sequences, likely UTF-8
    if (validUtf8Sequences > 0) {
      return 'utf-8';
    }
    
    // Default fallback
    return 'utf-8';
  }

  /**
   * Check if byte sequence at position is valid UTF-8
   */
  private isValidUtf8Sequence(buffer: Buffer, startIndex: number): boolean {
    if (startIndex >= buffer.length) return false;
    
    const firstByte = buffer[startIndex];
    
    // Single byte (ASCII)
    if ((firstByte & 0x80) === 0) {
      return true;
    }
    
    // Multi-byte sequence
    let expectedBytes = 0;
    if ((firstByte & 0xE0) === 0xC0) expectedBytes = 1; // 110xxxxx
    else if ((firstByte & 0xF0) === 0xE0) expectedBytes = 2; // 1110xxxx
    else if ((firstByte & 0xF8) === 0xF0) expectedBytes = 3; // 11110xxx
    else return false;
    
    // Check continuation bytes
    for (let i = 1; i <= expectedBytes; i++) {
      if (startIndex + i >= buffer.length) return false;
      const byte = buffer[startIndex + i];
      if ((byte & 0xC0) !== 0x80) return false; // 10xxxxxx
    }
    
    return true;
  }
  private normalizeEncoding(detected: string): FileEncoding {
    const lower = detected.toLowerCase();
    
    if (lower.includes('utf-8') || lower.includes('utf8')) {
      return 'utf-8';
    }
    
    if (lower.includes('utf-16') || lower.includes('utf16') || lower.includes('ucs-2')) {
      return 'utf-16';
    }
    
    if (lower.includes('iso-8859') || lower.includes('latin')) {
      return 'latin-1';
    }
    
    if (lower.includes('ascii')) {
      return 'ascii';
    }
    
    // Default to UTF-8 for unknown encodings
    return 'utf-8';
  }
}
