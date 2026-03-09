/**
 * Build script for Journal Ranking plugin
 * Copies necessary files to build directory
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, 'build');
const FILES_TO_COPY = [
  'bootstrap.js',
  'manifest.json',
  'content/main.js',
  'content/sjr.js'
];

const DIRS_TO_COPY = [
  'icons'
];

// Clean build directory
if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(BUILD_DIR, { recursive: true, force: true });
}

// Create build directory
fs.mkdirSync(BUILD_DIR, { recursive: true });

console.log('Building Journal Ranking plugin...');

// Copy files
FILES_TO_COPY.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(BUILD_DIR, file);
  
  if (fs.existsSync(srcPath)) {
    // Create directory if needed
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ Copied ${file}`);
  } else {
    console.log(`  ⚠ Warning: ${file} not found`);
  }
});

// Copy directories
DIRS_TO_COPY.forEach(dir => {
  const srcPath = path.join(__dirname, dir);
  const destPath = path.join(BUILD_DIR, dir);
  
  if (fs.existsSync(srcPath)) {
    copyDir(srcPath, destPath);
    console.log(`  ✓ Copied ${dir}/`);
  } else {
    console.log(`  ⚠ Warning: ${dir}/ not found (optional)`);
  }
});

console.log('\nBuild complete! Output in build/');

// Helper function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
