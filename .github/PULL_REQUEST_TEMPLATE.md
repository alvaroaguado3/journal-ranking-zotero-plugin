## Summary

Brief description of what this PR does.

Fixes # (issue number, if applicable)

## Changes

-
-

## Testing

- [ ] Tested with a journal that exists in OpenAlex
- [ ] Tested with a journal not found in OpenAlex (falls back to Crossref)
- [ ] Tested with an item that has no publication title
- [ ] Tested batch processing (multiple items selected)
- [ ] Verified Extra field is updated correctly with no duplicate entries
- [ ] Tested re-running the lookup on an already-ranked item

## Checklist

- [ ] Code follows the existing style (2-space indent, meaningful names)
- [ ] No new external dependencies introduced
- [ ] Plugin builds successfully (`npm run package` or `./build.sh`)
- [ ] Debug output is clean (no unexpected errors in Zotero's debug log)
