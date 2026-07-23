const fs = require('node:fs')
const path = require('node:path')
const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'jarvis-react', 'src', 'styles.css'), 'utf8')
const checks = {
  compactNewsHasHeight: /\.intelligence-rail > \.news-ticker \{[^}]*min-height:\s*184px/.test(css),
  compactNewsHasBoundary: /\.intelligence-rail > \.news-ticker \{[^}]*border-color:\s*#294550/.test(css),
  compactNewsHasSurface: /\.intelligence-rail > \.news-ticker \{[^}]*background:\s*rgba\(7, 15, 19, 0\.98\)/.test(css),
  compactNewsHeaderHasHeight: /\.news-ticker-head \{ min-height:\s*36px/.test(css),
  compactNewsHeaderHasRule: /\.news-ticker-head \{[^}]*border-bottom-color:\s*#294550/.test(css),
  compactNewsActionsHaveGap: /\.news-ticker-actions \{ gap:\s*3px/.test(css),
  compactNewsActionsHaveTarget: /\.news-ticker-actions \.news-icon \{ width:\s*28px; height:\s*28px/.test(css),
  compactNewsListCanScroll: /\.news-ticker-list \{ overflow-y:\s*auto; scrollbar-width:\s*thin/.test(css),
  compactNewsCopyReadable: /\.news-ticker-item p \{ font-size:\s*10px; line-height:\s*1\.4/.test(css),
  compactNewsMetaQuiet: /\.news-ticker-meta \{ font-size:\s*8px/.test(css)
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
console.log(JSON.stringify({ ok: failed.length === 0, count: Object.keys(checks).length, checks, failed }, null, 2))
if (failed.length) process.exit(1)
