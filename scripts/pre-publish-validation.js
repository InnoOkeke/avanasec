#!/usr/bin/env node

/**
 * Pre-Publish Validation Script
 * Tests the built package in a clean environment before publishing to npm.
 * This script creates a temporary directory, installs the package, and tests functionality.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawn } = require('child_process');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

/**
 * Create a temporary directory for testing
 */
function createTempDirectory() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'avana-pre-publish-'));
  logInfo(`Created temporary directory: ${tempDir}`);
  return tempDir;
}

/**
 * Clean up temporary directory
 */
function cleanupTempDirectory(tempDir) {
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    logInfo(`Cleaned up temporary directory: ${tempDir}`);
  } catch (error) {
    logWarning(`Failed to cleanup temporary directory: ${error.message}`);
  }
}

/**
 * Create a tarball of the current package
 */
function createPackageTarball() {
  logInfo('Creating package tarball...');
  
  try {
    const output = execSync('npm pack', { 
      encoding: 'utf-8',
      cwd: process.cwd()
    });
    
    // Extract tarball name from output (last line that ends with .tgz)
    const lines = output.trim().split('\n');
    let tarballName = null;
    
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.endsWith('.tgz')) {
        tarballName = line;
        break;
      }
    }
    
    if (!tarballName) {
      throw new Error('Could not find tarball name in npm pack output');
    }
    
    const tarballPath = path.join(process.cwd(), tarballName);
    
    if (!fs.existsSync(tarballPath)) {
      throw new Error(`Tarball not found: ${tarballPath}`);
    }
    
    logSuccess(`Created tarball: ${tarballName}`);
    return { name: tarballName, path: tarballPath };
  } catch (error) {
    logError(`Failed to create tarball: ${error.message}`);
    throw error;
  }
}

/**
 * Install the package in the temporary directory
 */
