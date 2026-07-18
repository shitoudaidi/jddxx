const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const target = path.join(root, 'tools', 'grok-cli');
fs.mkdirSync(target, { recursive: true });

const packageFile = path.join(target, 'package.json');
if (!fs.existsSync(packageFile)) {
  fs.writeFileSync(packageFile, `${JSON.stringify({ private: true, dependencies: {} }, null, 2)}\n`, 'utf8');
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npm, ['install', '--save-exact', '@xai-official/grok@0.2.102'], {
  cwd: target,
  stdio: 'inherit',
  shell: false,
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
console.log(`Grok Build installed under ${target}`);
