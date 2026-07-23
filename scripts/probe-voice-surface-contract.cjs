const fs = require('node:fs')
const path = require('node:path')
const ui = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'jarvis-react', 'src', 'main.jsx'), 'utf8')
const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'jarvis-react', 'src', 'styles.css'), 'utf8')
const checks = {
  voicePanelIsNamed: /className="voice-panel" role="group" aria-label="语音交互状态"/.test(ui),
  canvasIsDecorative: /id="voice-canvas"[^>]*aria-hidden="true"/.test(ui),
  voiceStatusIsPolite: /id="voice-status" role="status" aria-live="polite"/.test(ui),
  transcriptIsLog: /id="voice-transcript" role="log" aria-live="polite"/.test(ui),
  transcriptNotAtomic: /id="voice-transcript"[^>]*aria-atomic="false"/.test(ui),
  statusHasStableHeight: /#voice-status\s*\{[\s\S]*?min-height: 1\.2em/.test(css),
  transcriptHasStableHeight: /#voice-transcript\s*\{[\s\S]*?min-height: 1\.4em/.test(css),
  transcriptHasReadableMeasure: /#voice-transcript\s*\{[\s\S]*?max-width: 44ch/.test(css),
  transcriptDoesNotWrapLayout: /#voice-transcript\s*\{[\s\S]*?white-space: nowrap/.test(css),
  transcriptOverflowIsVisible: /#voice-transcript\s*\{[\s\S]*?text-overflow: ellipsis/.test(css)
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
console.log(JSON.stringify({ ok: failed.length === 0, count: Object.keys(checks).length, checks, failed }, null, 2))
if (failed.length) process.exit(1)
