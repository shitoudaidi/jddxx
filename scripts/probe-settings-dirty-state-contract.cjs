const fs = require('node:fs')
const path = require('node:path')
const ui = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'jarvis-react', 'src', 'main.jsx'), 'utf8')
const checks = {
  modelBaselineTracked: /modelBaselineRef = useRef/.test(ui),
  aiHotBaselineTracked: /aiHotBaselineRef = useRef/.test(ui),
  combinedDirtyStateTracked: /dirtyRef\.current = modelDirty \|\| aiHotDirty/.test(ui),
  closeRequiresConfirmation: /window\.confirm\("设置尚未保存，确定关闭吗？"\)/.test(ui),
  escapeUsesGuardedClose: /event\.key === "Escape"[\s\S]*requestClose\(\)/.test(ui),
  backdropUsesGuardedClose: /drawer-backdrop[\s\S]*requestClose\(\)/.test(ui),
  closeButtonUsesGuardedClose: /onClick=\{requestClose\}/.test(ui),
  modelSaveDisablesWhenClean: /disabled=\{saving \|\| !modelDirty/.test(ui),
  aiHotSaveDisablesWhenClean: /disabled=\{aiHotSaving \|\| !aiHotDirty\}/.test(ui),
  unsavedStateIsVisible: /className="drawer-dirty" role="status"/.test(ui)
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
console.log(JSON.stringify({ ok: failed.length === 0, count: Object.keys(checks).length, checks, failed }, null, 2))
if (failed.length) process.exit(1)
