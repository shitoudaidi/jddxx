const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'src/ui/jarvis-react/src/main.jsx'), 'utf8');
const checks = {
  customUrlRequiresHttp: /if \(!\['http:', 'https:'\]\.includes\(parsed\.protocol\)\) throw new Error/.test(ui),
  asyncErrorsAreBounded: /setError\(boundedFeedback\(timedOut/.test(ui),
  modelFieldsLockDuringSave: /<fieldset className="first-run-section" disabled=\{saving\}>/.test(ui) && /<fieldset className="first-run-section voice-choice" disabled=\{saving\}>/.test(ui),
  formExposesBusyState: /className="first-run-form" onSubmit=\{submit\} aria-busy=\{saving\}/.test(ui),
  asyncErrorsReceiveFocus: /errorRef\.current\?\.focus\(\)/.test(ui) && /role="alert" tabIndex=\{-1\}/.test(ui),
  progressNamesBothSteps: /第 1\/2 步：正在保存语音配置/.test(ui) && /第 2\/2 步：正在验证模型连接/.test(ui),
  modelProviderClearsOldSecret: /changeModelProvider[\s\S]{0,180}setApiKey\(""\)/.test(ui),
  localVoiceClearsCloudSecret: /if \(next === "local"\) setAliyunApiKey\(""\)/.test(ui),
  providerChangesRemaskSecrets: /setShowModelKey\(false\)/.test(ui) && /setShowVoiceKey\(false\)/.test(ui),
  localStorageFailureIsNonFatal: /try \{ localStorage\.setItem\(VOICE_PROVIDER_KEY, voiceProvider\); \} catch \{\}/.test(ui),
};
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
console.log(JSON.stringify({ ok: failed.length === 0, checks, failed }, null, 2));
if (failed.length) process.exit(1);
