/**
 * SJR (SCImago Journal Rank) API Integration
 * 
 * This module handles fetching journal rankings from SCImago Journal Rank
 * Since there's no official API, we'll use web scraping or alternative sources
 */

if (!Zotero.JournalRanking) {
  Zotero.JournalRanking = {};
}

if (!Zotero.JournalRanking.SJR) {
  Zotero.JournalRanking.SJR = {};
}

(function() {
  'use strict';

  const SJR = Zotero.JournalRanking.SJR;

  // Cache for lookups (journal name -> ranking data)
  SJR.cache = new Map();

  /**
   * Fetch journal ranking from available sources
   * @param {string} journalName - Name of the journal
   * @returns {Object|null} Ranking data {sjr, quartile, year, hIndex, citationCount} or null
   */
  SJR.fetchRanking = async function(journalName) {
    if (!journalName) {
      Zotero.debug('SJR: No journal name provided');
      return null;
    }

    Zotero.debug(`SJR: fetchRanking called for "${journalName}"`);

    // Check cache first
    const cacheKey = journalName.toLowerCase().trim();
    if (this.cache.has(cacheKey)) {
      Zotero.debug(`SJR: Found cached result for "${journalName}"`);
      return this.cache.get(cacheKey);
    }

    try {
      // Try OpenAlex first (free API, no blocking)
      Zotero.debug(`SJR: Trying OpenAlex for "${journalName}"`);
      let result = await this.fetchFromOpenAlex(journalName);
      Zotero.debug(`SJR: OpenAlex result: ${result ? 'Found' : 'Not found'}`);
      
      if (result) {
        Zotero.debug(`SJR: Caching OpenAlex result for "${journalName}"`);
        this.cache.set(cacheKey, result);
        return result;
      }

      // Fallback to Crossref
      Zotero.debug(`SJR: Trying Crossref for "${journalName}"`);
      result = await this.fetchFromCrossref(journalName);
      Zotero.debug(`SJR: Crossref result: ${result ? 'Found' : 'Not found'}`);
      
      if (result) {
        // Don't cache Crossref results since they don't provide useful metrics
        // This prevents polluting the cache with useless data
        Zotero.debug(`SJR: Not caching Crossref result (no useful metrics)`);
        return result;
      }

      // Note: SCImago is blocked by Cloudflare, so we skip it
      // Users would need to manually look up SJR if needed
      
    } catch (e) {
      Zotero.debug(`SJR: Error fetching ranking for "${journalName}": ${e}`);
      Zotero.debug(`SJR: Error stack: ${e.stack}`);
    }

    Zotero.debug(`SJR: No results found for "${journalName}"`);
    return null;
  };

  /**
   * Fetch from SCImago Journal Rank website
   * @param {string} journalName
   * @returns {Object|null}
   */
  SJR.fetchFromSCImago = async function(journalName) {
    try {
      // SCImago search URL
      const searchUrl = `https://www.scimagojr.com/journalsearch.php?q=${encodeURIComponent(journalName)}&tip=sid`;
      
      Zotero.debug(`SJR: Fetching from ${searchUrl}`);
      
      const response = await Zotero.HTTP.request(
        'GET',
        searchUrl,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml'
          },
          responseType: 'text'
        }
      );

      if (response.status !== 200) {
        Zotero.debug(`SJR: HTTP ${response.status} for ${journalName}`);
        return null;
      }

      // Parse HTML response
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.response, 'text/html');
      
      // Find the first result row
      const resultRow = doc.querySelector('table.tabla_datos tbody tr');
      
      if (!resultRow) {
        Zotero.debug(`SJR: No results found for ${journalName}`);
        return null;
      }

      // Extract data from table cells
      const cells = resultRow.querySelectorAll('td');
      
      if (cells.length < 4) {
        Zotero.debug('SJR: Unexpected table structure');
        return null;
      }

      // Extract journal title to verify match
      const foundTitle = cells[1]?.textContent?.trim() || '';
      
      // Extract SJR value (usually in column 3 or 4)
      let sjrValue = null;
      let quartile = null;
      let year = new Date().getFullYear() - 1; // SJR data is usually for previous year

      // Look for SJR value in cells
      for (let cell of cells) {
        const text = cell.textContent.trim();
        
        // Check for SJR value (format: 0.xxx or x.xxx)
        if (/^\d+\.\d+$/.test(text)) {
          sjrValue = text;
        }
        
        // Check for quartile (Q1, Q2, Q3, Q4)
        const qMatch = text.match(/Q([1-4])/);
        if (qMatch) {
          quartile = qMatch[1];
        }
      }

      if (sjrValue) {
        const result = {
          sjr: sjrValue,
          quartile: quartile,
          year: year,
          title: foundTitle
        };
        
        Zotero.debug(`SJR: Found ranking - SJR: ${sjrValue}, Q${quartile || '?'}`);
        return result;
      }

      Zotero.debug('SJR: Could not extract ranking data from result');
      return null;

    } catch (e) {
      Zotero.debug(`SJR: Error in fetchFromSCImago: ${e}`);
      throw e;
    }
  };

  /**
   * Fetch from OpenAlex API (free, no auth required)
   * @param {string} journalName
   * @returns {Object|null}
   */
  SJR.fetchFromOpenAlex = async function(journalName) {
    try {
      // OpenAlex now uses /sources instead of /venues
      const searchUrl = `https://api.openalex.org/sources?search=${encodeURIComponent(journalName)}`;
      
      Zotero.debug(`OpenAlex: Requesting ${searchUrl}`);
      
      const response = await Zotero.HTTP.request(
        'GET',
        searchUrl,
        {
          headers: {
            'User-Agent': 'Zotero Journal Ranking Plugin (mailto:alvaroaguado3@gmail.com)'
          }
        }
      );

      Zotero.debug(`OpenAlex: Response status ${response.status}`);

      if (response.status !== 200) {
        Zotero.debug(`OpenAlex: HTTP ${response.status} - ${response.statusText || 'No status text'}`);
        return null;
      }

      const data = JSON.parse(response.response);
      
      Zotero.debug(`OpenAlex: Parsed response, found ${data.results?.length || 0} results`);
      
      if (data.results && data.results.length > 0) {
        const source = data.results[0];
        
        Zotero.debug(`OpenAlex: Found source "${source.display_name}"`);
        
        // Extract metrics from the source
        const works_count = source.works_count || 0;
        const cited_by_count = source.cited_by_count || 0;
        const h_index = source.summary_stats?.h_index || 0;
const two_yr_mean_citedness = source.summary_stats?.['2yr_mean_citedness'] || 0;
        
        // Log the raw values for debugging
        Zotero.debug(`OpenAlex: Metrics - H-Index: ${h_index}, 2yr citedness: ${two_yr_mean_citedness}, Citations: ${cited_by_count}`);
        
        // Calculate a simple impact score (2-year mean citedness is similar to impact factor)
        const impactScore = two_yr_mean_citedness.toFixed(3);
        
        // Only return if we have meaningful metrics
        if (h_index > 0 || two_yr_mean_citedness > 0) {
          return {
            impact: impactScore,
            hIndex: h_index,
            citationCount: cited_by_count,
            worksCount: works_count,
            year: new Date().getFullYear(),
            source: 'OpenAlex'
          };
        } else {
          Zotero.debug(`OpenAlex: No useful metrics found for "${source.display_name}"`);
          return null;
        }
      }

      Zotero.debug(`OpenAlex: No sources found for "${journalName}"`);

      return null;
    } catch (e) {
      Zotero.debug(`OpenAlex: Error - ${e}`);
      return null;
    }
  };

  /**
   * Fetch from Crossref API
   * @param {string} journalName
   * @returns {Object|null}
   */
  SJR.fetchFromCrossref = async function(journalName) {
    try {
      const searchUrl = `https://api.crossref.org/journals?query=${encodeURIComponent(journalName)}`;
      
      const response = await Zotero.HTTP.request(
        'GET',
        searchUrl,
        {
          headers: {
            'User-Agent': 'Zotero Journal Ranking Plugin (mailto:alvaroaguado3@gmail.com)'
          }
        }
      );

      if (response.status !== 200) {
        Zotero.debug(`Crossref: HTTP ${response.status}`);
        return null;
      }

      const data = JSON.parse(response.response);
      
      if (data.message && data.message.items && data.message.items.length > 0) {
        const journal = data.message.items[0];
        
        Zotero.debug(`Crossref: Found journal "${journal.title}"`);
        
        return {
          impact: 'N/A',
          title: journal.title,
          publisher: journal.publisher,
          issn: journal.ISSN ? journal.ISSN.join(', ') : 'N/A',
          year: new Date().getFullYear(),
          source: 'Crossref'
        };
      }

      return null;
    } catch (e) {
      Zotero.debug(`Crossref: Error - ${e}`);
      return null;
    }
  };

  /**
   * Clear the cache
   */
  SJR.clearCache = function() {
    this.cache.clear();
  };

})();