function installPackageInTempDir(tempDir, tarballPath) {
  logInfo('Installing package in clean environment...');
  
  try {
    // Initialize a new npm project
    const packageJsonContent = {
      name: 'avana-test-env',
      version: '1.0.0',
      description: 'Test environment for avana-cli',
      private: true
    };
    
    fs.writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify(packageJsonContent, null, 2)
    );
    
    // Install the tarball
    execSync(`npm install "${tarballPath}"`, {
      cwd: tempDir,
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    logSuccess('Package installed successfully in clean environment');
    return true;
  } catch (error) {
    logError(`Failed to install package: ${error.message}`);
    return false;
  }
}

/**
 * Test that the binary is accessible after installation
 */
function testBinaryAccessibility(tempDir) {
  logInfo('Testing binary accessibility...');
  
  try {
    // Test using npx
    const helpOutput = execSync('npx avana --help', {
      cwd: tempDir,
      encoding: 'utf-8',
      timeout: 10000
    });
    
    if (helpOutput.includes('Avana CLI') && helpOutput.includes('Usage:')) {
      logSuccess('Binary is accessible via npx and shows help correctly');
      return true;
    } else {
      logError('Binary help output is incorrect');
      return false;
    }
  } catch (error) {
    logError(`Binary accessibility test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test that all dependencies are installed correctly
 */
function testDependencyInstallation(tempDir) {
  logInfo('Testing dependency installation...');
  
  const nodeModulesPath = path.join(tempDir, 'node_modules');
  const avanaPath = path.join(nodeModulesPath, 'avana-cli');
  const avanaNodeModulesPath = path.join(avanaPath, 'node_modules');
  
  if (!fs.existsSync(avanaPath)) {
    logError('avana-cli not found in node_modules');
    return false;
  }
  
  const requiredDependencies = [
    'chardet',
    'cli-progress',
    'iconv-lite',
    'minimatch',
    'husky'
  ];
  
  let allDepsInstalled = true;
  
  for (const dep of requiredDependencies) {
    // Check if dependency exists in main node_modules or avana's node_modules
    const mainDepPath = path.join(nodeModulesPath, dep);
    const avanaDepPath = path.join(avanaNodeModulesPath, dep);
    
    if (fs.existsSync(mainDepPath) || fs.existsSync(avanaDepPath)) {
      logSuccess(`Dependency installed: ${dep}`);
    } else {
      logError(`Dependency missing: ${dep}`);
      allDepsInstalled = false;
    }
  }
  
  return allDepsInstalled;
}

/**
 * Test basic functionality of the installed package
 */
function testBasicFunctionality(tempDir) {
  logInfo('Testing basic functionality...');
  
  try {
    // Create a test file with a fake secret
    const testFilePath = path.join(tempDir, 'test-file.js');
    fs.writeFileSync(testFilePath, `
// This is a test file
const apiKey = "test-key-12345";
console.log("Hello world");
`);
    
    // Run a scan on the test file
    const scanOutput = execSync('npx avana scan --path . --quiet', {
      cwd: tempDir,
      encoding: 'utf-8',
      timeout: 15000
    });
    
    // The scan should complete (even if it finds issues)
    logSuccess('Basic scan functionality works');
    
    // Test help command
    const helpOutput = execSync('npx avana --help', {
      cwd: tempDir,
      encoding: 'utf-8',
      timeout: 5000
    });
    
    if (helpOutput.includes('Usage:')) {
      logSuccess('Help command works correctly');
      return true;
    } else {
      logError('Help command output is incorrect');
      return false;
    }
    
  } catch (error) {
    // Scan might exit with code 1 if issues are found, which is expected
    if (error.status === 1) {
      logSuccess('Basic scan functionality works (found issues as expected)');
      return true;
    } else {
      logError(`Basic functionality test failed: ${error.message}`);
      return false;
    }
  }
}

/**
 * Test that the package works with different Node.js versions (if available)
 */
function testNodeVersionCompatibility(tempDir) {
  logInfo('Testing Node.js version compatibility...');
  
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
    
    if (majorVersion < 18) {
      logWarning(`Node.js version ${nodeVersion} is below minimum required (18+)`);
      return false;
    } else {
      logSuccess(`Node.js version ${nodeVersion} is compatible`);
      return true;
    }
  } catch (error) {
    logWarning(`Could not determine Node.js version: ${error.message}`);
    return true; // Don't fail the validation for this
  }
}

/**
 * Validate package.json fields for npm publishing
 */
function validatePackageJsonForPublishing() {
  logInfo('Validating package.json for publishing...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const requiredFields = [
    'name',
    'version',
    'description',
    'main',
    'bin',
    'keywords',
    'author',
    'license',
    'repository',
    'bugs',
    'homepage'
  ];
  
  let allFieldsValid = true;
  
  for (const field of requiredFields) {
    if (!packageJson[field]) {
      logError(`Missing required field in package.json: ${field}`);
      allFieldsValid = false;
    } else {
      logSuccess(`Required field present: ${field}`);
    }
  }
  
  // Check version format
  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (!versionRegex.test(packageJson.version)) {
    logError(`Invalid version format: ${packageJson.version}`);
    allFieldsValid = false;
  } else {
    logSuccess(`Version format valid: ${packageJson.version}`);
  }
  
  return allFieldsValid;
}

/**
 * Main pre-publish validation function
 */
async function prePublishValidation() {
  log(`${colors.bold}🚀 Pre-Publish Validation Starting...${colors.reset}`);
  console.log();

  let tempDir = null;
  let tarball = null;
  
  try {
    // Step 1: Validate package.json
    console.log();
    log(`${colors.bold}--- Package.json Validation ---${colors.reset}`);
    const packageJsonValid = validatePackageJsonForPublishing();
    
    if (!packageJsonValid) {
      logError('Package.json validation failed. Fix issues before publishing.');
      process.exit(1);
    }
    
    // Step 2: Create tarball
    console.log();
    log(`${colors.bold}--- Creating Package Tarball ---${colors.reset}`);
    tarball = createPackageTarball();
    
    // Step 3: Create temp directory
    console.log();
    log(`${colors.bold}--- Setting Up Test Environment ---${colors.reset}`);
    tempDir = createTempDirectory();
    
    // Step 4: Install package
    console.log();
    log(`${colors.bold}--- Installing Package ---${colors.reset}`);
    const installSuccess = installPackageInTempDir(tempDir, tarball.path);
    
    if (!installSuccess) {
      logError('Package installation failed');
      process.exit(1);
    }
    
    // Step 5: Test binary accessibility
    console.log();
    log(`${colors.bold}--- Testing Binary Accessibility ---${colors.reset}`);
    const binaryAccessible = testBinaryAccessibility(tempDir);
    
    // Step 6: Test dependencies
    console.log();
    log(`${colors.bold}--- Testing Dependencies ---${colors.reset}`);
    const depsInstalled = testDependencyInstallation(tempDir);
    
    // Step 7: Test basic functionality
    console.log();
    log(`${colors.bold}--- Testing Basic Functionality ---${colors.reset}`);
    const functionalityWorks = testBasicFunctionality(tempDir);
    
    // Step 8: Test Node.js compatibility
    console.log();
    log(`${colors.bold}--- Testing Node.js Compatibility ---${colors.reset}`);
    const nodeCompatible = testNodeVersionCompatibility(tempDir);
    
    // Summary
    console.log();
    log(`${colors.bold}📊 Pre-Publish Validation Summary${colors.reset}`);
    console.log();
    
    const results = [
      { name: 'Package.json Validation', passed: packageJsonValid },
      { name: 'Binary Accessibility', passed: binaryAccessible },
      { name: 'Dependency Installation', passed: depsInstalled },
      { name: 'Basic Functionality', passed: functionalityWorks },
      { name: 'Node.js Compatibility', passed: nodeCompatible }
    ];
    
    let allPassed = true;
    for (const result of results) {
      if (result.passed) {
        logSuccess(`${result.name}: PASSED`);
      } else {
        logError(`${result.name}: FAILED`);
        allPassed = false;
      }
    }
    
    console.log();
    if (allPassed) {
      log(`${colors.bold}${colors.green}🎉 All pre-publish validations passed! Package is ready for publishing.${colors.reset}`);
      console.log();
      logInfo('To publish the package, run:');
      logInfo('  npm publish');
      process.exit(0);
    } else {
      log(`${colors.bold}${colors.red}💥 Some pre-publish validations failed. Please fix the issues before publishing.${colors.reset}`);
      process.exit(1);
    }
    
  } catch (error) {
    logError(`Pre-publish validation error: ${error.message}`);
    process.exit(1);
  } finally {
    // Cleanup
    if (tempDir) {
      cleanupTempDirectory(tempDir);
    }
    
    if (tarball && fs.existsSync(tarball.path)) {
      try {
        fs.unlinkSync(tarball.path);
        logInfo(`Cleaned up tarball: ${tarball.name}`);
      } catch (error) {
        logWarning(`Failed to cleanup tarball: ${error.message}`);
      }
    }
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  prePublishValidation().catch(error => {
    logError(`Pre-publish validation script error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  prePublishValidation,
  createPackageTarball,
  installPackageInTempDir,
  testBinaryAccessibility,
  testDependencyInstallation,
  testBasicFunctionality,
  validatePackageJsonForPublishing
};