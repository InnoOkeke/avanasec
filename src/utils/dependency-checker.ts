/**
 * Dependency Checker
 * Validates that all required dependencies are available and provides helpful error messages
 */

import { ExitCode } from './exit-codes';
import { displayChardetError, handleChardetLoadingError } from './chardet-error-handler';

/**
 * Required dependencies for Avana CLI
 */
const REQUIRED_DEPENDENCIES = [
  {
    name: 'chardet',
    description: 'Character encoding detection',
    installCommand: 'npm install chardet',
    usage: 'File encoding detection'
  },
  {
    name: 'cli-progress',
    description: 'Progress bar functionality',
    installCommand: 'npm install cli-progress',
    usage: 'Progress reporting during scans'
  },
  {
    name: 'iconv-lite',
    description: 'Character encoding conversion',
    installCommand: 'npm install iconv-lite',
    usage: 'File encoding conversion'
  },
  {
    name: 'minimatch',
    description: 'File pattern matching',
    installCommand: 'npm install minimatch',
    usage: 'Ignore pattern matching'
  }
];

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
 * Check if a dependency is available
 */
function isDependencyAvailable(dependencyName: string): boolean {
  try {
    require.resolve(dependencyName);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get missing dependencies
 */
export function getMissingDependencies(): string[] {
  return REQUIRED_DEPENDENCIES
    .filter(dep => !isDependencyAvailable(dep.name))
    .map(dep => dep.name);
}

/**
 * Check if all dependencies are available
 */
export function areAllDependenciesAvailable(): boolean {
  return getMissingDependencies().length === 0;
}

/**
 * Display detailed error message for missing dependencies
 */
export function displayDependencyError(missingDeps?: string[]): void {
  const missing = missingDeps || getMissingDependencies();
  
  if (missing.length === 0) {
    return;
  }

  console.error(`${colors.red}${colors.bold}❌ Missing Dependencies${colors.reset}`);
  console.error();
  console.error(`${colors.red}Avana CLI requires the following dependencies that are not installed:${colors.reset}`);
  console.error();

  // Show details for each missing dependency
  for (const depName of missing) {
    const dep = REQUIRED_DEPENDENCIES.find(d => d.name === depName);
    if (dep) {
      console.error(`${colors.red}📦 ${dep.name}${colors.reset}`);
      console.error(`   ${colors.yellow}Purpose:${colors.reset} ${dep.description}`);
      console.error(`   ${colors.yellow}Used for:${colors.reset} ${dep.usage}`);
      console.error(`   ${colors.green}Install:${colors.reset} ${dep.installCommand}`);
      console.error();
    }
  }

  console.error(`${colors.blue}${colors.bold}🔧 Quick Fix:${colors.reset}`);
  console.error();
  console.error(`${colors.blue}Install all missing dependencies at once:${colors.reset}`);
  console.error(`   npm install ${missing.join(' ')}`);
  console.error();
  
  console.error(`${colors.blue}${colors.bold}💡 Troubleshooting:${colors.reset}`);
  console.error();
  console.error(`${colors.blue}1. Make sure you're in the correct project directory${colors.reset}`);
  console.error(`${colors.blue}2. Try running: npm install${colors.reset}`);
  console.error(`${colors.blue}3. If using global installation: npm install -g avana-cli${colors.reset}`);
  console.error(`${colors.blue}4. Check your Node.js version: node --version (requires 18+)${colors.reset}`);
  console.error();
  
  console.error(`${colors.yellow}${colors.bold}📚 Need Help?${colors.reset}`);
  console.error(`${colors.yellow}Visit: https://github.com/innookeke/avana-cli#installation${colors.reset}`);
  console.error(`${colors.yellow}Report issues: https://github.com/innookeke/avana-cli/issues${colors.reset}`);
  console.error();
}

/**
 * Validate dependencies and exit if any are missing
 */
export function validateDependenciesOrExit(): void {
  const missing = getMissingDependencies();
  
  if (missing.length > 0) {
    displayDependencyError(missing);
    process.exit(ExitCode.INVALID_ARGUMENTS);
  }
}

/**
 * Safe require with error handling
 */
export function safeRequire<T = any>(moduleName: string): T | null {
  try {
    return require(moduleName);
  } catch (error) {
    return null;
  }
}

/**
 * Safe require with detailed error message
 */
export function safeRequireWithError<T = any>(moduleName: string, context?: string): T {
  try {
    return require(moduleName);
  } catch (error) {
    // Special handling for chardet
    if (moduleName === 'chardet' && error instanceof Error) {
      displayChardetError(error, context);
      process.exit(ExitCode.INVALID_ARGUMENTS);
    }
    
    const dep = REQUIRED_DEPENDENCIES.find(d => d.name === moduleName);
    
    console.error(`${colors.red}${colors.bold}❌ Module Loading Error${colors.reset}`);
    console.error();
    console.error(`${colors.red}Failed to load required module: ${moduleName}${colors.reset}`);
    
    if (context) {
      console.error(`${colors.yellow}Context:${colors.reset} ${context}`);
    }
    
    if (dep) {
      console.error(`${colors.yellow}Purpose:${colors.reset} ${dep.description}`);
      console.error(`${colors.green}Install:${colors.reset} ${dep.installCommand}`);
    }
    
    console.error();
    console.error(`${colors.blue}${colors.bold}🔧 Quick Fix:${colors.reset}`);
    console.error(`${colors.blue}Run: npm install ${moduleName}${colors.reset}`);
    console.error();
    
    if (error instanceof Error) {
      console.error(`${colors.yellow}Technical details:${colors.reset} ${error.message}`);
    }
    
    process.exit(ExitCode.INVALID_ARGUMENTS);
  }
}

/**
 * Check specific dependency with context
 */
export function checkDependency(moduleName: string, context: string): boolean {
  if (!isDependencyAvailable(moduleName)) {
    const dep = REQUIRED_DEPENDENCIES.find(d => d.name === moduleName);
    
    console.error(`${colors.red}${colors.bold}❌ Dependency Missing${colors.reset}`);
    console.error();
    console.error(`${colors.red}Required module not found: ${moduleName}${colors.reset}`);
    console.error(`${colors.yellow}Needed for:${colors.reset} ${context}`);
    
    if (dep) {
      console.error(`${colors.yellow}Purpose:${colors.reset} ${dep.description}`);
      console.error(`${colors.green}Install:${colors.reset} ${dep.installCommand}`);
    }
    
    console.error();
    return false;
  }
  
  return true;
}

/**
 * Display general troubleshooting information
 */
export function displayTroubleshootingInfo(): void {
  console.error(`${colors.blue}${colors.bold}🔍 General Troubleshooting${colors.reset}`);
  console.error();
  console.error(`${colors.blue}If you're experiencing issues with Avana CLI:${colors.reset}`);
  console.error();
  console.error(`${colors.blue}1. Verify installation:${colors.reset}`);
  console.error(`   npm list avana-cli`);
  console.error();
  console.error(`${colors.blue}2. Reinstall the package:${colors.reset}`);
  console.error(`   npm uninstall avana-cli`);
  console.error(`   npm install avana-cli`);
  console.error();
  console.error(`${colors.blue}3. Clear npm cache:${colors.reset}`);
  console.error(`   npm cache clean --force`);
  console.error();
  console.error(`${colors.blue}4. Check Node.js version:${colors.reset}`);
  console.error(`   node --version  # Should be 18.0.0 or higher`);
  console.error();
  console.error(`${colors.blue}5. Update npm:${colors.reset}`);
  console.error(`   npm install -g npm@latest`);
  console.error();
  console.error(`${colors.yellow}${colors.bold}📞 Still need help?${colors.reset}`);
  console.error(`${colors.yellow}Create an issue: https://github.com/innookeke/avana-cli/issues${colors.reset}`);
  console.error(`${colors.yellow}Include your Node.js version and the full error message.${colors.reset}`);
  console.error();
}