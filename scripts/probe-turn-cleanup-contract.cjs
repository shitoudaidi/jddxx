const fs = require('node:fs')
const path = require('node:path')
const ui = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'jarvis-react', 'src', 'main.jsx'), 'utf8')
const checks = {
  optimisticIdUsesTurnToken: /const optimisticMessageId = `local-\$\{turnToken\}`/.test(ui),
  turnTracksOptimisticMessage: /activeTurnRef\.current = \{ token: turnToken, afterId, voice: fromVoice, content, optimisticMessageId, completed: false \}/.test(ui),
  ignoredTurnRemovesOptimisticMessage: /if \(sent\?\.ignored\)[\s\S]*filter\(\(item\) => item\.id !== optimisticMessageId\)/.test(ui),
  ignoredKeyboardRestoresDraft: /if \(!fromVoice\) \{\s*setDraft\(content\)/.test(ui),
  ignoredKeyboardRestoresFocus: /if \(!fromVoice\)[\s\S]*setTextInputOpen\(true\);[\s\S]*inputRef\.current\?\.focus/.test(ui),
  recoveredPollClearsTransientError: /if \(pollFailureRef\.current\) \{\s*pollFailureRef\.current = 0;\s*setLastError\(""\)/.test(ui),
  completedTurnClearsError: /const completeReply[\s\S]*setTurnElapsedSeconds\(0\);\s*setLastError\(""\)/.test(ui),
  completedTurnResetsClock: /const completeReply[\s\S]*turnStartedAtRef\.current = 0;\s*setTurnElapsedSeconds\(0\)/.test(ui),
  failedTurnResetsClock: /const failActiveTurn[\s\S]*turnStartedAtRef\.current = 0;\s*setTurnElapsedSeconds\(0\)/.test(ui),
  cancelledTurnResetsClock: /const cancelActiveTurn[\s\S]*turnStartedAtRef\.current = 0;\s*setTurnElapsedSeconds\(0\)/.test(ui)
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
console.log(JSON.stringify({ ok: failed.length === 0, count: Object.keys(checks).length, checks, failed }, null, 2))
if (failed.length) process.exit(1)
