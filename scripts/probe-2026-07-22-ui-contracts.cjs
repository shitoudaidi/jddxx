const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const probes = [
  'probe-operational-chrome-contract.cjs',
  'probe-news-resilience-contract.cjs',
  'probe-message-actions-contract.cjs',
  'probe-settings-workflow-contract.cjs',
  'probe-navigation-contract.cjs',
  'probe-first-run-resilience-contract.cjs',
  'probe-engineering-safety-contract.cjs',
  'probe-entity-motion-contract.cjs',
  'probe-secondary-contrast-contract.cjs',
  'probe-engineering-keyboard-contract.cjs',
];

const results = probes.map((probe) => {
  const result = spawnSync(process.execPath, [path.join(__dirname, probe)], { cwd: root, encoding: 'utf8' });
  return { probe, ok: result.status === 0, output: (result.stdout || result.stderr || '').trim().slice(-2000) };
});
const failed = results.filter((result) => !result.ok);
console.log(JSON.stringify({ ok: failed.length === 0, count: results.length, results }, null, 2));
if (failed.length) process.exit(1);
