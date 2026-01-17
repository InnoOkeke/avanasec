/**
 * Result Cache
 * Caches scan results to skip unchanged files for faster subsequent scans
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface CacheEntry {
  hash: string;
  timestamp: number;
  results: any[];
  fileSize: number;
  modifiedTime: number;
}

export interface CacheStats {
  totalEntries: number;
  hitCount: number;
  missCount: number;
  hitRate: number;
  cacheSize: number;
  expiredEntries: number;
}

export class ResultCache {
  private readonly cacheDir: string;
  private readonly cacheFile: string;
  private cache: Map<string, CacheEntry> = new Map();
  private hitCount: number = 0;
  private missCount: number = 0;
  private readonly maxAge: number; // in milliseconds
  private isDirty: boolean = false;

  constructor(cacheDir: string = '.avana-cache', maxAgeHours: number = 24) {
    this.cacheDir = path.resolve(cacheDir);
    this.cacheFile = path.join(this.cacheDir, 'scan-results.json');
    this.maxAge = maxAgeHours * 60 * 60 * 1000; // Convert hours to milliseconds
    
    this.ensureCacheDirectory();
    this.loadCache();
  }

  /**
   * Get cached results for a file
   */
  public get(filePath: string): any[] | null {
    try {
      const absolutePath = path.resolve(filePath);
      const cacheKey = this.getCacheKey(absolutePath);
      const entry = this.cache.get(cacheKey);

      if (!entry) {
        this.missCount++;
        return null;
      }

      // Check if entry is expired
      if (this.isExpired(entry)) {
        this.cache.delete(cacheKey);
        this.isDirty = true;
        this.missCount++;
        return null;
      }

      // Check if file has been modified
      const fileStats = this.getFileStats(absolutePath);
      if (!fileStats) {
        // File doesn't exist anymore, remove from cache
        this.cache.delete(cacheKey);
        this.isDirty = true;
        this.missCount++;
        return null;
      }

      const currentHash = this.calculateFileHash(fileStats.size, fileStats.mtime);
      if (entry.hash !== currentHash) {
        // File has been modified, remove from cache
        this.cache.delete(cacheKey);
        this.isDirty = true;
        this.missCount++;
        return null;
      }

      // Cache hit!
      this.hitCount++;
      return entry.results;
    } catch (error) {
      // On any error, treat as cache miss
      this.missCount++;
      return null;
    }
  }

  /**
   * Set cached results for a file
   */
  public set(filePath: string, results: any[]): void {
    try {
      const absolutePath = path.resolve(filePath);
      const fileStats = this.getFileStats(absolutePath);
      
      if (!fileStats) {
        return; // Can't cache if file doesn't exist
      }

      const cacheKey = this.getCacheKey(absolutePath);
      const hash = this.calculateFileHash(fileStats.size, fileStats.mtime);
      
      const entry: CacheEntry = {
        hash,
        timestamp: Date.now(),
        results: results,
        fileSize: fileStats.size,
        modifiedTime: fileStats.mtime
      };

      this.cache.set(cacheKey, entry);
      this.isDirty = true;
    } catch (error) {
      // Silently fail on cache set errors
      // Caching is optional and shouldn't break the main functionality
    }
  }

  /**
   * Clear all cached results
   */
  public clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
    this.isDirty = true;
  }

  /**
   * Remove expired entries from cache
   */
  public cleanup(): number {
    let removedCount = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry, now)) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      this.isDirty = true;
    }

    return removedCount;
  }

  /**
   * Get cache statistics
   */
  public getStats(): CacheStats {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;
    
    // Calculate cache size in bytes (approximate)
    let cacheSize = 0;
    for (const entry of this.cache.values()) {
      cacheSize += JSON.stringify(entry).length * 2; // Rough estimate (UTF-16)
    }

    // Count expired entries
    const now = Date.now();
    let expiredEntries = 0;
    for (const entry of this.cache.values()) {
      if (this.isExpired(entry, now)) {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: Math.round(hitRate * 100) / 100, // Round to 2 decimal places
      cacheSize,
      expiredEntries
    };
  }

  /**
   * Save cache to disk
   */
  public save(): void {
    if (!this.isDirty) {
      return; // No changes to save
    }

    try {
      // Clean up expired entries before saving
      this.cleanup();

      const cacheData = {
        version: '1.0',
        timestamp: Date.now(),
        entries: Array.from(this.cache.entries())
      };

      fs.writeFileSync(this.cacheFile, JSON.stringify(cacheData, null, 2), 'utf8');
      this.isDirty = false;
    } catch (error) {
      // Silently fail on save errors
      // Caching is optional and shouldn't break the main functionality
    }
  }

  /**
   * Load cache from disk
   */
  private loadCache(): void {
    try {
      if (!fs.existsSync(this.cacheFile)) {
        return; // No cache file exists yet
      }

      const cacheData = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
      
      if (cacheData.version === '1.0' && Array.isArray(cacheData.entries)) {
        this.cache = new Map(cacheData.entries);
        
        // Clean up expired entries on load
        this.cleanup();
      }
    } catch (error) {
      // If cache file is corrupted, start with empty cache
      this.cache.clear();
    }
  }

  /**
   * Ensure cache directory exists
   */
  private ensureCacheDirectory(): void {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
    } catch (error) {
      // If we can't create cache directory, caching will be disabled
      // This is acceptable as caching is optional
    }
  }

  /**
   * Generate cache key for a file path
   */
  private getCacheKey(absolutePath: string): string {
    // Use the absolute path as the cache key
    // Normalize path separators for cross-platform compatibility
    return absolutePath.replace(/\\/g, '/');
  }

  /**
   * Calculate hash for file based on size and modification time
   */
  private calculateFileHash(size: number, mtime: number): string {
    // Use file size and modification time to create a hash
    // This is much faster than reading the entire file content
    const data = `${size}-${mtime}`;
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * Get file statistics
   */
  private getFileStats(filePath: string): { size: number; mtime: number } | null {
    try {
      const stats = fs.statSync(filePath);
      return {
        size: stats.size,
        mtime: stats.mtime.getTime()
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry, now: number = Date.now()): boolean {
    return (now - entry.timestamp) > this.maxAge;
  }

  /**
   * Get cache directory path
   */
  public getCacheDir(): string {
    return this.cacheDir;
  }

  /**
   * Check if cache is enabled (directory is writable)
   */
  public isEnabled(): boolean {
    try {
      // Try to write a test file to check if directory is writable
      const testFile = path.join(this.cacheDir, '.test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get cache file size in bytes
   */
  public getCacheFileSize(): number {
    try {
      if (fs.existsSync(this.cacheFile)) {
        return fs.statSync(this.cacheFile).size;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }
}

// Global result cache instance
export let resultCache: ResultCache | null = null;

/**
 * Initialize global result cache
 */
export function initializeResultCache(cacheDir?: string, maxAgeHours?: number): ResultCache {
  resultCache = new ResultCache(cacheDir, maxAgeHours);
  return resultCache;
}

/**
 * Get the global result cache instance
 */
export function getResultCache(): ResultCache | null {
  return resultCache;
}