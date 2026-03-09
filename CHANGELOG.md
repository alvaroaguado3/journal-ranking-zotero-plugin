# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-08

### Added
- Initial release
- Automatic journal ranking lookup from SCImago Journal Rank (SJR)
- Right-click context menu integration
- Tools menu integration
- Batch processing support
- Smart caching of API lookups
- Appends SJR, quartile, and year to Extra field
- OpenAlex API fallback option (commented out by default)
- Build system with both bash script and npm options
- Comprehensive documentation (README, QUICKSTART, CONTRIBUTING)
- MIT License

### Features
- Fetches SJR impact factor
- Displays quartile ranking (Q1-Q4)
- Shows data year
- Updates Extra field without duplicates
- Processes multiple items at once
- Cache for performance

### Technical
- Compatible with Zotero 8+
- Uses Zotero's native HTTP request system
- Minimal dependencies
- Simple build process
- Creates installable .xpi file

[1.0.0]: https://github.com/alvaroaguado/journal-ranking-zotero-plugin/releases/tag/v1.0.0
