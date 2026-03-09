# Installation and Debugging Guide

## Installation Steps

1. **Uninstall old version** (if any):
   - Open Zotero 8
   - Go to `Tools → Add-ons`
   - Find "Journal Impact Ranking" and click "Remove"
   - Restart Zotero

2. **Install new version**:
   - Go to `Tools → Add-ons`
   - Click the gear icon (⚙️) → `Install Add-on From File`
   - Select `journal-ranking-zotero-plugin.xpi`
   - Restart Zotero

3. **Verify installation**:
   - Go to `Tools → Add-ons`
   - Check that "Journal Impact Ranking" shows as enabled
   - Version should be 1.0.0

## Checking if the Plugin is Working

### Enable Debug Output

1. In Zotero, go to `Help → Debug Output Logging → Enable`
2. Select "Enable after restart"
3. Restart Zotero
4. Try to use the plugin
5. Go to `Help → Debug Output Logging → View Output`

Look for lines containing:
- `Journal Ranking Plugin` (startup message)
- `Journal Ranking: Initialized` (initialization)
- `Journal Ranking: Added to Tools menu` (menu added)
- `Journal Ranking: Added to context menu` (context menu added)

### Troubleshooting

**If you don't see "Update Journal Ranking Index" in menus:**

1. Check debug output for error messages
2. Verify the plugin is enabled in Add-ons
3. Try restarting Zotero twice
4. Check Zotero version (must be 8.0 or higher)

**If you see the menu but it doesn't work:**

1. Select an item with a journal name in the "Publication" field
2. Check debug output for "Journal Ranking:" messages
3. Ensure you have internet connectivity

**On macOS specifically:**

- Make sure you're right-clicking (or Control+Click)
- Try selecting the item first, then right-clicking
- Check if the menu appears at the bottom of the context menu

## Manual Test

After installation, try this:

1. Create or select a test item with:
   - Type: Journal Article
   - Publication: "Nature"
2. Right-click the item
3. Look for "Update Journal Ranking Index" in the menu
4. Click it
5. Check the "Extra" field for the SJR ranking

## Getting Help

If the menu still doesn't appear:
1. Share the debug output
2. Provide your Zotero version (`Help → About Zotero`)
3. Provide your macOS version
4. Email: alvaroaguado3@gmail.com
