/**
 * Avanasec CLI - Troubleshoot Command
 * Provides comprehensive troubleshooting information and diagnostics
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import { displayChardetStatus, validateChardetInstallation } from '../utils/chardet-error-handler';
import { getMissingDependencies, areAllDependenciesAvailable } from '../utils/dependency-checker';
import { ExitCode } from '../utils/exit-codes';

/**
 * Colors for console output
 */
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

/**
 * Get system information
 */
function getSystemInfo() {
  const nodeVersion = process.version;
  const platform = os.platform();
  const arch = os.arch();
  const osRelease = os.release();
  const totalMemory = Math.round(os.totalmem() / 1024 / 1024 / 1024);
  
  return {
    nodeVersion,
    platform,
    arch,
    osRelease,
    totalMemory
  };
}

/**
 * Get npm information
 */
function getNpmInfo() {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
    const npmPrefix = execSync('npm config get prefix', { encoding: 'utf-8' }).trim();
    
    return {
      version: npmVersion,
      prefix: npmPrefix,
      available: true
    };
  } catch (error) {
    return {
      version: 'Unknown',
      prefix: 'Unknown',
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check Avana installation
 */
function checkAvanaInstallation() {
  try {
    // Check if we can find package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    let packageInfo = null;
    
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        packageInfo = {
          name: packageJson.name,
          version: packageJson.version,
          isAvanasec: packageJson.name === 'avanasec'
        };
      } catch (parseError) {
        packageInfo = { error: 'Could not parse package.json' };
      }
    }
    
    // Check global installation
    let globalInstallation = null;
    try {
      const globalList = execSync('npm list -g avanasec --depth=0', { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      globalInstallation = { installed: true, info: globalList.trim() };
    } catch (error) {
      globalInstallation = { installed: false };
    }
    
    return {
      packageInfo,
      globalInstallation
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check file permissions
 */
function checkFilePermissions() {
  const testPaths = [
    process.cwd(),
    os.tmpdir(),
    path.join(os.homedir(), '.npm')
  ];
  
  const results = testPaths.map(testPath => {
    try {
      // Test read access
      fs.accessSync(testPath, fs.constants.R_OK);
      
      // Test write access
      fs.accessSync(testPath, fs.constants.W_OK);
      
      return {
        path: testPath,
        readable: true,
        writable: true,
        error: null
      };
    } catch (error) {
      return {
        path: testPath,
        readable: false,
        writable: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });
  
  return results;
}

/**
 * Display system diagnostics
 */
function displaySystemDiagnostics() {
  console.log(`${colors.cyan}${colors.bold}🖥️  System Information${colors.reset}`);
  console.log();
  
  const systemInfo = getSystemInfo();
  console.log(`${colors.blue}Operating System:${colors.reset} ${systemInfo.platform} ${systemInfo.arch} (${systemInfo.osRelease})`);
  console.log(`${colors.blue}Node.js Version:${colors.reset} ${systemInfo.nodeVersion}`);
  console.log(`${colors.blue}Total Memory:${colors.reset} ${systemInfo.totalMemory} GB`);
  
  // Check Node.js version compatibility
  const majorVersion = parseInt(systemInfo.nodeVersion.split('.')[0].substring(1));
  if (majorVersion < 18) {
    console.log(`${colors.red}⚠️  Node.js version ${systemInfo.nodeVersion} is below minimum required (18+)${colors.reset}`);
    console.log(`${colors.yellow}   Update Node.js: https://nodejs.org/${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ Node.js version is compatible${colors.reset}`);
  }
  
  console.log();
}

/**
 * Display npm diagnostics
 */
function displayNpmDiagnostics() {
  console.log(`${colors.cyan}${colors.bold}📦 npm Information${colors.reset}`);
  console.log();
  
  const npmInfo = getNpmInfo();
  
  if (npmInfo.available) {
    console.log(`${colors.blue}npm Version:${colors.reset} ${npmInfo.version}`);
    console.log(`${colors.blue}npm Prefix:${colors.reset} ${npmInfo.prefix}`);
    console.log(`${colors.green}✅ npm is available${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ npm is not available${colors.reset}`);
    if (npmInfo.error) {
      console.log(`${colors.yellow}Error: ${npmInfo.error}${colors.reset}`);
    }
    console.log(`${colors.yellow}Install npm: https://www.npmjs.com/get-npm${colors.reset}`);
  }
  
  console.log();
}

/**
 * Display Avana installation diagnostics
 */
function displayAvanaDiagnostics() {
  console.log(`${colors.cyan}${colors.bold}🔒 Avana Installation${colors.reset}`);
  console.log();
  
  const installation = checkAvanaInstallation();
  
  if (installation.packageInfo) {
    if (installation.packageInfo.isAvanasec) {
      console.log(`${colors.green}✅ Running from Avanasec source directory${colors.reset}`);
      console.log(`${colors.blue}Version:${colors.reset} ${installation.packageInfo.version}`);
    } else if (installation.packageInfo.name) {
      console.log(`${colors.yellow}ℹ️  Running from ${installation.packageInfo.name} directory${colors.reset}`);
    }
  }
  
  if (installation.globalInstallation) {
    if (installation.globalInstallation.installed) {
      console.log(`${colors.green}✅ Avanasec is installed globally${colors.reset}`);
    } else {
      console.log(`${colors.yellow}ℹ️  Avanasec is not installed globally${colors.reset}`);
      console.log(`${colors.blue}Install globally: npm install -g avanasec${colors.reset}`);
    }
  }
  
  console.log();
}

/**
 * Display dependency diagnostics
 */
function displayDependencyDiagnostics() {
  console.log(`${colors.cyan}${colors.bold}📚 Dependencies${colors.reset}`);
  console.log();
  
  const allAvailable = areAllDependenciesAvailable();
  const missing = getMissingDependencies();
  
  if (allAvailable) {
    console.log(`${colors.green}✅ All required dependencies are available${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Missing dependencies: ${missing.join(', ')}${colors.reset}`);
    console.log(`${colors.blue}Install missing: npm install ${missing.join(' ')}${colors.reset}`);
  }
  
  console.log();
  
  // Specific chardet diagnostics
  displayChardetStatus();
}

/**
 * Display file permission diagnostics
 */
function displayPermissionDiagnostics() {
  console.log(`${colors.cyan}${colors.bold}🔐 File Permissions${colors.reset}`);
  console.log();
  
  const permissions = checkFilePermissions();
  
  for (const perm of permissions) {
    if (perm.readable && perm.writable) {
      console.log(`${colors.green}✅ ${perm.path}: Read/Write OK${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ ${perm.path}: Permission issues${colors.reset}`);
      if (perm.error) {
        console.log(`${colors.yellow}   Error: ${perm.error}${colors.reset}`);
      }
    }
  }
  
  console.log();
}

/**
 * Display common troubleshooting steps
 */
function displayTroubleshootingSteps() {
  console.log(`${colors.cyan}${colors.bold}🔧 Common Troubleshooting Steps${colors.reset}`);
  console.log();
  
  console.log(`${colors.blue}${colors.bold}1. Reinstall Avanasecsec CLI:${colors.reset}`);
  console.log(`   npm uninstall -g avanasec`);
  console.log(`   npm install -g avanasec`);
  console.log();
  
  console.log(`${colors.blue}${colors.bold}2. Clear npm cache:${colors.reset}`);
  console.log(`   npm cache clean --force`);
  console.log();
  
  console.log(`${colors.blue}${colors.bold}3. Rebuild native dependencies:${colors.reset}`);
  console.log(`   npm rebuild`);
  console.log();
  
  console.log(`${colors.blue}${colors.bold}4. Update npm to latest version:${colors.reset}`);
  console.log(`   npm install -g npm@latest`);
  console.log();
  
  console.log(`${colors.blue}${colors.bold}5. Check for conflicting installations:${colors.reset}`);
  console.log(`   npm list -g avanasec`);
  console.log(`   which avanasec  # On Unix-like systems`);
  console.log(`   where avanasec  # On Windows`);
  console.log();
  
  console.log(`${colors.blue}${colors.bold}6. Verify PATH environment variable:${colors.reset}`);
  console.log(`   echo $PATH  # On Unix-like systems`);
  console.log(`   echo %PATH%  # On Windows`);
  console.log();
}

/**
 * Display support information
 */
function displaySupportInfo() {
  console.log(`${colors.cyan}${colors.bold}📞 Getting Help${colors.reset}`);
  console.log();
  
  console.log(`${colors.blue}${colors.bold}Documentation:${colors.reset}`);
  console.log(`   https://github.com/innookeke/avanasec#readme`);
  console.log();
  
  console.log(`${colors.blue}${colors.bold}Report Issues:${colors.reset}`);
  console.log(`   https://github.com/innookeke/avanasec/issues`);
  console.log();
  
  console.log(`${colors.blue}${colors.bold}When reporting issues, please include:${colors.reset}`);
  console.log(`   • Your operating system and version`);
  console.log(`   • Node.js version (node --version)`);
  console.log(`   • npm version (npm --version)`);
  console.log(`   • Complete error message`);
  console.log(`   • Steps to reproduce the issue`);
  console.log();
  
  console.log(`${colors.blue}${colors.bold}Quick Test Command:${colors.reset}`);
  console.log(`   avanasec --help`);
  console.log();
}

/**
 * Main troubleshoot command
 */
export async function troubleshootCommand(): Promise<void> {
  console.log(`${colors.bold}${colors.cyan}🔍 Avanasec CLI Troubleshooting${colors.reset}`);
  console.log();
  
  try {
    displaySystemDiagnostics();
    displayNpmDiagnostics();
    displayAvanaDiagnostics();
    displayDependencyDiagnostics();
    displayPermissionDiagnostics();
    displayTroubleshootingSteps();
    displaySupportInfo();
    
    console.log(`${colors.green}${colors.bold}✅ Troubleshooting diagnostics complete${colors.reset}`);
    console.log();
    
    process.exit(ExitCode.SUCCESS);
  } catch (error) {
    console.error(`${colors.red}❌ Error running troubleshooting diagnostics:${colors.reset}`);
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(ExitCode.UNEXPECTED_ERROR);
  }
}
