const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const prompt = fs.readFileSync(path.join(root, 'src', 'core', 'prompt.js'), 'utf8')

const checks = [
  ['acknowledgement closes without filler', /Acknowledgement closes, it does not reopen/],
  ['continue advances without recap', /Continue means advance/],
  ['correction replaces the faulty premise', /Corrections replace the faulty premise/],
  ['latest interruption owns the floor', /latest interruption owns the floor/],
  ['reversible ambiguity proceeds by inference', /reversible interpretation[\s\S]{0,500}proceed without a clarification round/],
  ['high-impact ambiguity asks one concrete question', /high-impact uncertainty[\s\S]{0,700}Ask exactly one concrete question/],
  ['frustration receives status first', /Frustration gets status first/],
  ['unknown facts are not invented', /Unknown stays unknown/],
  ['voice defaults to two spoken sentences', /Voice defaults to two spoken sentences/],
  ['compound requests are all completed', /Compound requests stay compound/],
]

const results = checks.map(([name, pattern]) => ({ name, ok: pattern.test(prompt) }))
const forbiddenAbsolute = /Never ask for clarification\. Do not reply/
results.push({ name: 'obsolete absolute no-clarification rule removed', ok: !forbiddenAbsolute.test(prompt) })

console.log(JSON.stringify({ ok: results.every(item => item.ok), checks: results }, null, 2))
if (results.some(item => !item.ok)) process.exit(1)
