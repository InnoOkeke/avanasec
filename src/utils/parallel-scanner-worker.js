/**
 * Parallel Scanner Worker
 * Worker thread script for parallel file scanning
 */

const { parentPort, workerData } = require('worker_threads');
const path = require('path');

if (parentPort) {
  (async () => {
    try {
      const { files, patterns, ignorePatterns } = workerData;
      
      // Import the scanner (using dynamic import for ES modules)
      const scannerModule = await import('../scanners/secret-scanner.js');
      const { SecretScanner } = scannerModule;
      
      const scanner = new SecretScanner();
      
      // Process each file
      for (const file of files) {
        try {
          // Pass patterns to scanFile method
          const issues = scanner.scanFile(file, patterns);
          
          parentPort.postMessage({
            type: 'result',
            data: {
              file,
              issues
            }
          });
        } catch (error) {
          parentPort.postMessage({
            type: 'result',
            data: {
              file,
              issues: [],
              error: error instanceof Error ? error.message : String(error)
            }
          });
        }
      }
      
      // Signal completion
      parentPort.postMessage({
        type: 'complete'
      });
      
    } catch (error) {
      parentPort.postMessage({
        type: 'error',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  })();
}