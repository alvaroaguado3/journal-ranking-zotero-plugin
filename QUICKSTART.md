# Quick Start Guide

## Installation (5 minutes)

1. **Download or Build**
   - Download pre-built `.xpi` from releases, OR
   - Build from source (see below)

2. **Install in Zotero**
   - Open Zotero 8
   - Tools → Add-ons
   - Click gear icon ⚙️ → Install Add-on From File
   - Select `journal-ranking-zotero-plugin.xpi`
   - Restart Zotero

## Building from Source

### Option 1: Simple Build (No npm required)

```bash
./build.sh
```

This creates `journal-ranking-zotero-plugin.xpi` ready for installation.

### Option 2: Using npm

```bash
npm install
npm run package
```

## First Use

1. Open your Zotero library
2. Select a bibliography entry (e.g., a journal article)
3. Right-click → `Update Journal Ranking Index`
4. Check the "Extra" field - it should now contain:
   ```
   Impact: X.XXX | H-Index: XXX (YYYY) [OpenAlex]
   ```

## Example

**Before:**
```
Title: Machine Learning in Healthcare
Publication: Nature Medicine
Extra: DOI: 10.1038/example
```

**After fetching ranking:**
```
Title: Machine Learning in Healthcare
Publication: Nature Medicine
Extra: DOI: 10.1038/example
Impact: 4.523 | H-Index: 245 (2026) [OpenAlex]
```

## Batch Processing

1. Select multiple items (Shift+Click or Cmd/Ctrl+Click)
2. Right-click → `Update Journal Ranking Index`
3. Wait for processing
4. Alert shows results

## Troubleshooting

**"No ranking found"**
- Verify the journal name in the "Publication" field
- Check journal at [scimagojr.com](https://www.scimagojr.com)
- Some journals may not be indexed

**Plugin not showing in menu**
- Restart Zotero
- Check `Tools → Add-ons` to verify it's enabled
- Ensure you're using Zotero 8+

## Support

See [README.md](README.md) for full documentation.
