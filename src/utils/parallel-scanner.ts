/**
 * Parallel Scanner
 * Distributes file scanning across multiple worker threads for improved performance
 */

import { Worker } from 'worker_threads';
import * as os from 'os';
import * as path from 'path';

export interface ScanResult {
  file: string;
  issues: any[];
  error?: string;
}

export interface WorkerMessage {
  type: 'result' | 'error' | 'complete';
  data?: ScanResult;
  error?: string;
}

export interface ParallelScanOptions {
  workerCount?: number;
  patterns?: any[];
  ignorePatterns?: string[];
}

export class ParallelScanner {
  private readonly workerCount: number;
  private workers: Worker[] = [];
  private activeWorkers: number = 0;
  private completedFiles: number = 0;
  private totalFiles: number = 0;
  private results: ScanResult[] = [];
  private errors: string[] = [];

  constructor(options: ParallelScanOptions = {}) {
    // Default to CPU count - 1, but at least 1 worker
    this.workerCount = options.workerCount || Math.max(1, os.cpus().length - 1);
  }

  /**
   * Scan files in parallel using worker threads
   */
  public async scanFiles(
    files: string[],
    patterns: any[],
    ignorePatterns: string[] = []
  ): Promise<ScanResult[]> {
    if (files.length === 0) {
      return [];
    }

    this.totalFiles = files.length;
    this.completedFiles = 0;
    this.results = [];
    this.errors = [];

    // Distribute files evenly across workers
    const fileChunks = this.distributeFiles(files);
    const actualWorkerCount = Math.min(this.workerCount, fileChunks.length);

    // Create workers
    const workerPromises: Promise<void>[] = [];
    for (let i = 0; i < actualWorkerCount; i++) {
      if (fileChunks[i] && fileChunks[i].length > 0) {
        const workerPromise = this.createWorker(fileChunks[i], patterns, ignorePatterns);
        workerPromises.push(workerPromise);
      }
    }

    // Wait for all workers to complete
    await Promise.all(workerPromises);

    // Sort results by file path for consistent output
    this.results.sort((a, b) => a.file.localeCompare(b.file));

    return this.results;
  }

  /**
   * Distribute files evenly across workers
   */
  private distributeFiles(files: string[]): string[][] {
    const chunks: string[][] = [];
    const chunkSize = Math.ceil(files.length / this.workerCount);

    for (let i = 0; i < files.length; i += chunkSize) {
      chunks.push(files.slice(i, i + chunkSize));
    }

    return chunks;
  }

  /**
   * Create and manage a worker thread
   */
  private async createWorker(
    files: string[],
    patterns: any[],
    ignorePatterns: string[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Get the worker script path - handle both src and dist directories
      let workerScript: string;
      
      // Check if we're running from dist (compiled) or src (tests)
      if (__dirname.includes('dist')) {
        workerScript = path.join(__dirname, 'parallel-scanner-worker.js');
      } else {
        // Running from src directory (during tests), use the compiled version
        workerScript = path.join(__dirname, '../../dist/utils/parallel-scanner-worker.js');
      }
      
      const worker = new Worker(workerScript, {
        workerData: {
          files,
          patterns,
          ignorePatterns
        }
      });

      this.workers.push(worker);
      this.activeWorkers++;

      worker.on('message', (message: WorkerMessage) => {
        this.handleWorkerMessage(message);
      });

      worker.on('error', (error) => {
        this.errors.push(`Worker error: ${error.message}`);
        this.activeWorkers--;
        reject(error);
      });

      worker.on('exit', (code) => {
        this.activeWorkers--;
        if (code !== 0) {
          const error = new Error(`Worker stopped with exit code ${code}`);
          this.errors.push(error.message);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Handle messages from worker threads
   */
  private handleWorkerMessage(message: WorkerMessage): void {
    switch (message.type) {
      case 'result':
        if (message.data) {
          this.results.push(message.data);
          this.completedFiles++;
        }
        break;
      case 'error':
        if (message.error) {
          this.errors.push(message.error);
        }
        break;
      case 'complete':
        // Worker has finished processing all its files
        break;
    }
  }

  /**
   * Get scan progress (0-1)
   */
  public getProgress(): number {
    if (this.totalFiles === 0) return 1;
    return this.completedFiles / this.totalFiles;
  }

  /**
   * Get scan statistics
   */
  public getStats() {
    return {
      totalFiles: this.totalFiles,
      completedFiles: this.completedFiles,
      activeWorkers: this.activeWorkers,
      workerCount: this.workerCount,
      errors: this.errors.length,
      results: this.results.length
    };
  }

  /**
   * Terminate all workers
   */
  public async terminate(): Promise<void> {
    const terminationPromises = this.workers.map(worker => worker.terminate());
    await Promise.all(terminationPromises);
    this.workers = [];
    this.activeWorkers = 0;
  }

  /**
   * Check if parallel scanning is supported
   */
  public static isSupported(): boolean {
    try {
      // Check if worker_threads is available
      require('worker_threads');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get optimal worker count for the current system
   */
  public static getOptimalWorkerCount(): number {
    return Math.max(1, os.cpus().length - 1);
  }
}

// Global parallel scanner instance
export let parallelScanner: ParallelScanner | null = null;

/**
 * Initialize global parallel scanner
 */
export function initializeParallelScanner(options?: ParallelScanOptions): ParallelScanner {
  parallelScanner = new ParallelScanner(options);
  return parallelScanner;
}

/**
 * Get the global parallel scanner instance
 */
export function getParallelScanner(): ParallelScanner | null {
  return parallelScanner;
}