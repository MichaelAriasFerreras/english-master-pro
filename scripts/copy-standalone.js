
const fs = require('fs');
const path = require('path');

const distDir = process.env.NEXT_DIST_DIR || '.next';
const standalonePath = path.join(process.cwd(), distDir, 'standalone');
const staticPath = path.join(process.cwd(), distDir, 'static');
const targetStaticPath = path.join(standalonePath, distDir, 'static');

console.log('Copying static files for standalone build...');
console.log('From:', staticPath);
console.log('To:', targetStaticPath);

if (fs.existsSync(standalonePath) && fs.existsSync(staticPath)) {
  // Ensure target directory exists
  const targetDir = path.dirname(targetStaticPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy static files
  fs.cpSync(staticPath, targetStaticPath, { recursive: true });
  console.log('✓ Static files copied successfully');
} else {
  console.log('Warning: Standalone or static directory not found');
  console.log('Standalone exists:', fs.existsSync(standalonePath));
  console.log('Static exists:', fs.existsSync(staticPath));
}
