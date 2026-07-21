const fs = require('fs')
const path = require('path')
const root = path.resolve(__dirname, '..')
const main = fs.readFileSync(path.join(root, 'electron/main.cjs'), 'utf8')
const runner = fs.readFileSync(path.join(root, 'scripts/probe-wake-sequence.cjs'), 'utf8')
const checks = {
  packagedExeSelected: /dist', 'win-unpacked', 'GDDXX-Jarvis\.exe/.test(runner),
  packagedResourcesSelected: /win-unpacked', 'resources', 'app\.asar/.test(runner),
  brandTitleVerified: /titleBranded/.test(main) && /GDDXX-Jarvis\/i/.test(main),
  versionVisibleVerified: /footerVersionVisible/.test(main) && /v0\\\.3\\\.0/.test(main),
  manualEntryVisibleVerified: /manualEntryVisible/.test(main) && /getBoundingClientRect\(\)\.width >= 40/.test(main),
  arrowOnlyVerified: /manualEntryArrowOnly/.test(main) && /!entry\.textContent\.trim\(\)/.test(main),
  coreOnlineVerified: /coreOnline/.test(main) && /statusBody\.running/.test(main),
  wakeAssetVerified: /wakeAsset\?\.ok/.test(main),
  wakeCompletionVerified: /completed\.ready/.test(main) && /monitoring\.ready/.test(main),
  visibleErrorsRejected: /document\.querySelector\("\.error-banner"\)/.test(main),
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key)
console.log(JSON.stringify({ ok: failed.length === 0, checks, failed }, null, 2))
if (failed.length) process.exit(1)
