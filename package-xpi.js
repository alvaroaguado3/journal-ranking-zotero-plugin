/**
 * Package script to create .xpi file from build directory
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const BUILD_DIR = path.join(__dirname, 'build');
const OUTPUT_FILE = path.join(__dirname, 'journal-ranking-zotero-plugin.xpi');

// Read version from manifest
const manifestPath = path.join(BUILD_DIR, 'manifest.json');
let version = '1.0.0';

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  version = manifest.version;
}

console.log(`Packaging Journal Ranking plugin v${version}...`);

// Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error('Error: build directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Remove old XPI if exists
if (fs.existsSync(OUTPUT_FILE)) {
  fs.unlinkSync(OUTPUT_FILE);
}

// Create archive
const output = fs.createWriteStream(OUTPUT_FILE);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  const sizeKB = (archive.pointer() / 1024).toFixed(2);
  console.log(`\n✓ Created ${path.basename(OUTPUT_FILE)} (${sizeKB} KB)`);
  console.log(`\nInstallation:`);
  console.log(`  1. Open Zotero 8`);
  console.log(`  2. Go to Tools → Add-ons`);
  console.log(`  3. Click the gear icon → Install Add-on From File`);
  console.log(`  4. Select ${path.basename(OUTPUT_FILE)}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

// Pipe archive to file
archive.pipe(output);

// Add all files from build directory
archive.directory(BUILD_DIR, false);

// Finalize the archive
archive.finalize();
