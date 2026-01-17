/**
 * Parallel Scanner Worker
 * Worker thread script for parallel file scanning
 */

import { parentPort, workerData } from 'worker_threads';
import { SecretScanner } from '../scanners/secret-scanner';

export interface WorkerData {
  files: string[];
  patterns: any[];
  ignorePatterns: string[];
}

export interface WorkerMessage {
  type: 'result' | 'error' | 'complete';
  data?: {
    file: string;
    issues: any[];
    error?: string;
  };
  error?: string;
}

if (parentPort) {
  try {
    const { files, patterns, ignorePatterns } = workerData as WorkerData;
    
    const scanner = new SecretScanner();
    
    // Process each file
    for (const file of files) {
      try {
        // Pass patterns to scanFile method (synchronous)
        const issues = scanner.scanFile(file, patterns);
        
        parentPort.postMessage({
          type: 'result',
          data: {
            file,
            issues
          }
        } as WorkerMessage);
      } catch (error) {
        parentPort.postMessage({
          type: 'result',
          data: {
            file,
            issues: [],
            error: error instanceof Error ? error.message : String(error)
          }
        } as WorkerMessage);
      }
    }
    
    // Signal completion
    parentPort.postMessage({
      type: 'complete'
    } as WorkerMessage);
    
  } catch (error) {
    if (parentPort) {
      parentPort.postMessage({
        type: 'error',
        error: error instanceof Error ? error.message : String(error)
      } as WorkerMessage);
    }
  }
}