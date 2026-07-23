const fs = require('node:fs')
const path = require('node:path')
const ui = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'jarvis-react', 'src', 'main.jsx'), 'utf8')
const checks = {
  taskPromptIsBounded: /boundedFeedback\(task\.prompt/.test(ui),
  taskErrorsAreBounded: /boundedFeedback\(task\.error/.test(ui),
  eventTextIsBounded: /boundedFeedback\(item\.title \|\| item\.type/.test(ui) && /boundedFeedback\(item\.detail/.test(ui),
  runningOutputIsQuiet: /aria-live=\{isRunning \? "off" : "polite"\}/.test(ui),
  permissionSurfaceIsNamed: /className="engineering-permission" role="alert" aria-label="工程任务权限确认"/.test(ui),
  consoleIsARegion: /className="engineering-console"\s*role="region"/.test(ui),
  tabsDeclareOrientation: /role="tablist" aria-orientation="horizontal"/.test(ui),
  outputIsKeyboardReadable: /className="engineering-output" ref=\{outputRef\} tabIndex=\{0\}/.test(ui),
  commandFormIsNamed: /className="engineering-command" onSubmit=\{submit\} aria-label="工程任务输入"/.test(ui),
  commandFormBusyIsSemantic: /aria-busy=\{submitting \|\| cancelling\}/.test(ui)
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
console.log(JSON.stringify({ ok: failed.length === 0, count: Object.keys(checks).length, checks, failed }, null, 2))
if (failed.length) process.exit(1)
