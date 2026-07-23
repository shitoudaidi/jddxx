const fs = require('node:fs')
const path = require('node:path')
const ui = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'jarvis-react', 'src', 'main.jsx'), 'utf8')
const checks = {
  messageRoleIsNamed: /const roleLabel = isUser \? "用户消息"/.test(ui),
  liveMessageIsAnnounced: /aria-live=\{live \? "polite" : undefined\}/.test(ui),
  messageTimeHasDateTime: /<time dateTime=\{formatDateTimeAttribute\(message\.timestamp\)\}/.test(ui),
  messageTimeHasFullTitle: /title=\{formatFullTime\(message\.timestamp\)\}/.test(ui),
  messageArticleHasLabel: /aria-label=\{roleLabel\}/.test(ui),
  messageTimeIsGuarded: /message\.timestamp \? <time/.test(ui),
  messageUsesFullDateFormatter: /function formatFullTime\(timestamp\)/.test(ui),
  messageUsesDateTimeFormatter: /function formatDateTimeAttribute\(timestamp\)/.test(ui),
  liveMessageClassRemains: /live && "live"/.test(ui),
  messageOriginRemainsStructured: /className="message-origin"/.test(ui)
}
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
console.log(JSON.stringify({ ok: failed.length === 0, count: Object.keys(checks).length, checks, failed }, null, 2))
if (failed.length) process.exit(1)
