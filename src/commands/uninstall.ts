/**
 * Avana CLI - Uninstall Command
 * Removes Git hooks installed by Avana
 */

import * as fs from 'fs';
import * as path from 'path';

export async function uninstallCommand(): Promise<void> {
  console.log('🔓 Uninstalling Avana Git hooks...\n');

  try {
    // Check if .husky directory exists
    const huskyDir = path.join(process.cwd(), '.husky');
    if (!fs.existsSync(huskyDir)) {
      console.log('ℹ️  No Git hooks found to uninstall\n');
      return;
    }

    // Remove pre-commit hook
    const preCommitPath = path.join(huskyDir, 'pre-commit');
    if (fs.existsSync(preCommitPath)) {
      // Check if it's an Avana hook
      const content = fs.readFileSync(preCommitPath, 'utf-8');
      if (content.includes('avana scan')) {
        fs.unlinkSync(preCommitPath);
        console.log('✅ Removed pre-commit hook\n');
      } else {
        console.log('ℹ️  Pre-commit hook exists but was not created by Avana');
        console.log('   Skipping removal to preserve your custom hook\n');
      }
    } else {
      console.log('ℹ️  No pre-commit hook found\n');
    }

    console.log('✅ Avana Git hooks uninstalled successfully!\n');
    console.log('💡 To reinstall: avana install\n');
  } catch (error: any) {
    console.error('❌ Error uninstalling Git hooks:', error.message);
    process.exit(1);
  }
}
