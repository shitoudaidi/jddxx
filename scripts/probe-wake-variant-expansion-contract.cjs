const fs = require('node:fs')
const path = require('node:path')
const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'voice', 'wake-phrase.js'), 'utf8')
const variants = ['贾维诗', '贾维史', '甲维斯', '假威斯', '加威斯', '贾韦斯', '加维思', '佳维思', 'jarves', 'jarvice']
const checks = Object.fromEntries(variants.map((variant) => [variant, source.includes(`"${variant}"`)]))
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name)
console.log(JSON.stringify({ ok: failed.length === 0, count: variants.length, checks, failed }, null, 2))
if (failed.length) process.exit(1)
