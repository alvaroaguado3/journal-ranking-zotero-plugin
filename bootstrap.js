/**
 * Bootstrap file for Zotero 8 plugin
 * This is the entry point that Zotero loads
 */

var JournalRanking = {
  id: null,
  version: null,
  rootURI: null,
  initialized: false,

  async startup({ id, version, rootURI }) {
    this.id = id;
    this.version = version;
    this.rootURI = rootURI;

    // Load scripts
    Services.scriptloader.loadSubScript(this.rootURI + 'content/sjr.js');
    Services.scriptloader.loadSubScript(this.rootURI + 'content/main.js');
    
    // Wait a bit for Zotero to fully load
    await Zotero.Schema.schemaUpdatePromise;
    
    await Zotero.JournalRanking.init();
    this.initialized = true;
    
    Zotero.debug(`Journal Ranking Plugin ${version} started`);
  },

  async shutdown() {
    if (this.initialized) {
      await Zotero.JournalRanking.cleanup();
    }
    Zotero.debug('Journal Ranking Plugin shutdown');
  },

  install() {
    Zotero.debug('Journal Ranking Plugin installed');
  },

  uninstall() {
    Zotero.debug('Journal Ranking Plugin uninstalled');
  }
};

// Export for Zotero to call
function startup(data, reason) {
  JournalRanking.startup(data);
}

function shutdown(data, reason) {
  JournalRanking.shutdown();
}

function install(data, reason) {
  JournalRanking.install();
}

function uninstall(data, reason) {
  JournalRanking.uninstall();
}
