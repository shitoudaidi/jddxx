const fs = require('node:fs')
const path = require('node:path')
const ui = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'jarvis-react', 'src', 'main.jsx'), 'utf8')
const checks = {
  wakeGreetingHasTimestamp: /channel: "WAKE", timestamp: new Date\(\)\.toISOString\(\)/.test(ui),
  wakeCheckHasTimestamp: /channel: "SYSTEM CHECK", timestamp: new Date\(\)\.toISOString\(\)/.test(ui),
  wakeErrorsAreBounded: /playWakeSequence\(\)\.catch\(\(error\) => setLastError\(boundedFeedback/.test(ui),
  playbackTimeoutIsAnnounced: /setLastError\("语音播报超时/.test(ui),
  audioErrorsAreAnnounced: /setLastError\("语音音频无法播放/.test(ui),
  speakingStateIsNamed: /setVoiceStatusText\("Jarvis 正在播报"\)/.test(ui),
  finishedStateIsNamed: /播报完成，可继续对话/.test(ui),
  duplicatePlaybackIsNamed: /setVoiceStatusText\("已忽略重复播报"\)/.test(ui),
  unsupportedSpeechIsAlert: /当前语音引擎不支持这条播报/.test(ui),
  stoppedPlaybackIsNamed: /已停止播报，可继续对话/.test(ui)
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
console.log(JSON.stringify({ ok: failed.length === 0, count: Object.keys(checks).length, checks, failed }, null, 2))
if (failed.length) process.exit(1)
