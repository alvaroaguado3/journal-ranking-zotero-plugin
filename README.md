# Journal Impact Ranking for Zotero 8

A Zotero 8 plugin that automatically fetches and appends journal impact metrics to bibliography entries in your Zotero library using OpenAlex and other free academic APIs.

## Features

- 🔍 **Automatic Journal Ranking Lookup**: Fetches impact metrics from OpenAlex and Crossref
- 📊 **Impact Metrics**: Displays Impact Factor, H-Index, and citation counts
- 📝 **Extra Field Integration**: Appends ranking data to the "Extra" field of bibliography entries
- 🖱️ **Easy to Use**: Right-click context menu and Tools menu integration
- 💾 **Smart Caching**: Caches lookups to minimize API requests
- 🔄 **Batch Processing**: Process multiple items at once

## Installation

### From Release

1. Download the latest `journal-ranking-zotero-plugin.xpi` from the [Releases](https://github.com/alvaroaguado/journal-ranking-zotero-plugin/releases) page
2. Open Zotero 8
3. Go to `Tools → Add-ons`
4. Click the gear icon (⚙️) → `Install Add-on From File`
5. Select the downloaded `.xpi` file
6. Restart Zotero

### From Source

#### Option 1: Simple Build (bash script, no npm required)

```bash
# Clone the repository
git clone https://github.com/alvaroaguado/journal-ranking-zotero-plugin.git
cd journal-ranking-zotero-plugin

# Run build script
./build.sh

# This creates journal-ranking-zotero-plugin.xpi
```

#### Option 2: Using npm

```bash
# Clone the repository
git clone https://github.com/alvaroaguado/journal-ranking-zotero-plugin.git
cd journal-ranking-zotero-plugin

# Install dependencies
npm install

# Build and package the plugin
npm run package

# This creates journal-ranking-zotero-plugin.xpi
```

Then install the `.xpi` file as described above.

## Usage

### Manual Fetch

1. Select one or more bibliography entries in your Zotero library
2. Right-click → `Update Journal Ranking Index` or use `Tools → Update Journal Ranking Index`
3. The plugin will:
   - Extract the journal name from the "Publication" field
   - Query the SJR database
   - Append the ranking to the "Extra" field

### Extra Field Format

The plugin appends ranking data in this format:

```
Impact: 2.456 | H-Index: 150 (2026) [OpenAlex]
```

Where:
- `2.456` is the 2-year mean citedness (similar to Impact Factor)
- `150` is the H-Index of the journal
- `2026` is the year of the data
- `[OpenAlex]` indicates the data source

### Example

Before:
```
Extra: DOI: 10.1234/example
```

After:
```
Extra: DOI: 10.1234/example
Impact: 3.245 | H-Index: 180 (2026) [OpenAlex]
```

## Data Sources

The plugin fetches data from:

1. **Primary**: [OpenAlex](https://openalex.org/) - Free, open academic graph with comprehensive metrics
2. **Fallback**: [Crossref](https://www.crossref.org/) - Free metadata for scholarly content

### Why OpenAlex Instead of SJR?

SCImago Journal Rank (SJR) blocks automated requests with Cloudflare protection, making it unsuitable for plugin integration. OpenAlex provides:

- **2-year mean citedness**: Similar to Impact Factor
- **H-Index**: Widely recognized journal quality metric  
- **Citation counts**: Total citations received
- **No authentication required**: Free and open API
- **No rate limits**: For reasonable use

### Metrics Explained

- **Impact Score**: 2-year mean citedness (similar to Impact Factor) - average citations per paper
- **H-Index**: A journal has H-Index of N if it has N papers with at least N citations each
- **Citation Count**: Total citations the journal has received

## Development

### Project Structure

```
journal-ranking-zotero-plugin/
├── bootstrap.js          # Plugin entry point
├── manifest.json         # Plugin metadata
├── content/
│   ├── main.js          # Core plugin logic
│   └── sjr.js           # SJR API integration
├── icons/               # Plugin icons
├── build.js             # Build script
├── package-xpi.js       # XPI packaging script
└── package.json         # npm configuration
```

### Build Commands

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Package as .xpi
npm run package

# Watch mode (auto-rebuild on changes)
npm run watch
```

### Modifying the Plugin

1. **Change data source**: Edit `content/sjr.js` to modify or add API integrations
2. **Customize Extra field format**: Modify the formatting logic in `content/main.js` (search for "Append to Extra field")
3. **Add auto-fetch on import**: Uncomment the auto-fetch code in the notifier callback in `content/main.js`

### Debugging

Enable Zotero debug output:
1. `Help → Debug Output Logging → Enable`
2. Use the plugin
3. `Help → Debug Output Logging → View Output`

Look for messages starting with `Journal Ranking:` or `SJR:`

## Troubleshooting

### No ranking found

**Possible causes:**
- Journal name doesn't match database entries (try alternative spellings)
- Journal is not indexed in OpenAlex
- Network connectivity issues

**Solutions:**
- Manually verify the journal exists on [openalex.org](https://openalex.org/)
- Check your internet connection
- Ensure the "Publication" field contains the correct journal name

### Why not SCImago Journal Rank (SJR)?

SCImago blocks automated requests with Cloudflare bot protection (HTTP 403 errors). This makes it unsuitable for plugin integration. OpenAlex provides comparable metrics without blocking:
- **Impact Score** (2-year mean citedness) ≈ Impact Factor
- **H-Index** - widely accepted quality metric
- Free API with no authentication required

### Plugin not loading

**Solutions:**
- Ensure you're using Zotero 8 or later
- Check `Tools → Add-ons` to verify the plugin is enabled
- Restart Zotero
- Check debug output for errors

### Duplicate entries in Extra field

The plugin automatically removes old SJR entries before adding new ones. If you see duplicates:
1. Manually clean the Extra field
2. Re-run the fetch

## Privacy

This plugin makes HTTP requests to:
- SCImago Journal Rank (scimagojr.com)
- OpenAlex API (openalex.org) - if fallback is enabled

No personal data or library contents are transmitted, only journal names for lookup.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Add support for Impact Factor (if API available)
- [ ] Add support for CiteScore
- [ ] Customizable Extra field format
- [ ] Auto-fetch on item import (optional setting)
- [ ] Settings panel for configuration
- [ ] Multiple language support
- [ ] Progress bar for batch operations

## Support

- 🐛 [Report a bug](https://github.com/alvaroaguado/journal-ranking-zotero-plugin/issues)
- 💡 [Request a feature](https://github.com/alvaroaguado/journal-ranking-zotero-plugin/issues)
- 📧 Contact: alvaroaguado3@gmail.com

## Acknowledgments

- Built for [Zotero](https://www.zotero.org/) - the free, open-source reference manager
- Data from [SCImago Journal Rank](https://www.scimagojr.com/)
- Inspired by the Zotero user community's need for integrated journal metrics

---

**Note**: This plugin is not affiliated with Zotero, SCImago, or any journal ranking service.
