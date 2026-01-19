/**
 * Avanasec CLI - Install Command
 * Installs Git hooks for automatic pre-commit scanning
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { ExitCode, handleUnexpectedError, handleInvalidArguments } from '../utils/exit-codes';

export async function installCommand(): Promise<void> {
  console.log('🔒 Installing Avanasec Git hooks...\n');

  try {
    // Check if we're in a Git repository
    if (!fs.existsSync('.git')) {
      console.error('❌ Error: Not a Git repository');
      console.log('   Run this command from the root of your Git repository\n');
      process.exit(ExitCode.INVALID_ARGUMENTS);
    }

    // Check if Husky is installed
    try {
      require.resolve('husky');
    } catch {
      console.log('📦 Installing Husky...');
      execSync('npm install --save-dev husky', { stdio: 'inherit' });
    }

    // Initialize Husky
    console.log('⚙️  Initializing Husky...');
    execSync('npx husky init', { stdio: 'inherit' });

    // Create .husky directory if it doesn't exist
    const huskyDir = path.join(process.cwd(), '.husky');
    if (!fs.existsSync(huskyDir)) {
      fs.mkdirSync(huskyDir, { recursive: true });
    }

    // Create pre-commit hook
    const preCommitPath = path.join(huskyDir, 'pre-commit');
    const preCommitContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run Avanasec security scan
echo "🔒 Running Avanasec security scan..."
npx avanasec scan --staged

# Exit code 1 will block the commit
`;

    fs.writeFileSync(preCommitPath, preCommitContent, { mode: 0o755 });

    // Make the hook executable (Unix-like systems)
    if (process.platform !== 'win32') {
      fs.chmodSync(preCommitPath, 0o755);
    }

    console.log('\n✅ Avanasec Git hooks installed successfully!\n');
    console.log('📋 What happens now:');
    console.log('   • Before each commit, Avanasec will scan your staged files');
    console.log('   • Commits with critical/high severity issues will be blocked');
    console.log('   • You\'ll see clear error messages with fix suggestions\n');
    console.log('💡 Tips:');
    console.log('   • To bypass the hook: git commit --no-verify');
    console.log('   • To uninstall: avanasec uninstall\n');
    
    process.exit(ExitCode.SUCCESS);
  } catch (error: any) {
    console.error('❌ Error installing Git hooks:', error.message);
    handleUnexpectedError(error instanceof Error ? error : new Error(String(error)));
  }
}
