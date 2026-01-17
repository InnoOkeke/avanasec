/**
 * Memory Manager
 * Monitors and manages memory usage during scanning operations
 */

export interface MemoryStats {
  currentUsage: number;
  maxUsage: number;
  gcCount: number;
  limit: number;
}

export class MemoryManager {
  private maxUsage: number = 0;
  private gcCount: number = 0;
  private readonly limit: number;
  private readonly gcThreshold: number;

  constructor(limitMB: number = 500) {
    this.limit = limitMB * 1024 * 1024; // Convert MB to bytes
    this.gcThreshold = limitMB * 0.8 * 1024 * 1024; // 80% of limit
  }

  /**
   * Get current memory usage in bytes without updating maxUsage
   */
  private getCurrentUsageRaw(): number {
    const memUsage = process.memoryUsage();
    return memUsage.heapUsed;
  }

  /**
   * Get current memory usage in bytes
   */
  public getCurrentUsage(): number {
    const currentUsage = this.getCurrentUsageRaw();
    
    // Track maximum usage
    if (currentUsage > this.maxUsage) {
      this.maxUsage = currentUsage;
    }

    return currentUsage;
  }

  /**
   * Check if memory usage is within limits
   * Returns true if within limits, false if exceeded
   */
  public checkLimit(): boolean {
    const currentUsage = this.getCurrentUsage();
    
    // Trigger GC if approaching threshold
    if (currentUsage > this.gcThreshold) {
      this.triggerGC();
    }

    return currentUsage <= this.limit;
  }

  /**
   * Manually trigger garbage collection
   */
  public triggerGC(): void {
    if (global.gc) {
      global.gc();
      this.gcCount++;
    } else {
      // If --expose-gc flag not used, we can't force GC
      // But we can suggest it by creating memory pressure
      const before = this.getCurrentUsage();
      
      // Create some temporary objects to trigger natural GC
      const temp = new Array(1000).fill(null).map(() => ({ data: new Array(100) }));
      temp.length = 0; // Clear reference
      
      const after = this.getCurrentUsage();
      if (after < before) {
        this.gcCount++;
      }
    }
  }

  /**
   * Get comprehensive memory statistics
   */
  public getStats(): MemoryStats {
    const currentUsage = this.getCurrentUsageRaw();
    
    // Update maxUsage if needed
    if (currentUsage > this.maxUsage) {
      this.maxUsage = currentUsage;
    }
    
    return {
      currentUsage,
      maxUsage: this.maxUsage,
      gcCount: this.gcCount,
      limit: this.limit
    };
  }

  /**
   * Format memory size in human-readable format
   */
  public formatMemorySize(bytes: number): string {
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
   * Get memory usage percentage
   */
  public getUsagePercentage(): number {
    const currentUsage = this.getCurrentUsage();
    const percentage = (currentUsage / this.limit) * 100;
    // Cap at 100% for display purposes
    return Math.min(Math.round(percentage), 100);
  }

  /**
   * Check if memory usage is approaching the limit
   */
  public isApproachingLimit(): boolean {
    const currentUsage = this.getCurrentUsage();
    return currentUsage > this.gcThreshold;
  }

  /**
   * Reset statistics (useful for testing)
   */
  public reset(): void {
    this.maxUsage = 0;
    this.gcCount = 0;
    // Note: We can't reset actual memory usage, only our tracking
  }

  /**
   * Create a memory checkpoint for monitoring
   */
  public createCheckpoint(label: string): MemoryCheckpoint {
    return new MemoryCheckpoint(label, this.getCurrentUsage());
  }
}

/**
 * Memory checkpoint for tracking memory usage at specific points
 */
export class MemoryCheckpoint {
  public readonly label: string;
  public readonly startUsage: number;
  public readonly timestamp: number;

  constructor(label: string, startUsage: number) {
    this.label = label;
    this.startUsage = startUsage;
    this.timestamp = Date.now();
  }

  /**
   * Calculate memory difference since checkpoint
   */
  public getDifference(currentUsage: number): number {
    return currentUsage - this.startUsage;
  }

  /**
   * Get duration since checkpoint in milliseconds
   */
  public getDuration(): number {
    return Date.now() - this.timestamp;
  }
}

// Global memory manager instance
export const memoryManager = new MemoryManager();