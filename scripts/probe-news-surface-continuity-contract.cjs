const fs = require('node:fs')
const path = require('node:path')
const ui = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'jarvis-react', 'src', 'main.jsx'), 'utf8')
const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'jarvis-react', 'src', 'styles.css'), 'utf8')
const checks = {
  newsFetchHasTimeout: /fetch\(`\$\{api\}\/ai-news`, \{ signal: AbortSignal\.timeout\(12_000\) \}\)/.test(ui),
  refreshClearsOldError: /setLoading\(true\);\s*setError\(""\);/.test(ui),
  loadingStatusIsExplicit: /loading \? "SYNCING"/.test(ui),
  sourceTitleIsDisclosed: /title=\{item\.url \? `打开来源：\$\{item\.label\}`/.test(ui),
  carouselCurrentIsMarked: /aria-current=\{visibleIndex === 0 \? "true"/.test(ui),
  emptyStateIsAnnounced: /className="news-ticker-empty" role="status" aria-live="polite"/.test(ui),
  emptyRetryDisablesDuringLoad: /onClick=\{load\} disabled=\{loading\}/.test(ui),
  newsItemsHaveFocusState: /\.news-ticker-item:focus-visible/.test(css),
  newsItemsHavePressState: /\.news-ticker-item:active/.test(css),
  staleClassRemainsDistinct: /stale && "is-stale"/.test(ui)
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
console.log(JSON.stringify({ ok: failed.length === 0, count: Object.keys(checks).length, checks, failed }, null, 2))
if (failed.length) process.exit(1)
