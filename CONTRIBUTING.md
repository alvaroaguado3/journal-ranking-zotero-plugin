# Contributing to Journal Impact Ranking Plugin

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/alvaroaguado/journal-ranking-zotero-plugin.git
   cd journal-ranking-zotero-plugin
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Making Changes

1. Make your changes in the appropriate files
2. Test your changes:
   ```bash
   npm run build
   npm run package
   ```
3. Install the generated `.xpi` file in Zotero 8 for testing
4. Enable debug output in Zotero to see console logs

### Testing

Before submitting:
- Test with various journal names
- Test with multiple selected items
- Test with items that don't have journal names
- Check that the Extra field is correctly updated
- Verify no duplicate entries are created

### Code Style

- Use consistent indentation (2 spaces)
- Add comments for complex logic
- Use meaningful variable names
- Follow existing code patterns

## Submitting Changes

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```
   
2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub:
   - Describe what changes you made and why
   - Reference any related issues
   - Include screenshots if relevant

## Bug Reports

When reporting bugs, please include:
- Zotero version
- Plugin version
- Steps to reproduce
- Expected vs actual behavior
- Debug output (if available)

## Feature Requests

For feature requests:
- Describe the feature and its benefits
- Provide use cases
- Consider implementation complexity

## Questions?

Feel free to open an issue for questions or discussion!

Thank you for contributing! 🎉
