const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'src/ui/jarvis-react/src/main.jsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/ui/jarvis-react/src/styles.css'), 'utf8');
const checks = {
  completeProductIdentity: /<h1>GDDXX-JARVIS<\/h1>/.test(ui),
  headerMusicDuplicateRemoved: !/header-actions[\s\S]{0,500}toggleAmbientMusic/.test(ui),
  headerSettingsDuplicateRemoved: !/header-actions[\s\S]{0,700}setDrawerOpen/.test(ui),
  refreshHasPointerHint: /aria-label=\{refreshing \? "正在刷新状态" : "刷新状态"\} title=\{refreshing \? "正在刷新状态" : "刷新状态"\}/.test(ui),
  warningStateIsAmber: /status-pill\.warn\s*\{[\s\S]{0,80}#e3b86c/.test(css),
  loadingStateIsDistinct: /pending \? "pending"/.test(ui) && /status-pill\.pending/.test(css),
  statusIsAnnounced: /role="status" aria-live="polite" aria-busy=/.test(ui),
  idleDockIsContentSized: /command-dock:not\(\.text-open\)[\s\S]{0,160}width:\s*auto/.test(css),
  textDockHasInputBoundary: /command-dock\.text-open \.dock-input[\s\S]{0,120}border: 1px solid/.test(css),
  replayOnlyExistsWhenActionable: /visualState === "speaking" \|\| latestJarvisText \? <button className="secondary replay"/.test(ui),
};
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
console.log(JSON.stringify({ ok: failed.length === 0, checks, failed }, null, 2));
if (failed.length) process.exit(1);
