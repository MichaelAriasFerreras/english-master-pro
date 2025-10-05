
const fs = require('fs');
const path = require('path');

const buildDir = process.env.NEXT_DIST_DIR || '.build';
const sourceFile = path.join(__dirname, '..', buildDir, 'standalone', 'server.js');
const targetDir = path.join(__dirname, '..', buildDir, 'standalone', 'app');
const targetFile = path.join(targetDir, 'server.js');

console.log('Post-build: Copying server.js to expected location...');
console.log('  Source:', sourceFile);
console.log('  Target:', targetFile);

try {
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log('  Created directory:', targetDir);
  }

  // Copy server.js to the target location
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, targetFile);
    console.log('✅ Successfully copied server.js');
  } else {
    console.warn('⚠️  Warning: server.js not found at', sourceFile);
  }
} catch (error) {
  console.error('❌ Error during post-build:', error.message);
  process.exit(1);
}
