#!/usr/bin/env node

/**
 * Build Validation Script
 * Validates that the built package has all dependencies resolved,
 * all imported modules exist, and binary configuration is correct.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
 * Check if the dist directory exists and has required files
 */
function validateDistDirectory() {
  logInfo('Validating dist directory...');
  
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    logError('dist directory does not exist. Run "npm run build" first.');
    return false;
  }

  const requiredFiles = [
    'cli.js',
    'index.js',
    'index.d.ts'
  ];

  let allFilesExist = true;
  for (const file of requiredFiles) {
    const filePath = path.join(distPath, file);
    if (!fs.existsSync(filePath)) {
      logError(`Required file missing: dist/${file}`);
      allFilesExist = false;
    } else {
      logSuccess(`Found required file: dist/${file}`);
    }
  }

  return allFilesExist;
}

/**
 * Validate binary configuration in package.json
 */
function validateBinaryConfiguration() {
  logInfo('Validating binary configuration...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    logError('package.json not found');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  // Check bin field
  if (!packageJson.bin) {
    logError('No "bin" field found in package.json');
    return false;
  }

  if (!packageJson.bin.avana) {
    logError('No "avana" binary defined in package.json');
    return false;
  }

  const binaryPath = packageJson.bin.avana;
  const fullBinaryPath = path.join(process.cwd(), binaryPath);
  
  if (!fs.existsSync(fullBinaryPath)) {
    logError(`Binary file does not exist: ${binaryPath}`);
    return false;
  }

  logSuccess(`Binary configuration valid: ${binaryPath}`);

  // Check if binary has shebang
  const binaryContent = fs.readFileSync(fullBinaryPath, 'utf-8');
  if (!binaryContent.startsWith('#!/usr/bin/env node')) {
    logError('Binary file missing shebang: #!/usr/bin/env node');
    return false;
  }

  logSuccess('Binary has correct shebang');
  return true;
}

/**
 * Check that all dependencies are properly declared
 */
function validateDependencies() {
  logInfo('Validating dependencies...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const requiredDependencies = [
    'chardet',
    'cli-progress',
    'iconv-lite',
    'minimatch',
    'husky'
  ];

  let allDepsValid = true;
  for (const dep of requiredDependencies) {
    if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
      logError(`Missing dependency: ${dep}`);
      allDepsValid = false;
    } else {
      logSuccess(`Dependency declared: ${dep}@${packageJson.dependencies[dep]}`);
    }
  }

  return allDepsValid;
}

/**
 * Check that all imported modules can be resolved
 */
function validateModuleResolution() {
  logInfo('Validating module resolution...');
  
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    logError('node_modules directory not found. Run "npm install" first.');
    return false;
  }

  const requiredModules = [
    'chardet',
    'cli-progress',
    'iconv-lite',
    'minimatch'
  ];

  let allModulesResolved = true;
  for (const module of requiredModules) {
    try {
      require.resolve(module);
      logSuccess(`Module resolved: ${module}`);
    } catch (error) {
      logError(`Cannot resolve module: ${module}`);
      allModulesResolved = false;
    }
  }

  return allModulesResolved;
}

/**
 * Test that the built CLI can be executed
 */
function validateBinaryExecution() {
  logInfo('Validating binary execution...');
  
  try {
    // Test help command
    const helpOutput = execSync('node dist/cli.js --help', { 
      encoding: 'utf-8',
      timeout: 10000 
    });
    
    if (helpOutput.includes('Avana CLI') && helpOutput.includes('Usage:')) {
      logSuccess('Binary executes and shows help correctly');
    } else {
      logError('Binary help output is incorrect');
      return false;
    }

    // Test that binary doesn't crash on basic execution
    try {
      execSync('node dist/cli.js scan --path /nonexistent --quiet', { 
        encoding: 'utf-8',
        timeout: 5000,
        stdio: 'pipe'
      });
    } catch (error) {
      // Expected to fail with non-zero exit code, but shouldn't crash
      if (error.status !== undefined) {
        logSuccess('Binary handles invalid paths gracefully');
      } else {
        logError('Binary crashed unexpectedly');
        return false;
      }
    }

    return true;
  } catch (error) {
    logError(`Binary execution failed: ${error.message}`);
    return false;
  }
}

