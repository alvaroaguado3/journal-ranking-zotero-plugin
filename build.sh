#!/bin/bash

# Simple build script that doesn't require npm
# This creates the XPI file directly using zip

echo "Building Journal Ranking plugin..."

# Clean previous build
rm -rf build
rm -f journal-ranking-zotero-plugin.xpi

# Create build directory
mkdir -p build/content
mkdir -p build/icons

# Copy files
echo "  ✓ Copying files..."
cp bootstrap.js build/
cp manifest.json build/
cp content/main.js build/content/
cp content/sjr.js build/content/
cp icons/* build/icons/ 2>/dev/null || echo "  ⚠ No icons found (optional)"

# Create XPI (which is just a ZIP file with .xpi extension)
echo "  ✓ Creating XPI package..."
cd build
zip -r ../journal-ranking-zotero-plugin.xpi * -q
cd ..

# Get file size
SIZE=$(du -h journal-ranking-zotero-plugin.xpi | cut -f1)

echo ""
echo "✓ Created journal-ranking-zotero-plugin.xpi ($SIZE)"
echo ""
echo "Installation:"
echo "  1. Open Zotero 8"
echo "  2. Go to Tools → Add-ons"
echo "  3. Click the gear icon → Install Add-on From File"
echo "  4. Select journal-ranking-zotero-plugin.xpi"
echo ""
