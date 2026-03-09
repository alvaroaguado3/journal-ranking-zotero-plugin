# Journal Impact Ranking for Zotero 8

A Zotero 8 plugin that automatically fetches and appends journal impact metrics to bibliography entries in your Zotero library using [OpenAlex](https://openalex.org/) — a free, open academic graph.

---

## Features

- **Automatic Journal Ranking Lookup** — fetches impact metrics from OpenAlex (with Crossref as fallback)
- **Impact Metrics** — displays 2-year mean citedness (≈ Impact Factor), H-Index, and citation count
- **Extra Field Integration** — appends ranking data directly to the "Extra" field of each item
- **Right-click & Tools menu** — trigger lookups with one click
- **Smart Caching** — caches results to minimize API requests
- **Batch Processing** — process multiple selected items at once

---

## Installation

### From Release (recommended)

1. Download the latest `journal-ranking-zotero-plugin.xpi` from the [Releases](https://github.com/alvaroaguado3/journal-ranking-zotero-plugin/releases) page
2. Open Zotero 8
3. Go to `Tools → Add-ons`
4. Click the gear icon (⚙️) → `Install Add-on From File`
5. Select the downloaded `.xpi` file
6. Restart Zotero

### From Source

```bash
git clone https://github.com/alvaroaguado3/journal-ranking-zotero-plugin.git
cd journal-ranking-zotero-plugin
./build.sh
# Creates journal-ranking-zotero-plugin.xpi — install as above
```

---

## Usage

1. Select one or more bibliography entries in your Zotero library
2. Right-click → **Update Journal Ranking Index**, or use **Tools → Update Journal Ranking Index**
3. The plugin will:
   - Read the journal name from the item's **Publication** field
   - Query OpenAlex (and Crossref as fallback) for impact metrics
   - Append the result to the item's **Extra** field

### Extra Field Format

```
Impact: 2.456 | H-Index: 150 (2026) [OpenAlex]
```

| Field | Meaning |
|-------|---------|
| `2.456` | 2-year mean citedness (similar to Impact Factor) |
| `150` | H-Index of the journal |
| `2026` | Year the data was fetched |
| `[OpenAlex]` | Data source |

### Example

**Before:**
```
Extra: DOI: 10.1234/example
```

**After:**
```
Extra: DOI: 10.1234/example
Impact: 3.245 | H-Index: 180 (2026) [OpenAlex]
```

The plugin automatically removes any previous ranking entry before writing the new one, so re-running it is safe.

---

## Data Sources

| Source | Role | Notes |
|--------|------|-------|
| [OpenAlex](https://openalex.org/) | Primary | Free, open API — no key required |
| [Crossref](https://www.crossref.org/) | Fallback | Used when OpenAlex returns no results |

### Why not SCImago (SJR)?

SCImago blocks automated requests with Cloudflare bot protection (HTTP 403). OpenAlex provides comparable metrics without restrictions:

- **2-year mean citedness** ≈ Impact Factor
- **H-Index** — widely accepted journal quality metric
- **Citation count** — total citations received by the journal

---

## Project Structure

```
journal-ranking-zotero-plugin/
├── bootstrap.js       # Plugin entry point (Zotero 8 bootstrap API)
├── manifest.json      # Plugin metadata and version
├── content/
│   ├── main.js        # Core plugin logic, menu registration, Extra field formatting
│   └── sjr.js         # API integrations (OpenAlex + Crossref)
├── icons/             # Plugin icons (48px, 96px)
└── build.sh           # Build script — produces the .xpi
```

---

## Troubleshooting

### No ranking found

- The journal may not be indexed in OpenAlex — verify at [openalex.org](https://openalex.org/)
- Check that the item's **Publication** field contains the correct journal name
- Check your internet connection

### Plugin not loading

- Requires Zotero 8 or later
- Go to `Tools → Add-ons` and confirm the plugin is enabled
- Restart Zotero

### Debugging

1. `Help → Debug Output Logging → Enable`
2. Trigger a lookup
3. `Help → Debug Output Logging → View Output`

Look for lines starting with `Journal Ranking:` or `OpenAlex:`.

---

## Privacy

The plugin only transmits journal names (not personal data or library contents) to:
- OpenAlex API (`openalex.org`)
- Crossref API (`api.crossref.org`)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes and open a Pull Request

Bug reports and feature requests: [GitHub Issues](https://github.com/alvaroaguado3/journal-ranking-zotero-plugin/issues)

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Not affiliated with Zotero, OpenAlex, SCImago, or any journal ranking service.*
