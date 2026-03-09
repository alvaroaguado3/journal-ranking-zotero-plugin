/**
 * Main plugin logic for Journal Impact Ranking
 */

if (!Zotero.JournalRanking) {
  Zotero.JournalRanking = {};
}

(function() {
  'use strict';

  const JR = Zotero.JournalRanking;

  JR.init = async function() {
    // Clear the cache on startup to avoid stale data
    if (Zotero.JournalRanking.SJR) {
      Zotero.JournalRanking.SJR.clearCache();
      Zotero.debug('Journal Ranking: Cleared cache on startup');
    }
    
    // Wait for main window to load before adding UI elements
    await this.addToAllWindows();
    
    // Listen for new items
    this.notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item']);
    
    Zotero.debug('Journal Ranking: Initialized');
  };

  JR.cleanup = async function() {
    if (this.notifierID) {
      Zotero.Notifier.unregisterObserver(this.notifierID);
    }
  };

  JR.addToAllWindows = async function() {
    Zotero.debug('Journal Ranking: Getting main windows...');
    var windows = Zotero.getMainWindows();
    Zotero.debug(`Journal Ranking: Found ${windows.length} window(s)`);
    
    for (let win of windows) {
      if (!win.ZoteroPane) {
        Zotero.debug('Journal Ranking: Window has no ZoteroPane, skipping');
        continue;
      }
      Zotero.debug('Journal Ranking: Adding to window');
      this.addToWindow(win);
    }
  };

  JR.addToWindow = function(window) {
    let doc = window.document;
    
    Zotero.debug('Journal Ranking: Adding menu items to window');
    
    // Add to Tools menu
    let toolsPopup = doc.getElementById('menu_ToolsPopup');
    if (toolsPopup) {
      let menuSeparator = doc.createXULElement('menuseparator');
      menuSeparator.id = 'journal-ranking-tools-separator';
      toolsPopup.appendChild(menuSeparator);
      
      let toolsMenuItem = doc.createXULElement('menuitem');
      toolsMenuItem.id = 'journal-ranking-tools-menuitem';
      toolsMenuItem.setAttribute('label', 'Update Journal Ranking Index');
      toolsMenuItem.addEventListener('command', () => {
        JR.fetchRankingsForSelected();
      });
      toolsPopup.appendChild(toolsMenuItem);
      
      Zotero.debug('Journal Ranking: Added to Tools menu');
    } else {
      Zotero.debug('Journal Ranking: Could not find menu_ToolsPopup');
    }

    // Add to item context menu
    let itemPopup = doc.getElementById('zotero-itemmenu');
    if (itemPopup) {
      let separator = doc.createXULElement('menuseparator');
      separator.id = 'journal-ranking-separator';
      itemPopup.appendChild(separator);
      
      let contextMenuItem = doc.createXULElement('menuitem');
      contextMenuItem.id = 'journal-ranking-context-menuitem';
      contextMenuItem.setAttribute('label', 'Update Journal Ranking Index');
      contextMenuItem.addEventListener('command', () => {
        JR.fetchRankingsForSelected();
      });
      itemPopup.appendChild(contextMenuItem);
      
      Zotero.debug('Journal Ranking: Added to context menu');
    } else {
      Zotero.debug('Journal Ranking: Could not find zotero-itemmenu');
      
      // Try alternative menu IDs
      Zotero.debug('Journal Ranking: Trying alternative menu selectors...');
      let alternativeMenus = ['item-menu', 'zotero-item-menu', 'itemMenu'];
      for (let menuId of alternativeMenus) {
        let menu = doc.getElementById(menuId);
        if (menu) {
          Zotero.debug(`Journal Ranking: Found alternative menu: ${menuId}`);
        }
      }
    }
  };

  JR.notifierCallback = {
    notify: async function(event, type, ids, extraData) {
      if (event === 'add') {
        // Optionally auto-fetch for new items
        // Uncomment to enable auto-fetch on item creation
        // for (let id of ids) {
        //   await JR.fetchRankingForItem(id);
        // }
      }
    }
  };

  JR.fetchRankingsForSelected = async function() {
    const zoteroPane = Zotero.getActiveZoteroPane();
    if (!zoteroPane) {
      Zotero.debug('Journal Ranking: No active Zotero pane');
      return;
    }

    const selectedItems = zoteroPane.getSelectedItems();
    if (!selectedItems.length) {
      alert('Please select at least one item');
      return;
    }

    let processed = 0;
    let failed = 0;
    let noMetrics = 0;

    for (let item of selectedItems) {
      try {
        const result = await this.fetchRankingForItem(item.id);
        if (result === true) {
          processed++;
        } else if (result === 'no-metrics') {
          noMetrics++;
        } else {
          failed++;
        }
      } catch (e) {
        Zotero.debug(`Journal Ranking: Error processing item ${item.id}: ${e}`);
        failed++;
      }
    }

    let message = `Successfully updated: ${processed} item(s)`;
    if (noMetrics > 0) {
      message += `\nNo metrics found: ${noMetrics} item(s)`;
    }
    if (failed > 0) {
      message += `\nFailed: ${failed} item(s)`;
    }
    if (noMetrics + failed > 0) {
      message += '\n\nCheck debug output for details.';
    }
    
    alert(message);
  };

  JR.fetchRankingForItem = async function(itemID) {
    const item = await Zotero.Items.getAsync(itemID);
    
    if (!item || item.isNote() || item.isAttachment()) {
      return false;
    }

    // Get journal name from publicationTitle field
    const journalName = item.getField('publicationTitle');
    
    if (!journalName) {
      Zotero.debug(`Journal Ranking: No journal name for item ${itemID}`);
      return false;
    }

    Zotero.debug(`Journal Ranking: Fetching ranking for "${journalName}"`);

    try {
      // Fetch ranking from SJR
      const ranking = await Zotero.JournalRanking.SJR.fetchRanking(journalName);
      
      if (ranking) {
        // Append to Extra field
        let extra = item.getField('extra') || '';
        
        // Remove old ranking if exists (clean up any previous format)
        // Remove lines containing journal metrics from any source
        const lines = extra.split('\n');
        const filteredLines = lines.filter(line => {
          const lowerLine = line.toLowerCase();
          return !lowerLine.includes('[openalex]') && 
                 !lowerLine.includes('[crossref]') &&
                 !lowerLine.includes('journal metrics found') &&
                 !line.match(/^(SJR|Impact|H-Index):/);
        });
        extra = filteredLines.join('\n').trim();
        
        // Append new ranking based on source
        if (extra && extra.length > 0) {
          extra += '\n';
        }
        
        // Format based on data source
        if (ranking.source === 'OpenAlex') {
          // OpenAlex provides impact score (2-year mean citedness) and h-index
          let hasMetrics = false;
          let metricsLine = '';
          
          if (ranking.impact && ranking.impact !== '0.000') {
            metricsLine += `Impact: ${ranking.impact}`;
            hasMetrics = true;
          }
          if (ranking.hIndex && ranking.hIndex > 0) {
            if (metricsLine) {
              metricsLine += ' | ';
            }
            metricsLine += `H-Index: ${ranking.hIndex}`;
            hasMetrics = true;
          }
          
          if (hasMetrics) {
            if (ranking.year) {
              metricsLine += ` (${ranking.year})`;
            }
            extra += metricsLine + ' [OpenAlex]';
          }
        } else if (ranking.sjr) {
          // Traditional SJR format (if we ever get it working)
          extra += `SJR: ${ranking.sjr}`;
          if (ranking.quartile) {
            extra += ` | Q${ranking.quartile}`;
          }
          if (ranking.year) {
            extra += ` (${ranking.year})`;
          }
        } else {
          // Skip Crossref and other sources if they don't have useful metrics
          Zotero.debug(`Journal Ranking: No useful metrics from ${ranking.source}, skipping`);
          return 'no-metrics';
        }
        
        item.setField('extra', extra.trim());
        await item.saveTx();
        
        Zotero.debug(`Journal Ranking: Updated item ${itemID} with ranking data from ${ranking.source}`);
        return true;
      } else {
        Zotero.debug(`Journal Ranking: No ranking data found for "${journalName}"`);
        return 'no-metrics';
      }
    } catch (e) {
      Zotero.debug(`Journal Ranking: Error fetching ranking: ${e}`);
      return false;
    }
  };

})();
