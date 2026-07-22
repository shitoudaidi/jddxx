const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'src/ui/jarvis-react/src/main.jsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/ui/jarvis-react/src/styles.css'), 'utf8');
const checks = {
  settingsReadChecksHttp: /if \(!response\.ok \|\| data\.ok === false\) throw new Error\(data\.error \|\| "无法读取 AI HOT 配置"\)/.test(ui),
  settingsReadHasTimeout: /fetch\(`\$\{api\}\/settings\/ai-hot`, \{ signal: AbortSignal\.timeout\(API_TIMEOUT_MS\) \}\)/.test(ui),
  settingsSaveHasTimeout: /body: JSON\.stringify\(\{ endpoint:[\s\S]{0,180}signal: AbortSignal\.timeout\(API_TIMEOUT_MS\)/.test(ui),
  settingsClearHasTimeout: /apiKey: "" \}\),[\s\S]{0,80}signal: AbortSignal\.timeout\(API_TIMEOUT_MS\)/.test(ui),
  endpointValidatedBeforeSave: /资讯接口必须是有效的 HTTP 或 HTTPS 地址/.test(ui),
  modelFormSupportsEnter: /<form className="drawer-section" onSubmit=/.test(ui) && /type="submit"/.test(ui),
  providerUsesControlledOptions: /<option value="deepseek">DeepSeek<\/option>/.test(ui) && /<option value="custom">/.test(ui),
  errorsAreBounded: /function boundedFeedback[\s\S]{0,140}slice\(0, 180\)/.test(ui),
  aiHotFeedbackIsAnnounced: /aiHotFeedback\.type === "error" \? "alert" : "status"\} aria-live="polite"/.test(ui),
  modalBackdropAndMotionPreference: /className="drawer-backdrop"/.test(ui) && /initial=\{reduceMotion \? false : \{ x: 28 \}\}/.test(ui) && /\.drawer-backdrop/.test(css),
};
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
console.log(JSON.stringify({ ok: failed.length === 0, checks, failed }, null, 2));
if (failed.length) process.exit(1);
