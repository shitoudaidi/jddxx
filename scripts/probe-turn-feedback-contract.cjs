const fs = require('fs')
const path = require('path')
const root = path.resolve(__dirname, '..')
const ui = fs.readFileSync(path.join(root, 'src/ui/jarvis-react/src/main.jsx'), 'utf8')
const css = fs.readFileSync(path.join(root, 'src/ui/jarvis-react/src/styles.css'), 'utf8')
const checks = {
  secondsNotInLiveLabel: !/label: `贾维斯思考中\$\{turnElapsedSeconds/.test(ui),
  elapsedIsVisuallySeparate: /turnState\.elapsed\}s<\/time>/.test(ui) && /aria-hidden="true"/.test(ui),
  understandingPhase: /正在理解指令/.test(ui),
  thinkingPhase: /正在思考/.test(ui),
  processingPhase: /正在处理任务/.test(ui),
  complexPhase: /复杂任务仍在执行/.test(ui),
  waitingPhase: /正在等待核心完成/.test(ui),
  progressIsSemantic: /role="progressbar"/.test(ui) && /aria-valuemax="95"/.test(ui),
  progressIsBounded: /Math\.min\(95, turnState\.elapsed \|\| 0\)/.test(ui),
  progressMotionIsControlled: /\.turn-progress i[\s\S]*transition: width 400ms linear/.test(css),
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key)
console.log(JSON.stringify({ ok: failed.length === 0, checks, failed }, null, 2))
if (failed.length) process.exit(1)
