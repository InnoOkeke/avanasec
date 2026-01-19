/**
 * Chardet Error Handler
 * Specific error handling and troubleshooting for chardet module issues
 */

import { ExitCode } from './exit-codes';

/**
 * Colors for console output
 */
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

/**
 * Display specific chardet error message
 */
export function displayChardetError(error: Error, context?: string): void {
  console.error(`${colors.red}${colors.bold}❌ Character Encoding Detection Error${colors.reset}`);
  console.error();
  console.error(`${colors.red}The chardet module failed to load or execute properly.${colors.reset}`);
  
  if (context) {
    console.error(`${colors.yellow}Context:${colors.reset} ${context}`);
  }
  
  console.error(`${colors.yellow}Error details:${colors.reset} ${error.message}`);
  console.error();
  
  console.error(`${colors.blue}${colors.bold}🔧 Quick Fixes:${colors.reset}`);
  console.error();
  console.error(`${colors.blue}1. Reinstall chardet module:${colors.reset}`);
  console.error(`   npm uninstall chardet`);
  console.error(`   npm install chardet`);
  console.error();
  console.error(`${colors.blue}2. Clear npm cache and reinstall:${colors.reset}`);
  console.error(`   npm cache clean --force`);
  console.error(`   npm install chardet`);
  console.error();
  console.error(`${colors.blue}3. Try a different chardet version:${colors.reset}`);
  console.error(`   npm install chardet@2.1.1`);
  console.error();
  console.error(`${colors.blue}4. Verify Node.js compatibility:${colors.reset}`);
  console.error(`   node --version  # Should be 18.0.0 or higher`);
  console.error();
  
  console.error(`${colors.yellow}${colors.bold}💡 About chardet:${colors.reset}`);
  console.error(`${colors.yellow}chardet is used for automatic character encoding detection.${colors.reset}`);
  console.error(`${colors.yellow}It helps Avana correctly read files with different text encodings.${colors.reset}`);
  console.error();
  
  console.error(`${colors.yellow}${colors.bold}🔍 Troubleshooting Steps:${colors.reset}`);
  console.error();
  console.error(`${colors.yellow}1. Check if chardet is installed:${colors.reset}`);
  console.error(`   npm list chardet`);
  console.error();
  console.error(`${colors.yellow}2. Test chardet directly:${colors.reset}`);
  console.error(`   node -e "console.log(require('chardet'))"`);
  console.error();
  console.error(`${colors.yellow}3. Check for native dependencies:${colors.reset}`);
  console.error(`   npm rebuild`);
  console.error();
  console.error(`${colors.yellow}4. If using Windows, ensure build tools are available:${colors.reset}`);
  console.error(`   npm install -g windows-build-tools`);
  console.error();
  
  console.error(`${colors.green}${colors.bold}✅ Workaround:${colors.reset}`);
  console.error(`${colors.green}Avana can continue without chardet using fallback encoding detection.${colors.reset}`);
  console.error(`${colors.green}Set DEBUG=1 to see encoding detection warnings.${colors.reset}`);
  console.error();
  
  console.error(`${colors.blue}${colors.bold}📞 Still need help?${colors.reset}`);
  console.error(`${colors.blue}Report this issue: https://github.com/innookeke/avanasec/issues${colors.reset}`);
  console.error(`${colors.blue}Include your Node.js version and operating system.${colors.reset}`);
  console.error();
}

/**
 * Handle chardet loading error with graceful fallback
 */
export function handleChardetLoadingError(error: Error): void {
  console.warn(`${colors.yellow}⚠️  Warning: chardet module could not be loaded${colors.reset}`);
  console.warn(`${colors.yellow}Falling back to basic encoding detection.${colors.reset}`);
  
  if (process.env.DEBUG) {
    console.warn(`${colors.yellow}Error details: ${error.message}${colors.reset}`);
    console.warn();
    console.warn(`${colors.blue}To fix this issue:${colors.reset}`);
    console.warn(`${colors.blue}Run: npm install chardet${colors.reset}`);
    console.warn();
  }
}

/**
 * Test chardet functionality
 */
export function testChardetFunctionality(): boolean {
  try {
    const chardet = require('chardet');
    
    // Test with a simple buffer
    const testBuffer = Buffer.from('Hello, world!', 'utf8');
    const result = chardet.detect(testBuffer);
    
    return typeof result === 'string' && result.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Display chardet status information
 */
export function displayChardetStatus(): void {
  console.log(`${colors.blue}${colors.bold}📊 Chardet Module Status${colors.reset}`);
  console.log();
  
  try {
    const chardet = require('chardet');
    console.log(`${colors.green}✅ chardet module: Available${colors.reset}`);
    
    // Test functionality
    const isWorking = testChardetFunctionality();
    if (isWorking) {
      console.log(`${colors.green}✅ chardet functionality: Working${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠️  chardet functionality: Limited${colors.reset}`);
    }
    
    // Show version if available
    try {
      const packageJson = require('chardet/package.json');
      console.log(`${colors.blue}ℹ️  chardet version: ${packageJson.version}${colors.reset}`);
    } catch (versionError) {
      console.log(`${colors.yellow}ℹ️  chardet version: Unknown${colors.reset}`);
    }
    
  } catch (error) {
    console.log(`${colors.red}❌ chardet module: Not available${colors.reset}`);
    console.log(`${colors.yellow}   Fallback encoding detection will be used${colors.reset}`);
    
    if (error instanceof Error) {
      console.log(`${colors.yellow}   Error: ${error.message}${colors.reset}`);
    }
  }
  
  console.log();
}

/**
 * Validate chardet installation and provide guidance
 */
export function validateChardetInstallation(): boolean {
  try {
    require('chardet');
    
    if (testChardetFunctionality()) {
      return true;
    } else {
      console.warn(`${colors.yellow}⚠️  chardet is installed but not functioning correctly${colors.reset}`);
      console.warn(`${colors.yellow}Consider reinstalling: npm install chardet${colors.reset}`);
      return false;
    }
  } catch (error) {
    console.warn(`${colors.yellow}⚠️  chardet is not installed or not accessible${colors.reset}`);
    console.warn(`${colors.green}Install with: npm install chardet${colors.reset}`);
    return false;
  }
}