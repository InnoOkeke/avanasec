/**
 * Progress Reporter
 * Provides progress reporting functionality for file scanning operations
 */

import { safeRequireWithError } from './dependency-checker';

// Safe require for cli-progress with error handling
const cliProgress = safeRequireWithError('cli-progress', 'Progress bar functionality');

export interface ProgressOptions {
  total: number;
  noProgress?: boolean;
}

export interface ProgressStats {
  current: number;
  total: number;
  percentage: number;
  eta: number;
  elapsedTime: number;
  rate: number;
}

export class ProgressReporter {
  private progressBar: any | null = null;
  private startTime: number = 0;
  private lastUpdateTime: number = 0;
  private current: number = 0;
  private total: number = 0;
  private noProgress: boolean = false;
  private readonly updateThreshold: number = 100; // Update at most once per 100ms

  constructor(options: ProgressOptions) {
    this.total = options.total;
    this.noProgress = options.noProgress || false;
  }

  /**
   * Start the progress reporting
   */
  public start(): void {
    if (this.noProgress) {
      return;
    }

    this.startTime = Date.now();
    this.lastUpdateTime = this.startTime;
    this.current = 0;

    // Create progress bar with custom format
    this.progressBar = new cliProgress.SingleBar({
      format: 'Scanning |{bar}| {percentage}% | {value}/{total} files | ETA: {eta}s | {rate} files/s',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      clearOnComplete: true,
      stopOnComplete: true,
      etaBuffer: 50, // Use last 50 updates for ETA calculation
    }, cliProgress.Presets.shades_classic);

    this.progressBar.start(this.total, 0, {
      rate: 0,
      eta: 0
    });
  }

  /**
   * Update progress (throttled to updateThreshold)
   */
  public update(current?: number): void {
    const now = Date.now();
    
    if (current !== undefined) {
      this.current = current;
    } else {
      this.current++;
    }

    if (this.noProgress || !this.progressBar) {
      return;
    }
    
    // Throttle updates to avoid performance issues
    if (now - this.lastUpdateTime < this.updateThreshold && current !== this.total) {
      return;
    }

    const elapsedTime = (now - this.startTime) / 1000; // in seconds
    const rate = elapsedTime > 0 ? this.current / elapsedTime : 0;
    const eta = rate > 0 ? Math.ceil((this.total - this.current) / rate) : 0;

    this.progressBar.update(this.current, {
      rate: rate.toFixed(1),
      eta: eta
    });

    this.lastUpdateTime = now;
  }

  /**
   * Increment progress by 1
   */
  public increment(): void {
    this.update(this.current + 1);
  }

  /**
   * Complete the progress reporting
   */
  public complete(): void {
    if (this.noProgress || !this.progressBar) {
      return;
    }

    // Ensure we're at 100%
    this.progressBar.update(this.total);
    this.progressBar.stop();
    
    // Clear the progress bar from terminal
    if (process.stdout.isTTY) {
      process.stdout.write('\r\x1b[K'); // Clear current line
    }
    
    this.progressBar = null;
  }

  /**
   * Stop and clear the progress bar without completing
   */
  public stop(): void {
    if (this.noProgress || !this.progressBar) {
      return;
    }

    this.progressBar.stop();
    
    // Clear the progress bar from terminal
    if (process.stdout.isTTY) {
      process.stdout.write('\r\x1b[K'); // Clear current line
    }
    
    this.progressBar = null;
  }

  /**
   * Get current progress statistics
   */
  public getStats(): ProgressStats {
    const now = Date.now();
    const elapsedTime = (now - this.startTime) / 1000; // in seconds
    const rate = elapsedTime > 0 ? this.current / elapsedTime : 0;
    const eta = rate > 0 ? Math.ceil((this.total - this.current) / rate) : 0;
    const percentage = this.total > 0 ? Math.round((this.current / this.total) * 100) : 0;

    return {
      current: this.current,
      total: this.total,
      percentage,
      eta,
      elapsedTime,
      rate
    };
  }

  /**
   * Check if progress reporting is enabled
   */
  public isEnabled(): boolean {
    return !this.noProgress;
  }

  /**
   * Update the total number of items
   */
  public setTotal(total: number): void {
    this.total = total;
    if (this.progressBar && !this.noProgress) {
      this.progressBar.setTotal(total);
    }
  }
}

// Global progress reporter instance
export let progressReporter: ProgressReporter | null = null;

/**
 * Initialize global progress reporter
 */
export function initializeProgressReporter(options: ProgressOptions): ProgressReporter {
  progressReporter = new ProgressReporter(options);
  return progressReporter;
}

/**
 * Get the global progress reporter instance
 */
export function getProgressReporter(): ProgressReporter | null {
  return progressReporter;
}