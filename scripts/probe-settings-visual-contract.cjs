const fs = require('node:fs')
const path = require('node:path')
const electron = fs.readFileSync(path.join(__dirname, '..', 'electron', 'main.cjs'), 'utf8')
const checks = {
  stableDialogOpener: /\.module-link\[aria-haspopup="dialog"\]/.test(electron),
  waitsForCompositor: /setTimeout\(resolve, 180\)/.test(electron),
  checksDrawerVisibility: /drawerVisible: Boolean\(drawerStyle/.test(electron),
  checksDrawerOpacity: /drawerOpaque: Boolean\(drawerStyle/.test(electron),
  checksBackdropVisibility: /backdropVisible: Boolean\(backdropStyle/.test(electron),
  checksDialogRole: /drawerHasDialogRole: drawer\?\.getAttribute\("role"\) === "dialog"/.test(electron),
  checksModalState: /drawerIsModal: drawer\?\.getAttribute\("aria-modal"\) === "true"/.test(electron),
  checksTitleBinding: /drawerHasTitle: Boolean\(drawer\?\.querySelector\("#settings-drawer-title"\)\)/.test(electron),
  checksViewportBounds: /drawerInViewport: Boolean\(drawerRect && drawerRect.left >= 0/.test(electron),
  gatesSnapshotOnVisualChecks: /settings\.drawerVisible && settings\.drawerOpaque && settings\.backdropVisible/.test(electron)
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
console.log(JSON.stringify({ ok: failed.length === 0, count: Object.keys(checks).length, checks, failed }, null, 2))
if (failed.length) process.exit(1)
