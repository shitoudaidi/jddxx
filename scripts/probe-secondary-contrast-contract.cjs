const fs = require('node:fs');
const path = require('node:path');
const css = fs.readFileSync(path.resolve(__dirname, '..', 'src/ui/jarvis-react/src/styles.css'), 'utf8');

function luminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((value) => parseInt(value, 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
const group = css.slice(css.lastIndexOf('/* 2026-07-22: readable secondary telemetry'));
const selectors = ['header-clock span', 'status-pill em', 'terminal-empty span', 'message-channel', 'turn-owner time', 'news-ticker-meta span', 'news-external', 'engineering-side-section > small', 'engineering-prompt-count'];
const checks = Object.fromEntries(selectors.map((selector) => [selector, group.includes(selector)]));
checks.secondaryTextMeetsAA = contrast('8fa3ab', '070d11') >= 4.5;
checks.higherContrastModeExists = /@media \(prefers-contrast: more\)/.test(group) && contrast('b8c7cd', '070d11') >= 7;
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
console.log(JSON.stringify({ ok: failed.length === 0, ratio: contrast('8fa3ab', '070d11'), checks, failed }, null, 2));
if (failed.length) process.exit(1);
