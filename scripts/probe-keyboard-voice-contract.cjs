const fs = require('fs')
const path = require('path')
const source = fs.readFileSync(path.resolve(__dirname, '../src/ui/jarvis-react/src/main.jsx'), 'utf8')
const checks = {
  textFieldsProtected: /input, textarea, select/.test(source),
  buttonsProtected: /select, button, a\[href\]/.test(source),
  contentEditableProtected: /contenteditable="true"/.test(source),
  ariaButtonsProtected: /\[role="button"\]/.test(source),
  imeKeysIgnored: /event\.isComposing/.test(source),
  modifiedKeysIgnored: /event\.ctrlKey \|\| event\.metaKey \|\| event\.altKey/.test(source),
  repeatStartBlocked: /event\.repeat \|\| pttHeldRef\.current/.test(source),
  unmatchedKeyupBlocked: /event\.code !== "Space" \|\| !pttHeldRef\.current/.test(source),
  blurReleasesPtt: /addEventListener\("blur", releasePtt\)/.test(source),
  hiddenWindowReleasesPtt: /visibilityState !== "visible"\) releasePtt/.test(source),
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key)
console.log(JSON.stringify({ ok: failed.length === 0, checks, failed }, null, 2))
if (failed.length) process.exit(1)
