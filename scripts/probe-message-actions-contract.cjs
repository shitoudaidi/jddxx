const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'src/ui/jarvis-react/src/main.jsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/ui/jarvis-react/src/styles.css'), 'utf8');
const checks = {
  clipboardFailuresAreHandled: /try \{[\s\S]{0,260}navigator\.clipboard[\s\S]{0,260}catch \{/.test(ui),
  copyTimerIsCleanedUp: /clearTimeout\(copyTimerRef\.current\)/.test(ui),
  copyFeedbackIsAnnounced: /aria-live="polite" title="复制这条回复"/.test(ui),
  liveMessagesHaveNoActions: /message\.id !== "live"/.test(ui),
  replayWaitsForCurrentTurn: /disabled=\{sending\}[\s\S]{0,100}当前回复完成后可重播/.test(ui),
  timestampsExposeFullDate: /dateTime=\{formatDateTimeAttribute\(message\.timestamp\)\}/.test(ui) && /Number\.isNaN\(date\.getTime\(\)\) \? undefined : date\.toISOString\(\)/.test(ui),
  scrollRespectsReducedMotion: /behavior: reduceMotion \? "auto" : "smooth"/.test(ui),
  emptySearchCanClearInline: /没有匹配的对话<\/strong><button[\s\S]{0,180}>清空搜索/.test(ui),
  emptyConversationOffersKeyboard: /onClick=\{onUseKeyboard\}><Keyboard[\s\S]{0,40}键盘输入/.test(ui),
  genericErrorsAreNotVoiceErrors: /voiceRecovery \? "VOICE RECOVERY" : "SYSTEM"/.test(ui) && /voiceRecovery && voiceRecovery\.kind !== "device"/.test(ui),
};
const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
console.log(JSON.stringify({ ok: failed.length === 0, checks, failed }, null, 2));
if (failed.length) process.exit(1);