/**
 * Test that all core modules can be loaded
 */
function validateModuleLoading() {
  logInfo('Validating module loading...');
  
  const testModules = [
    { path: path.join(process.cwd(), 'dist/index.js'), name: 'Main Avana module' },
    { path: path.join(process.cwd(), 'dist/utils/file-type-detector.js'), name: 'FileTypeDetector' },
    { path: path.join(process.cwd(), 'dist/scanners/secret-scanner.js'), name: 'SecretScanner' },
    { path: path.join(process.cwd(), 'dist/utils/progress-reporter.js'), name: 'ProgressReporter' },
    { path: path.join(process.cwd(), 'dist/utils/ignore-pattern-manager.js'), name: 'IgnorePatternManager' }
  ];

  let allModulesLoad = true;
  for (const module of testModules) {
    try {
      require(module.path);
      logSuccess(`Module loads: ${module.name}`);
    } catch (error) {
      logError(`Module failed to load: ${module.name} - ${error.message}`);
      allModulesLoad = false;
    }
  }

  return allModulesLoad;
}

/**
 * Validate files field in package.json
 */
function validateFilesField() {
  logInfo('Validating files field in package.json...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  if (!packageJson.files || !Array.isArray(packageJson.files)) {
    logError('No "files" field found in package.json or it is not an array');
    return false;
  }

  const requiredIncludes = ['dist'];
  const recommendedIncludes = ['README.md', 'LICENSE', 'CHANGELOG.md'];
  
  let isValid = true;
  
  // Check required includes
  for (const include of requiredIncludes) {
    if (!packageJson.files.includes(include) && !packageJson.files.some(f => f.startsWith(include))) {
      logError(`Missing required include in files field: ${include}`);
      isValid = false;
    } else {
      logSuccess(`Required include found: ${include}`);
    }
  }

  // Check recommended includes
  for (const include of recommendedIncludes) {
    if (!packageJson.files.includes(include)) {
      logWarning(`Recommended include missing: ${include}`);
    } else {
      logSuccess(`Recommended include found: ${include}`);
    }
  }

  return isValid;
}

/**
 * Main validation function
 */
async function validateBuild() {
  log(`${colors.bold}🔍 Build Validation Starting...${colors.reset}`);
  console.log();

  const validations = [
    { name: 'Dist Directory', fn: validateDistDirectory },
    { name: 'Binary Configuration', fn: validateBinaryConfiguration },
    { name: 'Dependencies', fn: validateDependencies },
    { name: 'Module Resolution', fn: validateModuleResolution },
    { name: 'Module Loading', fn: validateModuleLoading },
    { name: 'Binary Execution', fn: validateBinaryExecution },
    { name: 'Files Field', fn: validateFilesField }
  ];

  let allPassed = true;
  const results = [];

  for (const validation of validations) {
    console.log();
    log(`${colors.bold}--- ${validation.name} ---${colors.reset}`);
    
    try {
      const result = await validation.fn();
      results.push({ name: validation.name, passed: result });
      
      if (result) {
        logSuccess(`${validation.name} validation passed`);
      } else {
        logError(`${validation.name} validation failed`);
        allPassed = false;
      }
    } catch (error) {
      logError(`${validation.name} validation error: ${error.message}`);
      results.push({ name: validation.name, passed: false });
      allPassed = false;
    }
  }

  // Summary
  console.log();
  log(`${colors.bold}📊 Validation Summary${colors.reset}`);
  console.log();
  
  for (const result of results) {
    if (result.passed) {
      logSuccess(`${result.name}: PASSED`);
    } else {
      logError(`${result.name}: FAILED`);
    }
  }

  console.log();
  if (allPassed) {
    log(`${colors.bold}${colors.green}🎉 All validations passed! Build is ready for distribution.${colors.reset}`);
    process.exit(0);
  } else {
    log(`${colors.bold}${colors.red}💥 Some validations failed. Please fix the issues before distributing.${colors.reset}`);
    process.exit(1);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateBuild().catch(error => {
    logError(`Validation script error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  validateBuild,
  validateDistDirectory,
  validateBinaryConfiguration,
  validateDependencies,
  validateModuleResolution,
  validateModuleLoading,
  validateBinaryExecution,
  validateFilesField
};